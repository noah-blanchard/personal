"use client"

import { useMONOBSkin } from "../MONOBSkinContext"
import { useKnob } from "../../shared/useKnob"

type MonoKnobProps = {
  label: string
  value: number
  min: number
  max: number
  unit?: string
  onChange: (v: number) => void
}

export function MonoKnob({ label, value, min, max, unit = "", onChange }: MonoKnobProps) {
  const skin = useMONOBSkin()
  const { onPointerDown, onPointerMove, onPointerUp, rotation, normalized } = useKnob({
    min,
    max,
    value,
    onChange,
    sensitivity: 180,
  })

  return (
    <div className="flex flex-col items-center gap-2 select-none">
      <span className="text-[10px] font-mono tracking-[0.22em] uppercase" style={{ color: skin.silk }}>
        {label}
      </span>
      <div
        className="relative cursor-ns-resize"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        style={{ width: 64, height: 64, touchAction: "none" }}
      >
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: skin.knob.body,
            border: `1px solid ${skin.knob.edge}`,
            boxShadow: "inset 0 2px 6px rgba(0,0,0,0.6), 0 3px 6px rgba(0,0,0,0.5)",
          }}
        />
        <div
          className="absolute inset-[10px] rounded-full"
          style={{
            background: skin.knob.cap,
            border: `1px solid ${skin.knob.edge}`,
            boxShadow: "inset 0 1px 3px rgba(0,0,0,0.55)",
          }}
        />
        <div className="absolute inset-0" style={{ transform: `rotate(${rotation}deg)` }}>
          <div
            className="absolute"
            style={{
              width: 3,
              height: 16,
              left: "50%",
              top: 6,
              transform: "translateX(-50%)",
              background: skin.knob.notch,
              borderRadius: 2,
              boxShadow: `0 0 6px ${skin.knob.glow}`,
            }}
          />
        </div>
        <div
          className="absolute inset-0 rounded-full"
          style={{
            border: `2px solid ${skin.knob.edge}`,
            opacity: 0.3 + normalized * 0.5,
          }}
        />
      </div>
      <span className="text-[13px] font-mono tabular-nums" style={{ color: skin.accent }}>
        {value}{unit}
      </span>
    </div>
  )
}
