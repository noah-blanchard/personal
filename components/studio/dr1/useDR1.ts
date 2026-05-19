"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { makeDefaultPattern } from "./constants"
import type { Pattern } from "./types"

const URL_PARAM = "p"
const SYNC_DEBOUNCE_MS = 500

function encodePattern(p: Pattern): string {
  try {
    return btoa(JSON.stringify(p))
  } catch {
    return ""
  }
}

function decodePattern(s: string): Pattern | null {
  try {
    return JSON.parse(atob(s)) as Pattern
  } catch {
    return null
  }
}

function triggerNote(
  trackId: string,
  synths: Record<string, unknown>,
  time: number,
  vol: number,
) {
  switch (trackId) {
    case "kick":
      ;(synths.kick as import("tone").MembraneSynth).triggerAttackRelease("C1", "8n", time, vol)
      break
    case "snare":
      ;(synths.snare as import("tone").NoiseSynth).triggerAttackRelease("16n", time, vol)
      break
    case "clap":
      ;(synths.clap as import("tone").NoiseSynth).triggerAttackRelease("16n", time, vol)
      break
    case "hhcl":
      ;(synths.hhcl as import("tone").MetalSynth).triggerAttackRelease(400, "32n", time, vol)
      break
    case "hhop":
      ;(synths.hhop as import("tone").MetalSynth).triggerAttackRelease(400, "8n", time, vol)
      break
  }
}

