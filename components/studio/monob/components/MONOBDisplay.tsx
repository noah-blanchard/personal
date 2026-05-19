"use client"

import { useMONOBSkin } from "../MONOBSkinContext"
import type { MONOBPatch } from "../types"

type MONOBDisplayProps = {
  patch: MONOBPatch
  activeNote: string | null
}

export function MONOBDisplay({ patch, activeNote }: MONOBDisplayProps) {
  const skin = useMONOBSkin()

  return (
    <div
      className="rounded"
      style={{
        padding: "4px",
        background: skin.lcd.bezel,
        border: `1px solid ${skin.panel.border}`,
        boxShadow: "inset 0 2px 4px rgba(0,0,0,0.6)",
      }}
    >
      <div
        className="rounded-sm px-4 py-2 font-mono"
        style={{
          background: skin.lcd.screen,
          minHeight: "62px",
          color: skin.lcd.text,
          textShadow: skin.lcd.glow,
        }}
      >
        <div className="flex items-center justify-between">
          <span className="text-[10px] tracking-[0.2em]" style={{ color: skin.lcd.label }}>
            PATCH
          </span>
          <span className="text-[16px] tracking-[0.2em]">{patch.name}</span>
          <span className="text-[10px] tracking-[0.2em]" style={{ color: skin.lcd.label }}>
            NOTE
          </span>
          <span className="text-[16px] tracking-[0.2em]" style={{ minWidth: 42, textAlign: "right" }}>
            {activeNote ?? "--"}
          </span>
        </div>
        <div className="flex items-center gap-6 mt-2 text-[12px]">
          <div className="flex items-center gap-2">
            <span style={{ color: skin.lcd.label, letterSpacing: "0.18em" }}>OSC</span>
            <span className="uppercase" style={{ color: skin.lcd.text }}>{patch.oscType}</span>
          </div>
          <div className="flex items-center gap-2">
            <span style={{ color: skin.lcd.label, letterSpacing: "0.18em" }}>FLT</span>
            <span className="uppercase" style={{ color: skin.lcd.text }}>{patch.filterType}</span>
          </div>
          <div className="flex items-center gap-2">
            <span style={{ color: skin.lcd.label, letterSpacing: "0.18em" }}>CUT</span>
            <span style={{ color: skin.lcd.text }}>{Math.round(patch.filterCutoff)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
