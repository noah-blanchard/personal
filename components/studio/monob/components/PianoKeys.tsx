"use client"

import { useEffect, useMemo, useRef } from "react"
import { useMONOBSkin } from "../MONOBSkinContext"

const NOTE_SEQUENCE = [
  "C2", "C#2", "D2", "D#2", "E2", "F2", "F#2", "G2", "G#2", "A2", "A#2", "B2",
  "C3", "C#3", "D3", "D#3", "E3", "F3", "F#3", "G3", "G#3", "A3", "A#3", "B3",
  "C4", "C#4", "D4", "D#4", "E4", "F4", "F#4", "G4", "G#4", "A4", "A#4", "B4",
  "C5",
] as const

const KEYBOARD_KEYS = ["a", "w", "s", "e", "d", "f", "t", "g", "y", "h", "u", "j", "k"]

type PianoKeysProps = {
  activeNote: string | null
  octaveOffset: number
  onOctaveChange: (v: number) => void
  onNoteOn: (note: string, velocity?: number) => void
  onNoteOff: () => void
}

type KeyMeta = {
  note: string
  isBlack: boolean
  whiteIndex: number
}

export function PianoKeys({ activeNote, octaveOffset, onOctaveChange, onNoteOn, onNoteOff }: PianoKeysProps) {
  const skin = useMONOBSkin()
  const pressedKeys = useRef<Set<string>>(new Set())

  const maxOctave = Math.max(0, Math.floor((NOTE_SEQUENCE.length - 25) / 12))
  const safeOctave = Math.min(maxOctave, Math.max(0, octaveOffset))

  const visibleNotes = useMemo(() => {
    const baseIndex = safeOctave * 12
    return NOTE_SEQUENCE.slice(baseIndex, baseIndex + 25)
  }, [safeOctave])

  const keys = useMemo<KeyMeta[]>(() => {
    let whiteIndex = -1
    return visibleNotes.map((note) => {
      const isBlack = note.includes("#")
      if (!isBlack) whiteIndex += 1
      return { note, isBlack, whiteIndex }
    })
  }, [visibleNotes])

  const keyMap = useMemo(() => {
    const noteSlice = visibleNotes.slice(0, 13)
    const map = new Map<string, string>()
    KEYBOARD_KEYS.forEach((key, i) => {
      const note = noteSlice[i]
      if (note) map.set(key, note)
    })
    return map
  }, [visibleNotes])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement
      if (target?.tagName === "INPUT" || target?.tagName === "TEXTAREA" || target?.isContentEditable) return
      if (e.repeat) return
      const key = e.key.toLowerCase()
      const note = keyMap.get(key)
      if (!note) return
      pressedKeys.current.add(key)
      onNoteOn(note, 0.85)
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase()
      if (!pressedKeys.current.has(key)) return
      pressedKeys.current.delete(key)
      onNoteOff()
    }

    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("keyup", handleKeyUp)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("keyup", handleKeyUp)
    }
  }, [keyMap, onNoteOn, onNoteOff])

  const whiteKeys = keys.filter((k) => !k.isBlack)
  const blackKeys = keys.filter((k) => k.isBlack)

  const WHITE_W = 36
  const WHITE_H = 140
  const BLACK_W = 22
  const BLACK_H = 90

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onOctaveChange(Math.max(0, safeOctave - 1))}
            className="font-mono text-[11px] outline-none focus-visible:ring-1 focus-visible:ring-white/20"
            style={{
              padding: "4px 8px",
              borderRadius: "5px",
              border: `1px solid ${skin.panel.border}`,
              color: skin.silk,
              background: "rgba(0,0,0,0.25)",
            }}
          >
            - OCT
          </button>
          <button
            onClick={() => onOctaveChange(Math.min(maxOctave, safeOctave + 1))}
            className="font-mono text-[11px] outline-none focus-visible:ring-1 focus-visible:ring-white/20"
            style={{
              padding: "4px 8px",
              borderRadius: "5px",
              border: `1px solid ${skin.panel.border}`,
              color: skin.silk,
              background: "rgba(0,0,0,0.25)",
            }}
          >
            + OCT
          </button>
        </div>
      </div>

      <div className="relative" style={{ width: WHITE_W * whiteKeys.length, height: WHITE_H }}>
        <div className="flex">
          {whiteKeys.map((key) => {
            const active = activeNote === key.note
            return (
              <button
                key={key.note}
                onPointerDown={() => onNoteOn(key.note, 0.9)}
                onPointerUp={onNoteOff}
                onPointerLeave={onNoteOff}
                className="relative outline-none focus-visible:ring-1 focus-visible:ring-white/30"
                style={{
                  width: WHITE_W,
                  height: WHITE_H,
                  borderRadius: "0 0 6px 6px",
                  border: `1px solid ${skin.key.whiteBorder}`,
                  background: skin.key.white,
                  boxShadow: active ? skin.key.activeGlow : skin.key.whiteShadow,
                  color: active ? skin.key.active : "#222",
                  zIndex: 1,
                  touchAction: "none",
                  transition: "all 80ms",
                }}
              />
            )
          })}
        </div>

        {blackKeys.map((key) => {
          const active = activeNote === key.note
          const left = key.whiteIndex * WHITE_W + WHITE_W - BLACK_W / 2
          return (
            <button
              key={key.note}
              onPointerDown={() => onNoteOn(key.note, 0.85)}
              onPointerUp={onNoteOff}
              onPointerLeave={onNoteOff}
              className="absolute outline-none focus-visible:ring-1 focus-visible:ring-white/30"
              style={{
                top: 0,
                left,
                width: BLACK_W,
                height: BLACK_H,
                borderRadius: "0 0 6px 6px",
                border: "1px solid rgba(0,0,0,0.6)",
                background: skin.key.black,
                boxShadow: active ? skin.key.activeGlow : skin.key.blackShadow,
                transform: "translateX(-50%)",
                color: active ? skin.key.active : "#ddd",
                zIndex: 2,
                touchAction: "none",
                transition: "all 80ms",
              }}
            />
          )
        })}
      </div>
    </div>
  )
}
