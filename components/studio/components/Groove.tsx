"use client"

import { useSkin } from "../SkinContext"

export function Groove() {
  const skin = useSkin()
  return (
    <div className="flex flex-col gap-px">
      <div style={{ height: "1px", background: skin.groove.dark }} />
      <div style={{ height: "1px", background: skin.groove.light }} />
    </div>
  )
}
