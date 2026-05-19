"use client"

import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { useSkin } from "../SkinContext"

const BLOB_CONFIGS = [
  { w: "55vw", h: "55vw", top: "-10%", left: "-15%",  dur: 22, dx: [0, 120, -60, 80, 0],  dy: [0, -80, 60, -40, 0],  sc: [1, 1.15, 0.9, 1.08, 1], colorIdx: 0, opacity: 0.38 },
  { w: "45vw", h: "45vw", top: "30%",  left: "55%",   dur: 28, dx: [0, -90, 50, -70, 0],  dy: [0, 70, -50, 90, 0],   sc: [1, 0.88, 1.12, 0.95, 1], colorIdx: 1, opacity: 0.32 },
  { w: "50vw", h: "50vw", top: "55%",  left: "-5%",   dur: 18, dx: [0, 80, -40, 100, 0],  dy: [0, -60, 80, -30, 0],  sc: [1, 1.1, 0.92, 1.05, 1], colorIdx: 3, opacity: 0.28 },
  { w: "35vw", h: "35vw", top: "-5%",  left: "60%",   dur: 25, dx: [0, -60, 40, -80, 0],  dy: [0, 80, -40, 60, 0],   sc: [1, 0.92, 1.08, 0.88, 1], colorIdx: 4, opacity: 0.34 },
  { w: "40vw", h: "40vw", top: "65%",  left: "50%",   dur: 20, dx: [0, 70, -50, 40, 0],   dy: [0, -50, 70, -80, 0],  sc: [1, 1.12, 0.95, 1.0, 1],  colorIdx: 6, opacity: 0.30 },
  { w: "30vw", h: "30vw", top: "20%",  left: "25%",   dur: 32, dx: [0, -40, 60, -30, 0],  dy: [0, 40, -60, 50, 0],   sc: [1, 0.95, 1.05, 0.98, 1], colorIdx: 5, opacity: 0.22 },
] as const

const WAVE_CONFIGS = [
  { freq: 0.006, amp: 90,  phase: 0,    dur: 18, colorIdx: 1, opacity: 0.10, strokeW: 1.2 },
  { freq: 0.009, amp: 60,  phase: 2.1,  dur: 13, colorIdx: 0, opacity: 0.08, strokeW: 1.0 },
  { freq: 0.004, amp: 130, phase: 4.5,  dur: 22, colorIdx: 5, opacity: 0.07, strokeW: 1.5 },
] as const

const PARTICLE_CONFIGS = [
  { size: 5, top: "12%", left: "8%",   dur: 9,  dx: [0, 40, -30, 0],  dy: [0, -50, 30, 0],  op: [0.25, 0.55, 0.2,  0.25], colorIdx: 0 },
  { size: 4, top: "28%", left: "85%",  dur: 11, dx: [0, -50, 20, 0],  dy: [0, 40, -60, 0],  op: [0.2,  0.5,  0.3,  0.2],  colorIdx: 1 },
  { size: 6, top: "72%", left: "15%",  dur: 8,  dx: [0, 30, -40, 0],  dy: [0, -30, 50, 0],  op: [0.3,  0.6,  0.25, 0.3],  colorIdx: 3 },
  { size: 4, top: "85%", left: "70%",  dur: 13, dx: [0, -40, 60, 0],  dy: [0, 50, -40, 0],  op: [0.2,  0.45, 0.35, 0.2],  colorIdx: 4 },
  { size: 5, top: "45%", left: "92%",  dur: 10, dx: [0, -60, 30, 0],  dy: [0, -40, 60, 0],  op: [0.25, 0.55, 0.2,  0.25], colorIdx: 6 },
  { size: 3, top: "8%",  left: "48%",  dur: 14, dx: [0, 50, -30, 0],  dy: [0, 60, -50, 0],  op: [0.15, 0.4,  0.3,  0.15], colorIdx: 5 },
  { size: 5, top: "60%", left: "38%",  dur: 7,  dx: [0, -30, 50, 0],  dy: [0, -60, 30, 0],  op: [0.3,  0.6,  0.22, 0.3],  colorIdx: 2 },
  { size: 4, top: "33%", left: "22%",  dur: 12, dx: [0, 40, -50, 0],  dy: [0, 30, -40, 0],  op: [0.2,  0.5,  0.28, 0.2],  colorIdx: 0 },
  { size: 6, top: "78%", left: "55%",  dur: 9,  dx: [0, -20, 40, 0],  dy: [0, -40, 20, 0],  op: [0.25, 0.55, 0.25, 0.25], colorIdx: 3 },
  { size: 3, top: "15%", left: "75%",  dur: 16, dx: [0, 30, -60, 0],  dy: [0, 50, -30, 0],  op: [0.15, 0.38, 0.28, 0.15], colorIdx: 6 },
  { size: 5, top: "52%", left: "5%",   dur: 11, dx: [0, 60, -20, 0],  dy: [0, -30, 50, 0],  op: [0.22, 0.52, 0.22, 0.22], colorIdx: 1 },
  { size: 4, top: "90%", left: "30%",  dur: 8,  dx: [0, -40, 30, 0],  dy: [0, -50, 40, 0],  op: [0.2,  0.45, 0.3,  0.2],  colorIdx: 4 },
] as const

