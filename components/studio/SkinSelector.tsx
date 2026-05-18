"use client"

import { SKINS } from "./skins"
import { useSkin, useSkinSetter } from "./SkinContext"

export function SkinSelector() {
  const current = useSkin()
  const setSkin = useSkinSetter()

  return (
    <div className="flex items-center gap-1.5">
      {SKINS.map((skin) => {
        const active = current.id === skin.id
        return (
          <button
            key={skin.id}
            onClick={() => setSkin(skin)}
            title={skin.name}
            className="relative outline-none focus-visible:ring-1 focus-visible:ring-white/30 transition-transform"
            style={{
              width: 14,
              height: 14,
              borderRadius: "50%",
              background: skin.preview.chassis,
              border: active
                ? `2px solid ${skin.preview.dot}`
                : `1px solid rgba(128,128,128,0.3)`,
              boxShadow: active
                ? `0 0 0 1px ${skin.preview.dot}40, 0 0 6px 1px ${skin.preview.dot}60`
                : "none",
              transform: active ? "scale(1.15)" : "scale(1)",
              transition: "transform 150ms, box-shadow 150ms, border 150ms",
            }}
            onMouseEnter={(e) => { if (!active) (e.currentTarget as HTMLElement).style.transform = "scale(1.1)" }}
            onMouseLeave={(e) => { if (!active) (e.currentTarget as HTMLElement).style.transform = "scale(1)" }}
          >
            {/* Accent dot */}
            <span
              className="absolute inset-0 flex items-center justify-center"
              style={{ pointerEvents: "none" }}
            >
              <span
                className="rounded-full"
                style={{
                  width: 4,
                  height: 4,
                  background: skin.preview.dot,
                  boxShadow: `0 0 3px 1px ${skin.preview.dot}80`,
                }}
              />
            </span>
          </button>
        )
      })}
    </div>
  )
}
