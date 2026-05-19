"use client"

import { useSkin } from "../SkinContext"

export function Panel({ label, children, className = "" }: { label?: string; children: React.ReactNode; className?: string }) {
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
