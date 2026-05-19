"use client"

import { motion, useReducedMotion } from "framer-motion"
import { useMONOBSkin } from "../MONOBSkinContext"

const GLOWS = [
  { size: 520, top: "-10%", left: "-15%", dur: 18, opacity: 0.22 },
  { size: 420, top: "50%", left: "65%", dur: 22, opacity: 0.18 },
  { size: 360, top: "10%", left: "55%", dur: 16, opacity: 0.16 },
] as const

export function MONOBBackground() {
  const skin = useMONOBSkin()
  const reduceMotion = useReducedMotion()

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden" style={{ background: skin.bgBase }}>
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: [
            "radial-gradient(circle at 20% 15%, rgba(255,255,255,0.04) 0%, transparent 55%)",
            "radial-gradient(circle at 80% 70%, rgba(255,255,255,0.03) 0%, transparent 60%)",
            "repeating-linear-gradient(0deg, rgba(255,255,255,0.02) 0px, rgba(255,255,255,0.02) 1px, transparent 1px, transparent 4px)",
          ].join(", "),
          opacity: 0.6,
        }}
      />

      {GLOWS.map((g, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full blur-3xl"
          style={{
            width: g.size,
            height: g.size,
            top: g.top,
            left: g.left,
            background: `radial-gradient(circle, ${skin.accent}55 0%, transparent 60%)`,
            opacity: g.opacity,
          }}
          animate={reduceMotion ? undefined : { x: [0, 80, -60, 0], y: [0, -60, 40, 0] }}
          transition={reduceMotion ? undefined : { duration: g.dur, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}

      <motion.div
        className="absolute inset-y-0 right-[-20%] w-[40%]"
        style={{
          background: `linear-gradient(120deg, transparent 0%, ${skin.accent}18 40%, transparent 80%)`,
          opacity: 0.35,
        }}
        animate={reduceMotion ? undefined : { x: [0, -200, 0] }}
        transition={reduceMotion ? undefined : { duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  )
}
