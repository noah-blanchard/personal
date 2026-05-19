import * as Tone from "tone"

/**
 * ToneEngine - Core audio engine for the DAW
 * 
 * Manages:
 * - Tone.js Transport initialization and control
 * - Sample loading and caching
 * - Playback scheduling coordination
 * - Transport state synchronization with DAWProvider
 */

export type SampleInfo = {
  fileId: string
  buffer: Tone.ToneAudioBuffer
  durationBars: number
}

export type ToneEngineState = {
  isPlaying: boolean
  bpm: number
  currentBar: number
  isReady: boolean
  loadedSamples: Set<string>
}

export type ToneEngineCallbacks = {
  onPlayheadUpdate?: (bar: number) => void
  onStateChange?: (state: Partial<ToneEngineState>) => void
}

class ToneEngine {
  private static instance: ToneEngine | null = null
  private transport: any // Tone.Transport type has issues, using any as workaround
  private samples: Map<string, SampleInfo> = new Map()
  private state: ToneEngineState = {
    isPlaying: false,
    bpm: 128,
    currentBar: 1,
    isReady: false,
    loadedSamples: new Set(),
  }
  private callbacks: ToneEngineCallbacks = {}
  private scheduledEvents: number[] = []
  private isInitialized = false

  private constructor() {
    // Initialize transport reference - will be set up properly in initialize()
    this.transport = null
  }

  public static getInstance(): ToneEngine {
    if (!ToneEngine.instance) {
      ToneEngine.instance = new ToneEngine()
    }
    return ToneEngine.instance
  }

  /**
   * Initialize Tone.js audio context
   * Must be called after user interaction
   */
  public async initialize(): Promise<void> {
    if (this.isInitialized) return

    try {
      await Tone.start()
      
      // Get transport reference - use Tone.Transport directly
      this.transport = Tone.Transport
      if (!this.transport) {
        throw new Error("Tone.Transport is not available")
      }
      
      // Set BPM and time signature
      this.transport.bpm.value = 128
      this.transport.timeSignature = [4, 4]
      
      // Bind transport events
      this.transport.on("start", this.handleTransportStart.bind(this))
      this.transport.on("stop", this.handleTransportStop.bind(this))
      this.transport.on("pause", this.handleTransportStop.bind(this))
      
      this.isInitialized = true
      this.updateState({ isReady: true })
      console.log("[ToneEngine] Initialized successfully")
    } catch (error) {
      console.error("[ToneEngine] Failed to initialize:", error)
      throw error
    }
  }

  /**
   * Load a single sample from URL
   */
  public async loadSample(fileId: string, url: string): Promise<void> {
    try {
      const buffer = await Tone.ToneAudioBuffer.fromUrl(url)
      const durationBars = this.calculateBarsFromDuration(buffer.duration)
      
      this.samples.set(fileId, {
        fileId,
        buffer,
        durationBars,
      })
      
      this.state.loadedSamples.add(fileId)
      console.log(`[ToneEngine] Loaded sample: ${fileId} (${buffer.duration.toFixed(2)}s = ${durationBars.toFixed(2)} bars)`)
    } catch (error) {
      console.warn(`[ToneEngine] Failed to load sample ${fileId}:`, error)
    }
  }

  /**
   * Load multiple samples from a manifest
   */
  public async loadSamples(sampleManifest: Array<{ fileId: string; url: string }>): Promise<void> {
    const promises = sampleManifest.map(({ fileId, url }) => this.loadSample(fileId, url))
    await Promise.allSettled(promises)
    console.log(`[ToneEngine] Loaded ${this.samples.size} samples`)
  }

  /**
   * Calculate how many bars a sample occupies at current BPM
   */
  private calculateBarsFromDuration(durationSeconds: number): number {
    const beatsPerBar = 4
    const beatsPerMinute = this.state.bpm
    const secondsPerBeat = 60 / beatsPerMinute
    const secondsPerBar = secondsPerBeat * beatsPerBar
    return durationSeconds / secondsPerBar
  }

  /**
   * Get sample duration in bars
   */
  public getSampleDurationBars(fileId: string): number | undefined {
    const sample = this.samples.get(fileId)
    return sample?.durationBars
  }

  /**
   * Check if a sample is loaded
   */
  public isSampleLoaded(fileId: string): boolean {
    return this.samples.has(fileId)
  }

  /**
   * Start transport playback
   */
  public async start(fromBar?: number): Promise<void> {
    if (!this.isInitialized) {
      await this.initialize()
    }

    if (!this.transport) {
      throw new Error("Transport not initialized")
    }

    if (fromBar !== undefined) {
      this.transport.position = this.barToTime(fromBar)
    }

    await this.transport.start()
  }

  /**
   * Stop transport playback
   */
  public stop(): void {
    if (!this.transport) return
    this.transport.stop()
    this.clearAllScheduledEvents()
  }

  /**
   * Toggle transport playback
   */
  public async togglePlay(fromBar?: number): Promise<void> {
    if (!this.transport) {
      console.log('[ToneEngine] togglePlay: transport not initialized, initializing...')
      await this.initialize()
    }
    
    console.log('[ToneEngine] togglePlay: current state =', this.transport.state)
    if (this.transport.state === "started") {
      console.log('[ToneEngine] togglePlay: stopping')
      this.stop()
    } else {
      console.log('[ToneEngine] togglePlay: starting from bar', fromBar)
      await this.start(fromBar)
      console.log('[ToneEngine] togglePlay: after start, state =', this.transport.state)
    }
  }

