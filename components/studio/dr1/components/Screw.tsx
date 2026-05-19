"use client"

import { useSkin } from "../SkinContext"

export function Screw({ className }: { className: string }) {
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
