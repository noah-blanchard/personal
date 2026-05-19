"use client"

import { useSkin } from "../SkinContext"

export function StatusLED({ active }: { active: boolean }) {
  const skin = useSkin()
  return (
    <div className="flex items-center gap-1.5">
      <div
        className="rounded-full"
        style={{
          width: 6, height: 6,
          background: active ? skin.led.on : skin.led.off,
          boxShadow: active ? skin.led.onGlow : "inset 0 1px 1px rgba(0,0,0,0.6)",
          border: "1px solid rgba(0,0,0,0.4)",
          transition: "all 300ms",
          animation: active ? "pulse-soft 2s ease-in-out infinite" : "none",
        }}
      />
      <span className="text-[8px] font-mono tracking-widest" style={{ color: active ? skin.led.textOn : skin.led.textOff }}>
        {active ? "ON" : "OFF"}
      </span>
    </div>
  )
}
