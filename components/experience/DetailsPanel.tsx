"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { Entry } from "./types";
import { LANE_META } from "./types";
import { entriesAt, indexToLabel, monthIndex } from "./useGantt";
import { Tag } from "../ui/Tag";

type Props = {
  entries: Entry[];
  playhead: number;
  pinnedId: string | null;
  onUnpin: () => void;
};

export function DetailsPanel({ entries, playhead, pinnedId, onUnpin }: Props) {
  const pinned = pinnedId ? entries.find((e) => e.id === pinnedId) ?? null : null;

  return (
    <div className="mt-6 min-h-[12rem] rounded-lg border hairline bg-ink-50/50 p-5 dark:bg-ink-900/30 sm:p-6">
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
      <div className="flex items-baseline justify-between gap-4">
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-ink-500 dark:text-ink-400">
          on <span className="text-accent">{indexToLabel(playhead)}</span>
          {active.length > 0 && (
            <span className="text-ink-400 dark:text-ink-500">
              {" "}· {active.length} active
            </span>
          )}
        </p>
        <p className="font-mono text-[10px] uppercase tracking-widest text-ink-400 dark:text-ink-500">
          → click a bar for what i did & learned
        </p>
      </div>

      {active.length === 0 ? (
        <p className="mt-6 font-mono text-sm text-ink-500 dark:text-ink-400">
          (nothing yet — drag the playhead right)
        </p>
      ) : (
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {active.map((e) => (
            <ActiveCard key={e.id} entry={e} playhead={playhead} />
          ))}
        </div>
      )}
    </motion.div>
  );
}

function ActiveCard({ entry, playhead }: { entry: Entry; playhead: number }) {
  const s = monthIndex(entry.start);
  const monthsIn = Math.max(1, playhead - s + 1);
  const years = Math.floor(monthsIn / 12);
  const months = monthsIn % 12;
  const duration =
    years === 0 ? `${months}mo in` : months === 0 ? `${years}y in` : `${years}y ${months}mo in`;

  return (
    <div className="rounded-md border hairline bg-ink-100/40 p-4 dark:bg-ink-900/30">
      <div className="flex items-baseline justify-between gap-3">
        <span className="font-mono text-[10px] uppercase tracking-widest text-accent">
          {LANE_META[entry.lane].label.toLowerCase()}
        </span>
        <span className="font-mono text-[10px] uppercase tracking-widest text-ink-400 dark:text-ink-500">
          {duration}
        </span>
      </div>
      <h4 className="mt-2 font-serif text-xl leading-tight tracking-tight text-ink-900 dark:text-ink-50">
        {entry.label}
      </h4>
      {(entry.role || entry.location) && (
        <p className="mt-0.5 text-sm text-ink-600 dark:text-ink-400">
          {entry.role}
          {entry.role && entry.location ? " · " : ""}
          {entry.location}
        </p>
      )}
      {entry.description && (
        <p className="mt-3 text-balance text-sm leading-relaxed text-ink-700 dark:text-ink-300">
          {entry.description}
        </p>
      )}
      {entry.tags && entry.tags.length > 0 && (
        <ul className="mt-3 flex flex-wrap gap-1.5">
          {entry.tags.map((t) => (
            <li key={t}>
              <Tag size="sm">{t}</Tag>
            </li>
          ))}
        </ul>
      )}
    </div>
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

      {entry.did && entry.did.length > 0 && (
        <Section label="built" items={entry.did} />
      )}

      {entry.learned && entry.learned.length > 0 && (
        <Section label="learned" items={entry.learned} />
      )}

      {entry.tags && entry.tags.length > 0 && (
        <div className="mt-7">
          <SectionHeader label="stack" />
          <ul className="mt-3 flex flex-wrap gap-1.5">
            {entry.tags.map((t) => (
              <li key={t}>
                <Tag size="sm">{t}</Tag>
              </li>
            ))}
          </ul>
        </div>
      )}

      {entry.href && (
        <a
          href={entry.href}
          data-magnet
          className="mt-6 inline-flex items-center gap-2 text-sm text-ink-900 underline decoration-ink-300 decoration-1 underline-offset-4 transition-colors hover:decoration-accent dark:text-ink-50 dark:decoration-ink-700"
        >
          View related work
          <span aria-hidden>→</span>
        </a>
      )}
    </motion.div>
  );
}

function Section({ label, items }: { label: string; items: string[] }) {
  return (
    <div className="mt-7">
      <SectionHeader label={label} />
      <ul className="mt-3 space-y-1.5">
        {items.map((item, i) => (
          <li
            key={i}
            className="flex gap-3 font-mono text-[13px] leading-relaxed text-ink-700 dark:text-ink-300"
          >
            <span aria-hidden className="select-none text-ink-400 dark:text-ink-600">
              ·
            </span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SectionHeader({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="font-mono text-[10px] uppercase tracking-widest text-accent">
        {label}
      </span>
      <span className="h-px flex-1 bg-ink-200 dark:bg-ink-800" aria-hidden />
    </div>
  );
}