export function useDR1() {
  const [pattern, setPattern] = useState<Pattern>(makeDefaultPattern)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentStep, setCurrentStep] = useState(-1)

  const toneRef = useRef<typeof import("tone") | null>(null)
  const synthsRef = useRef<Record<string, unknown>>({})
  const seqRef = useRef<import("tone").Sequence | null>(null)
  const patternRef = useRef<Pattern>(pattern)
  patternRef.current = pattern

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const encoded = params.get(URL_PARAM)
    if (encoded) {
      const decoded = decodePattern(encoded)
      if (decoded) setPattern(decoded)
    }
  }, [])

  const syncTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  useEffect(() => {
    if (syncTimer.current) clearTimeout(syncTimer.current)
    syncTimer.current = setTimeout(() => {
      const encoded = encodePattern(pattern)
      if (encoded) {
        const url = new URL(window.location.href)
        url.searchParams.set(URL_PARAM, encoded)
        window.history.replaceState(null, "", url.toString())
      }
    }, SYNC_DEBOUNCE_MS)
  }, [pattern])

  const initTone = useCallback(async () => {
    if (toneRef.current) return
    const Tone = await import("tone")
    toneRef.current = Tone
    await Tone.start()

    const reverb = new Tone.Reverb({ decay: 1.2, wet: 0.15 }).toDestination()

    const kick = new Tone.MembraneSynth({
      pitchDecay: 0.05, octaves: 6,
      envelope: { attack: 0.001, decay: 0.3, sustain: 0, release: 0.1 },
    }).toDestination()
    kick.volume.value = -6

    const snareFilter = new Tone.Filter(3000, "bandpass").toDestination()
    const snare = new Tone.NoiseSynth({
      noise: { type: "white" },
      envelope: { attack: 0.001, decay: 0.15, sustain: 0, release: 0.05 },
    }).connect(snareFilter)
    snare.volume.value = -9

    const clap = new Tone.NoiseSynth({
      noise: { type: "pink" },
      envelope: { attack: 0.005, decay: 0.1, sustain: 0, release: 0.1 },
    }).connect(reverb)
    clap.volume.value = -9

    const hhcl = new Tone.MetalSynth({
      envelope: { attack: 0.001, decay: 0.05, release: 0.01 },
      harmonicity: 5.1, modulationIndex: 32, resonance: 4000, octaves: 1.5,
    }).toDestination()
    hhcl.volume.value = -18

    const hhop = new Tone.MetalSynth({
      envelope: { attack: 0.001, decay: 0.3, release: 0.1 },
      harmonicity: 5.1, modulationIndex: 32, resonance: 4000, octaves: 1.5,
    }).toDestination()
    hhop.volume.value = -16

    synthsRef.current = { kick, snare, clap, hhcl, hhop, reverb, snareFilter }
  }, [])

  const triggerTrack = useCallback((trackId: string, velocity: number) => {
    const Tone = toneRef.current
    const synths = synthsRef.current
    if (!Tone || !synths) return
    triggerNote(trackId, synths, Tone.now(), velocity / 127)
  }, [])

  const play = useCallback(async () => {
    await initTone()
    const Tone = toneRef.current!

    if (seqRef.current) {
      seqRef.current.dispose()
      seqRef.current = null
    }
    Tone.getDraw().cancel(0)

    Tone.Transport.bpm.value = patternRef.current.bpm
    Tone.Transport.swing = patternRef.current.swing / 100
    Tone.Transport.swingSubdivision = "16n"

    const steps = Array.from({ length: patternRef.current.stepCount }, (_, i) => i)

    seqRef.current = new Tone.Sequence(
      (time, step) => {
        const p = patternRef.current
        p.tracks.forEach((track) => {
          const s = track.steps[step as number]
          if (s?.active && !track.muted) {
            triggerNote(track.id, synthsRef.current, time, s.velocity / 127)
          }
        })

        Tone.getDraw().schedule(() => {
          setCurrentStep(step as number)
        }, time)
      },
      steps,
      "16n"
    )

    seqRef.current.start(0)
    Tone.Transport.start()
    setIsPlaying(true)
  }, [initTone])

  const stop = useCallback(() => {
    const Tone = toneRef.current
    if (!Tone) return
    Tone.Transport.stop()
    seqRef.current?.stop()
    Tone.getDraw().cancel(0)
    setIsPlaying(false)
    setCurrentStep(-1)
  }, [])

  const reset = useCallback(() => {
    stop()
    setPattern(makeDefaultPattern(patternRef.current.stepCount))
  }, [stop])

  useEffect(() => {
    const Tone = toneRef.current
    if (!Tone || !isPlaying) return
    Tone.Transport.bpm.value = pattern.bpm
    Tone.Transport.swing = pattern.swing / 100
  }, [pattern.bpm, pattern.swing, isPlaying])

  useEffect(() => {
    return () => {
      const Tone = toneRef.current
      if (Tone) {
        Tone.Transport.stop()
        Tone.getDraw().cancel(0)
        seqRef.current?.dispose()
        Object.values(synthsRef.current).forEach((s) => {
          ;(s as { dispose?: () => void }).dispose?.()
        })
      }
    }
  }, [])

  const toggleStep = useCallback((trackId: string, stepIndex: number) => {
    setPattern((p) => ({
      ...p,
      tracks: p.tracks.map((t) =>
        t.id !== trackId
          ? t
          : { ...t, steps: t.steps.map((s, i) => (i !== stepIndex ? s : { ...s, active: !s.active })) }
      ),
    }))
  }, [])

  const setVelocity = useCallback((trackId: string, stepIndex: number, velocity: number) => {
    setPattern((p) => ({
      ...p,
      tracks: p.tracks.map((t) =>
        t.id !== trackId
          ? t
          : { ...t, steps: t.steps.map((s, i) => (i !== stepIndex ? s : { ...s, velocity })) }
      ),
    }))
  }, [])

  const setBpm = useCallback((bpm: number) => {
    setPattern((p) => ({ ...p, bpm }))
  }, [])

  const setSwing = useCallback((swing: number) => {
    setPattern((p) => ({ ...p, swing }))
  }, [])

  const setStepCount = useCallback(
    (stepCount: 16 | 32) => {
      if (isPlaying) stop()
      setPattern((p) => ({
        ...p,
        stepCount,
        tracks: p.tracks.map((t) => {
          const current = t.steps
          if (stepCount === 32 && current.length === 16) {
            return { ...t, steps: [...current, ...Array.from({ length: 16 }, () => ({ active: false, velocity: 100 }))] }
          }
          if (stepCount === 16 && current.length === 32) {
            return { ...t, steps: current.slice(0, 16) }
          }
          return t
        }),
      }))
    },
    [isPlaying, stop]
  )

  const toggleMute = useCallback((trackId: string) => {
    setPattern((p) => ({
      ...p,
      tracks: p.tracks.map((t) => (t.id !== trackId ? t : { ...t, muted: !t.muted })),
    }))
  }, [])

  return {
    pattern,
    isPlaying,
    currentStep,
    play,
    stop,
    reset,
    toggleStep,
    setVelocity,
    setBpm,
    setSwing,
    setStepCount,
    toggleMute,
    triggerTrack,
  }
}
