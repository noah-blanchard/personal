"use client"

import { createContext, useCallback, useContext, useEffect, useState, useMemo } from "react"
import type { DAWChannel, DAWClip, DAWContextValue, DAWDetailSelection, DAWFile, DAWFolderId, DAWPanels } from "./types"
import type { Locale } from "@/content/types"
import { useToneEngine } from "./audio/useToneEngine"
import { usePlaybackScheduler } from "./audio/usePlaybackScheduler"
import { DAW_FOLDERS } from "./files"

const DAWContext = createContext<DAWContextValue | null>(null)

export function useDAW(): DAWContextValue {
  const ctx = useContext(DAWContext)
  if (!ctx) throw new Error("useDAW must be used inside DAWProvider")
  return ctx
}

let clipCounter = 0
let channelCounter = 0

function createDefaultChannels(): DAWChannel[] {
  const channels = Array.from({ length: 4 }, (_, index) => ({
    id: `ch-${index}`,
    label: `Track ${index + 1}`,
    volume: 80,
    muted: false,
    clips: [],
  }))
  channelCounter = channels.length
  return channels
}

export function DAWProvider({
  locale,
  children,
}: {
  locale: Locale
  children: React.ReactNode
}) {
  const [panels, setPanels] = useState<DAWPanels>({ browser: true, playlist: true })
  const [channels, setChannels] = useState<DAWChannel[]>(createDefaultChannels)
  const [selectedClip, setSelectedClip] = useState<DAWClip | null>(null)
  const [detailSelection, setDetailSelection] = useState<DAWDetailSelection | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [playheadBar, setPlayheadBar] = useState(1)
  const bpm = 128

  // Tone.js integration
  const toneEngine = useToneEngine()
  usePlaybackScheduler(channels, isPlaying)

  // Build sample manifest from DAW folders
  const sampleManifest = useMemo(() => {
    const samples = DAW_FOLDERS.flatMap(folder =>
      folder.files
        .filter(file => file.ext === "mp3" || file.ext === "wav" || file.ext === "ogg" || file.ext === "flac")
        .map(file => ({
          fileId: file.id,
          url: `/audio/${folder.id}/${file.itemId}.mp3`,
        }))
    )
    return samples
  }, [])

  // Initialize ToneEngine and load samples on mount
  useEffect(() => {
    // Initialize on first user interaction
    const handleUserInteraction = async () => {
      try {
        await toneEngine.initialize()
        await toneEngine.loadSamples(sampleManifest)
        
        // Update files with sample durations
        DAW_FOLDERS.forEach(folder => {
          folder.files.forEach(file => {
            const durationBars = toneEngine.getSampleDurationBars(file.id)
            if (durationBars !== undefined) {
              file.durationBars = Math.round(durationBars)
            }
          })
        })
      } catch (error) {
        console.warn("Failed to initialize audio engine:", error)
      }
      // Remove listeners after first interaction
      window.removeEventListener("click", handleUserInteraction)
      window.removeEventListener("keydown", handleUserInteraction)
    }

    window.addEventListener("click", handleUserInteraction)
    window.addEventListener("keydown", handleUserInteraction)

    return () => {
      window.removeEventListener("click", handleUserInteraction)
      window.removeEventListener("keydown", handleUserInteraction)
    }
  }, [toneEngine, sampleManifest])

  // Sync isPlaying state with ToneEngine
  useEffect(() => {
    // Only sync if ToneEngine is ready and we're not the ones who triggered the change
    if (toneEngine.isReady && toneEngine.isPlaying !== isPlaying) {
      // The toneEngine will handle the actual transport control
      // This effect is for syncing state from ToneEngine to React
    }
  }, [toneEngine.isReady, toneEngine.isPlaying, isPlaying])

  // Update playhead from ToneEngine
  useEffect(() => {
    if (toneEngine.isReady) {
      setPlayheadBar(toneEngine.currentBar)
    }
  }, [toneEngine.currentBar, toneEngine.isReady])

  const togglePanel = useCallback((panel: keyof DAWPanels) => {
    setPanels((prev) => ({ ...prev, [panel]: !prev[panel] }))
  }, [])

  const addClip = useCallback((channelId: string, file: DAWFile, startBar: number) => {
    // Use sample duration if available, otherwise default to 4 bars
    const lengthBars = file.durationBars !== undefined 
      ? Math.max(1, Math.round(file.durationBars))
      : 4

    const clip: DAWClip = {
      id: `clip-${++clipCounter}`,
      file,
      startBar,
      lengthBars,
    }
    let added = false
    setChannels((prev) =>
      prev.map((channel) => {
        if (channel.id !== channelId) return channel
        added = true
        return { ...channel, clips: [...channel.clips, clip] }
      })
    )
    if (added) {
      setSelectedClip(clip)
      setDetailSelection({ type: "file", fileId: file.id })
      setDetailOpen(true)
    }
  }, [])

  const removeClip = useCallback(
    (channelId: string, clipId: string) => {
      setChannels((prev) =>
        prev.map((channel) =>
          channel.id === channelId
            ? { ...channel, clips: channel.clips.filter((clip) => clip.id !== clipId) }
            : channel
        )
      )
      setSelectedClip((prev) => (prev?.id === clipId ? null : prev))
      setDetailOpen((prev) => {
        if (selectedClip?.id === clipId) return false
        return prev
      })
    },
    [selectedClip]
  )

  const moveClip = useCallback((clipId: string, channelId: string, startBar: number) => {
    let nextClip: DAWClip | null = null
    setChannels((prev) => {
      let foundClip: DAWClip | null = null
      const withoutClip = prev.map((channel) => {
        const clipIndex = channel.clips.findIndex((clip) => clip.id === clipId)
        if (clipIndex === -1) return channel
        const clip = channel.clips[clipIndex]
        if (!clip) return channel
        foundClip = { ...clip, startBar }
        return { ...channel, clips: channel.clips.filter((clip) => clip.id !== clipId) }
      })
      const clipToInsert = foundClip
      if (!clipToInsert) return prev
      nextClip = clipToInsert
      return withoutClip.map((channel) =>
        channel.id === channelId
          ? { ...channel, clips: [...channel.clips, clipToInsert] }
          : channel
      )
    })
    if (nextClip) {
      setSelectedClip((prev) => (prev?.id === clipId ? nextClip : prev))
    }
  }, [])

  const setChannelVolume = useCallback((channelId: string, volume: number) => {
    setChannels((prev) =>
      prev.map((channel) => (channel.id === channelId ? { ...channel, volume } : channel))
    )
  }, [])

  const toggleChannelMute = useCallback((channelId: string) => {
    setChannels((prev) =>
      prev.map((channel) =>
        channel.id === channelId ? { ...channel, muted: !channel.muted } : channel
      )
    )
  }, [])

  const addChannel = useCallback(() => {
    setChannels((prev) => {
      const nextIndex = channelCounter
      channelCounter += 1
      return [
        ...prev,
        {
          id: `ch-${nextIndex}`,
          label: `Track ${prev.length + 1}`,
          volume: 80,
          muted: false,
          clips: [],
        },
      ]
    })
  }, [])

  const openFolderDetail = useCallback((folderId: DAWFolderId) => {
    setDetailSelection({ type: "folder", folderId })
    setDetailOpen(true)
  }, [])

  const openFileDetail = useCallback((fileId: string) => {
    setDetailSelection({ type: "file", fileId })
    setDetailOpen(true)
  }, [])

  const selectClip = useCallback(
    (clip: DAWClip | null) => {
      setSelectedClip(clip)
      if (clip) {
        setDetailSelection({ type: "file", fileId: clip.file.id })
        setDetailOpen(true)
      }
    },
    []
  )

  const togglePlay = useCallback(async () => {
    if (toneEngine.isReady) {
      const newIsPlaying = !toneEngine.isPlaying
      await toneEngine.togglePlay(playheadBar)
      setIsPlaying(newIsPlaying)
    } else {
      // Fallback: just toggle local state if engine not ready
      setIsPlaying((p) => !p)
    }
  }, [toneEngine, playheadBar])

  // Legacy playhead tracking (fallback if ToneEngine not ready)
  useEffect(() => {
    if (toneEngine.isReady) {
      // ToneEngine handles playhead updates
      return
    }

    if (!isPlaying) {
      setPlayheadBar(1)
      return
    }
    let startTime: number | null = null
    let rafId = 0
    const barsPerSecond = bpm / 60 / 4
    const tick = (ts: number) => {
      if (!startTime) startTime = ts
      setPlayheadBar(1 + ((ts - startTime) / 1000) * barsPerSecond)
      rafId = requestAnimationFrame(tick)
    }
    rafId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafId)
  }, [isPlaying, bpm, toneEngine.isReady])

  return (
    <DAWContext.Provider
      value={{
        locale,
        panels,
        togglePanel,
        channels,
        addClip,
        removeClip,
        moveClip,
        setChannelVolume,
        toggleChannelMute,
        addChannel,
        selectedClip,
        selectClip,
        detailSelection,
        openFolderDetail,
        openFileDetail,
        detailOpen,
        setDetailOpen,
        isPlaying,
        togglePlay,
        bpm,
        playheadBar,
      }}
    >
      {children}
    </DAWContext.Provider>
  )
}
