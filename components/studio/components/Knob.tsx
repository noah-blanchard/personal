"use client"

import { useSkin } from "../SkinContext"
import { useKnob } from "../useKnob"

type KnobProps = {
  label: string
  value: number
  min: number
  max: number
  unit?: string
  color?: string
  onChange: (v: number) => void
}

const CX = 44
const CY = 44
const R_OUTER = 38
const R_GRIP  = 31
const R_CAP   = 20
const ARC_R   = 29

function polar(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180
  const round = (n: number) => Math.round(n * 10000) / 10000
  return { x: round(cx + r * Math.cos(rad)), y: round(cy + r * Math.sin(rad)) }
}

function arcPath(cx: number, cy: number, r: number, startDeg: number, endDeg: number) {
  const s = polar(cx, cy, r, startDeg)
  const e = polar(cx, cy, r, endDeg)
  const large = Math.abs(endDeg - startDeg) > 180 ? 1 : 0
  return `M ${s.x} ${s.y} A ${r} ${r} 0 ${large} 1 ${e.x} ${e.y}`
}

const MAJOR_TICKS = [-135, 0, 135]
const MINOR_TICKS = [-90, -45, 45, 90]

export function Knob({ label, value, min, max, unit = "", color, onChange }: KnobProps) {
  const skin = useSkin()
  const arcColor = color ?? skin.accent

  const { onPointerDown, onPointerMove, onPointerUp, rotation, normalized } = useKnob({
    min, max, value, onChange,
  })

  const fillEnd = -135 + normalized * 270
  const pInner = polar(CX, CY, 11, rotation)
  const pOuter = polar(CX, CY, 18, rotation)

  const gradId = `alum-${label}`
  const capId  = `cap-${label}`
  const ringShadowId = `rs-${label}`

  return (
    <div className="flex flex-col items-center gap-2 select-none">
      <span className="text-[11px] font-mono tracking-[0.2em] uppercase" style={{ color: skin.silkscreen }}>
        {label}
      </span>

      <div
        className="cursor-ns-resize relative"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        style={{ touchAction: "none" }}
      >
        <svg width="88" height="88" viewBox="0 0 88 88">
          <defs>
            <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="1" gradientUnits="objectBoundingBox">
              {skin.knob.aluminumGradient
                .replace("linear-gradient(135deg,", "")
                .replace(")", "")
                .split(",")
                .map((stop, i, arr) => {
                  const [color, pct] = stop.trim().split(" ")
                  return <stop key={i} offset={pct ?? `${(i / (arr.length - 1)) * 100}%`} stopColor={color} />
                })
              }
            </linearGradient>
            <radialGradient id={capId} cx="40%" cy="35%" r="65%">
              {skin.knob.capGradient
                .replace("radial-gradient(circle at 40% 35%,", "")
                .replace(")", "")
                .split(",")
                .map((stop, i, arr) => (
                  <stop key={i} offset={`${(i / (arr.length - 1)) * 100}%`} stopColor={stop.trim()} />
                ))
              }
            </radialGradient>
            <radialGradient id={ringShadowId} cx="50%" cy="50%" r="50%">
              <stop offset="85%"  stopColor="transparent" />
              <stop offset="100%" stopColor="rgba(0,0,0,0.6)" />
            </radialGradient>
          </defs>

          <circle cx={CX + 1} cy={CY + 2} r={R_OUTER + 1} fill="rgba(0,0,0,0.5)" />
          <circle cx={CX} cy={CY} r={R_OUTER} fill={`url(#${gradId})`} />
          <circle cx={CX} cy={CY} r={R_OUTER} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="0.5" />
          <circle cx={CX} cy={CY} r={R_OUTER} fill={`url(#${ringShadowId})`} />

          {MINOR_TICKS.map((a) => {
            const inner = polar(CX, CY, R_OUTER - 5, a)
            const outer = polar(CX, CY, R_OUTER - 1, a)
            return <line key={a} x1={inner.x} y1={inner.y} x2={outer.x} y2={outer.y} stroke="rgba(0,0,0,0.6)" strokeWidth="1" strokeLinecap="round" />
          })}
          {MAJOR_TICKS.map((a) => {
            const inner = polar(CX, CY, R_OUTER - 7, a)
            const outer = polar(CX, CY, R_OUTER - 1, a)
            return <line key={a} x1={inner.x} y1={inner.y} x2={outer.x} y2={outer.y} stroke="rgba(0,0,0,0.8)" strokeWidth="1.5" strokeLinecap="round" />
          })}

          <circle cx={CX} cy={CY} r={R_GRIP + 3} fill={skin.knob.gripColor} />
          <circle cx={CX} cy={CY} r={R_GRIP + 3} fill="none" stroke="rgba(0,0,0,0.4)" strokeWidth="1" />
          {Array.from({ length: 12 }, (_, i) => {
            const p = polar(CX, CY, R_GRIP + 1, i * 30)
            return <circle key={i} cx={p.x} cy={p.y} r="1.2" fill={skin.knob.gripBumpColor} />
          })}

          <path d={arcPath(CX, CY, ARC_R, -135, 135)} fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="5" strokeLinecap="round" />
          <path d={arcPath(CX, CY, ARC_R, -135, 135)} fill="none" stroke={skin.knob.trackColor} strokeWidth="4" strokeLinecap="round" />

          {normalized > 0 && (
            <path
              d={arcPath(CX, CY, ARC_R, -135, fillEnd)}
              fill="none" stroke={arcColor} strokeWidth="3.5" strokeLinecap="round"
              style={{ filter: `drop-shadow(0 0 3px ${arcColor})` }}
            />
          )}

          <circle cx={CX} cy={CY} r={R_CAP} fill={`url(#${capId})`} />
          <circle cx={CX} cy={CY} r={R_CAP} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />

          <line x1={pInner.x} y1={pInner.y} x2={pOuter.x} y2={pOuter.y}
            stroke={arcColor} strokeWidth="2.5" strokeLinecap="round"
            style={{ filter: `drop-shadow(0 0 2px ${arcColor})` }}
          />
          <circle cx={CX} cy={CY} r="2" fill={arcColor} opacity="0.4" />
        </svg>
      </div>

      <span className="text-[14px] font-mono tabular-nums" style={{ color: skin.btn.color }}>
        {value}{unit}
      </span>
    </div>
  )
}
