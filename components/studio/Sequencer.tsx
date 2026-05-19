"use client"

import { SkinProvider } from "./SkinContext"
import { StudioBackground } from "./components/StudioBackground"
import { SequencerInner } from "./components/SequencerInner"

export function Sequencer() {
  return (
    <SkinProvider>
      <StudioBackground />
      <SequencerInner />
    </SkinProvider>
  )
}
