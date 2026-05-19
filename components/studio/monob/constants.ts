import type { MONOBPatch } from "./types"

export function makeDefaultPatch(): MONOBPatch {
  return {
    name: "INIT",
    oscType: "sawtooth",
    ampEnv: { attack: 0.01, decay: 0.2, sustain: 0.6, release: 0.3 },
    filterType: "lowpass",
    filterRolloff: -24,
    filterCutoff: 1200,
    filterRes: 1.2,
    filterEnv: { attack: 0.02, decay: 0.25, sustain: 0.4, release: 0.35 },
    volume: 80,
    portamento: 0,
  }
}
