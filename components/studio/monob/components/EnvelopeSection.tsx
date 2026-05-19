"use client"

import { MonoKnob } from "./MonoKnob"
import { useMONOBSkin } from "../MONOBSkinContext"
import type { Envelope } from "../types"

type EnvelopeSectionProps = {
  label: string
  env: Envelope
  onChange: (env: Envelope) => void
}

const A_MAX_MS = 1200
const D_MAX_MS = 1200
const R_MAX_MS = 2000

export function EnvelopeSection({ label, env, onChange }: EnvelopeSectionProps) {
  const skin = useMONOBSkin()
  return (
    <div className="flex flex-col gap-3">
      <span className="text-[10px] font-mono tracking-[0.28em] uppercase text-center" style={{ color: skin.silk }}>
        {label}
      </span>
      <div className="grid grid-cols-4 gap-3">
        <MonoKnob
          label="A"
          value={Math.round(env.attack * 1000)}
          min={0}
          max={A_MAX_MS}
          unit="ms"
          onChange={(v) => onChange({ ...env, attack: v / 1000 })}
        />
        <MonoKnob
          label="D"
          value={Math.round(env.decay * 1000)}
          min={0}
          max={D_MAX_MS}
          unit="ms"
          onChange={(v) => onChange({ ...env, decay: v / 1000 })}
        />
        <MonoKnob
          label="S"
          value={Math.round(env.sustain * 100)}
          min={0}
          max={100}
          unit="%"
          onChange={(v) => onChange({ ...env, sustain: v / 100 })}
        />
        <MonoKnob
          label="R"
          value={Math.round(env.release * 1000)}
          min={0}
          max={R_MAX_MS}
          unit="ms"
          onChange={(v) => onChange({ ...env, release: v / 1000 })}
        />
      </div>
    </div>
  )
}
