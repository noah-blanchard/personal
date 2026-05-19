"use client"

import * as Tone from "tone"

async function withAudio(fn: () => void) {
  try {
    await Tone.start()
    fn()
  } catch {
    // Audio context unavailable — silently skip
  }
}

function disposeSoon(node: Tone.ToneAudioNode, ms = 600) {
  setTimeout(() => node.dispose(), ms)
}

export function playClick() {
  withAudio(() => {
    const synth = new Tone.Synth({
      oscillator: { type: "sine" },
      envelope: { attack: 0.001, decay: 0.04, sustain: 0, release: 0.04 },
      volume: -20,
    }).toDestination()
    synth.triggerAttackRelease("G5", "64n")
    disposeSoon(synth, 300)
  })
}

export function playDrop() {
  withAudio(() => {
    const synth = new Tone.Synth({
      oscillator: { type: "triangle" },
      envelope: { attack: 0.001, decay: 0.14, sustain: 0, release: 0.1 },
      volume: -14,
    }).toDestination()
    synth.triggerAttackRelease("C4", "8n")
    disposeSoon(synth, 700)
  })
}

export function playOpen() {
  withAudio(() => {
    const synth = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: "sine" },
      envelope: { attack: 0.02, decay: 0.12, sustain: 0, release: 0.2 },
      volume: -20,
    }).toDestination()
    synth.triggerAttackRelease(["E4", "G4", "B4"], "8n")
    disposeSoon(synth, 900)
  })
}

export function playClose() {
  withAudio(() => {
    const synth = new Tone.Synth({
      oscillator: { type: "sine" },
      envelope: { attack: 0.001, decay: 0.09, sustain: 0, release: 0.08 },
      volume: -22,
    }).toDestination()
    synth.triggerAttackRelease("E3", "16n")
    disposeSoon(synth, 400)
  })
}

export function playRemove() {
  withAudio(() => {
    const synth = new Tone.Synth({
      oscillator: { type: "sawtooth" },
      envelope: { attack: 0.001, decay: 0.08, sustain: 0, release: 0.06 },
      volume: -22,
    }).toDestination()
    synth.triggerAttackRelease("A2", "32n")
    disposeSoon(synth, 400)
  })
}

export function playTransitionSplash() {
  withAudio(() => {
    const synth = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: "sine" },
      envelope: { attack: 0.06, decay: 0.25, sustain: 0.05, release: 0.6 },
      volume: -16,
    }).toDestination()
    const now = Tone.now()
    synth.triggerAttackRelease(["C3", "E3", "G3"], "4n", now)
    synth.triggerAttackRelease(["C4", "E4", "G4"], "4n", now + 0.18)
    disposeSoon(synth, 2500)
  })
}
