export type Step = {
  active: boolean
  velocity: number // 1–127
}

export type Track = {
  id: string
  name: string
  color: string
  steps: Step[]
  muted: boolean
}

export type Pattern = {
  name: string
  bpm: number
  swing: number // 0–100
  stepCount: 16 | 32
  tracks: Track[]
}