function buildWavePath(freq: number, amp: number, phase: number, width: number, height: number): string {
  const midY = height / 2
  const pts: string[] = []
  for (let i = 0; i <= 200; i++) {
    const x = (i / 200) * width * 2
    const y = midY + amp * Math.sin(freq * x + phase)
    pts.push(`${Math.round(x * 100) / 100},${Math.round(y * 100) / 100}`)
  }
  return pts.join(" ")
}

const VIEW_W = 1440
const VIEW_H = 800

function BackgroundLayers({ skinId }: { skinId: string }) {
  const skin = useSkin()
  const reduced = useReducedMotion()

  const trackColors = skin.tracks
  const blobColors = [skin.accent, trackColors[0], trackColors[1], trackColors[3], trackColors[4], trackColors[5], trackColors[6]]

  return (
    <motion.div
      key={skinId}
      className="absolute inset-0"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      style={{ background: skin.bgBase }}
    >
      {BLOB_CONFIGS.map((b, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full pointer-events-none"
          style={{
            width: b.w, height: b.h, top: b.top, left: b.left,
            background: blobColors[b.colorIdx] ?? skin.accent,
            filter: `blur(${100 + i * 10}px)`,
            opacity: b.opacity,
          }}
          animate={reduced ? {} : { x: [...b.dx], y: [...b.dy], scale: [...b.sc] }}
          transition={reduced ? {} : { duration: b.dur, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
        />
      ))}

      <svg
        className="absolute inset-0 pointer-events-none"
        width="200%" height="100%"
        viewBox={`0 0 ${VIEW_W * 2} ${VIEW_H}`}
        preserveAspectRatio="none"
        style={{ top: 0, left: 0 }}
      >
        {WAVE_CONFIGS.map((w, i) => {
          const pts = buildWavePath(w.freq, w.amp, w.phase, VIEW_W, VIEW_H)
          const color = (trackColors as string[])[w.colorIdx] ?? skin.accent
          return (
            <motion.g
              key={i}
              animate={reduced ? {} : { x: [0, -VIEW_W] as number[] }}
              transition={reduced ? {} : { duration: w.dur, repeat: Infinity, ease: "linear" }}
            >
              <polyline
                points={pts} fill="none" stroke={color}
                strokeWidth={w.strokeW} strokeOpacity={w.opacity}
                strokeLinecap="round" strokeLinejoin="round"
              />
            </motion.g>
          )
        })}
      </svg>

      {PARTICLE_CONFIGS.map((p, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full pointer-events-none"
          style={{
            width: p.size, height: p.size, top: p.top, left: p.left,
            background: (trackColors as string[])[p.colorIdx] ?? skin.accent,
          }}
          animate={reduced ? {} : { x: [...p.dx], y: [...p.dy], opacity: [...p.op] }}
          transition={reduced ? {} : { duration: p.dur, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
        />
      ))}

      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 80% 80% at 50% 50%, transparent 20%, rgba(0,0,0,0.75) 100%)" }}
      />
    </motion.div>
  )
}

export function StudioBackground() {
  const skin = useSkin()
  return (
    <div className="fixed inset-0 overflow-hidden" style={{ zIndex: 0 }}>
      <AnimatePresence mode="wait">
        <BackgroundLayers key={skin.id} skinId={skin.id} />
      </AnimatePresence>
    </div>
  )
}
