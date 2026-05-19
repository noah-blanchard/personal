"use client"

import { useMONOBSkin } from "../MONOBSkinContext"

export function Screw({ className }: { className: string }) {
  const skin = useMONOBSkin()
  return (
    <div className={`absolute ${className}`} style={{ width: 16, height: 16 }}>
      <svg viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="8" r="6.5" fill={skin.screw.fill} stroke={skin.screw.rim} strokeWidth="1" />
        <circle cx="8" cy="8" r="3" fill={skin.screw.fill} stroke={skin.screw.rim} strokeWidth="0.5" />
        <line x1="5.5" y1="8" x2="10.5" y2="8" stroke={skin.screw.slot} strokeWidth="1" strokeLinecap="round" />
        <circle cx="6.2" cy="6.4" r="0.7" fill={skin.screw.glint} />
      </svg>
    </div>
  )
}
