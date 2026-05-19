"use client"

import { useState } from "react"
import { useMONOBSkin } from "../MONOBSkinContext"
import { useMONOB } from "../useMONOB"
import { MONOBDisplay } from "./MONOBDisplay"
import { MONOBSkinSelector } from "./MONOBSkinSelector"
import { MonoKnob } from "./MonoKnob"
import { MonoPanel } from "./MonoPanel"
import { OscSection } from "./OscSection"
import { FilterSection } from "./FilterSection"
import { EnvelopeSection } from "./EnvelopeSection"
import { PianoKeys } from "./PianoKeys"
import { Screw } from "./Screw"

export function MONOBInner() {
  const skin = useMONOBSkin()
  const {
    patch,
    activeNote,
    noteOn,
    noteOff,
    setOscType,
    setAmpEnv,
    setFilterEnv,
    setFilterType,
    setFilterRolloff,
    setFilterCutoff,
    setFilterRes,
    setVolume,
    setPortamento,
  } = useMONOB()

  const [octaveOffset, setOctaveOffset] = useState(0)

  return (
    <div
      className="w-full max-w-5xl mx-auto relative"
      style={{
        position: "relative",
        zIndex: 1,
        background: skin.chassis.bg,
        borderRadius: "18px",
        border: "1px solid",
        borderColor: skin.chassis.borderBottom,
        borderTopColor: skin.chassis.borderTop,
        boxShadow: skin.chassis.shadow,
        padding: "22px",
      }}
    >
      <Screw className="top-[10px] left-[10px]" />
      <Screw className="top-[10px] right-[10px]" />
      <Screw className="bottom-[10px] left-[10px]" />
      <Screw className="bottom-[10px] right-[10px]" />

      <div className="absolute left-4 right-4 top-0 h-[6px] rounded-b" style={{ background: skin.accent, opacity: 0.15 }} />

      <div className="flex flex-col gap-4">
        <div className="flex items-stretch gap-4 flex-wrap">
          <div
            className="flex flex-col justify-between px-3 py-2 rounded-md shrink-0"
            style={{
              background: skin.brand.plateBg,
              border: `1px solid ${skin.brand.plateBorder}`,
              minWidth: "120px",
              boxShadow: "inset 0 2px 4px rgba(0,0,0,0.45)",
            }}
          >
            <div>
              <div className="text-[10px] font-mono tracking-[0.3em] uppercase" style={{ color: skin.brand.subText }}>
                NBLXRD
              </div>
              <div
                className="font-mono font-bold tracking-[0.2em] uppercase"
                style={{ color: skin.brand.text, fontSize: "20px" }}
              >
                MO-NOB
              </div>
            </div>
            <div className="mt-2">
              <MONOBSkinSelector />
            </div>
          </div>

          <div className="flex-1 min-w-[260px]">
            <MONOBDisplay patch={patch} activeNote={activeNote} />
          </div>
        </div>

        <div className="grid lg:grid-cols-[1.2fr_1fr] gap-4">
          <MonoPanel label="Voice">
            <div className="flex flex-col gap-4">
              <OscSection oscType={patch.oscType} onChange={setOscType} />
              <FilterSection
                filterType={patch.filterType}
                filterRolloff={patch.filterRolloff}
                cutoff={patch.filterCutoff}
                resonance={patch.filterRes}
                onTypeChange={setFilterType}
                onRolloffChange={setFilterRolloff}
                onCutoffChange={setFilterCutoff}
                onResonanceChange={setFilterRes}
              />
            </div>
          </MonoPanel>

          <MonoPanel label="Envelope">
            <div className="flex flex-col gap-5">
              <EnvelopeSection label="Amp Env" env={patch.ampEnv} onChange={setAmpEnv} />
              <EnvelopeSection label="Filter Env" env={patch.filterEnv} onChange={setFilterEnv} />
            </div>
          </MonoPanel>
        </div>

        <MonoPanel label="Performance">
          <div className="flex flex-wrap gap-6 items-start">
            <div className="flex items-center gap-4">
              <MonoKnob label="VOLUME" value={patch.volume} min={0} max={100} unit="%" onChange={setVolume} />
              <MonoKnob label="GLIDE" value={patch.portamento} min={0} max={100} unit="%" onChange={setPortamento} />
            </div>
            <div className="flex-1 min-w-[260px]">
              <PianoKeys
                activeNote={activeNote}
                octaveOffset={octaveOffset}
                onOctaveChange={setOctaveOffset}
                onNoteOn={noteOn}
                onNoteOff={noteOff}
              />
            </div>
          </div>
        </MonoPanel>
      </div>
    </div>
  )
}
