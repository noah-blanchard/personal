"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { Entry } from "./types";
import { LANE_META } from "./types";
import { entriesAt, indexToLabel, monthIndex } from "./useGantt";

type Props = {
  entries: Entry[];
  playhead: number;
  pinnedId: string | null;
  onUnpin: () => void;
};

export function DetailsPanel({ entries, playhead, pinnedId, onUnpin }: Props) {
  const pinned = pinnedId ? entries.find((e) => e.id === pinnedId) ?? null : null;

  return (
    <div className="mt-6 min-h-[10rem] rounded-lg border hairline bg-ink-50/50 p-5 dark:bg-ink-900/30 sm:p-6">
      <AnimatePresence mode="wait">
        {pinned ? (
          <PinnedView key={pinned.id} entry={pinned} onUnpin={onUnpin} />
        ) : (
          <ScrubView key={`scrub-${playhead}`} entries={entries} playhead={playhead} />
        )}
      </AnimatePresence>
    </div>
  );
}

function ScrubView({ entries, playhead }: { entries: Entry[]; playhead: number }) {
  const active = entriesAt(entries, playhead);

  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
    >
      <p className="font-mono text-xs uppercase tracking-[0.25em] text-ink-500 dark:text-ink-400">
        on <span className="text-accent">{indexToLabel(playhead)}</span>
      </p>

      {active.length === 0 ? (
        <p className="mt-4 font-mono text-sm text-ink-500 dark:text-ink-400">
          (nothing yet — scroll right)
        </p>
      ) : (
        <ul className="mt-4 space-y-2">
          {active.map((e) => (
            <li key={e.id} className="grid grid-cols-[5rem_1fr] items-baseline gap-3">
              <span className="font-mono text-[10px] uppercase tracking-widest text-ink-500 dark:text-ink-400">
                {LANE_META[e.lane].label.toLowerCase()}
              </span>
              <span className="text-sm text-ink-800 dark:text-ink-200">
                <span className="font-medium">{e.label}</span>
                {e.role && (
                  <span className="text-ink-500 dark:text-ink-400"> · {e.role}</span>
                )}
                {e.location && (
                  <span className="font-mono text-[11px] text-ink-400 dark:text-ink-500">
                    {" "}— {e.location}
                  </span>
                )}
              </span>
            </li>
          ))}
        </ul>
      )}

      <p className="mt-6 font-mono text-[10px] uppercase tracking-widest text-ink-400 dark:text-ink-500">
        → click any bar to pin its details
      </p>
    </motion.div>
  );
}

function PinnedView({ entry, onUnpin }: { entry: Entry; onUnpin: () => void }) {
  const start = indexToLabel(monthIndex(entry.start));
  const end = entry.end ? indexToLabel(monthIndex(entry.end)) : "ongoing";

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 4 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-ink-500 dark:text-ink-400">
            {LANE_META[entry.lane].label.toLowerCase()} ·{" "}
            <span className="text-accent">
              {start} → {end}
            </span>
          </p>
          <h3 className="mt-2 font-serif text-2xl leading-tight tracking-tight text-ink-900 dark:text-ink-50 md:text-3xl">
            {entry.label}
            {entry.role && (
              <span className="text-ink-500 dark:text-ink-400"> · {entry.role}</span>
            )}
          </h3>
          {entry.location && (
            <p className="mt-1 font-mono text-xs text-ink-500 dark:text-ink-400">
              {entry.location}
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={onUnpin}
          data-magnet
          className="shrink-0 rounded-full border hairline px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-ink-500 transition-colors hover:text-ink-900 dark:text-ink-400 dark:hover:text-ink-50"
          aria-label="Unpin details"
        >
          esc · unpin
        </button>
      </div>

      {entry.description && (
        <p className="mt-4 max-w-2xl text-balance text-ink-700 dark:text-ink-300">
          {entry.description}
        </p>
      )}

      {entry.tags && entry.tags.length > 0 && (
        <ul className="mt-5 flex flex-wrap gap-1.5">
          {entry.tags.map((t) => (
            <li
              key={t}
              className="rounded-full border hairline px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-ink-500 dark:text-ink-400"
            >
              {t}
            </li>
          ))}
        </ul>
      )}

      {entry.href && (
        <a
          href={entry.href}
          data-magnet
          className="mt-5 inline-flex items-center gap-2 text-sm text-ink-900 underline decoration-ink-300 decoration-1 underline-offset-4 transition-colors hover:decoration-accent dark:text-ink-50 dark:decoration-ink-700"
        >
          View related work
          <span aria-hidden>→</span>
        </a>
      )}

    </motion.div>
  );
}
