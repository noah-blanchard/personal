import * as Tone from "tone"
import type { DAWChannel, DAWClip } from "../types"

/**
 * PlaybackScheduler - Handles precise timing of sample playback
 * 
 * Uses Tone.js Transport scheduling with lookahead to ensure samples
 * play at exactly the right musical time, regardless of JavaScript
 * execution delays.
 * 
 * Architecture:
 * - Monitors transport position via Tone.js schedule events
 * - For each clip that should play at current bar, schedules sample playback
 * - Tracks which clips have been triggered to avoid re-triggering
 * - Clears trigger state when transport stops
 */

type TriggeredClipKey = string // `${channelId}:${clipId}`

export class PlaybackScheduler {
  private triggeredClips = new Set<TriggeredClipKey>()
  private isPlaying = false
  private channels: DAWChannel[] = []
  private scheduleEventIds: number[] = []
  private sampleCache = new Map<string, Tone.ToneAudioBuffer>()
  private activePlayers: Tone.Player[] = []

  /**
   * Update the scheduler with current channel state
   * Called whenever channels change in DAWProvider
   */
  public setChannels(channels: DAWChannel[]) {
    this.channels = channels
    
    // Preload samples when channels change
    this.preloadSamples()
    
    // If currently playing, reschedule everything
    if (this.isPlaying) {
      this.rescheduleAll()
    }
  }

  /**
   * Start scheduling - sets up Tone.js transport listeners
   */
  public async start() {
    console.log('[PlaybackScheduler] start() called, isPlaying=true')
    console.log('[PlaybackScheduler] Tone.Transport.state:', Tone.Transport?.state)
    console.log('[PlaybackScheduler] Tone.Transport.position:', Tone.Transport?.position)
    
    // Make sure Tone.js is started
    await Tone.start()
    
    // Preload samples for all clips
    await this.preloadSamples()
    
    // Start the transport if it's not already running
    if (Tone.Transport.state !== "started") {
      console.log('[PlaybackScheduler] Starting Tone.Transport...')
      await Tone.Transport.start()
      console.log('[PlaybackScheduler] Transport started, new state:', Tone.Transport.state)
    }
    
    this.isPlaying = true
    this.triggeredClips.clear()
    
    // Set up lookahead scheduling
    this.setupLookaheadScheduler()
  }

  /**
   * Stop scheduling - clears all scheduled events
   */
  public stop() {
    this.isPlaying = false
    this.clearScheduledEvents()
    // Clear triggered clips so they can play again on next start
    this.triggeredClips.clear()
    
    // Stop the transport
    if (Tone.Transport.state === "started") {
      Tone.Transport.stop()
    }
    
    // Stop all active players
    this.activePlayers.forEach(player => {
      try {
        player.stop()
        player.dispose()
      } catch (e) {
        // Ignore errors
      }
    })
    this.activePlayers = []
  }

  /**
   * Set up scheduler using Tone.Transport.schedule for precise timing
   */
  private setupLookaheadScheduler() {
    this.clearScheduledEvents()
    
    console.log('[PlaybackScheduler] Setting up precise scheduler')
    
    // Schedule each clip directly at its start time
    for (const channel of this.channels) {
      if (channel.muted) continue
      
      for (const clip of channel.clips) {
        const clipKey = `${channel.id}:${clip.id}`
        
        // Don't reschedule if already scheduled
        if (this.triggeredClips.has(clipKey)) continue
        
        const clipBar = clip.startBar
        const barIndex = clipBar - 1
        const clipTimeStr = `${barIndex}:0:0`
        
        // Schedule the clip to play at its exact musical time
        const eventId = Tone.Transport.schedule((time) => {
          console.log(`[PlaybackScheduler] Scheduled event firing for clip ${clipKey} at bar ${clipBar}`)
          this.playSampleDirectly(clip.file.id, channel.volume, channel.muted)
        }, clipTimeStr)
        
        this.scheduleEventIds.push(eventId)
        this.triggeredClips.add(clipKey)
        console.log(`[PlaybackScheduler] Scheduled clip ${clipKey} at bar ${clipBar} (time: ${clipTimeStr}), event ID: ${eventId}`)
      }
    }
  }

