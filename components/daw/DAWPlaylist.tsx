"use client"

import { useDndMonitor, useDraggable, useDroppable } from "@dnd-kit/core"
import { CSS } from "@dnd-kit/utilities"
import { useRef } from "react"
import { useDAW } from "./DAWProvider"
import { useDAWAudio } from "./audio/useDAWAudio"
import type { DAWChannel, DAWClip } from "./types"

const BAR_WIDTH = 64
const TOTAL_BARS = 32
const CHANNEL_H = 48
const LABEL_W = 144
const CHANNEL_COLORS = ["bg-amber-500", "bg-emerald-500", "bg-sky-500", "bg-rose-500", "bg-lime-500", "bg-orange-500"]

function clampBar(startBar: number, lengthBars: number) {
  const maxStart = Math.max(1, TOTAL_BARS - lengthBars + 1)
  return Math.min(Math.max(1, startBar), maxStart)
}

export function DAWPlaylist() {
  const {
    channels,
    addClip,
    moveClip,
    addChannel,
    removeClip,
    setChannelVolume,
    toggleChannelMute,
    selectedClip,
    selectClip,
    playheadBar,
  } = useDAW()
  const audio = useDAWAudio()
  const scrollRef = useRef<HTMLDivElement | null>(null)

  useDndMonitor({
    onDragEnd(event) {
      if (!event.over?.id?.toString().startsWith("channel-")) return
      const channelId = event.over.data.current?.channelId as string | undefined
      if (!channelId) return
      const overRect = event.over.rect
      const translatedRect = event.active.rect?.current?.translated
      const dropX = translatedRect ? translatedRect.left - overRect.left : 0
      const activeData = event.active.data.current

      if (activeData?.file) {
        const startBar = clampBar(Math.floor(dropX / BAR_WIDTH) + 1, 4)
        addClip(channelId, activeData.file, startBar)
        audio.playDrop()
        return
      }

      if (activeData?.clipId && typeof activeData.lengthBars === "number") {
        const startBar = clampBar(Math.floor(dropX / BAR_WIDTH) + 1, activeData.lengthBars)
        moveClip(activeData.clipId, channelId, startBar)
      }
    },
  })

  const contentWidth = LABEL_W + TOTAL_BARS * BAR_WIDTH

  function handleAddChannel() {
    audio.playClick()
    addChannel()
  }

  return (
    <div className="flex h-full flex-col overflow-hidden bg-stone-100 dark:bg-zinc-950">
      <div className="flex-1 overflow-auto relative" ref={scrollRef}>
        <div className="relative" style={{ minWidth: contentWidth }}>
          <div className="sticky top-0 z-20 flex border-b border-stone-300 dark:border-zinc-800 bg-stone-100 dark:bg-zinc-950">
            <div
              className="shrink-0 sticky left-0 z-30 border-r border-stone-300 dark:border-zinc-800 bg-stone-100 dark:bg-zinc-950"
              style={{ width: LABEL_W, height: CHANNEL_H }}
            />
            <BarNumbers />
          </div>

          {channels.map((channel, index) => (
            <ChannelRow
              key={channel.id}
              channel={channel}
              index={index}
              selectedClip={selectedClip}
              onSelectClip={selectClip}
              onRemoveClip={removeClip}
              onSetVolume={setChannelVolume}
              onToggleMute={toggleChannelMute}
            />
          ))}

          <AddChannelRow onAdd={handleAddChannel} />

          <div
            className="absolute top-0 bottom-0 pointer-events-none z-40 w-px bg-amber-500"
            style={{ left: LABEL_W + (playheadBar - 1) * BAR_WIDTH }}
          />
        </div>
      </div>
    </div>
  )
}

function BarNumbers() {
  return (
    <div className="flex" style={{ height: CHANNEL_H }}>
      {Array.from({ length: TOTAL_BARS }).map((_, index) => (
        <div
          key={`bar-${index + 1}`}
          className="flex items-center justify-center text-[10px] text-stone-400 dark:text-zinc-600 border-l border-stone-200 dark:border-zinc-800"
          style={{ width: BAR_WIDTH }}
        >
          {index + 1}
        </div>
      ))}
    </div>
  )
}

