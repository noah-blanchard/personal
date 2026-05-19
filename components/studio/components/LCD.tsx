"use client"

import { useSkin } from "../SkinContext"
import type { Pattern } from "../types"

type LCDProps = {
  pattern: Pattern
  isPlaying: boolean
  currentStep: number
}

export function LCD({ pattern, isPlaying, currentStep }: LCDProps) {
  const skin = useSkin()
  const lcd = skin.lcd

  return (
    <div
      className="relative rounded"
      style={{
        padding: "3px",
        background: lcd.bezelBg,
        boxShadow: ["inset 0 2px 4px rgba(0,0,0,0.9)", "inset 0 -1px 0 rgba(255,255,255,0.03)", "0 1px 0 rgba(255,255,255,0.04)"].join(", "),
        border: "1px solid rgba(0,0,0,0.4)",
      }}
    >
      <div className="rounded-sm overflow-hidden" style={{ border: "1px solid rgba(0,0,0,0.3)", boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.02)" }}>
        <div
          className="relative px-4 py-2.5 font-mono select-none"
          style={{ background: lcd.screenBg, minHeight: "58px" }}
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: [
                "repeating-linear-gradient(90deg, rgba(0,0,0,0.15) 0px, rgba(0,0,0,0.15) 1px, transparent 1px, transparent 3px)",
                "repeating-linear-gradient(0deg, rgba(0,0,0,0.15) 0px, rgba(0,0,0,0.15) 1px, transparent 1px, transparent 3px)",
              ].join(", "),
              backgroundSize: "3px 3px",
              zIndex: 2,
            }}
          />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: "repeating-linear-gradient(0deg, transparent 0px, transparent 1px, rgba(0,0,0,0.08) 1px, rgba(0,0,0,0.08) 2px)",
              zIndex: 3,
            }}
          />
          <div
            className="absolute top-0 right-0 pointer-events-none"
            style={{ width: "40%", height: "50%", background: "linear-gradient(225deg, rgba(255,255,255,0.025) 0%, transparent 60%)", zIndex: 4, borderRadius: "0 4px 0 0" }}
          />

          <div className="relative flex flex-col gap-1.5" style={{ zIndex: 5 }}>
            <div className="flex items-center gap-5 flex-wrap">
              <LCDField label="PAT"   value={pattern.name} lcd={lcd} />
              <LCDField label="BPM"   value={String(pattern.bpm)} lcd={lcd} large />
              <LCDField label="SWING" value={`${pattern.swing}%`} lcd={lcd} />
              <LCDField label="STEPS" value={String(pattern.stepCount)} lcd={lcd} />
              <LCDField label="STEP"  value={currentStep >= 0 ? String(currentStep + 1).padStart(2, "0") : "--"} lcd={lcd} />
              <div
                className="text-[12px] tracking-[0.15em] px-1.5 py-0.5 rounded-sm"
                style={{
                  color: isPlaying ? lcd.statusActiveColor : lcd.statusInactiveColor,
                  border: `1px solid ${isPlaying ? lcd.statusActiveBorder : "transparent"}`,
                  textShadow: isPlaying ? lcd.textGlow : "none",
                  background: isPlaying ? lcd.statusActiveBg : "transparent",
                  animation: isPlaying ? "pulse-soft 2s ease-in-out infinite" : "none",
                  fontFamily: "var(--font-mono)",
                }}
              >
                {isPlaying ? "▶ PLAY" : "■ STOP"}
              </div>
            </div>

            <div className="flex gap-[2px]">
              {Array.from({ length: pattern.stepCount }, (_, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-sm"
                  style={{
                    height: "3px",
                    background: currentStep === i ? lcd.stepBarActive : i % 4 === 0 ? lcd.stepBarBeat : lcd.stepBarOff,
                    boxShadow: currentStep === i ? `0 0 4px ${lcd.stepBarActive}` : "none",
                    transition: "background 50ms",
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function LCDField({ label, value, lcd, large }: { label: string; value: string; lcd: ReturnType<typeof useSkin>["lcd"]; large?: boolean }) {
  return (
    <div className="flex items-baseline gap-1">
      <span style={{ color: lcd.labelColor, fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.18em", textTransform: "uppercase" }}>
        {label}
      </span>
      <span style={{ color: lcd.textColor, textShadow: lcd.textGlow, fontSize: large ? "17px" : "14px", letterSpacing: "0.06em", fontFamily: "var(--font-mono)", fontVariantNumeric: "tabular-nums" }}>
        {value}
      </span>
    </div>
  )
}
