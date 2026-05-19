"use client"

import { useSkin } from "../SkinContext"
import { TrackRow } from "./TrackRow"
import type { Pattern } from "../types"

type StepGridProps = {
  pattern: Pattern
  currentStep: number
  onToggleStep: (trackId: string, stepIndex: number) => void
  onVelocityChange: (trackId: string, stepIndex: number, v: number) => void
  onToggleMute: (trackId: string) => void
}

export function StepGrid({ pattern, currentStep, onToggleStep, onVelocityChange, onToggleMute }: StepGridProps) {
  const skin = useSkin()
  const { stepCount } = pattern
  const groupCount = stepCount / 4

  return (
    <div className="relative">
      {currentStep >= 0 && (
        <div
          className="absolute top-6 bottom-0 pointer-events-none z-10"
          style={{
            left: `calc(62px + 4px + (100% - 62px - 4px) * ${currentStep / stepCount})`,
            width: `calc((100% - 62px - 4px) / ${stepCount} - 1px)`,
            background: "rgba(255,255,255,0.04)",
            borderTop: `2px solid ${skin.accent}80`,
            borderRadius: "2px 2px 0 0",
            boxShadow: `0 0 8px 1px ${skin.accent}18`,
          }}
        />
      )}

      <div className="flex items-center gap-2 mb-2" style={{ paddingLeft: "64px" }}>
        <div className="grid flex-1" style={{ gridTemplateColumns: `repeat(${stepCount}, minmax(0, 1fr))`, gap: "3px" }}>
          {Array.from({ length: stepCount }, (_, i) => {
            const isBeat = (i + 1) % 4 === 1
            const isActive = currentStep === i
            return (
              <div key={i} className="flex justify-center items-center" style={{ height: "14px" }}>
                {isBeat ? (
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "8px", color: isActive ? skin.accent : skin.silkscreen, textShadow: isActive ? `0 0 6px ${skin.accent}` : "none", transition: "color 60ms", lineHeight: 1 }}>
                    {i + 1}
                  </span>
                ) : (
                  <div className="rounded-full" style={{ width: 2, height: 2, background: isActive ? skin.accent : skin.groove.light, boxShadow: isActive ? `0 0 4px ${skin.accent}` : "none", transition: "background 60ms" }} />
                )}
              </div>
            )
          })}
        </div>
      </div>

      <div className="absolute top-[18px] bottom-0 pointer-events-none" style={{ left: "64px", right: 0 }}>
        {Array.from({ length: groupCount - 1 }, (_, i) => (
          <div key={i} className="absolute top-0 bottom-0 flex flex-col" style={{ left: `${((i + 1) / groupCount) * 100}%` }}>
            <div style={{ flex: 1, width: "1px", background: skin.groove.dark }} />
            <div style={{ flex: 1, width: "1px", background: skin.groove.light }} />
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-[5px]">
        {pattern.tracks.map((track, i) => (
          <TrackRow
            key={track.id}
            track={{ ...track, color: skin.tracks[i] ?? track.color }}
            currentStep={currentStep}
            onToggleStep={(stepIndex) => onToggleStep(track.id, stepIndex)}
            onVelocityChange={(stepIndex, v) => onVelocityChange(track.id, stepIndex, v)}
            onToggleMute={() => onToggleMute(track.id)}
          />
        ))}
      </div>
    </div>
  )
}
