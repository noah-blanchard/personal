"use client"

import { createContext, useContext, useState } from "react"
import { DEFAULT_SKIN, type Skin } from "./skins"

type SkinContextValue = {
  skin: Skin
  setSkin: (s: Skin) => void
}

const SkinContext = createContext<SkinContextValue>({
  skin: DEFAULT_SKIN,
  setSkin: () => {},
})

export function SkinProvider({ children }: { children: React.ReactNode }) {
  const [skin, setSkin] = useState<Skin>(DEFAULT_SKIN)
  return (
    <SkinContext.Provider value={{ skin, setSkin }}>
      {children}
    </SkinContext.Provider>
  )
}

export function useSkin() {
  return useContext(SkinContext).skin
}

export function useSkinSetter() {
  return useContext(SkinContext).setSkin
}
