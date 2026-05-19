"use client"

import { useId, useState } from "react"
import { useSkin } from "../SkinContext"

type PartSwitchProps = {
  viewPart: 1 | 2
  partBEnabled: boolean
  onSetViewPart: (p: 1 | 2) => void
  onTogglePartB: () => void
}

export function PartSwitch({ viewPart, partBEnabled, onSetViewPart, onTogglePartB }: PartSwitchProps) {
  const skin = useSkin()
  const uid = useId().replace(/:/g, "")
  const [ledPressed, setLedPressed] = useState(false)

  // Collar pivot in SVG coords
  const PX = 45
  const PY = 30

  const leverAngle = !partBEnabled || viewPart === 1 ? -32 : 32

  const handleSwitchClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!partBEnabled) return
    const rect = e.currentTarget.getBoundingClientRect()
    onSetViewPart((e.clientX - rect.left) < rect.width / 2 ? 1 : 2)
  }

  return (
    <div className="flex items-center gap-3 select-none">

      {/* PART silkscreen label */}
      <span
        className="text-[10px] font-mono tracking-[0.22em] uppercase"
        style={{ color: skin.silkscreen }}
      >
        Part
      </span>

      {/* ── Toggle switch with CSS perspective ── */}
      <div style={{ perspective: "320px", perspectiveOrigin: "50% -60%" }}>
        <svg
          width="92"
          height="46"
          viewBox="0 0 92 46"
          onClick={handleSwitchClick}
          style={{
            display: "block",
            transform: "rotateX(-9deg)",
            cursor: partBEnabled ? "pointer" : "default",
            overflow: "visible",
          }}
        >
          <defs>
            {/* Lever shaft — brushed nickel cylinder */}
            <linearGradient id={`${uid}-shaft`} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%"   stopColor="#4a4a4a" />
              <stop offset="18%"  stopColor="#aaaaaa" />
              <stop offset="40%"  stopColor="#efefef" />
              <stop offset="62%"  stopColor="#c8c8c8" />
              <stop offset="82%"  stopColor="#888888" />
              <stop offset="100%" stopColor="#505050" />
            </linearGradient>

            {/* Ball tip — sphere */}
            <radialGradient id={`${uid}-ball`} cx="36%" cy="30%" r="60%">
              <stop offset="0%"   stopColor="#f8f8f8" />
              <stop offset="45%"  stopColor="#c0c0c0" />
              <stop offset="80%"  stopColor="#848484" />
              <stop offset="100%" stopColor="#505050" />
            </radialGradient>

            {/* Collar — nickel ring */}
            <radialGradient id={`${uid}-collar`} cx="36%" cy="28%" r="65%">
              <stop offset="0%"   stopColor="#d8d8d8" />
              <stop offset="50%"  stopColor="#9a9a9a" />
              <stop offset="85%"  stopColor="#606060" />
              <stop offset="100%" stopColor="#404040" />
            </radialGradient>

            {/* Housing front face */}
            <linearGradient id={`${uid}-front`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor="#383836" />
              <stop offset="50%"  stopColor="#262624" />
              <stop offset="100%" stopColor="#1c1c1a" />
            </linearGradient>

            {/* Housing top face (visible chamfer — 3D illusion) */}
            <linearGradient id={`${uid}-top`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor="#5a5a58" />
              <stop offset="100%" stopColor="#3a3a38" />
            </linearGradient>

            {/* Lever drop shadow filter */}
            <filter id={`${uid}-shadow`} x="-40%" y="-40%" width="180%" height="180%">
              <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="rgba(0,0,0,0.5)" />
            </filter>
          </defs>

          {/* ── Housing drop shadow ── */}
          <rect x="7" y="22" width="78" height="22" rx="3" fill="rgba(0,0,0,0.55)" />

          {/* ── Housing top face (pseudo-3D) ── */}
          <rect x="5" y="14" width="82" height="8" rx="3" fill={`url(#${uid}-top)`} />

          {/* ── Housing front face ── */}
          <rect x="5" y="19" width="82" height="24" rx="3" fill={`url(#${uid}-front)`} />

          {/* Front face top edge shimmer */}
          <rect x="5" y="19" width="82" height="3" rx="1" fill="rgba(255,255,255,0.09)" />

          {/* Bottom shadow strip */}
          <rect x="5" y="39" width="82" height="4" rx="0 0 3 3" fill="rgba(0,0,0,0.45)" />

          {/* ── Label I ── */}
          <text
            x="18" y="34"
            textAnchor="middle"
            fontFamily="var(--font-mono)"
            fontSize="11"
            letterSpacing="0.06em"
            fill={viewPart === 1 ? skin.accent : "rgba(255,255,255,0.30)"}
            style={{
              filter: viewPart === 1 ? `drop-shadow(0 0 4px ${skin.accent})` : "none",
              transition: "fill 150ms",
            }}
          >I</text>

          {/* ── Label II ── */}
          <text
            x="74" y="34"
            textAnchor="middle"
            fontFamily="var(--font-mono)"
            fontSize="11"
            letterSpacing="0.04em"
            fill={viewPart === 2 && partBEnabled ? skin.accent : "rgba(255,255,255,0.30)"}
            opacity={partBEnabled ? 1 : 0.30}
            style={{
              filter: viewPart === 2 && partBEnabled ? `drop-shadow(0 0 4px ${skin.accent})` : "none",
              transition: "fill 150ms, opacity 200ms",
            }}
          >II</text>

          {/* ── Mounting collar ── */}
          <circle cx={PX} cy={PY} r="12"   fill={`url(#${uid}-collar)`} />
          <circle cx={PX} cy={PY} r="12"   fill="none" stroke="rgba(0,0,0,0.4)"   strokeWidth="0.8" />
          {/* Threaded grooves */}
          <circle cx={PX} cy={PY} r="9.5"  fill="none" stroke="rgba(0,0,0,0.3)"   strokeWidth="0.7" />
          <circle cx={PX} cy={PY} r="7.5"  fill="none" stroke="rgba(0,0,0,0.25)"  strokeWidth="0.5" />
          <circle cx={PX} cy={PY} r="5.8"  fill="none" stroke="rgba(0,0,0,0.2)"   strokeWidth="0.5" />
          {/* Bore / hole */}
          <circle cx={PX} cy={PY} r="4.2"  fill="#101010" />
          <circle cx={PX} cy={PY} r="4.2"  fill="none" stroke="rgba(0,0,0,0.7)"   strokeWidth="0.5" />
          {/* Collar top glint */}
          <ellipse cx={PX - 3} cy={PY - 5} rx="3.5" ry="2" fill="rgba(255,255,255,0.18)" />

          {/* ── Bat lever — pivots at collar center ── */}
          <g
            filter={`url(#${uid}-shadow)`}
            style={{
              transformOrigin: `${PX}px ${PY}px`,
              transform: `rotate(${leverAngle}deg)`,
              transition: "transform 250ms cubic-bezier(0.34, 1.56, 0.64, 1)",
            }}
          >
            {/* Shaft base / collar flange */}
            <rect
              x={PX - 6} y={PY - 6}
              width="12" height="10"
              rx="3"
              fill="#686866"
            />
            <rect
              x={PX - 6} y={PY - 7}
              width="12" height="2"
              rx="1"
              fill="rgba(255,255,255,0.12)"
            />

            {/* Main shaft — cylindrical rod */}
            <rect
              x={PX - 4} y={5}
              width="8" height={PY - 4}
              rx="4"
              fill={`url(#${uid}-shaft)`}
            />

            {/* Shaft highlight rim (left bright edge of cylinder) */}
            <rect
              x={PX - 4} y={5}
              width="2" height={PY - 4}
              rx="1"
              fill="rgba(255,255,255,0.14)"
            />

            {/* Ball tip */}
            <circle cx={PX} cy={6} r="6.5" fill={`url(#${uid}-ball)`} />
            <circle cx={PX} cy={6} r="6.5" fill="none" stroke="rgba(0,0,0,0.25)" strokeWidth="0.6" />
            {/* Ball specular highlight */}
            <circle cx={PX - 2} cy={3.8} r="2.2" fill="rgba(255,255,255,0.50)" />
          </g>
        </svg>
      </div>

      {/* ── Part II LED enable button ── */}
      <button
        onClick={onTogglePartB}
        onMouseDown={() => setLedPressed(true)}
        onMouseUp={() => setLedPressed(false)}
        onMouseLeave={() => setLedPressed(false)}
        className="flex flex-col items-center gap-1 outline-none focus-visible:ring-1 focus-visible:ring-white/20"
        style={{
          padding: "5px 7px",
          borderRadius: "5px",
          background: ledPressed ? skin.panel.bg : "transparent",
          border: `1px solid ${partBEnabled ? `${skin.accent}40` : "transparent"}`,
          transition: "background 80ms, border-color 150ms",
          cursor: "pointer",
        }}
        title={partBEnabled ? "Disable Part II" : "Enable Part II"}
      >
        <div
          style={{
            width: "9px",
            height: "9px",
            borderRadius: "50%",
            background: partBEnabled ? skin.accent : skin.led.off,
            boxShadow: partBEnabled ? skin.led.onGlow : "none",
            transition: "background 150ms, box-shadow 150ms",
          }}
        />
        <span
          className="text-[9px] font-mono tracking-[0.08em]"
          style={{
            color: partBEnabled ? skin.accent : skin.silkscreen,
            textShadow: partBEnabled ? `0 0 5px ${skin.accent}` : "none",
            opacity: partBEnabled ? 1 : 0.5,
            transition: "color 150ms, opacity 150ms",
            lineHeight: 1,
          }}
        >
          II
        </span>
      </button>
    </div>
  )
}
