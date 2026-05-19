"use client"

import { useEffect, useRef, useCallback } from "react"
import { PlaybackScheduler } from "./PlaybackScheduler"
import { useToneEngine } from "./useToneEngine"
import type { DAWChannel } from "../types"

/**
 * usePlaybackScheduler - React hook for PlaybackScheduler integration
 * 
 * Manages the lifecycle of the PlaybackScheduler and keeps it
 * synchronized with DAW state changes.
 */

export function usePlaybackScheduler(channels: DAWChannel[], isPlaying: boolean) {
  const schedulerRef = useRef<PlaybackScheduler | null>(null)
  const { isReady } = useToneEngine()

  // Initialize scheduler
  useEffect(() => {
    if (!schedulerRef.current) {
      schedulerRef.current = new PlaybackScheduler()
    }

    return () => {
      schedulerRef.current?.dispose()
    }
  }, [])

  // Update channels whenever they change
  useEffect(() => {
    if (schedulerRef.current) {
      schedulerRef.current.setChannels(channels)
    }
  }, [channels])

  // Start/stop scheduler based on playback state
  useEffect(() => {
    console.log(`[usePlaybackScheduler] isPlaying=${isPlaying}, isReady=${isReady}`)
    if (!schedulerRef.current || !isReady) return

    if (isPlaying) {
      console.log('[usePlaybackScheduler] Calling scheduler.start()')
      schedulerRef.current.start().catch(err => {
        console.error('[usePlaybackScheduler] Error starting scheduler:', err)
      })
    } else {
      console.log('[usePlaybackScheduler] Calling scheduler.stop()')
      schedulerRef.current.stop()
    }
  }, [isPlaying, isReady])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      schedulerRef.current?.dispose()
    }
  }, [])

  return {
    scheduler: schedulerRef.current,
  }
}
