"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { makeDefaultPatch } from "./constants"
import type { FilterRolloff, FilterType, MONOBPatch, OscType } from "./types"

const URL_PARAM = "m"
const SYNC_DEBOUNCE_MS = 500
const FILTER_ENV_OCTAVES = 2.5
const VOLUME_MIN_DB = -30
const VOLUME_MAX_DB = 0
const PORTA_MAX_SEC = 0.35

function encodePatch(p: MONOBPatch): string {
  try {
    return btoa(JSON.stringify(p))
  } catch {
    return ""
  }
}

function decodePatch(s: string): MONOBPatch | null {
  try {
    return JSON.parse(atob(s)) as MONOBPatch
  } catch {
    return null
  }
}

function mapVolumeDb(v: number) {
  const t = Math.min(100, Math.max(0, v)) / 100
  return VOLUME_MIN_DB + t * (VOLUME_MAX_DB - VOLUME_MIN_DB)
}

function mapPortamento(v: number) {
  const t = Math.min(100, Math.max(0, v)) / 100
  return t * PORTA_MAX_SEC
}

export function useMONOB() {
  const [patch, setPatch] = useState<MONOBPatch>(makeDefaultPatch)
  const [activeNote, setActiveNote] = useState<string | null>(null)

  const toneRef = useRef<typeof import("tone") | null>(null)
  const synthRef = useRef<import("tone").MonoSynth | null>(null)
  const patchRef = useRef<MONOBPatch>(patch)
  patchRef.current = patch

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const encoded = params.get(URL_PARAM)
    if (encoded) {
      const decoded = decodePatch(encoded)
      if (decoded) setPatch(decoded)
    }
  }, [])

  const syncTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  useEffect(() => {
    if (syncTimer.current) clearTimeout(syncTimer.current)
    syncTimer.current = setTimeout(() => {
      const encoded = encodePatch(patch)
      if (encoded) {
        const url = new URL(window.location.href)
        url.searchParams.set(URL_PARAM, encoded)
        window.history.replaceState(null, "", url.toString())
      }
    }, SYNC_DEBOUNCE_MS)
  }, [patch])

  const initTone = useCallback(async () => {
    if (toneRef.current) return
    const Tone = await import("tone")
    toneRef.current = Tone
    await Tone.start()
    Tone.getContext().lookAhead = 0

    const p = patchRef.current
    const synth = new Tone.MonoSynth({
      oscillator: { type: p.oscType },
      envelope: { ...p.ampEnv },
      filter: { type: p.filterType, rolloff: p.filterRolloff, Q: p.filterRes },
      filterEnvelope: { ...p.filterEnv, baseFrequency: p.filterCutoff, octaves: FILTER_ENV_OCTAVES },
    }).toDestination()

    synth.volume.value = mapVolumeDb(p.volume)
    synth.portamento = mapPortamento(p.portamento)
    synthRef.current = synth
  }, [])

  useEffect(() => {
    const synth = synthRef.current
    if (!synth) return
    synth.set({
      oscillator: { type: patch.oscType },
      envelope: { ...patch.ampEnv },
      filter: { type: patch.filterType, rolloff: patch.filterRolloff, Q: patch.filterRes },
      filterEnvelope: { ...patch.filterEnv, baseFrequency: patch.filterCutoff, octaves: FILTER_ENV_OCTAVES },
    })
    synth.filter.frequency.value = patch.filterCutoff
    synth.filterEnvelope.baseFrequency = patch.filterCutoff
    synth.portamento = mapPortamento(patch.portamento)
    synth.volume.value = mapVolumeDb(patch.volume)
  }, [patch])

  const noteOn = useCallback(
    async (note: string, velocity = 0.85) => {
      if (!toneRef.current) await initTone()
      const synth = synthRef.current
      if (!synth) return
      synth.triggerAttack(note, undefined, velocity)
      setActiveNote(note)
    },
    [initTone]
  )

  const noteOff = useCallback(() => {
    const synth = synthRef.current
    if (!synth) return
    synth.triggerRelease()
    setActiveNote(null)
  }, [])

  useEffect(() => {
    return () => {
      const Tone = toneRef.current
      if (Tone) {
        synthRef.current?.dispose()
      }
    }
  }, [])

  const setOscType = useCallback((oscType: OscType) => {
    setPatch((p) => ({ ...p, oscType }))
  }, [])

  const setAmpEnv = useCallback((env: MONOBPatch["ampEnv"]) => {
    setPatch((p) => ({ ...p, ampEnv: env }))
  }, [])

  const setFilterEnv = useCallback((env: MONOBPatch["filterEnv"]) => {
    setPatch((p) => ({ ...p, filterEnv: env }))
  }, [])

  const setFilterType = useCallback((filterType: FilterType) => {
    setPatch((p) => ({ ...p, filterType }))
  }, [])

  const setFilterRolloff = useCallback((filterRolloff: FilterRolloff) => {
    setPatch((p) => ({ ...p, filterRolloff }))
  }, [])

  const setFilterCutoff = useCallback((filterCutoff: number) => {
    setPatch((p) => ({ ...p, filterCutoff }))
  }, [])

  const setFilterRes = useCallback((filterRes: number) => {
    setPatch((p) => ({ ...p, filterRes }))
  }, [])

  const setVolume = useCallback((volume: number) => {
    setPatch((p) => ({ ...p, volume }))
  }, [])

  const setPortamento = useCallback((portamento: number) => {
    setPatch((p) => ({ ...p, portamento }))
  }, [])

  const resetPatch = useCallback(() => {
    setPatch(makeDefaultPatch())
  }, [])

  return {
    patch,
    activeNote,
    noteOn,
    noteOff,
    setOscType,
    setAmpEnv,
    setFilterEnv,
    setFilterType,
    setFilterRolloff,
    setFilterCutoff,
    setFilterRes,
    setVolume,
    setPortamento,
    resetPatch,
  }
}
