"use client"

import { useMemo } from "react"
import { playClick, playClose, playDrop, playOpen, playRemove, playTransitionSplash } from "./sounds"

export function useDAWAudio() {
  return useMemo(
    () => ({ playClick, playClose, playDrop, playOpen, playRemove, playTransitionSplash }),
    []
  )
}
