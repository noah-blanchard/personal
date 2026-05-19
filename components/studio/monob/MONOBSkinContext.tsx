"use client"

import { createContext, useContext, useState } from "react"
import { DEFAULT_MONOB_SKIN, type MONOBSkin } from "./skins"

type MONOBSkinContextValue = {
  skin: MONOBSkin
  setSkin: (s: MONOBSkin) => void
}

const MONOBSkinContext = createContext<MONOBSkinContextValue>({
  skin: DEFAULT_MONOB_SKIN,
  setSkin: () => {},
})

export function MONOBSkinProvider({ children }: { children: React.ReactNode }) {
  const [skin, setSkin] = useState<MONOBSkin>(DEFAULT_MONOB_SKIN)
  return (
    <MONOBSkinContext.Provider value={{ skin, setSkin }}>
      {children}
    </MONOBSkinContext.Provider>
  )
}

export function useMONOBSkin() {
  return useContext(MONOBSkinContext).skin
}

export function useMONOBSkinSetter() {
  return useContext(MONOBSkinContext).setSkin
}