function ChannelRow({
  channel,
  index,
  selectedClip,
  onSelectClip,
  onRemoveClip,
  onSetVolume,
  onToggleMute,
}: {
  channel: DAWChannel
  index: number
  selectedClip: DAWClip | null
  onSelectClip: (clip: DAWClip | null) => void
  onRemoveClip: (channelId: string, clipId: string) => void
  onSetVolume: (channelId: string, volume: number) => void
  onToggleMute: (channelId: string) => void
}) {
  const audio = useDAWAudio()
  const { setNodeRef, isOver } = useDroppable({
    id: `channel-${channel.id}`,
    data: { channelId: channel.id },
  })
  const accent = CHANNEL_COLORS[index % CHANNEL_COLORS.length]
  const selectedInChannel = selectedClip
    ? channel.clips.some((clip) => clip.id === selectedClip.id)
    : false

  function handleRemoveSelected() {
    if (!selectedClip || !selectedInChannel) return
    audio.playRemove()
    onRemoveClip(channel.id, selectedClip.id)
  }

  function handleMute() {
    audio.playClick()
    onToggleMute(channel.id)
  }

  return (
    <div className="flex border-b border-stone-200 dark:border-zinc-900" style={{ height: CHANNEL_H }}>
      <div
        className="sticky left-0 z-10 grid grid-cols-[auto_minmax(0,1fr)_auto_auto_auto] items-center gap-2 border-r border-stone-300 dark:border-zinc-800 bg-stone-100 dark:bg-zinc-950 px-3"
        style={{ width: LABEL_W }}
      >
        <div className={`h-2 w-2 rounded-full ${accent} shrink-0`} />
        <div className="min-w-0">
          <span className="block truncate text-[11px] text-stone-600 dark:text-zinc-300">
            {channel.label}
          </span>
        </div>
        <button
          onClick={handleMute}
          title={channel.muted ? "Unmute" : "Mute"}
          className={[
            "flex h-5 w-5 shrink-0 items-center justify-center rounded text-[10px] font-bold transition-colors",
            channel.muted
              ? "bg-amber-500 text-black"
              : "text-stone-400 dark:text-zinc-600 hover:text-stone-600 dark:hover:text-zinc-300",
          ].join(" ")}
        >
          M
        </button>
        <input
          type="range"
          min={0}
          max={100}
          value={channel.volume}
          onChange={(e) => onSetVolume(channel.id, Number(e.target.value))}
          className="w-12 h-1 accent-amber-400 cursor-pointer"
          title={`Volume: ${channel.volume}%`}
        />
        <button
          onClick={handleRemoveSelected}
          title={selectedInChannel ? "Remove selected clip" : "Select a clip to remove"}
          className={[
            "flex h-5 w-5 shrink-0 items-center justify-center rounded text-[12px] transition-all",
            selectedInChannel
              ? "text-stone-400 dark:text-zinc-600 hover:bg-stone-200 dark:hover:bg-zinc-800 hover:text-stone-600 dark:hover:text-zinc-300"
              : "text-stone-300 dark:text-zinc-800 cursor-default",
          ].join(" ")}
          disabled={!selectedInChannel}
        >
          ✕
        </button>
      </div>

      <div
        ref={setNodeRef}
        className={[
          "relative",
          isOver ? "bg-amber-500/5" : "",
        ].join(" ")}
        style={{ width: TOTAL_BARS * BAR_WIDTH }}
      >
        <div className="absolute inset-0 flex pointer-events-none">
          {Array.from({ length: TOTAL_BARS }).map((_, barIndex) => (
            <div
              key={`grid-${channel.id}-${barIndex}`}
              className="h-full border-l border-stone-200 dark:border-zinc-800"
              style={{ width: BAR_WIDTH }}
            />
          ))}
        </div>

        {channel.clips.map((clip) => (
          <ClipCard
            key={clip.id}
            clip={clip}
            isSelected={selectedClip?.id === clip.id}
            onSelect={() => {
              audio.playOpen()
              onSelectClip(clip)
            }}
          />
        ))}
      </div>
    </div>
  )
}

function ClipCard({
  clip,
  isSelected,
  onSelect,
}: {
  clip: DAWClip
  isSelected: boolean
  onSelect: () => void
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: clip.id,
    data: { clipId: clip.id, lengthBars: clip.lengthBars },
  })
  const style = {
    left: (clip.startBar - 1) * BAR_WIDTH,
    width: clip.lengthBars * BAR_WIDTH,
    top: 6,
    height: CHANNEL_H - 12,
    ...(transform ? { transform: CSS.Translate.toString(transform), zIndex: 30 } : null),
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      onClick={onSelect}
      className={[
        "absolute rounded border px-2 py-1 text-[10px] text-white/90 shadow-sm cursor-pointer select-none",
        clip.file.color,
        isSelected ? "ring-2 ring-amber-500/70" : "border-black/10",
        isDragging ? "opacity-70" : "",
      ].join(" ")}
    >
      <div className="truncate">
        {clip.file.name}
        <span className="text-white/70">.{clip.file.ext}</span>
      </div>
    </div>
  )
}

function AddChannelRow({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="flex border-b border-stone-200 dark:border-zinc-900" style={{ height: CHANNEL_H }}>
      <div
        className="sticky left-0 z-10 flex items-center border-r border-stone-300 dark:border-zinc-800 bg-stone-100 dark:bg-zinc-950 px-3"
        style={{ width: LABEL_W }}
      >
        <button
          onClick={onAdd}
          className="flex items-center gap-2 rounded border border-stone-300 dark:border-zinc-800 px-2 py-1 text-[10px] uppercase tracking-widest text-stone-500 dark:text-zinc-400 hover:border-amber-500/60 hover:text-amber-500"
        >
          + add channel
        </button>
      </div>
      <div
        className="border-l border-stone-200 dark:border-zinc-800"
        style={{ width: TOTAL_BARS * BAR_WIDTH }}
      />
    </div>
  )
}
