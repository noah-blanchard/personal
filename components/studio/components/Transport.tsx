"use client"

import { useSkin } from "../SkinContext"
import { PushButton } from "./PushButton"

type TransportProps = {
  isPlaying: boolean
  stepCount: 16 | 32
  onPlay: () => void
  onStop: () => void
  onReset: () => void
  onSetStepCount: (n: 16 | 32) => void
}

export function Transport({ isPlaying, stepCount, onPlay, onStop, onReset, onSetStepCount }: TransportProps) {
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

      <div className="self-stretch w-px mx-1" style={{ background: `linear-gradient(180deg, transparent, ${skin.groove.light} 30%, ${skin.groove.light} 70%, transparent)` }} />

      <div className="flex flex-col gap-1 items-start">
        <span className="text-[10px] font-mono tracking-[0.22em] uppercase pl-0.5" style={{ color: skin.silkscreen }}>
          Steps
        </span>
        <div
          className="flex rounded overflow-hidden"
          style={{
            border: `1px solid ${skin.btn.borderMid}`,
            borderBottomColor: skin.btn.borderBottom,
            boxShadow: [skin.btn.shadowOuter].join(", "),
          }}
        >
          {([16, 32] as const).map((n) => {
            const active = stepCount === n
            return (
              <button
                key={n}
                onClick={() => onSetStepCount(n)}
                className="px-3 py-1.5 font-mono text-[13px] tracking-widest outline-none focus-visible:ring-1 focus-visible:ring-white/20"
                style={{
                  background: active ? skin.panel.bg : skin.btn.bg,
                  color: active ? skin.accent : skin.btn.color,
                  boxShadow: active ? `inset 0 2px 3px rgba(0,0,0,0.4), inset 0 0 0 1px ${skin.accent}20` : "none",
                  textShadow: active ? `0 0 6px ${skin.accent}` : "none",
                  transition: "all 100ms",
                }}
              >
                {n}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
