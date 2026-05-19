"use client"

import { useState } from "react"
import type { useSkin } from "../SkinContext"

type SmallPushButtonProps = {
  label: string
  sublabel: string
  onClick: () => void
  active?: boolean
  skin: ReturnType<typeof useSkin>
}

export function SmallPushButton({ label, sublabel, onClick, active, skin }: SmallPushButtonProps) {
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
          background: skin.btn.bg,
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
      <span className="text-[10px] font-mono tracking-widest" style={{ color: skin.silkscreen }}>
        {sublabel}
      </span>
    </div>
  )
}
