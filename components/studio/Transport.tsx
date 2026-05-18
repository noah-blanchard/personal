"use client"

import { useState } from "react"
import { useSkin } from "./SkinContext"

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
        <span className="text-[8px] font-mono tracking-[0.22em] uppercase pl-0.5" style={{ color: skin.silkscreen }}>
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
        <span className="text-[8px] font-mono tracking-[0.22em] uppercase pl-0.5" style={{ color: skin.silkscreen }}>
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
                className="px-3 py-1.5 font-mono text-[11px] tracking-widest outline-none focus-visible:ring-1 focus-visible:ring-white/20"
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

type PushButtonProps = {
  label: string
  sublabel: string
  active: boolean
  activeColor: string
  onClick: () => void
}

function PushButton({ label, sublabel, active, activeColor, onClick }: PushButtonProps) {
  const skin = useSkin()
  const [pressed, setPressed] = useState(false)
  const { r, g, b } = hexToRgb(activeColor)

  return (
    <div className="flex flex-col items-center gap-1">
      {/* LED above button */}
      <div
        className="w-1.5 h-1.5 rounded-full"
        style={{
          background: active ? activeColor : skin.led.off,
          boxShadow: active ? `0 0 4px 1px ${activeColor}, 0 0 8px 2px rgba(${r},${g},${b},0.4)` : "none",
          transition: "all 200ms",
        }}
      />

      <button
        onClick={onClick}
        onMouseDown={() => setPressed(true)}
        onMouseUp={() => setPressed(false)}
        onMouseLeave={() => setPressed(false)}
        title={sublabel}
        className="w-11 font-mono text-sm outline-none focus-visible:ring-1 focus-visible:ring-white/20"
        style={{
          height: pressed ? "34px" : "36px",
          marginBottom: pressed ? "2px" : "0px",
          borderRadius: "4px",
          background: active
            ? `linear-gradient(180deg, rgba(${r},${g},${b},0.22) 0%, rgba(${r},${g},${b},0.12) 100%)`
            : pressed
            ? skin.panel.bg
            : skin.btn.bg,
          border: `1px solid ${active ? `rgba(${r},${g},${b},0.4)` : skin.btn.borderMid}`,
          borderTopColor: active ? `rgba(${r},${g},${b},0.5)` : pressed ? skin.btn.borderBottom : skin.btn.borderTop,
          borderBottomColor: active ? `rgba(${r},${g},${b},0.25)` : skin.btn.borderBottom,
          color: active ? activeColor : skin.btn.color,
          boxShadow: pressed
            ? "inset 0 2px 4px rgba(0,0,0,0.6)"
            : active
            ? [skin.btn.shadowOuter, `0 0 8px 2px rgba(${r},${g},${b},0.2)`, skin.btn.shadowInner].join(", ")
            : [skin.btn.shadowOuter, skin.btn.shadowInner].join(", "),
          textShadow: active ? `0 0 8px ${activeColor}` : "none",
          transition: pressed
            ? "height 30ms, margin-bottom 30ms, box-shadow 30ms"
            : "height 80ms, margin-bottom 80ms, box-shadow 80ms",
        }}
      >
        {label}
      </button>
      <span className="text-[8px] font-mono tracking-widest" style={{ color: skin.silkscreen }}>{sublabel}</span>
    </div>
  )
}

function hexToRgb(hex: string) {
  return {
    r: parseInt(hex.slice(1, 3), 16),
    g: parseInt(hex.slice(3, 5), 16),
    b: parseInt(hex.slice(5, 7), 16),
  }
}