  /**
   * Play a sample directly using Tone.Player
   */
  private playSampleDirectly(fileId: string, volume?: number, muted?: boolean) {
    const sampleUrl = this.getSampleUrl(fileId)
    if (!sampleUrl) {
      console.warn(`[PlaybackScheduler] No URL for fileId: ${fileId}`)
      return
    }

    // Check cache first
    const cachedBuffer = this.sampleCache.get(fileId)
    if (cachedBuffer) {
      this.playBuffer(cachedBuffer, volume, muted)
      return
    }

    // Load and cache the sample
    console.log(`[PlaybackScheduler] Loading and caching sample: ${sampleUrl}`)
    Tone.start().then(() => {
      return Tone.ToneAudioBuffer.fromUrl(sampleUrl)
    }).then(buffer => {
      console.log(`[PlaybackScheduler] Sample loaded, duration: ${buffer.duration}s`)
      this.sampleCache.set(fileId, buffer)
      this.playBuffer(buffer, volume, muted)
    }).catch(err => {
      console.warn(`[PlaybackScheduler] Failed to load sample ${fileId}:`, err)
    })
  }

  /**
   * Play a cached buffer immediately
   */
  private playBuffer(buffer: Tone.ToneAudioBuffer, volume?: number, muted?: boolean) {
    const player = new Tone.Player(buffer).connect(Tone.getDestination())
    
    if (volume !== undefined) {
      player.volume.value = 20 * Math.log10(Math.max(0.001, volume / 100))
    }
    
    if (muted) {
      player.mute = true
    }
    
    player.start()
    
    // Track active player
    this.activePlayers.push(player)
    
    // Remove from active list and dispose after playback
    player.onended = () => {
      const index = this.activePlayers.indexOf(player)
      if (index > -1) {
        this.activePlayers.splice(index, 1)
      }
      player.dispose()
    }
  }

  /**
   * Preload all samples for current clips
   */
  private async preloadSamples() {
    const sampleIds = new Set<string>()
    
    // Collect all unique sample IDs from clips
    for (const channel of this.channels) {
      for (const clip of channel.clips) {
        sampleIds.add(clip.file.id)
      }
    }
    
    // Load each sample into cache
    const loadPromises = Array.from(sampleIds).map(fileId => {
      const sampleUrl = this.getSampleUrl(fileId)
      if (!sampleUrl) return Promise.resolve()
      
      // Check if already cached
      if (this.sampleCache.has(fileId)) return Promise.resolve()
      
      return Tone.ToneAudioBuffer.fromUrl(sampleUrl).then(buffer => {
        this.sampleCache.set(fileId, buffer)
        console.log(`[PlaybackScheduler] Preloaded sample: ${fileId}`)
      }).catch(err => {
        console.warn(`[PlaybackScheduler] Failed to preload sample ${fileId}:`, err)
      })
    })
    
    await Promise.all(loadPromises)
    console.log(`[PlaybackScheduler] Preloaded ${this.sampleCache.size} samples`)
  }

  /**
   * Get the URL for a sample file
   */
  private getSampleUrl(fileId: string): string | null {
    // Parse fileId format: "folderId:itemId"
    const parts = fileId.split(":")
    if (parts.length !== 2) return null
    
    const [folderId, itemId] = parts
    return `/audio/${folderId}/${itemId}.mp3`
  }

  /**
   * Trigger all clips that should play at a specific bar
   * Used as a safety net in case lookahead misses
   */
  private triggerClipsAtBar(bar: number) {
    // This is now handled by Tone.Transport.schedule directly
    // No need for bar checking
  }

  /**
   * Reschedule all clips - called when channels update during playback
   */
  private rescheduleAll() {
    // Clear existing schedule
    this.clearScheduledEvents()
    
    // Reset trigger state for clips that haven't played yet
    // Get current bar from transport
    const transport = Tone.Transport
    if (!transport) return
    
    const position = transport.position
    const parts = position.split(":")
    const currentBar = parseInt(parts[0]) + 1
    
    const newTriggeredSet = new Set<TriggeredClipKey>()
    
    for (const key of this.triggeredClips) {
      const [channelId, clipId] = key.split(":")
      const channel = this.channels.find(c => c.id === channelId)
      const clip = channel?.clips.find(c => c.id === clipId)
      
      // Keep triggered state only if clip is in the past
      if (clip && clip.startBar < currentBar) {
        newTriggeredSet.add(key)
      }
    }
    
    this.triggeredClips = newTriggeredSet
    
    // Reschedule
    this.setupLookaheadScheduler()
  }

  /**
   * Clear all scheduled Tone.Transport events
   */
  private clearScheduledEvents() {
    this.scheduleEventIds.forEach(id => Tone.Transport.clear(id))
    this.scheduleEventIds = []
  }

  /**
   * Clean up resources
   */
  public dispose() {
    this.stop()
  }
}
