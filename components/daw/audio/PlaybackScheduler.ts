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

  /**
   * Update the scheduler with current channel state
   * Called whenever channels change in DAWProvider
   */
  public setChannels(channels: DAWChannel[]) {
    this.channels = channels
    
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
    this.triggeredClips.clear()
  }

  /**
   * Set up lookahead scheduler using Tone.Transport
   * Schedules events slightly ahead of time for tight timing
   */
  private setupLookaheadScheduler() {
    this.clearScheduledEvents()
    
    const lookahead = 0.1 // 100ms lookahead
    const scheduleInterval = 0.05 // Check every 50ms
    
    console.log('[PlaybackScheduler] Starting lookahead scheduler')
    
    // Create a repeating event that checks for clips to schedule
    let callCount = 0
    const scheduleCheck = () => {
      callCount++
      if (!this.isPlaying) {
        if (callCount <= 5) console.log(`[PlaybackScheduler] scheduleCheck #${callCount}: returning - not playing`)
        return
      }
      
      const currentTime = Tone.now()
      const transport = Tone.Transport
      if (!transport) {
        if (callCount <= 5) console.log(`[PlaybackScheduler] scheduleCheck #${callCount}: returning - no transport`)
        return
      }
      if (transport.state !== "started") {
        if (callCount <= 5) console.log(`[PlaybackScheduler] scheduleCheck #${callCount}: returning - transport state is ${transport.state}`)
        return
      }
      
      // Get current bar from transport position
      const position = transport.position
      const parts = position.split(":")
      const currentBar = parseInt(parts[0]) + 1 // Convert 0-indexed to 1-indexed
      
      // Debug: log channel and clip info
      if (callCount <= 20) {
        console.log(`[PlaybackScheduler] scheduleCheck #${callCount}: bar=${currentBar}, transport.state=${transport.state}, channels=${this.channels.length}, totalClips=${this.channels.reduce((sum, ch) => sum + ch.clips.length, 0)}`)
      }
      
      // Look ahead for clips that should play
      for (const channel of this.channels) {
        if (channel.muted) continue
        
        for (const clip of channel.clips) {
          const clipKey = `${channel.id}:${clip.id}`
          
          // Skip if already triggered
          if (this.triggeredClips.has(clipKey)) continue
          
          // Check if this clip should play soon (within lookahead window)
          const clipBar = clip.startBar
          const barIndex = clipBar - 1
          const clipTimeStr = `${barIndex}:0:0`
          const clipTime = Tone.Time(clipTimeStr).toSeconds()
          
          if (clipTime >= currentTime && clipTime <= currentTime + lookahead) {
            console.log(`[PlaybackScheduler] Triggering clip ${clipKey} at bar ${clipBar} (file: ${clip.file.id})`)
            // Play the sample directly
            this.playSampleDirectly(clip.file.id, channel.volume, channel.muted)
            
            // Mark as triggered
            this.triggeredClips.add(clipKey)
          }
        }
      }
    }
    
    // Schedule the check to run repeatedly
    try {
      const intervalId = Tone.Transport.scheduleRepeat(scheduleCheck, scheduleInterval)
      this.scheduleEventIds.push(intervalId)
      console.log(`[PlaybackScheduler] Scheduled check every ${scheduleInterval}s, event ID: ${intervalId}`)
    } catch (err) {
      console.error('[PlaybackScheduler] Failed to schedule repeat:', err)
    }
    
    // Also schedule a check on every bar change for safety
    try {
      const barCheckId = Tone.Transport.scheduleRepeat(() => {
        if (!this.isPlaying) return
        const transport = Tone.Transport
        if (!transport) return
        
        const position = transport.position
        const parts = position.split(":")
        const bar = parseInt(parts[0]) + 1
        console.log(`[PlaybackScheduler] Bar check: ${bar}, triggered clips: ${this.triggeredClips.size}`)
        this.triggerClipsAtBar(bar)
      }, "1m")
      this.scheduleEventIds.push(barCheckId)
      console.log(`[PlaybackScheduler] Scheduled bar check, event ID: ${barCheckId}`)
    } catch (err) {
      console.error('[PlaybackScheduler] Failed to schedule bar check:', err)
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

    console.log(`[PlaybackScheduler] Playing sample: ${sampleUrl}`)

    // Start Tone.js if needed
    Tone.start().then(() => {
      console.log(`[PlaybackScheduler] Loading buffer from: ${sampleUrl}`)
      Tone.ToneAudioBuffer.fromUrl(sampleUrl).then(buffer => {
        console.log(`[PlaybackScheduler] Buffer loaded, duration: ${buffer.duration}s`)
        const player = new Tone.Player(buffer).connect(Tone.getDestination())
        
        if (volume !== undefined) {
          player.volume.value = 20 * Math.log10(Math.max(0.001, volume / 100))
        }
        
        if (muted) {
          player.mute = true
        }
        
        player.start()
        console.log(`[PlaybackScheduler] Sample started`)
        
        // Dispose after playback
        setTimeout(() => player.dispose(), buffer.duration * 1000 + 100)
      }).catch(err => {
        console.warn(`[PlaybackScheduler] Failed to load sample ${fileId}:`, err)
      })
    }).catch(err => {
      console.warn(`[PlaybackScheduler] Failed to start Tone.js:`, err)
    })
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
    for (const channel of this.channels) {
      if (channel.muted) continue
      
      for (const clip of channel.clips) {
        if (clip.startBar === bar) {
          const clipKey = `${channel.id}:${clip.id}`
          if (!this.triggeredClips.has(clipKey)) {
            this.playSampleDirectly(clip.file.id, channel.volume, channel.muted)
            this.triggeredClips.add(clipKey)
          }
        }
      }
    }
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
