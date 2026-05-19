"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { getToneEngine, type ToneEngineState, type ToneEngineCallbacks } from "./ToneEngine"

/**
 * useToneEngine - React hook for ToneEngine integration
 * 
 * Provides:
 * - Engine initialization and lifecycle management
 * - State synchronization with React
 * - Sample loading utilities
 * - Transport control methods
 */

export function useToneEngine() {
  const engineRef = useRef(getToneEngine())
  const [state, setState] = useState<ToneEngineState>(engineRef.current.getState())
  const [isInitialized, setIsInitialized] = useState(false)

  // Set up callbacks for state updates
  useEffect(() => {
    const engine = engineRef.current
    
    const callbacks: ToneEngineCallbacks = {
      onStateChange: (partial) => {
        setState((prev) => ({ ...prev, ...partial }))
      },
      onPlayheadUpdate: (bar) => {
        setState((prev) => ({ ...prev, currentBar: bar }))
      },
    }

    engine.setCallbacks(callbacks)
  }, [])

  // Initialize engine on first user interaction
  const initialize = useCallback(async () => {
    const engine = engineRef.current
    if (!isInitialized) {
      try {
        await engine.initialize()
        setIsInitialized(true)
      } catch (error) {
        console.error("Failed to initialize ToneEngine:", error)
        throw error
      }
    }
  }, [isInitialized])

  // Load samples from manifest
  const loadSamples = useCallback(async (sampleManifest: Array<{ fileId: string; url: string }>) => {
    const engine = engineRef.current
    await engine.loadSamples(sampleManifest)
  }, [])

  // Load a single sample
  const loadSample = useCallback(async (fileId: string, url: string) => {
    const engine = engineRef.current
    await engine.loadSample(fileId, url)
  }, [])

  // Transport control
  const start = useCallback(async (fromBar?: number) => {
    const engine = engineRef.current
    await engine.start(fromBar)
  }, [])

  const stop = useCallback(() => {
    const engine = engineRef.current
    engine.stop()
  }, [])

  const togglePlay = useCallback(async (fromBar?: number) => {
    const engine = engineRef.current
    await engine.togglePlay(fromBar)
  }, [])

  const setBpm = useCallback((bpm: number) => {
    const engine = engineRef.current
    engine.setBpm(bpm)
  }, [])

  const seekTo = useCallback((bar: number) => {
    const engine = engineRef.current
    engine.seekTo(bar)
  }, [])

  // Sample utilities
  const getSampleDurationBars = useCallback((fileId: string) => {
    const engine = engineRef.current
    return engine.getSampleDurationBars(fileId)
  }, [])

  const isSampleLoaded = useCallback((fileId: string) => {
    const engine = engineRef.current
    return engine.isSampleLoaded(fileId)
  }, [])

  // Schedule sample playback
  const scheduleSample = useCallback((
    fileId: string,
    bar: number,
    volume?: number,
    muted?: boolean
  ) => {
    const engine = engineRef.current
    engine.scheduleSample(fileId, bar, volume, muted)
  }, [])

  // Get current state
  const getState = useCallback(() => {
    const engine = engineRef.current
    return engine.getState()
  }, [])

  return {
    // State
    isPlaying: state.isPlaying,
    bpm: state.bpm,
    currentBar: state.currentBar,
    isReady: state.isReady,
    loadedSamples: state.loadedSamples,
    isInitialized,

    // Methods
    initialize,
    loadSamples,
    loadSample,
    start,
    stop,
    togglePlay,
    setBpm,
    seekTo,
    getSampleDurationBars,
    isSampleLoaded,
    scheduleSample,
    getState,
  }
}
