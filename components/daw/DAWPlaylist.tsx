"use client"

import { useDroppable } from "@dnd-kit/core"
import { useDAW } from "./DAWProvider"
import { useDAWAudio } from "./audio/useDAWAudio"
import type { DAWLane } from "./types"

export function DAWPlaylist() {
  const { playlist } = useDAW()
  const { setNodeRef } = useDroppable({ id: "playlist-drop" })

  return (
    <div
      ref={setNodeRef}
      className="flex h-full flex-col overflow-hidden bg-stone-100 dark:bg-zinc-950"
    >
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-stone-300 dark:border-zinc-800 px-3 py-2 shrink-0">
        <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400 dark:text-zinc-500">
          Playlist
        </span>
        <span className="ml-auto text-[10px] text-stone-400 dark:text-zinc-700">
          {playlist.length} track{playlist.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Lanes */}
      <div className="flex-1 overflow-y-auto">
        {playlist.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="p-2 flex flex-col gap-1">
            {playlist.map((lane, idx) => (
              <LaneRow key={lane.instanceId} lane={lane} index={idx} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-2 text-center">
      <span className="text-2xl text-stone-300 dark:text-zinc-800">≋</span>
      <p className="text-[11px] text-stone-400 dark:text-zinc-600">
        drag files from the browser
      </p>
      <p className="text-[10px] text-stone-300 dark:text-zinc-700">
        or double-click to open
      </p>
    </div>
  )
}

function LaneRow({ lane, index }: { lane: DAWLane; index: number }) {
  const { removeFromPlaylist, setVolume, toggleMute, selectLane, selectedLane } = useDAW()
  const audio = useDAWAudio()
  const isSelected = selectedLane?.instanceId === lane.instanceId

  function handleClick() {
    audio.playOpen()
    selectLane(lane)
  }

  function handleRemove(e: React.MouseEvent) {
    e.stopPropagation()
    audio.playRemove()
    removeFromPlaylist(lane.instanceId)
  }

  function handleMute(e: React.MouseEvent) {
    e.stopPropagation()
    audio.playClick()
    toggleMute(lane.instanceId)
  }

  return (
    <div
      onClick={handleClick}
      className={[
        "group flex items-center gap-2 rounded border px-2 py-2 cursor-pointer transition-all select-none",
        isSelected
          ? "border-amber-500/50 bg-amber-500/5"
          : "border-stone-300 dark:border-zinc-800 hover:border-stone-400 dark:hover:border-zinc-700",
      ].join(" ")}
    >
      {/* Index */}
      <span className="w-4 text-center text-[10px] tabular-nums text-stone-400 dark:text-zinc-700 shrink-0">
        {String(index + 1).padStart(2, "0")}
      </span>

      {/* Color + glyph */}
      <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded text-[12px] ${lane.file.color} text-white`}>
        {lane.file.glyph}
      </div>

      {/* Name */}
      <div className="flex min-w-0 flex-1 flex-col">
        <span className="truncate text-[11px] text-stone-700 dark:text-zinc-200">
          {lane.file.name}
          <span className="text-stone-400 dark:text-zinc-600">.{lane.file.ext}</span>
        </span>
      </div>

      {/* Volume slider */}
      <input
        type="range"
        min={0}
        max={100}
        value={lane.volume}
        onClick={(e) => e.stopPropagation()}
        onChange={(e) => setVolume(lane.instanceId, Number(e.target.value))}
        className="w-16 h-1 accent-amber-400 cursor-pointer"
        title={`Volume: ${lane.volume}%`}
      />

      {/* Mute */}
      <button
        onClick={handleMute}
        title="Mute"
        className={[
          "flex h-5 w-5 shrink-0 items-center justify-center rounded text-[10px] font-bold transition-colors",
          lane.muted
            ? "bg-amber-500 text-black"
            : "text-stone-400 dark:text-zinc-600 hover:text-stone-600 dark:hover:text-zinc-300",
        ].join(" ")}
      >
        M
      </button>

      {/* Remove */}
      <button
        onClick={handleRemove}
        title="Remove"
        className="flex h-5 w-5 shrink-0 items-center justify-center rounded text-[12px] text-stone-400 dark:text-zinc-700 opacity-0 transition-all hover:bg-stone-200 dark:hover:bg-zinc-800 hover:text-stone-600 dark:hover:text-zinc-300 group-hover:opacity-100"
      >
        ✕
      </button>
    </div>
  )
}
