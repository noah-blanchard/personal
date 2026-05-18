"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { makeDefaultPattern, PENTATONIC_NOTES } from "./constants"
import type { Pattern, Track } from "./types"

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

export function useSequencer() {
  // Always start with the default so SSR and client render identical HTML.
  // URL-encoded pattern is applied after hydration in the effect below.
  const [pattern, setPattern] = useState<Pattern>(makeDefaultPattern)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentStep, setCurrentStep] = useState(-1)

  // Tone.js refs — dynamic import, never serialized
  const toneRef = useRef<typeof import("tone") | null>(null)
  const synthsRef = useRef<Record<string, unknown>>({})
  const seqRef = useRef<import("tone").Sequence | null>(null)
  const patternRef = useRef<Pattern>(pattern)
  patternRef.current = pattern

  // On mount: read URL param and hydrate pattern (runs only on client, after SSR)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const encoded = params.get(URL_PARAM)
    if (encoded) {
      const decoded = decodePattern(encoded)
      if (decoded) setPattern(decoded)
    }
  }, [])

  // URL sync (debounced)
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

  // Initialize Tone.js synths (lazy, on first play)
  const initTone = useCallback(async () => {
    if (toneRef.current) return
    const Tone = await import("tone")
    toneRef.current = Tone
    await Tone.start()

    const reverb = new Tone.Reverb({ decay: 1.2, wet: 0.15 }).toDestination()
    const limiter = new Tone.Limiter(-3).toDestination()

    synthsRef.current = {
      kick: new Tone.MembraneSynth({
        pitchDecay: 0.05, octaves: 6,
        envelope: { attack: 0.001, decay: 0.3, sustain: 0, release: 0.1 },
      }).connect(limiter),

      snare: (() => {
        const noise = new Tone.NoiseSynth({
          noise: { type: "white" },
          envelope: { attack: 0.001, decay: 0.15, sustain: 0, release: 0.05 },
        }).connect(new Tone.Filter(3000, "bandpass").connect(limiter))
        return noise
      })(),

      clap: (() => {
        const noise = new Tone.NoiseSynth({
          noise: { type: "pink" },
          envelope: { attack: 0.005, decay: 0.1, sustain: 0, release: 0.1 },
        }).connect(reverb)
        return noise
      })(),

      hhcl: new Tone.MetalSynth({
        envelope: { attack: 0.001, decay: 0.05, release: 0.01 },
        harmonicity: 5.1, modulationIndex: 32, resonance: 4000, octaves: 1.5,
      }).connect(limiter),

      hhop: new Tone.MetalSynth({
        envelope: { attack: 0.001, decay: 0.3, release: 0.1 },
        harmonicity: 5.1, modulationIndex: 32, resonance: 4000, octaves: 1.5,
      }).connect(limiter),

      bass: new Tone.MonoSynth({
        oscillator: { type: "sawtooth" },
        filter: { Q: 2, type: "lowpass", rolloff: -24 },
        envelope: { attack: 0.01, decay: 0.1, sustain: 0.3, release: 0.1 },
        filterEnvelope: { attack: 0.01, decay: 0.1, sustain: 0.5, release: 0.1, baseFrequency: 200, octaves: 2 },
      }).connect(limiter),

      lead: new Tone.PolySynth(Tone.Synth, {
        oscillator: { type: "triangle" },
        envelope: { attack: 0.02, decay: 0.1, sustain: 0.3, release: 0.2 },
      }).connect(reverb),
    }
  }, [])

  const triggerTrack = useCallback((trackId: string, velocity: number) => {
    const Tone = toneRef.current
    const synths = synthsRef.current
    if (!Tone || !synths) return
    const vol = velocity / 127

    switch (trackId) {
      case "kick":
        ;(synths.kick as import("tone").MembraneSynth).triggerAttackRelease("C1", "8n", Tone.now(), vol)
        break
      case "snare":
        ;(synths.snare as import("tone").NoiseSynth).triggerAttackRelease("16n", Tone.now(), vol)
        break
      case "clap":
        ;(synths.clap as import("tone").NoiseSynth).triggerAttackRelease("16n", Tone.now(), vol)
        break
      case "hhcl":
        ;(synths.hhcl as import("tone").MetalSynth).triggerAttackRelease("32n", Tone.now(), vol)
        break
      case "hhop":
        ;(synths.hhop as import("tone").MetalSynth).triggerAttackRelease("8n", Tone.now(), vol)
        break
      case "bass": {
        const note = PENTATONIC_NOTES[Math.floor(Math.random() * 5)] ?? "C3"
        ;(synths.bass as import("tone").MonoSynth).triggerAttackRelease(note, "8n", Tone.now(), vol)
        break
      }
      case "lead": {
        const note = PENTATONIC_NOTES[Math.floor(Math.random() * PENTATONIC_NOTES.length)] ?? "C4"
        ;(synths.lead as import("tone").PolySynth).triggerAttackRelease(note, "8n", Tone.now(), vol)
        break
      }
    }
  }, [])

  const play = useCallback(async () => {
    await initTone()
    const Tone = toneRef.current!

    if (seqRef.current) {
      seqRef.current.dispose()
    }

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
            Tone.getDraw().schedule(() => {
              // velocity-based trigger handled via triggerTrack at audio time
            }, time)
            // Audio trigger (not draw-scheduled)
            const vol = s.velocity / 127
            const synths = synthsRef.current
            const now = time

            switch (track.id) {
              case "kick":
                ;(synths.kick as import("tone").MembraneSynth).triggerAttackRelease("C1", "8n", now, vol)
                break
              case "snare":
                ;(synths.snare as import("tone").NoiseSynth).triggerAttackRelease("16n", now, vol)
                break
              case "clap":
                ;(synths.clap as import("tone").NoiseSynth).triggerAttackRelease("16n", now, vol)
                break
              case "hhcl":
                ;(synths.hhcl as import("tone").MetalSynth).triggerAttackRelease("32n", now, vol)
                break
              case "hhop":
                ;(synths.hhop as import("tone").MetalSynth).triggerAttackRelease("8n", now, vol)
                break
              case "bass": {
                const note = PENTATONIC_NOTES[(step as number) % 5] ?? "C3"
                ;(synths.bass as import("tone").MonoSynth).triggerAttackRelease(note, "8n", now, vol)
                break
              }
              case "lead": {
                const note = PENTATONIC_NOTES[(step as number) % PENTATONIC_NOTES.length] ?? "C4"
                ;(synths.lead as import("tone").PolySynth).triggerAttackRelease(note, "8n", now, vol)
                break
              }
            }
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
    setIsPlaying(false)
    setCurrentStep(-1)
  }, [])

  const reset = useCallback(() => {
    stop()
    setPattern(makeDefaultPattern(patternRef.current.stepCount))
  }, [stop])

  // Sync BPM/swing to transport while playing
  useEffect(() => {
    const Tone = toneRef.current
    if (!Tone || !isPlaying) return
    Tone.Transport.bpm.value = pattern.bpm
    Tone.Transport.swing = pattern.swing / 100
  }, [pattern.bpm, pattern.swing, isPlaying])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      const Tone = toneRef.current
      if (Tone) {
        Tone.Transport.stop()
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
          : {
              ...t,
              steps: t.steps.map((s, i) =>
                i !== stepIndex ? s : { ...s, active: !s.active }
              ),
            }
      ),
    }))
  }, [])

  const setVelocity = useCallback((trackId: string, stepIndex: number, velocity: number) => {
    setPattern((p) => ({
      ...p,
      tracks: p.tracks.map((t) =>
        t.id !== trackId
          ? t
          : {
              ...t,
              steps: t.steps.map((s, i) => (i !== stepIndex ? s : { ...s, velocity })),
            }
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
