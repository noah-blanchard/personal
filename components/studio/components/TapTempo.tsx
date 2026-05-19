"use client"

import { useCallback, useRef, useState } from "react"
import { useSkin } from "../SkinContext"

type TapTempoProps = {
  onBpmChange: (bpm: number) => void
}

export function TapTempo({ onBpmChange }: TapTempoProps) {
  const skin = useSkin()
  const taps = useRef<number[]>([])
  const [pressed, setPressed] = useState(false)
  const [flash, setFlash] = useState(false)

  const handleTap = useCallback(() => {
    const now = performance.now()
    taps.current.push(now)
    if (taps.current.length > 8) taps.current = taps.current.slice(-8)
    if (taps.current.length < 2) return
    const last = taps.current[taps.current.length - 2] ?? 0
    if (now - last > 3000) { taps.current = [now]; return }
    const intervals: number[] = []
    for (let i = 1; i < taps.current.length; i++) {
      intervals.push((taps.current[i] ?? 0) - (taps.current[i - 1] ?? 0))
    }
    const avg = intervals.reduce((a, b) => a + b, 0) / intervals.length
    const bpm = Math.round(60000 / avg)
    onBpmChange(Math.min(200, Math.max(60, bpm)))
    setFlash(true)
    setTimeout(() => setFlash(false), 80)
  }, [onBpmChange])

  return (
    <div className="flex flex-col items-center gap-1">
      <span className="text-[10px] font-mono tracking-[0.22em] uppercase" style={{ color: skin.silkscreen }}>Tap</span>
      <button
        onClick={handleTap}
        onMouseDown={() => setPressed(true)}
        onMouseUp={() => setPressed(false)}
        onMouseLeave={() => setPressed(false)}
        className="relative outline-none focus-visible:ring-1 focus-visible:ring-white/20"
        style={{
          width: "52px",
          height: pressed ? "50px" : "52px",
          marginBottom: pressed ? "2px" : "0",
          borderRadius: "50%",
          background: flash ? skin.btn.bg : pressed ? skin.panel.bg : skin.btn.bg,
          border: `1px solid ${skin.btn.borderMid}`,
          borderTopColor: pressed ? skin.btn.borderBottom : skin.btn.borderTop,
          borderBottomColor: skin.btn.borderBottom,
          boxShadow: pressed
            ? "inset 0 3px 6px rgba(0,0,0,0.7), inset 0 1px 3px rgba(0,0,0,0.5)"
            : [skin.btn.shadowOuter, skin.btn.shadowInner].join(", "),
          transition: pressed
            ? "height 30ms, margin-bottom 30ms, box-shadow 30ms"
            : "height 80ms, margin-bottom 80ms, box-shadow 80ms",
        }}
      >
        <div
          className="absolute rounded-full pointer-events-none"
          style={{ inset: "6px", border: `1px solid rgba(128,128,128,0.08)`, boxShadow: "inset 0 1px 2px rgba(0,0,0,0.3)" }}
        />
        <div
          className="absolute rounded-full pointer-events-none"
          style={{ inset: "13px", border: "1px solid rgba(0,0,0,0.2)", background: "radial-gradient(circle at 40% 35%, rgba(255,255,255,0.04), transparent)" }}
        />
        <span className="relative z-10 text-[11px] font-mono tracking-[0.15em]" style={{ color: flash ? skin.accent : skin.btn.color }}>
          TAP
        </span>
      </button>
      <span className="text-[10px] font-mono tracking-widest" style={{ color: skin.silkscreen }}>TEMPO</span>
    </div>
  )
}
