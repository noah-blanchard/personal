"use client"

import { useMONOBSkin } from "../MONOBSkinContext"
import type { OscType } from "../types"

const OSC_OPTIONS: { id: OscType; label: string }[] = [
  { id: "sine", label: "SINE" },
  { id: "square", label: "SQUARE" },
  { id: "sawtooth", label: "SAW" },
]

type OscSectionProps = {
  oscType: OscType
  onChange: (t: OscType) => void
}

export function OscSection({ oscType, onChange }: OscSectionProps) {
  const skin = useMONOBSkin()
  const wavePath = getWavePath(oscType)

  return (
    <div className="flex flex-col gap-2">
      <span className="text-[10px] font-mono tracking-[0.28em] uppercase" style={{ color: skin.silk }}>
        Oscillator
      </span>
      <div className="flex items-center gap-3 flex-wrap">
        {OSC_OPTIONS.map((opt) => {
          const active = oscType === opt.id
          return (
            <button
              key={opt.id}
              onClick={() => onChange(opt.id)}
              className="font-mono text-[12px] tracking-[0.18em] outline-none focus-visible:ring-1 focus-visible:ring-white/20"
              style={{
                padding: "8px 10px",
                borderRadius: "6px",
                border: `1px solid ${active ? skin.accent : skin.panel.border}`,
                background: active ? skin.accent + "22" : "rgba(0,0,0,0.2)",
                color: active ? skin.accent : skin.silk,
                boxShadow: active ? `0 0 8px ${skin.accent}44` : "inset 0 2px 4px rgba(0,0,0,0.5)",
                transition: "all 120ms",
              }}
            >
              {opt.label}
            </button>
          )
        })}
        <div
          className="flex items-center justify-center"
          style={{
            width: 120,
            height: 42,
            borderRadius: 8,
            border: `1px solid ${skin.panel.border}`,
            background: "rgba(0,0,0,0.18)",
            boxShadow: "inset 0 2px 4px rgba(0,0,0,0.55)",
          }}
        >
          <svg width="108" height="30" viewBox="0 0 120 40" aria-hidden="true">
            <path
              d={wavePath}
              fill="none"
              stroke={skin.accent}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path d="M0 20 L120 20" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
          </svg>
        </div>
      </div>
    </div>
  )
}

function getWavePath(type: OscType) {
  switch (type) {
    case "sine":
      return "M0 20 C 10 0, 30 0, 40 20 S 70 40, 80 20 S 110 0, 120 20"
    case "square":
      return "M0 28 L0 12 L40 12 L40 28 L80 28 L80 12 L120 12 L120 28"
    case "sawtooth":
      return "M0 28 L40 12 L40 28 L80 12 L80 28 L120 12"
    default:
      return "M0 20 L120 20"
  }
}
