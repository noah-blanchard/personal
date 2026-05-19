"use client"

import { useMONOBSkin } from "../MONOBSkinContext"
import { MonoKnob } from "./MonoKnob"
import type { FilterRolloff, FilterType } from "../types"

const FILTER_TYPES: { id: FilterType; label: string }[] = [
  { id: "lowpass", label: "LP" },
  { id: "bandpass", label: "BP" },
  { id: "highpass", label: "HP" },
]

const ROLLOFFS: { id: FilterRolloff; label: string }[] = [
  { id: -12, label: "12dB" },
  { id: -24, label: "24dB" },
]

type FilterSectionProps = {
  filterType: FilterType
  filterRolloff: FilterRolloff
  cutoff: number
  resonance: number
  onTypeChange: (t: FilterType) => void
  onRolloffChange: (r: FilterRolloff) => void
  onCutoffChange: (v: number) => void
  onResonanceChange: (v: number) => void
}

export function FilterSection({
  filterType,
  filterRolloff,
  cutoff,
  resonance,
  onTypeChange,
  onRolloffChange,
  onCutoffChange,
  onResonanceChange,
}: FilterSectionProps) {
  const skin = useMONOBSkin()

  return (
    <div className="flex flex-col gap-3">
      <span className="text-[10px] font-mono tracking-[0.28em] uppercase" style={{ color: skin.silk }}>
        Filter
      </span>
      <div className="flex flex-wrap items-center gap-2">
        {FILTER_TYPES.map((opt) => {
          const active = filterType === opt.id
          return (
            <button
              key={opt.id}
              onClick={() => onTypeChange(opt.id)}
              className="font-mono text-[11px] tracking-[0.2em] outline-none focus-visible:ring-1 focus-visible:ring-white/20"
              style={{
                padding: "6px 10px",
                borderRadius: "6px",
                border: `1px solid ${active ? skin.accent : skin.panel.border}`,
                background: active ? skin.accent + "22" : "rgba(0,0,0,0.25)",
                color: active ? skin.accent : skin.silk,
                boxShadow: active ? `0 0 6px ${skin.accent}44` : "inset 0 2px 4px rgba(0,0,0,0.55)",
                transition: "all 120ms",
              }}
            >
              {opt.label}
            </button>
          )
        })}
        <div className="w-px h-5" style={{ background: skin.panel.border }} />
        {ROLLOFFS.map((opt) => {
          const active = filterRolloff === opt.id
          return (
            <button
              key={opt.id}
              onClick={() => onRolloffChange(opt.id)}
              className="font-mono text-[11px] tracking-[0.18em] outline-none focus-visible:ring-1 focus-visible:ring-white/20"
              style={{
                padding: "6px 10px",
                borderRadius: "6px",
                border: `1px solid ${active ? skin.accent : skin.panel.border}`,
                background: active ? skin.accent + "22" : "rgba(0,0,0,0.25)",
                color: active ? skin.accent : skin.silk,
                boxShadow: active ? `0 0 6px ${skin.accent}44` : "inset 0 2px 4px rgba(0,0,0,0.55)",
                transition: "all 120ms",
              }}
            >
              {opt.label}
            </button>
          )
        })}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <MonoKnob
          label="CUTOFF"
          value={Math.round(cutoff)}
          min={40}
          max={12000}
          unit="Hz"
          onChange={onCutoffChange}
        />
        <MonoKnob
          label="RES"
          value={Math.round(resonance * 10)}
          min={0}
          max={50}
          onChange={(v) => onResonanceChange(v / 10)}
        />
      </div>
    </div>
  )
}
