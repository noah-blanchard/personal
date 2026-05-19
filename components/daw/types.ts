import type { Locale } from "@/content/types"

export type DAWFileExt = "mp3" | "mid" | "wav" | "flac" | "ogg" | "txt"
export type DAWSection = "about" | "experience" | "projects" | "skills" | "contact" | "cv"

export interface DAWFile {
  id: DAWSection
  name: string
  ext: DAWFileExt
  color: string // tailwind bg- class for the track color
  glyph: string // single char displayed as icon
}

export interface DAWLane {
  instanceId: string
  file: DAWFile
  volume: number // 0–100
  muted: boolean
}

export interface DAWPanels {
  browser: boolean
  playlist: boolean
}

export interface DAWContextValue {
  locale: Locale
  panels: DAWPanels
  togglePanel: (panel: keyof DAWPanels) => void
  playlist: DAWLane[]
  addToPlaylist: (file: DAWFile) => void
  removeFromPlaylist: (instanceId: string) => void
  setVolume: (instanceId: string, volume: number) => void
  toggleMute: (instanceId: string) => void
  selectedLane: DAWLane | null
  selectLane: (lane: DAWLane | null) => void
  detailOpen: boolean
  setDetailOpen: (open: boolean) => void
  isPlaying: boolean
  togglePlay: () => void
  bpm: number
}
