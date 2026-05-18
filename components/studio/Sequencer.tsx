"use client"

import { useState } from "react"
import { Knob } from "./Knob"
import { LCD } from "./LCD"
import { SkinProvider, useSkin } from "./SkinContext"
import { SkinSelector } from "./SkinSelector"
import { StepGrid } from "./StepGrid"
import { TapTempo } from "./TapTempo"
import { Transport } from "./Transport"
import { StudioBackground } from "./StudioBackground"
import { useSequencer } from "./useSequencer"

function Screw({ className }: { className: string }) {
  const skin = useSkin()
  return (
    <div className={`absolute ${className}`} style={{ width: 16, height: 16 }}>
      <svg viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="8" r="6.5" fill={skin.screw.fill} stroke={skin.screw.strokeOuter} strokeWidth="1" />
        <circle cx="8" cy="8" r="3" fill={skin.screw.fill} stroke={skin.screw.strokeInner} strokeWidth="0.5" />
        <line x1="8" y1="5.2" x2="8" y2="10.8" stroke={skin.screw.slot} strokeWidth="0.9" strokeLinecap="round" />
        <line x1="5.2" y1="8" x2="10.8" y2="8" stroke={skin.screw.slot} strokeWidth="0.9" strokeLinecap="round" />
        <circle cx="6.5" cy="6.8" r="0.7" fill={skin.screw.glint} />
      </svg>
    </div>
  )
}

function Panel({ label, children, className = "" }: { label?: string; children: React.ReactNode; className?: string }) {
  const skin = useSkin()
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {label && (
        <span
          className="text-[8px] font-mono tracking-[0.25em] uppercase pl-0.5"
          style={{ color: skin.silkscreen, letterSpacing: "0.28em" }}
        >
          {label}
        </span>
      )}
      <div
        className="rounded-md"
        style={{
          background: skin.panel.bg,
          border: "1px solid",
          borderColor: skin.panel.borderBottom,
          borderTopColor: skin.panel.borderTop,
          boxShadow: [
            "inset 0 2px 5px rgba(0,0,0,0.5)",
            "inset 0 -1px 0 rgba(255,255,255,0.04)",
            "0 1px 0 rgba(255,255,255,0.05)",
          ].join(", "),
          padding: "10px 12px",
        }}
      >
        {children}
      </div>
    </div>
  )
}

function Groove() {
  const skin = useSkin()
  return (
    <div className="flex flex-col gap-px">
      <div style={{ height: "1px", background: skin.groove.dark }} />
      <div style={{ height: "1px", background: skin.groove.light }} />
    </div>
  )
}

function StatusLED({ active }: { active: boolean }) {
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

function SequencerInner() {
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
              <div
                className="text-[8px] font-mono tracking-[0.3em] uppercase mb-0.5"
                style={{ color: skin.brand.sub }}
              >
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
              <span className="text-[8px] font-mono tracking-[0.22em] uppercase" style={{ color: skin.silkscreen }}>Export</span>
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
          <span className="text-[8px] font-mono tracking-widest uppercase" style={{ color: skin.silkscreen, opacity: 0.6 }}>
            Click · R-click velocity · Drag knobs ↕
          </span>
          <span className="text-[8px] font-mono tracking-widest uppercase" style={{ color: skin.silkscreen, opacity: 0.4 }}>
            Tone.js · Web Audio
          </span>
        </div>
      </div>
    </div>
  )
}

// Thin wrapper supplying PushButton locally for Share
function ShareButton() {
  const [copied, setCopied] = useState(false)
  const skin = useSkin()

  const handleClick = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <SmallPushButton
      label={copied ? "✓" : "⬡"}
      sublabel={copied ? "COPIED" : "SHARE"}
      onClick={handleClick}
      active={copied}
      skin={skin}
    />
  )
}

function SmallPushButton({
  label, sublabel, onClick, active, skin,
}: {
  label: string; sublabel: string; onClick: () => void; active?: boolean
  skin: ReturnType<typeof useSkin>
}) {
  const [pressed, setPressed] = useState(false)
  return (
    <div className="flex flex-col items-center gap-1">
      <button
        onClick={onClick}
        onMouseDown={() => setPressed(true)}
        onMouseUp={() => setPressed(false)}
        onMouseLeave={() => setPressed(false)}
        className="outline-none focus-visible:ring-1 focus-visible:ring-white/20 font-mono text-xs"
        style={{
          width: "44px",
          height: pressed ? "30px" : "32px",
          marginBottom: pressed ? "2px" : "0",
          borderRadius: "4px",
          background: active
            ? skin.btn.bg
            : pressed
            ? skin.btn.bg
            : skin.btn.bg,
          border: `1px solid ${active ? skin.accent + "50" : skin.btn.borderMid}`,
          borderTopColor: active ? skin.accent + "60" : pressed ? skin.btn.borderBottom : skin.btn.borderTop,
          borderBottomColor: active ? skin.accent + "20" : skin.btn.borderBottom,
          color: active ? skin.accent : skin.btn.color,
          boxShadow: pressed
            ? "inset 0 2px 4px rgba(0,0,0,0.5)"
            : [skin.btn.shadowOuter, skin.btn.shadowInner].join(", "),
          textShadow: active ? `0 0 6px ${skin.accent}` : "none",
          transition: "all 80ms",
        }}
      >
        {label}
      </button>
      <span className="text-[8px] font-mono tracking-widest" style={{ color: skin.silkscreen }}>
        {sublabel}
      </span>
    </div>
  )
}

export function Sequencer() {
  return (
    <SkinProvider>
      <StudioBackground />
      <SequencerInner />
    </SkinProvider>
  )
}
