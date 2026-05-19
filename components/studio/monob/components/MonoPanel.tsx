"use client"

import { useMONOBSkin } from "../MONOBSkinContext"

export function MonoPanel({ label, children, className = "" }: { label?: string; children: React.ReactNode; className?: string }) {
  const skin = useMONOBSkin()
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {label && (
        <span
          className="text-[10px] font-mono tracking-[0.28em] uppercase pl-0.5"
          style={{ color: skin.silk }}
        >
          {label}
        </span>
      )}
      <div
        className="rounded-md"
        style={{
          background: skin.panel.bg,
          border: `1px solid ${skin.panel.border}`,
          boxShadow: [skin.panel.inset, "0 1px 0 rgba(255,255,255,0.06)"].join(", "),
          padding: "12px",
        }}
      >
        {children}
      </div>
    </div>
  )
}
