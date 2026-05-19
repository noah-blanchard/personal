"use client"

import { useSkin } from "../SkinContext"
import { PushButton } from "./PushButton"

type TransportProps = {
  isPlaying: boolean
  onPlay: () => void
  onStop: () => void
  onReset: () => void
}

export function Transport({ isPlaying, onPlay, onStop, onReset }: TransportProps) {
  const skin = useSkin()

  return (
    <div className="flex items-center gap-2.5">
      <div className="flex flex-col gap-1 items-start">
        <span className="text-[10px] font-mono tracking-[0.22em] uppercase pl-0.5" style={{ color: skin.silkscreen }}>
          Transport
        </span>
        <div className="flex items-center gap-2">
          <PushButton label="▶" sublabel="PLAY" active={isPlaying} activeColor={skin.accent} onClick={isPlaying ? onStop : onPlay} />
          <PushButton label="■" sublabel="STOP" active={false} activeColor="#ef4444" onClick={onStop} />
          <PushButton label="↺" sublabel="RESET" active={false} activeColor="#f59e0b" onClick={onReset} />
        </div>
      </div>
    </div>
  )
}
