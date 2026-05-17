"use client";

import { motion, useReducedMotion } from "framer-motion";
import { forwardRef } from "react";
import type { Entry, Lane } from "./types";
import { LANE_META, LANE_ORDER } from "./types";
import {
  indexToX,
  monthIndex,
  todayIndex,
  yearTicks,
  type GanttDomain,
} from "./useGantt";

type Props = {
  entries: Entry[];
  domain: GanttDomain;
  playhead: number;
  pinnedId: string | null;
  onPin: (id: string | null) => void;
};

export const Gantt = forwardRef<HTMLDivElement, Props>(function Gantt(
  { entries, domain, playhead, pinnedId, onPin },
  surfaceRef
) {
  const reduced = useReducedMotion();
  const playheadX = indexToX(playhead, domain) * 100;

  return (
    <div className="rounded-lg border hairline bg-ink-50/50 p-4 dark:bg-ink-900/30 sm:p-6">
      <div className="overflow-x-auto">
        <div
          ref={surfaceRef}
          tabIndex={0}
          role="slider"
          aria-label="Scrub through career history"
          aria-valuemin={domain.start}
          aria-valuemax={domain.end}
          aria-valuenow={playhead}
          className="relative min-w-[680px] cursor-ew-resize touch-none focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-ink-50 dark:focus-visible:ring-offset-ink-950"
        >
          {/* Year axis */}
          <div className="relative h-7 select-none border-b hairline">
            {yearTicks(domain).map((idx) => {
              const x = indexToX(idx, domain) * 100;
              const year = Math.floor(idx / 12);
              const isFirst = idx === domain.start;
              const isLast = idx === yearTicks(domain).at(-1);
              const showLabel = isFirst || isLast || year % 2 === 0;
              return (
                <div
                  key={idx}
                  className="absolute top-0 flex h-full -translate-x-1/2 flex-col items-center"
                  style={{ left: `${x}%` }}
                >
                  {showLabel && (
                    <span className="font-mono text-[10px] uppercase tracking-widest text-ink-500 dark:text-ink-400">
                      {year}
                    </span>
                  )}
                  <span className="mt-auto h-1 w-px bg-ink-300 dark:bg-ink-700" />
                </div>
              );
            })}
            {/* today marker */}
            <div className="absolute right-0 top-1/2 flex -translate-y-1/2 items-center gap-1">
              <span
                className="h-1.5 w-1.5 rounded-full bg-accent"
                aria-hidden
              />
              <span className="font-mono text-[10px] uppercase tracking-widest text-accent">
                today
              </span>
            </div>
          </div>

          {/* Lanes */}
          <div className="relative">
            {LANE_ORDER.map((lane) => (
              <LaneRow
                key={lane}
                lane={lane}
                entries={entries.filter((e) => e.lane === lane)}
                domain={domain}
                playhead={playhead}
                pinnedId={pinnedId}
                onPin={onPin}
                reduced={Boolean(reduced)}
              />
            ))}

            {/* Playhead — spans all lanes */}
            <motion.div
              aria-hidden
              className="pointer-events-none absolute inset-y-0 z-20"
              animate={{ left: `${playheadX}%` }}
              transition={
                reduced
                  ? { duration: 0 }
                  : { type: "spring", stiffness: 420, damping: 36, mass: 0.4 }
              }
            >
              <div className="absolute inset-y-0 left-0 w-px -translate-x-1/2 bg-accent/70" />
              <div className="absolute left-0 top-0 -translate-x-1/2 -translate-y-2/3">
                <div className="h-2.5 w-2.5 rounded-full bg-accent shadow-[0_0_0_3px_rgba(163,230,53,0.18)]" />
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <p className="mt-4 font-mono text-[10px] uppercase tracking-widest text-ink-400 dark:text-ink-500">
        drag the playhead · ← → step month · shift+← → step year · tab cycle entries
      </p>
    </div>
  );
});

function LaneRow({
  lane,
  entries,
  domain,
  playhead,
  pinnedId,
  onPin,
  reduced,
}: {
  lane: Lane;
  entries: Entry[];
  domain: GanttDomain;
  playhead: number;
  pinnedId: string | null;
  onPin: (id: string | null) => void;
  reduced: boolean;
}) {
  return (
    <div className="relative h-10 border-b hairline last:border-b-0 sm:h-12">
      <div className="pointer-events-none absolute left-0 top-1/2 z-10 -translate-y-1/2 select-none pl-1">
        <span className="font-mono text-[10px] uppercase tracking-widest text-ink-500 dark:text-ink-400">
          {LANE_META[lane].label}
        </span>
      </div>

      {entries.map((entry) => {
        const s = monthIndex(entry.start);
        const f = entry.end ? monthIndex(entry.end) : domain.end;
        const x = indexToX(s, domain) * 100;
        const w = Math.max(
          1.2,
          (indexToX(f, domain) - indexToX(s, domain)) * 100
        );
        const ongoing = !entry.end;
        const activeUnderPlayhead = playhead >= s && playhead <= f;
        const pinned = pinnedId === entry.id;
        const highlight = activeUnderPlayhead || pinned;

        return (
          <Bar
            key={entry.id}
            entry={entry}
            x={x}
            w={w}
            ongoing={ongoing}
            highlight={highlight}
            pinned={pinned}
            onPin={onPin}
            reduced={reduced}
          />
        );
      })}
    </div>
  );
}

function Bar({
  entry,
  x,
  w,
  ongoing,
  highlight,
  pinned,
  onPin,
  reduced,
}: {
  entry: Entry;
  x: number;
  w: number;
  ongoing: boolean;
  highlight: boolean;
  pinned: boolean;
  onPin: (id: string | null) => void;
  reduced: boolean;
}) {
  return (
    <motion.button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onPin(pinned ? null : entry.id);
      }}
      onPointerDown={(e) => e.stopPropagation()}
      initial={reduced ? false : { opacity: 0, y: 6 }}
      whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      style={{ left: `${x}%`, width: `${w}%` }}
      data-magnet
      className={[
        "absolute top-1/2 flex h-5 -translate-y-1/2 items-center overflow-hidden rounded-[3px] border px-1.5 text-left transition-colors sm:h-6",
        highlight
          ? "border-accent bg-accent/15 text-ink-900 dark:text-ink-50"
          : "border-ink-300/80 bg-ink-100/60 text-ink-700 hover:border-ink-400 dark:border-ink-700/80 dark:bg-ink-800/40 dark:text-ink-300 dark:hover:border-ink-600",
        ongoing
          ? "after:absolute after:right-0 after:top-0 after:h-full after:w-3 after:bg-gradient-to-r after:from-transparent after:to-ink-50/80 dark:after:to-ink-900/60"
          : "",
      ].join(" ")}
      aria-label={`${entry.label}${entry.role ? " — " + entry.role : ""}`}
      aria-pressed={pinned}
    >
      <span className="truncate whitespace-nowrap font-mono text-[10px] uppercase tracking-wider">
        {entry.label}
      </span>
      {ongoing && (
        <span
          aria-hidden
          className="relative z-10 ml-1 text-[10px] text-accent"
        >
          →
        </span>
      )}
    </motion.button>
  );
}
