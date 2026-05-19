"use client"

import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, MouseSensor, TouchSensor, useSensor, useSensors } from "@dnd-kit/core"
import { Panel, Group as PanelGroup, Separator as PanelResizeHandle } from "react-resizable-panels"
import { useState } from "react"
import { useDAW } from "./DAWProvider"
import { DAWToolbar } from "./DAWToolbar"
import { DAWBrowser } from "./DAWBrowser"
import { DAWPlaylist } from "./DAWPlaylist"
import { DAWDetailPanel } from "./DAWDetailPanel"
import { useDAWAudio } from "./audio/useDAWAudio"
import type { DAWFile } from "./types"

export function DAWLayout() {
  const { panels, detailOpen, addToPlaylist } = useDAW()
  const audio = useDAWAudio()
  const [activeDragFile, setActiveDragFile] = useState<DAWFile | null>(null)

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 5 } }),
  )

  function handleDragStart(event: DragStartEvent) {
    const file = event.active.data.current?.file as DAWFile | undefined
    if (file) setActiveDragFile(file)
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveDragFile(null)
    const file = event.active.data.current?.file as DAWFile | undefined
    if (file && event.over?.id === "playlist-drop") {
      audio.playDrop()
      addToPlaylist(file)
    }
  }

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="flex h-screen flex-col overflow-hidden bg-stone-100 dark:bg-zinc-950 font-mono">
        <DAWToolbar />

        <div className="min-h-0 flex-1">
          <PanelGroup orientation="horizontal" className="h-full">
            {panels.browser && (
              <>
                <Panel id="browser" defaultSize="22%" minSize="14%" maxSize="40%" className="min-h-0">
                  <DAWBrowser />
                </Panel>
                <ResizeHandleV />
              </>
            )}

            <Panel id="main" className="min-h-0">
              <MainArea showPlaylist={panels.playlist} showDetail={detailOpen} />
            </Panel>
          </PanelGroup>
        </div>
      </div>

      <DragOverlay dropAnimation={null}>
        {activeDragFile && <DragGhost file={activeDragFile} />}
      </DragOverlay>
    </DndContext>
  )
}

function MainArea({ showPlaylist, showDetail }: { showPlaylist: boolean; showDetail: boolean }) {
  if (showPlaylist && showDetail) {
    return (
      <PanelGroup orientation="vertical" className="h-full">
        <Panel id="playlist" minSize="25%" className="min-h-0">
          <DAWPlaylist />
        </Panel>
        <ResizeHandleH />
        <Panel id="detail" defaultSize="38%" minSize="18%" maxSize="72%" className="min-h-0">
          <DAWDetailPanel />
        </Panel>
      </PanelGroup>
    )
  }

  if (showPlaylist) {
    return <div className="h-full"><DAWPlaylist /></div>
  }

  if (showDetail) {
    return <div className="h-full"><DAWDetailPanel /></div>
  }

  return (
    <div className="flex h-full items-center justify-center text-[11px] text-stone-400 dark:text-zinc-600">
      open a panel — [B] browser · [P] playlist · [D] detail
    </div>
  )
}

function DragGhost({ file }: { file: DAWFile }) {
  return (
    <div className="flex items-center gap-2 rounded border border-amber-500/50 bg-zinc-900/90 px-3 py-2 shadow-xl backdrop-blur-sm pointer-events-none">
      <div className={`flex h-5 w-5 items-center justify-center rounded text-[11px] ${file.color} text-white`}>
        {file.glyph}
      </div>
      <span className="text-[11px] text-zinc-200">
        {file.name}<span className="text-zinc-500">.{file.ext}</span>
      </span>
    </div>
  )
}

function ResizeHandleV() {
  return (
    <PanelResizeHandle className="w-[3px] bg-stone-300 dark:bg-zinc-800 transition-colors hover:bg-amber-500 dark:hover:bg-amber-500 cursor-col-resize" />
  )
}

function ResizeHandleH() {
  return (
    <PanelResizeHandle className="h-[3px] bg-stone-300 dark:bg-zinc-800 transition-colors hover:bg-amber-500 dark:hover:bg-amber-500 cursor-row-resize" />
  )
}
