"use client"

import { useState } from "react"
import { useSkin } from "./SkinContext"
import type { Step } from "./types"

type StepButtonProps = {
  step: Step
  isPlaying: boolean
  color: string
  onToggle: () => void
  onVelocityChange: (v: number) => void
}

function hexToRgb(hex: string) {
  return {
    r: parseInt(hex.slice(1, 3), 16),
    g: parseInt(hex.slice(3, 5), 16),
    b: parseInt(hex.slice(5, 7), 16),
  }
}

export function StepButton({ step, isPlaying, color, onToggle, onVelocityChange }: StepButtonProps) {
  const skin = useSkin()
  const [showVelocity, setShowVelocity] = useState(false)
  const [pressed, setPressed] = useState(false)

  const { r, g, b } = hexToRgb(color)
  const velFactor = step.active ? 0.35 + (step.velocity / 127) * 0.65 : 0

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault()
    if (step.active) setShowVelocity((v) => !v)
  }

  const inactiveStyle: React.CSSProperties = {
    background: pressed
      ? skin.pad.bg.replace("145deg,", "145deg,").replace("0%", "0%") // slightly darker — just use same bg
      : skin.pad.bg,
    borderRadius: "5px",
    border: `1px solid ${skin.pad.borderMid}`,
    borderTopColor: pressed ? skin.pad.borderBottom : skin.pad.borderTop,
    borderLeftColor: skin.pad.borderLeft,
    borderBottomColor: skin.pad.borderBottom,
    borderRightColor: skin.pad.borderRight,
    boxShadow: pressed
      ? "inset 0 2px 4px rgba(0,0,0,0.7), inset 0 1px 2px rgba(0,0,0,0.5)"
      : [skin.pad.shadowOuter, skin.pad.shadowInner].join(", "),
    transform: pressed ? "translateY(3px)" : "translateY(0px)",
    transition: pressed
      ? "transform 30ms ease, box-shadow 30ms ease"
      : "transform 80ms ease, box-shadow 80ms ease, background 80ms ease",
  }

  const activeStyle: React.CSSProperties = {
    background: pressed
      ? `rgba(${r},${g},${b},${velFactor * 0.55})`
      : `linear-gradient(145deg, rgba(${r},${g},${b},${velFactor * 0.85}) 0%, rgba(${r},${g},${b},${velFactor * 0.7}) 50%, rgba(${r},${g},${b},${velFactor * 0.5}) 100%)`,
    borderRadius: "5px",
    border: `1px solid rgba(${r},${g},${b},0.5)`,
    borderTopColor: `rgba(${r},${g},${b},0.6)`,
    borderLeftColor: `rgba(${r},${g},${b},0.55)`,
    borderBottomColor: `rgba(${r},${g},${b},0.2)`,
    borderRightColor: `rgba(${r},${g},${b},0.25)`,
    boxShadow: pressed
      ? "inset 0 2px 4px rgba(0,0,0,0.5)"
      : isPlaying
      ? [
          `0 3px 0 rgba(0,0,0,0.7)`,
          `0 4px 8px rgba(0,0,0,0.4)`,
          `inset 0 1px 0 rgba(255,255,255,0.15)`,
          `inset 0 -1px 2px rgba(0,0,0,0.3)`,
          `0 0 10px 4px rgba(${r},${g},${b},0.7)`,
          `0 0 24px 10px rgba(${r},${g},${b},0.3)`,
        ].join(", ")
      : [
          `0 3px 0 rgba(0,0,0,0.7)`,
          `0 4px 8px rgba(0,0,0,0.4)`,
          `inset 0 1px 0 rgba(255,255,255,0.12)`,
          `inset 0 -1px 2px rgba(0,0,0,0.3)`,
          `0 0 7px 2px rgba(${r},${g},${b},0.45)`,
          `0 0 16px 6px rgba(${r},${g},${b},0.15)`,
        ].join(", "),
    transform: pressed ? "translateY(3px)" : "translateY(0px)",
    transition: pressed
      ? "transform 30ms ease, box-shadow 30ms ease"
      : "transform 80ms ease, box-shadow 80ms ease, background 80ms ease",
  }

  return (
    <div className="relative flex flex-col items-center gap-0.5">
      <button
        onClick={onToggle}
        onContextMenu={handleContextMenu}
        onMouseDown={() => setPressed(true)}
        onMouseUp={() => setPressed(false)}
        onMouseLeave={() => setPressed(false)}
        className="relative w-full aspect-square outline-none focus-visible:ring-1 focus-visible:ring-white/30"
        style={step.active ? activeStyle : inactiveStyle}
      >
        {step.active && (
          <span
            className="absolute bottom-[3px] left-1/2 -translate-x-1/2 rounded-full"
            style={{
              width: "40%", height: "2px",
              background: color,
              opacity: 0.4 + (step.velocity / 127) * 0.6,
              boxShadow: `0 0 4px 1px rgba(${r},${g},${b},0.6)`,
            }}
          />
        )}
      </button>

      {showVelocity && step.active && (
        <div
          className="absolute z-20 bottom-full mb-2 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 shadow-2xl"
          style={{
            background: skin.panel.bg,
            border: `1px solid ${skin.pad.borderMid}`,
            borderRadius: "6px",
            padding: "8px 6px",
            boxShadow: "0 8px 24px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.04)",
          }}
          onMouseLeave={() => setShowVelocity(false)}
        >
          <span className="text-[9px] font-mono tracking-widest" style={{ color: skin.silkscreen }}>VEL</span>
          <input
            type="range" min={1} max={127} value={step.velocity}
            onChange={(e) => onVelocityChange(Number(e.target.value))}
            className="h-16 cursor-ns-resize"
            style={{ writingMode: "vertical-lr", direction: "rtl", accentColor: color, width: "14px" }}
          />
          <span className="text-[10px] font-mono tabular-nums" style={{ color }}>{step.velocity}</span>
        </div>
      )}
    </div>
  )
}
