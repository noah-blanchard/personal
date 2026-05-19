"use client"

import { MONOBSkinProvider } from "./MONOBSkinContext"
import { MONOBInner } from "./components/MONOBInner"

export function MONOB() {
  return (
    <MONOBSkinProvider>
      <MONOBInner />
    </MONOBSkinProvider>
  )
}
