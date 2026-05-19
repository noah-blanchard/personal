"use client"

import { useState } from "react"
import { useSkin } from "../SkinContext"
import { SmallPushButton } from "./SmallPushButton"

export function ShareButton() {
  const [copied, setCopied] = useState(false)
  const skin = useSkin()

  const handleClick = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <SmallPushButton
      label={copied ? "✓" : "⬡"}
      sublabel={copied ? "COPIED" : "SHARE"}
      onClick={handleClick}
      active={copied}
      skin={skin}
    />
  )
}
