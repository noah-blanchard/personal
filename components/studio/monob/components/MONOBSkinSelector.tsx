"use client"

import { MONOB_SKINS } from "../skins"
import { useMONOBSkin, useMONOBSkinSetter } from "../MONOBSkinContext"

export function MONOBSkinSelector() {
  const current = useMONOBSkin()
  const setSkin = useMONOBSkinSetter()

  return (
    <div className="flex items-center gap-2">
      {MONOB_SKINS.map((skin) => {
        const active = current.id === skin.id
        return (
          <button
            key={skin.id}
            onClick={() => setSkin(skin)}
            className="relative outline-none focus-visible:ring-1 focus-visible:ring-white/30"
            style={{
              padding: "2px",
              borderRadius: "6px",
              background: skin.preview.chassis,
              border: active ? `1px solid ${skin.preview.dot}` : "1px solid rgba(255,255,255,0.15)",
              boxShadow: active ? `0 0 8px ${skin.preview.dot}55` : "none",
              transition: "all 150ms",
            }}
            title={skin.name}
          >
            <div
              style={{
                width: 18,
                height: 10,
                borderRadius: 4,
                background: skin.preview.dot,
                opacity: active ? 0.9 : 0.6,
              }}
            />
          </button>
        )
      })}
    </div>
  )
}
