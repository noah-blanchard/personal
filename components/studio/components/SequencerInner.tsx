"use client"

import { useSkin } from "../SkinContext"
import { useSequencer } from "../useSequencer"
import { Groove } from "./Groove"
import { Knob } from "./Knob"
import { LCD } from "./LCD"
import { Panel } from "./Panel"
import { Screw } from "./Screw"
import { ShareButton } from "./ShareButton"
import { SkinSelector } from "./SkinSelector"
import { StatusLED } from "./StatusLED"
import { StepGrid } from "./StepGrid"
import { TapTempo } from "./TapTempo"
import { Transport } from "./Transport"

export function SequencerInner() {
  const skin = useSkin()
  const {
    pattern, isPlaying, currentStep,
    play, stop, reset,
    toggleStep, setVelocity, setBpm, setSwing, setStepCount, toggleMute,
  } = useSequencer()

  return (
    <div
      className="w-full max-w-5xl mx-auto relative"
      style={{
        position: "relative",
        zIndex: 1,
        background: skin.chassis.bg,
        borderRadius: "14px",
        border: "1px solid",
        borderColor: skin.chassis.borderBottom,
        borderTopColor: skin.chassis.borderTop,
        boxShadow: skin.chassis.outerShadow,
        padding: "20px 20px 18px 20px",
      }}
    >
      <Screw className="top-[10px] left-[10px]" />
      <Screw className="top-[10px] right-[10px]" />
      <Screw className="bottom-[10px] left-[10px]" />
      <Screw className="bottom-[10px] right-[10px]" />

      <div className="flex flex-col gap-3 mx-3">
        {/* ── Brand plate + LCD ── */}
        <div className="flex items-stretch gap-4">
          <div
            className="flex flex-col justify-between shrink-0 px-3 py-2.5 rounded-md"
            style={{
              background: skin.brand.plateBg,
              border: "1px solid",
              borderTopColor: skin.brand.plateBorderTop,
              borderColor: skin.panel.borderTop,
              boxShadow: ["inset 0 2px 4px rgba(0,0,0,0.4)", "0 1px 0 rgba(255,255,255,0.05)"].join(", "),
              minWidth: "88px",
            }}
          >
            <div>
              <div className="text-[10px] font-mono tracking-[0.3em] uppercase mb-0.5" style={{ color: skin.brand.sub }}>
                N.Blanchard
              </div>
              <div
                className="font-mono font-bold tracking-[0.12em] uppercase"
                style={{
                  fontSize: "20px",
                  color: skin.brand.name,
                  textShadow: `0 0 10px ${skin.accent}40, 0 0 20px ${skin.accent}18`,
                  letterSpacing: "0.12em",
                  lineHeight: 1,
                }}
              >
                MK-1
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <StatusLED active={isPlaying} />
              <SkinSelector />
            </div>
          </div>

          <div className="flex-1">
            <LCD pattern={pattern} isPlaying={isPlaying} currentStep={currentStep} />
          </div>
        </div>

        <Groove />

        {/* ── Transport + Knobs + Tap + Share ── */}
        <Panel>
          <div className="flex items-end gap-5 sm:gap-7 flex-wrap">
            <Transport
              isPlaying={isPlaying}
              stepCount={pattern.stepCount}
              onPlay={play}
              onStop={stop}
              onReset={reset}
              onSetStepCount={setStepCount}
            />
            <div className="self-stretch w-px hidden sm:block" style={{ background: `linear-gradient(180deg, transparent, ${skin.groove.light} 20%, ${skin.groove.light} 80%, transparent)` }} />
            <Knob label="BPM"   value={pattern.bpm}   min={60}  max={200} color={skin.accent}    onChange={setBpm} />
            <Knob label="SWING" value={pattern.swing}  min={0}   max={100} unit="%" color="#a78bfa" onChange={setSwing} />
            <div className="self-stretch w-px hidden sm:block" style={{ background: `linear-gradient(180deg, transparent, ${skin.groove.light} 20%, ${skin.groove.light} 80%, transparent)` }} />
            <TapTempo onBpmChange={setBpm} />
            <div className="ml-auto flex flex-col items-center gap-1">
              <span className="text-[10px] font-mono tracking-[0.22em] uppercase" style={{ color: skin.silkscreen }}>Export</span>
              <ShareButton />
            </div>
          </div>
        </Panel>

        <Groove />

        {/* ── Step Grid ── */}
        <Panel label="Sequencer">
          <StepGrid
            pattern={pattern}
            currentStep={currentStep}
            onToggleStep={toggleStep}
            onVelocityChange={setVelocity}
            onToggleMute={toggleMute}
          />
        </Panel>

        <div className="flex items-center justify-between px-0.5 pt-1">
          <span className="text-[10px] font-mono tracking-widest uppercase" style={{ color: skin.silkscreen, opacity: 0.6 }}>
            Click · R-click velocity · Drag knobs ↕
          </span>
          <span className="text-[10px] font-mono tracking-widest uppercase" style={{ color: skin.silkscreen, opacity: 0.4 }}>
            Tone.js · Web Audio
          </span>
        </div>
      </div>
    </div>
  )
}
