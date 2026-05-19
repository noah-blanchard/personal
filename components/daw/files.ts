import type { DAWFile } from "./types"

export const DAW_FILES: DAWFile[] = [
  { id: "about",      name: "about",      ext: "mp3",  color: "bg-violet-500", glyph: "♪" },
  { id: "experience", name: "experience", ext: "mid",  color: "bg-blue-500",   glyph: "♫" },
  { id: "projects",   name: "projects",   ext: "wav",  color: "bg-amber-500",  glyph: "≋" },
  { id: "skills",     name: "skills",     ext: "flac", color: "bg-emerald-500",glyph: "⊕" },
  { id: "contact",    name: "contact",    ext: "ogg",  color: "bg-rose-500",   glyph: "◉" },
  { id: "cv",         name: "cv",         ext: "txt",  color: "bg-zinc-400",   glyph: "≡" },
]
