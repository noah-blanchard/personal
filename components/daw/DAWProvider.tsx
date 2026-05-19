"use client"

import { createContext, useCallback, useContext, useState } from "react"
import type { DAWContextValue, DAWFile, DAWLane, DAWPanels } from "./types"
import type { Locale } from "@/content/types"

const DAWContext = createContext<DAWContextValue | null>(null)

export function useDAW(): DAWContextValue {
  const ctx = useContext(DAWContext)
  if (!ctx) throw new Error("useDAW must be used inside DAWProvider")
  return ctx
}

let instanceCounter = 0

export function DAWProvider({
  locale,
  children,
}: {
  locale: Locale
  children: React.ReactNode
}) {
  const [panels, setPanels] = useState<DAWPanels>({ browser: true, playlist: true })
  const [playlist, setPlaylist] = useState<DAWLane[]>([])
  const [selectedLane, setSelectedLane] = useState<DAWLane | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)

  const togglePanel = useCallback((panel: keyof DAWPanels) => {
    setPanels((prev) => ({ ...prev, [panel]: !prev[panel] }))
  }, [])

  const addToPlaylist = useCallback((file: DAWFile) => {
    const lane: DAWLane = {
      instanceId: `lane-${++instanceCounter}`,
      file,
      volume: 80,
      muted: false,
    }
    setPlaylist((prev) => [...prev, lane])
    setSelectedLane(lane)
    setDetailOpen(true)
  }, [])

  const removeFromPlaylist = useCallback(
    (instanceId: string) => {
      setPlaylist((prev) => prev.filter((l) => l.instanceId !== instanceId))
      setSelectedLane((prev) => (prev?.instanceId === instanceId ? null : prev))
      setDetailOpen((prev) => {
        if (selectedLane?.instanceId === instanceId) return false
        return prev
      })
    },
    [selectedLane]
  )

  const setVolume = useCallback((instanceId: string, volume: number) => {
    setPlaylist((prev) =>
      prev.map((l) => (l.instanceId === instanceId ? { ...l, volume } : l))
    )
  }, [])

  const toggleMute = useCallback((instanceId: string) => {
    setPlaylist((prev) =>
      prev.map((l) => (l.instanceId === instanceId ? { ...l, muted: !l.muted } : l))
    )
  }, [])

  const selectLane = useCallback((lane: DAWLane | null) => {
    setSelectedLane(lane)
    if (lane) setDetailOpen(true)
  }, [])

  const togglePlay = useCallback(() => setIsPlaying((p) => !p), [])

  return (
    <DAWContext.Provider
      value={{
        locale,
        panels,
        togglePanel,
        playlist,
        addToPlaylist,
        removeFromPlaylist,
        setVolume,
        toggleMute,
        selectedLane,
        selectLane,
        detailOpen,
        setDetailOpen,
        isPlaying,
        togglePlay,
        bpm: 128,
      }}
    >
      {children}
    </DAWContext.Provider>
  )
}
