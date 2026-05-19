"use client"

import { useState } from "react"
import { StepButton } from "./StepButton"
import type { Track } from "../types"

type TrackRowProps = {
  track: Track
  currentStep: number
  onToggleStep: (stepIndex: number) => void
  onVelocityChange: (stepIndex: number, v: number) => void
  onToggleMute: () => void
}

function hexToRgb(hex: string) {
  return {
    r: parseInt(hex.slice(1, 3), 16),
    g: parseInt(hex.slice(3, 5), 16),
    b: parseInt(hex.slice(5, 7), 16),
  }
}

export function TrackRow({ track, currentStep, onToggleStep, onVelocityChange, onToggleMute }: TrackRowProps) {
  const [mutePressed, setMutePressed] = useState(false)
  const { r, g, b } = hexToRgb(track.color)

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1.5 w-[60px] shrink-0">
        <div
          className="w-[5px] h-[5px] rounded-full shrink-0"
          style={{
            background: track.muted ? "#1a1a18" : `rgba(${r},${g},${b},1)`,
            boxShadow: track.muted
              ? "inset 0 1px 1px rgba(0,0,0,0.6)"
              : `0 0 4px 1px rgba(${r},${g},${b},0.8), 0 0 8px 2px rgba(${r},${g},${b},0.3)`,
            border: "1px solid rgba(0,0,0,0.4)",
            transition: "all 150ms",
          }}
        />

        <button
          onClick={onToggleMute}
          onMouseDown={() => setMutePressed(true)}
          onMouseUp={() => setMutePressed(false)}
          onMouseLeave={() => setMutePressed(false)}
          title={track.muted ? "Unmute" : "Mute"}
          className="outline-none focus-visible:ring-1 focus-visible:ring-white/20"
          style={{
            padding: "2px 4px",
            borderRadius: "3px",
            background: mutePressed ? "#0e0e0c" : track.muted ? "#111110" : "transparent",
            border: `1px solid ${track.muted ? "#1e1e1c" : "transparent"}`,
            boxShadow: mutePressed
              ? "inset 0 1px 2px rgba(0,0,0,0.8)"
              : track.muted
              ? "inset 0 1px 2px rgba(0,0,0,0.5)"
              : "none",
            transition: "all 80ms",
          }}
        >
          <span
            className="text-[9px] font-mono tracking-[0.12em] leading-none"
            style={{
              color: track.muted ? "rgba(255,255,255,0.2)" : `rgba(${r},${g},${b},0.85)`,
              textShadow: track.muted ? "none" : `0 0 6px rgba(${r},${g},${b},0.5)`,
              transition: "all 150ms",
            }}
          >
            {track.name}
          </span>
        </button>
      </div>

      <div
        className="grid gap-[3px] flex-1"
        style={{ gridTemplateColumns: `repeat(${track.steps.length}, minmax(0, 1fr))` }}
      >
        {track.steps.map((step, i) => (
          <StepButton
            key={i}
            step={step}
            isPlaying={currentStep === i}
            color={track.color}
            onToggle={() => onToggleStep(i)}
            onVelocityChange={(v) => onVelocityChange(i, v)}
          />
        ))}
      </div>
    </div>
  )
}
