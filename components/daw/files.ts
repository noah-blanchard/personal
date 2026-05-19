import { BIO, CURRENTLY, FACTS, WHOAMI } from "@/content/about"
import { ENTRIES, type Lane } from "@/content/experience"
import { TECH_GROUPS } from "@/content/tech"
import { PROJECTS } from "@/content/work"
import type { DAWFile, DAWFileExt, DAWFolder, DAWFolderId } from "./types"

/**
 * Calculate how many bars a sample occupies at a given BPM
 * Formula: bars = (durationSeconds × BPM) / 60 / beatsPerBar
 * Assumes 4/4 time signature (4 beats per bar)
 */
export function calculateBarsFromDuration(durationSeconds: number, bpm: number = 128): number {
  const beatsPerBar = 4
  const secondsPerBeat = 60 / bpm
  const secondsPerBar = secondsPerBeat * beatsPerBar
  return durationSeconds / secondsPerBar
}

/**
 * Round bars to nearest musical duration (e.g., 1, 2, 4, 8 bars)
 * Useful for display and snap-to-grid behavior
 */
export function roundToNearestBar(bars: number, granularity: number = 1): number {
  return Math.round(bars / granularity) * granularity
}

const EXPERIENCE_STYLE: Record<Lane, { ext: DAWFileExt; color: string; glyph: string }> = {
  work: { ext: "mp3", color: "bg-amber-500", glyph: "W" },
  education: { ext: "mid", color: "bg-sky-500", glyph: "E" },
  internship: { ext: "wav", color: "bg-emerald-500", glyph: "I" },
  side: { ext: "flac", color: "bg-rose-500", glyph: "S" },
}

const ABOUT_STYLE: Record<string, { ext: DAWFileExt; color: string; glyph: string }> = {
  bio: { ext: "mp3", color: "bg-violet-500", glyph: "B" },
  facts: { ext: "mid", color: "bg-amber-500", glyph: "F" },
  currently: { ext: "wav", color: "bg-emerald-500", glyph: "C" },
  whoami: { ext: "flac", color: "bg-sky-500", glyph: "W" },
}

const PROJECT_STYLE = { ext: "wav" as const, color: "bg-amber-500", glyph: "P" }

const SKILL_STYLE: Record<string, { ext: DAWFileExt; color: string; glyph: string }> = {
  frontend: { ext: "flac", color: "bg-emerald-500", glyph: "F" },
  backend: { ext: "mp3", color: "bg-sky-500", glyph: "B" },
  infra: { ext: "mid", color: "bg-amber-500", glyph: "I" },
  tooling: { ext: "wav", color: "bg-rose-500", glyph: "T" },
}

const CONTACT_STYLE = { ext: "ogg" as const, color: "bg-rose-500", glyph: "C" }
const CV_STYLE = { ext: "txt" as const, color: "bg-zinc-400", glyph: "V" }

function makeFile(
  folderId: DAWFolderId,
  itemId: string,
  name: string,
  style: { ext: DAWFileExt; color: string; glyph: string },
  durationBars?: number
): DAWFile {
  return {
    id: `${folderId}:${itemId}`,
    folderId,
    itemId,
    name,
    ext: style.ext,
    color: style.color,
    glyph: style.glyph,
    durationBars,
  }
}

const ABOUT_FILES: DAWFile[] = [
  makeFile("about", "bio", "bio", ABOUT_STYLE.bio!),
  makeFile("about", "facts", "facts", ABOUT_STYLE.facts!),
  makeFile("about", "currently", "currently", ABOUT_STYLE.currently!),
  makeFile("about", "whoami", "whoami", ABOUT_STYLE.whoami!),
]

const EXPERIENCE_FILES: DAWFile[] = ENTRIES.map((entry) =>
  makeFile("experience", entry.id, entry.label, EXPERIENCE_STYLE[entry.lane])
)

const PROJECT_FILES: DAWFile[] = PROJECTS.map((project) =>
  makeFile("projects", project.id, project.title, { ...PROJECT_STYLE, glyph: project.glyph })
)

const SKILL_FILES: DAWFile[] = TECH_GROUPS.map((group) => {
  const style = SKILL_STYLE[group.id] ?? SKILL_STYLE.frontend!
  const name = group.title.en
  return makeFile("skills", group.id, name, style)
})

const CONTACT_FILES: DAWFile[] = [
  makeFile("contact", "contact", "contact", CONTACT_STYLE),
]

const CV_FILES: DAWFile[] = [
  makeFile("cv", "cv_en", "cv_en", CV_STYLE),
]

export const DAW_FOLDERS: DAWFolder[] = [
  { id: "about", name: "About", files: ABOUT_FILES },
  { id: "experience", name: "Experience", files: EXPERIENCE_FILES },
  { id: "projects", name: "Projects", files: PROJECT_FILES },
  { id: "skills", name: "Skills", files: SKILL_FILES },
  { id: "contact", name: "Contact", files: CONTACT_FILES },
  { id: "cv", name: "CV", files: CV_FILES },
]

export const DAW_FILES_BY_ID = DAW_FOLDERS.flatMap((folder) => folder.files).reduce(
  (acc, file) => {
    acc[file.id] = file
    return acc
  },
  {} as Record<string, DAWFile>
)

export const DAW_FOLDER_BY_ID = DAW_FOLDERS.reduce(
  (acc, folder) => {
    acc[folder.id] = folder
    return acc
  },
  {} as Record<DAWFolderId, DAWFolder>
)

export const ABOUT_KEYS = {
  bio: BIO,
  facts: FACTS,
  currently: CURRENTLY,
  whoami: WHOAMI,
}
