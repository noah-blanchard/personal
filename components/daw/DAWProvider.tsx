"use client"

import { createContext, useCallback, useContext, useEffect, useState } from "react"
import type { DAWChannel, DAWClip, DAWContextValue, DAWDetailSelection, DAWFile, DAWFolderId, DAWPanels } from "./types"
import type { Locale } from "@/content/types"

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

  const togglePanel = useCallback((panel: keyof DAWPanels) => {
    setPanels((prev) => ({ ...prev, [panel]: !prev[panel] }))
  }, [])

  const addClip = useCallback((channelId: string, file: DAWFile, startBar: number) => {
    const clip: DAWClip = {
      id: `clip-${++clipCounter}`,
      file,
      startBar,
      lengthBars: 4,
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

  const togglePlay = useCallback(() => setIsPlaying((p) => !p), [])

  useEffect(() => {
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
  }, [isPlaying, bpm])

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
