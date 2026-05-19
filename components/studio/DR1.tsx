"use client"

import { SkinProvider } from "./SkinContext"
import { StudioBackground } from "./components/StudioBackground"
import { DR1Inner } from "./components/DR1Inner"

export function DR1() {
  return (
    <SkinProvider>
      <StudioBackground />
      <DR1Inner />
    </SkinProvider>
  )
}
