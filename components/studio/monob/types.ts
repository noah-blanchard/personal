export type OscType = "sine" | "square" | "sawtooth"

export type FilterType = "lowpass" | "bandpass" | "highpass"

export type FilterRolloff = -12 | -24

export type Envelope = {
  attack: number
  decay: number
  sustain: number
  release: number
}

export type MONOBPatch = {
  name: string
  oscType: OscType
  ampEnv: Envelope
  filterType: FilterType
  filterRolloff: FilterRolloff
  filterCutoff: number
  filterRes: number
  filterEnv: Envelope
  volume: number
  portamento: number
}
