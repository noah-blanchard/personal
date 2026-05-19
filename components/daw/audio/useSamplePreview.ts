"use client"

import { useRef, useCallback, useState, useEffect } from "react"
import * as Tone from "tone"

/**
 * useSamplePreview - Manages audio sample preview playback
 * 
 * Features:
 * - Plays a preview of a sample when requested
 * - Only one preview can play at a time (global singleton)
 * - Automatically stops when component unmounts or new preview starts
 * - Graceful fallback if audio unavailable
 */

type PreviewState = {
  isPlaying: boolean
  fileId: string | null
}

class SamplePreviewManager {
  private static instance: SamplePreviewManager | null = null
  private currentPlayer: Tone.Player | null = null
  private state: PreviewState = { isPlaying: false, fileId: null }
  private listeners: Set<(state: PreviewState) => void> = new Set()

  private constructor() {}

  public static getInstance(): SamplePreviewManager {
    if (!SamplePreviewManager.instance) {
      SamplePreviewManager.instance = new SamplePreviewManager()
    }
    return SamplePreviewManager.instance
  }

  public subscribe(listener: (state: PreviewState) => void): () => void {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }

  public async playSample(fileId: string, url: string): Promise<void> {
    try {
      // Stop current preview if playing
      this.stopCurrent()

      // Start Tone.js if needed
      await Tone.start()

      // Load and play the sample
      const buffer = await Tone.ToneAudioBuffer.fromUrl(url)
      const player = new Tone.Player(buffer).connect(Tone.getDestination())
      player.volume.value = -6 // Slightly quieter for preview
      
      this.currentPlayer = player
      this.updateState({ isPlaying: true, fileId })

      // Play the sample
      player.start()

      // Clean up when done
      setTimeout(() => {
        this.currentPlayer = null
        this.updateState({ isPlaying: false, fileId: null })
      }, buffer.duration * 1000 + 100)
    } catch (error) {
      console.warn(`[SamplePreview] Failed to play preview for ${fileId}:`, error)
      this.updateState({ isPlaying: false, fileId: null })
    }
  }

  public stop(): void {
    this.stopCurrent()
    this.updateState({ isPlaying: false, fileId: null })
  }

  public getState(): PreviewState {
    return this.state
  }

  private stopCurrent(): void {
    if (this.currentPlayer) {
      try {
        this.currentPlayer.stop()
      } catch (e) {
        // Ignore errors
      }
      this.currentPlayer = null
    }
  }

  private updateState(partial: Partial<PreviewState>): void {
    this.state = { ...this.state, ...partial }
    this.listeners.forEach(listener => listener(this.state))
  }

  public dispose(): void {
    this.stopCurrent()
    this.listeners.clear()
    SamplePreviewManager.instance = null
  }
}

export const getSamplePreviewManager = SamplePreviewManager.getInstance

/**
 * useSamplePreview - React hook for sample preview functionality
 */
export function useSamplePreview() {
  const managerRef = useRef(getSamplePreviewManager())
  const [state, setState] = useState<PreviewState>(managerRef.current.getState())

  useEffect(() => {
    const unsubscribe = managerRef.current.subscribe(setState)
    return unsubscribe
  }, [])

  const playPreview = useCallback(async (fileId: string, url: string) => {
    await managerRef.current.playSample(fileId, url)
  }, [])

  const stopPreview = useCallback(() => {
    managerRef.current.stop()
  }, [])

  const isPlaying = useCallback((fileId: string) => {
    return state.isPlaying && state.fileId === fileId
  }, [state])

  const isAnyPlaying = state.isPlaying

  return {
    isPlaying,
    isAnyPlaying,
    playPreview,
    stopPreview,
    currentFileId: state.fileId,
  }
}
