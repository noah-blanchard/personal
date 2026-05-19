"use client"

import { useDAW } from "./DAWProvider"
import { useDAWAudio } from "./audio/useDAWAudio"
import { useToneEngine } from "./audio/useToneEngine"

export function DAWToolbar() {
  const { panels, togglePanel, isPlaying, togglePlay, bpm, setDetailOpen, detailOpen } = useDAW()
  const audio = useDAWAudio()
  const toneEngine = useToneEngine()

  function handleTogglePanel(panel: "browser" | "playlist") {
    audio.playClick()
    togglePanel(panel)
  }

  async function handlePlay() {
    audio.playClick()
    if (toneEngine.isReady) {
      await toneEngine.togglePlay()
    } else {
      togglePlay()
    }
  }

  return (
    <div className="flex h-10 shrink-0 items-center gap-0 border-b border-stone-300 dark:border-zinc-800 bg-stone-200 dark:bg-zinc-900 px-3 font-mono text-xs">
      {/* Transport */}
      <div className="flex items-center gap-1 pr-3 border-r border-stone-300 dark:border-zinc-700">
        <TransportBtn onClick={handlePlay} active={isPlaying} title={isPlaying ? "Pause" : "Play"}>
          {isPlaying ? "⏸" : "▶"}
        </TransportBtn>
        <TransportBtn 
          onClick={async () => { 
            audio.playClick()
            if (toneEngine.isReady) {
              toneEngine.stop()
            } else {
              togglePlay()
            }
          }} 
          title="Stop"
        >
          ⏹
        </TransportBtn>
      </div>

      {/* BPM */}
      <div className="flex items-center gap-1.5 px-3 border-r border-stone-300 dark:border-zinc-700">
        <span className="text-stone-500 dark:text-zinc-500">♩</span>
        <span className="tabular-nums text-amber-500 dark:text-amber-400">{bpm}</span>
        <span className="text-stone-500 dark:text-zinc-500">BPM</span>
      </div>

      {/* Title */}
      <div className="flex-1 px-3 text-center">
        <span className="tracking-widest text-stone-600 dark:text-zinc-300 uppercase text-[10px]">
          NOAH<span className="text-amber-500 dark:text-amber-400">.</span>DAW
        </span>
        <span className="ml-2 text-stone-400 dark:text-zinc-600 text-[9px]">v1.0</span>
      </div>

      {/* Panel toggles */}
      <div className="flex items-center gap-1 pl-3 border-l border-stone-300 dark:border-zinc-700">
        <PanelToggle active={panels.browser} onClick={() => handleTogglePanel("browser")} title="Toggle Browser">
          B
        </PanelToggle>
        <PanelToggle active={panels.playlist} onClick={() => handleTogglePanel("playlist")} title="Toggle Playlist">
          P
        </PanelToggle>
        <PanelToggle active={detailOpen} onClick={() => { audio.playClick(); setDetailOpen(!detailOpen) }} title="Toggle Detail">
          D
        </PanelToggle>
      </div>
    </div>
  )
}

function TransportBtn({
  children,
  onClick,
  active,
  title,
}: {
  children: React.ReactNode
  onClick: () => void
  active?: boolean
  title?: string
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={[
        "flex h-6 w-6 items-center justify-center rounded text-[11px] transition-colors",
        active
          ? "bg-amber-500 text-black"
          : "text-stone-500 dark:text-zinc-400 hover:bg-stone-300 dark:hover:bg-zinc-700 hover:text-stone-800 dark:hover:text-zinc-100",
      ].join(" ")}
    >
      {children}
    </button>
  )
}

function PanelToggle({
  children,
  onClick,
  active,
  title,
}: {
  children: React.ReactNode
  onClick: () => void
  active: boolean
  title?: string
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={[
        "flex h-6 w-6 items-center justify-center rounded border text-[10px] font-bold tracking-widest transition-all",
        active
          ? "border-amber-500 bg-amber-500/10 text-amber-500 dark:text-amber-400"
          : "border-stone-300 dark:border-zinc-700 text-stone-400 dark:text-zinc-600 hover:border-stone-500 dark:hover:border-zinc-500 hover:text-stone-600 dark:hover:text-zinc-400",
      ].join(" ")}
    >
      {children}
    </button>
  )
}
