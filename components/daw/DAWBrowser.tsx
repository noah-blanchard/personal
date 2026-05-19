"use client"

import { useDraggable } from "@dnd-kit/core"
import { CSS } from "@dnd-kit/utilities"
import { useDAW } from "./DAWProvider"
import { useDAWAudio } from "./audio/useDAWAudio"
import { DAW_FILES } from "./files"
import type { DAWFile } from "./types"

export function DAWBrowser() {
  const { locale } = useDAW()
  const folderLabel = locale === "fr" ? "Noah Blanchard" : "Noah Blanchard"

  return (
    <div className="flex h-full flex-col overflow-hidden border-r border-stone-300 dark:border-zinc-800 bg-stone-50 dark:bg-zinc-900">
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-stone-300 dark:border-zinc-800 px-3 py-2">
        <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400 dark:text-zinc-500">
          Browser
        </span>
      </div>

      {/* Tree */}
      <div className="flex-1 overflow-y-auto p-2 text-xs">
        <FolderRow label={folderLabel}>
          {DAW_FILES.map((file) => (
            <FileRow key={file.id} file={file} />
          ))}
        </FolderRow>
      </div>

      {/* Footer hint */}
      <div className="border-t border-stone-200 dark:border-zinc-800 px-3 py-1.5">
        <p className="text-[9px] text-stone-400 dark:text-zinc-600">
          drag to playlist · double-click to open
        </p>
      </div>
    </div>
  )
}

function FolderRow({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div>
      <div className="flex items-center gap-1.5 rounded px-2 py-1 text-stone-500 dark:text-zinc-400">
        <span className="text-[10px] text-amber-500 dark:text-amber-400">▾</span>
        <span className="text-[11px]">{label}/</span>
      </div>
      <div className="ml-3 border-l border-stone-300 dark:border-zinc-800 pl-2">
        {children}
      </div>
    </div>
  )
}

function FileRow({ file }: { file: DAWFile }) {
  const { addToPlaylist } = useDAW()
  const audio = useDAWAudio()

  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `browser-${file.id}`,
    data: { file },
  })

  const style = transform
    ? { transform: CSS.Translate.toString(transform), zIndex: 50, opacity: 0.85 }
    : undefined

  function handleDoubleClick() {
    audio.playOpen()
    addToPlaylist(file)
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      onDoubleClick={handleDoubleClick}
      className={[
        "group flex cursor-grab items-center gap-2 rounded px-2 py-1.5 transition-colors select-none",
        "hover:bg-stone-200 dark:hover:bg-zinc-800",
        isDragging ? "opacity-50" : "",
      ].join(" ")}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${file.color} shrink-0`} />
      <span className="text-stone-600 dark:text-zinc-300 text-[11px] tabular-nums">
        {file.name}
      </span>
      <span className="text-stone-400 dark:text-zinc-600 text-[10px]">
        .{file.ext}
      </span>
    </div>
  )
}
