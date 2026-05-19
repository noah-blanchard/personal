import type { Locale } from "@/content/types"

export type DAWFileExt = "mp3" | "mid" | "wav" | "flac" | "ogg" | "txt"
export type DAWFolderId = "about" | "experience" | "projects" | "skills" | "contact" | "cv"

export interface DAWFile {
  id: string
  folderId: DAWFolderId
  itemId: string
  name: string
  ext: DAWFileExt
  color: string // tailwind bg- class for the track color
  glyph: string // single char displayed as icon
}

export interface DAWFolder {
  id: DAWFolderId
  name: string
  files: DAWFile[]
}

export interface DAWClip {
  id: string
  file: DAWFile
  startBar: number // 1-indexed
  lengthBars: number
}

export interface DAWChannel {
  id: string
  label: string
  volume: number // 0–100
  muted: boolean
  clips: DAWClip[]
}

export interface DAWPanels {
  browser: boolean
  playlist: boolean
}

export interface DAWContextValue {
  locale: Locale
  panels: DAWPanels
  togglePanel: (panel: keyof DAWPanels) => void
  channels: DAWChannel[]
  addClip: (channelId: string, file: DAWFile, startBar: number) => void
  removeClip: (channelId: string, clipId: string) => void
  moveClip: (clipId: string, channelId: string, startBar: number) => void
  setChannelVolume: (channelId: string, volume: number) => void
  toggleChannelMute: (channelId: string) => void
  addChannel: () => void
  selectedClip: DAWClip | null
  selectClip: (clip: DAWClip | null) => void
  detailSelection: DAWDetailSelection | null
  openFolderDetail: (folderId: DAWFolderId) => void
  openFileDetail: (fileId: string) => void
  detailOpen: boolean
  setDetailOpen: (open: boolean) => void
  isPlaying: boolean
  togglePlay: () => void
  bpm: number
  playheadBar: number
}

export type DAWDetailSelection =
  | { type: "folder"; folderId: DAWFolderId }
  | { type: "file"; fileId: string }
