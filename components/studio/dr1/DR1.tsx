"use client"

import { SkinProvider } from "./SkinContext"
import { DR1Inner } from "./components/DR1Inner"

export function DR1() {
  return (
    <SkinProvider>
      <DR1Inner />
    </SkinProvider>
  )
}
