import type { Pattern, Step } from "./types"

export const TRACK_DEFS = [
  { id: "kick",  name: "KICK",  color: "#f59e0b" },
  { id: "snare", name: "SNARE", color: "#22d3ee" },
  { id: "clap",  name: "CLAP",  color: "#f472b6" },
  { id: "hhcl",  name: "HH CL", color: "#2dd4bf" },
  { id: "hhop",  name: "HH OP", color: "#60a5fa" },
] as const

function makeSteps(count: number): Step[] {
  return Array.from({ length: count }, () => ({ active: false, velocity: 100 }))
}

export function makeDefaultPattern(stepCount: 16 | 32 = 16): Pattern {
  return {
    name: "A1",
    bpm: 120,
    swing: 0,
    stepCount,
    tracks: TRACK_DEFS.map((t) => ({
      id: t.id,
      name: t.name,
      color: t.color,
      steps: makeSteps(stepCount),
      muted: false,
    })),
  }
}
