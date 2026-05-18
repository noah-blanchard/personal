"use client"

import { useCallback, useRef } from "react"

type UseKnobOptions = {
  min: number
  max: number
  value: number
  onChange: (value: number) => void
  sensitivity?: number // px per full range
}

export function useKnob({ min, max, value, onChange, sensitivity = 200 }: UseKnobOptions) {
  const startY = useRef<number | null>(null)
  const startValue = useRef<number>(value)

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault()
      ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
      startY.current = e.clientY
      startValue.current = value
    },
    [value]
  )

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (startY.current === null) return
      const delta = startY.current - e.clientY // drag up = increase
      const range = max - min
      const newValue = Math.min(max, Math.max(min, startValue.current + (delta / sensitivity) * range))
      onChange(Math.round(newValue))
    },
    [min, max, onChange, sensitivity]
  )

  const onPointerUp = useCallback(() => {
    startY.current = null
  }, [])

  // 0–1 normalized position
  const normalized = (value - min) / (max - min)
  // -135° to +135° rotation range
  const rotation = -135 + normalized * 270

  return { onPointerDown, onPointerMove, onPointerUp, rotation, normalized }
}