  /**
   * Set transport BPM
   */
  public setBpm(bpm: number): void {
    if (!this.transport) return
    this.transport.bpm.value = bpm
    this.updateState({ bpm })
    
    // Recalculate all sample durations
    this.samples.forEach((sample) => {
      sample.durationBars = this.calculateBarsFromDuration(sample.buffer.duration)
    })
  }

  /**
   * Seek to a specific bar
   */
  public seekTo(bar: number): void {
    if (!this.transport) return
    this.transport.position = this.barToTime(bar)
    this.updateState({ currentBar: bar })
  }

  /**
   * Schedule a sample to play at a specific bar
   */
  public scheduleSample(fileId: string, bar: number, volume?: number, muted?: boolean): void {
    const sample = this.samples.get(fileId)
    if (!sample) {
      console.warn(`[ToneEngine] Cannot schedule unloaded sample: ${fileId}`)
      return
    }

    if (!this.transport) {
      console.warn(`[ToneEngine] Cannot schedule sample: transport not initialized`)
      return
    }

    const time = this.barToTime(bar)
    const timeInSeconds = Tone.Time(time).toSeconds()
    const now = Tone.now()
    
    // Only schedule if time is in the future (with small buffer)
    if (timeInSeconds < now - 0.1) {
      return
    }

    // Create player for this instance
    const player = new Tone.Player(sample.buffer).connect(Tone.getDestination())
    
    // Apply volume
    if (volume !== undefined) {
      player.volume.value = this.linearToDB(volume / 100)
    }
    
    // Apply mute
    if (muted) {
      player.mute = true
    }

    // Schedule playback
    const eventId = Tone.Transport.schedule((scheduledTime) => {
      player.start(scheduledTime)
      // Dispose player after playback
      setTimeout(() => player.dispose(), sample.buffer.duration * 1000 + 100)
    }, time)

    this.scheduledEvents.push(eventId)
  }

  /**
   * Clear all scheduled events
   */
  private clearAllScheduledEvents(): void {
    this.scheduledEvents.forEach((id) => {
      try {
        Tone.Transport.clear(id)
      } catch (e) {
        // Ignore errors when clearing events
      }
    })
    this.scheduledEvents = []
  }

  /**
   * Convert bar number to Tone.js time
   */
  public barToTime(bar: number): string {
    // Bar numbers are 1-indexed
    const barIndex = bar - 1
    return `${barIndex}:0:0`
  }

  /**
   * Convert current transport position to bar number
   */
  private getCurrentBar(): number {
    if (!this.transport) return 1
    const position = this.transport.position
    const parts = position.split(":")
    return parseInt(parts[0]) + 1 // Convert 0-indexed to 1-indexed
  }

  /**
   * Convert linear volume (0-1) to dB
   */
  private linearToDB(linear: number): number {
    return 20 * Math.log10(Math.max(0.001, linear))
  }

  /**
   * Set up callbacks
   */
  public setCallbacks(callbacks: ToneEngineCallbacks): void {
    this.callbacks = callbacks
  }

  /**
   * Get current state
   */
  public getState(): ToneEngineState {
    return { ...this.state }
  }

  /**
   * Update internal state and notify callbacks
   */
  private updateState(partial: Partial<ToneEngineState>): void {
    this.state = { ...this.state, ...partial }
    this.callbacks.onStateChange?.(partial)
  }

  /**
   * Handle transport start
   */
  private handleTransportStart(): void {
    this.updateState({ isPlaying: true })
    
    // Start playhead update loop
    this.startPlayheadUpdateLoop()
  }

  /**
   * Handle transport stop/pause
   */
  private handleTransportStop(): void {
    this.updateState({ isPlaying: false })
    this.stopPlayheadUpdateLoop()
    // Reset to bar 1 when stopped
    this.updateState({ currentBar: 1 })
  }

  /**
   * Playhead update loop using requestAnimationFrame
   */
  private playheadUpdateRaf?: number

  private startPlayheadUpdateLoop(): void {
    const update = () => {
      if (this.transport && this.transport.state === "started") {
        const bar = this.getCurrentBar()
        this.updateState({ currentBar: bar })
        this.callbacks.onPlayheadUpdate?.(bar)
      }
      this.playheadUpdateRaf = requestAnimationFrame(update)
    }
    this.playheadUpdateRaf = requestAnimationFrame(update)
  }

  private stopPlayheadUpdateLoop(): void {
    if (this.playheadUpdateRaf) {
      cancelAnimationFrame(this.playheadUpdateRaf)
      this.playheadUpdateRaf = undefined
    }
    // Reset to bar 1 when stopped
    this.updateState({ currentBar: 1 })
    this.callbacks.onPlayheadUpdate?.(1)
  }

  /**
   * Dispose engine and clean up resources
   */
  public dispose(): void {
    this.stop()
    this.samples.clear()
    this.stopPlayheadUpdateLoop()
    // Clear transport reference
    this.transport = null
    ToneEngine.instance = null
  }
}

// Export singleton instance getter
export const getToneEngine = ToneEngine.getInstance
