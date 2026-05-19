"use client"

import { useDraggable } from "@dnd-kit/core"
import { CSS } from "@dnd-kit/utilities"
import { useDAW } from "./DAWProvider"
import { useDAWAudio } from "./audio/useDAWAudio"
import { DAW_FOLDERS } from "./files"
import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import type { DAWFile, DAWFolder, DAWFolderId } from "./types"

export function DAWBrowser() {
  const { locale } = useDAW()
  const [expandedFolder, setExpandedFolder] = useState<DAWFolderId | null>(null)
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
          {DAW_FOLDERS.map((folder) => (
            <SubFolderRow
              key={folder.id}
              folder={folder}
              isExpanded={expandedFolder === folder.id}
              onToggle={() => setExpandedFolder((prev) => (prev === folder.id ? null : folder.id))}
            />
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

function SubFolderRow({
  folder,
  isExpanded,
  onToggle,
}: {
  folder: DAWFolder
  isExpanded: boolean
  onToggle: () => void
}) {
  return (
    <div className="py-0.5">
      <button
        onClick={onToggle}
        className="flex w-full items-center gap-1.5 rounded px-2 py-1 text-stone-500 dark:text-zinc-400 hover:bg-stone-200 dark:hover:bg-zinc-800 transition-colors"
      >
        <motion.span
          className="text-[10px] text-amber-500 dark:text-amber-400"
          animate={{ rotate: isExpanded ? 0 : -90 }}
          transition={{ duration: 0.2 }}
        >
          ▾
        </motion.span>
        <span className="text-[11px] uppercase tracking-wider">{folder.name}</span>
        <span className="ml-auto text-[9px] text-stone-400 dark:text-zinc-600">
          {folder.files.length}
        </span>
      </button>
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="ml-3 border-l border-stone-300 dark:border-zinc-800 pl-2">
              {folder.files.map((file) => (
                <FileRow key={file.id} file={file} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function FileRow({ file }: { file: DAWFile }) {
  const { channels, addClip, openFileDetail } = useDAW()
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
    if (!channels[0]) return
    addClip(channels[0].id, file, 1)
  }

  function handleClick() {
    audio.playClick()
    openFileDetail(file.id)
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      onDoubleClick={handleDoubleClick}
      onClick={handleClick}
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
