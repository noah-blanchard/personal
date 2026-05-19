"use client"

import { AnimatePresence, motion } from "framer-motion"
import { useState } from "react"
import { DR1 } from "./dr1/DR1"
import { StudioBackground } from "./dr1/components/StudioBackground"
import { MONOB } from "./monob/MONOB"

type GearId = "dr1" | "monob"

type GearMeta = {
  id: GearId
  label: string
  brand: string
  accent: string
  panel: string
  chassis: string
  mini: "dr1" | "monob"
}

const GEAR_LIST: GearMeta[] = [
  {
    id: "dr1",
    label: "DR-1",
    brand: "NBLXRD",
    accent: "#a3e635",
    panel: "#141412",
    chassis: "#0b0b0a",
    mini: "dr1",
  },
  {
    id: "monob",
    label: "MO-NOB",
    brand: "NBLXRD",
    accent: "#ff9a3c",
    panel: "#1a140f",
    chassis: "#0d0c0a",
    mini: "monob",
  },
]

export function StudioSwitcher() {
  const [active, setActive] = useState<GearId>("dr1")
  const [shelfOpen, setShelfOpen] = useState(false)

  return (
    <div className="w-full relative">
      <StudioBackground />
      <div className="w-full md:pr-[260px] pb-[160px] md:pb-0 flex justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.98 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="relative z-10 w-full"
          >
            {active === "dr1" ? <DR1 /> : <MONOB />}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="fixed inset-y-0 right-0 hidden md:flex items-center z-30">
        <ShelfPanel active={active} onSelect={setActive} />
      </div>

      <div className="fixed left-0 right-0 bottom-0 md:hidden z-30">
        <div className="flex justify-end px-4 pb-3">
          <button
            onClick={() => setShelfOpen((v) => !v)}
            className="font-mono text-[11px] tracking-[0.24em] uppercase outline-none focus-visible:ring-1 focus-visible:ring-white/30"
            style={{
              padding: "8px 12px",
              borderRadius: "999px",
              border: "1px solid rgba(255,255,255,0.2)",
              background: "rgba(0,0,0,0.65)",
              color: "rgba(255,255,255,0.7)",
              boxShadow: "0 6px 14px rgba(0,0,0,0.45)",
            }}
          >
            {shelfOpen ? "Close Gear" : "Gear Shelf"}
          </button>
        </div>

        <motion.div
          initial={false}
          animate={{ y: shelfOpen ? 0 : 260 }}
          transition={{ type: "spring", stiffness: 260, damping: 28 }}
          className="px-4 pb-4"
        >
          <ShelfPanel active={active} onSelect={(id) => { setActive(id); setShelfOpen(false) }} compact />
        </motion.div>
      </div>
    </div>
  )
}

function ShelfPanel({ active, onSelect, compact }: { active: GearId; onSelect: (id: GearId) => void; compact?: boolean }) {
  return (
    <div
      className="rounded-2xl px-4 py-5 flex flex-col gap-4"
      style={{
        width: compact ? "100%" : "220px",
        background: "rgba(10,10,9,0.9)",
        border: "1px solid rgba(255,255,255,0.08)",
        boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
        backdropFilter: "blur(12px)",
      }}
    >
      <div className="flex items-center justify-between">
        <span className="font-mono text-[11px] tracking-[0.28em] uppercase" style={{ color: "rgba(255,255,255,0.6)" }}>
          Studio Shelf
        </span>
        <span className="text-[9px] font-mono tracking-[0.22em] uppercase" style={{ color: "rgba(255,255,255,0.35)" }}>
          Click to load
        </span>
      </div>
      <div className={compact ? "grid grid-cols-2 gap-3" : "flex flex-col gap-3"}>
        {GEAR_LIST.map((gear) => (
          <button
            key={gear.id}
            onClick={() => onSelect(gear.id)}
            className="outline-none focus-visible:ring-1 focus-visible:ring-white/30"
            style={{
              borderRadius: "14px",
              padding: "10px",
              border: `1px solid ${active === gear.id ? gear.accent : "rgba(255,255,255,0.08)"}`,
              background: active === gear.id ? `${gear.accent}15` : "rgba(0,0,0,0.35)",
              boxShadow: active === gear.id ? `0 0 16px ${gear.accent}40` : "inset 0 2px 6px rgba(0,0,0,0.6)",
              transition: "all 140ms",
              textAlign: "left",
            }}
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-[9px] font-mono tracking-[0.3em] uppercase" style={{ color: "rgba(255,255,255,0.5)" }}>
                  {gear.brand}
                </div>
                <div className="text-[14px] font-mono tracking-[0.2em] uppercase" style={{ color: "#f7f3ea" }}>
                  {gear.label}
                </div>
              </div>
              <MiniGear gear={gear} />
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

function MiniGear({ gear }: { gear: GearMeta }) {
  return (
    <div
      className="relative"
      style={{
        width: 74,
        height: 46,
        borderRadius: 10,
        background: gear.panel,
        border: `1px solid ${gear.accent}35`,
        boxShadow: "inset 0 2px 4px rgba(0,0,0,0.6)",
      }}
    >
      <div
        className="absolute inset-1 rounded-lg"
        style={{
          background: gear.chassis,
          border: "1px solid rgba(255,255,255,0.05)",
        }}
      />
      {gear.mini === "dr1" ? <MiniDr1 accent={gear.accent} /> : <MiniMonob accent={gear.accent} />}
    </div>
  )
}

function MiniDr1({ accent }: { accent: string }) {
  return (
    <div className="absolute inset-2 flex flex-col gap-1">
      <div className="grid grid-cols-4 gap-1">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            style={{
              height: 8,
              borderRadius: 2,
              background: i === 1 ? accent : "rgba(255,255,255,0.12)",
              boxShadow: i === 1 ? `0 0 6px ${accent}66` : "inset 0 1px 2px rgba(0,0,0,0.6)",
            }}
          />
        ))}
      </div>
      <div className="flex-1 flex items-end gap-1">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} style={{ width: "100%", height: 2, background: i % 2 ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.08)" }} />
        ))}
      </div>
    </div>
  )
}

function MiniMonob({ accent }: { accent: string }) {
  return (
    <div className="absolute inset-2 flex flex-col justify-between">
      <div className="flex items-center gap-1">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.15)",
              border: `1px solid ${accent}55`,
              boxShadow: "inset 0 2px 3px rgba(0,0,0,0.6)",
            }}
          />
        ))}
      </div>
      <div className="flex gap-[2px]">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} style={{ flex: 1, height: 6, borderRadius: 1, background: i % 2 ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.2)" }} />
        ))}
      </div>
    </div>
  )
}
