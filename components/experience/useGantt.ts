"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { Entry } from "./types";

// Time math is all in "month integers" (year * 12 + month-index)
// to avoid Date object pitfalls with timezones / DST.
//   monthIndex("2021-06") = 2021*12 + 5

export function monthIndex(ym: string): number {
  // Accepts "YYYY-MM" or "YYYY-MM-DD"; ignores anything past the month.
  const [y, m] = ym.split("-");
  return Number(y) * 12 + (Number(m) - 1);
}

export function todayIndex(): number {
  const d = new Date();
  return d.getFullYear() * 12 + d.getMonth();
}

export function indexToLabel(idx: number): string {
  const y = Math.floor(idx / 12);
  const m = idx % 12;
  const MONTHS = [
    "jan", "feb", "mar", "apr", "may", "jun",
    "jul", "aug", "sep", "oct", "nov", "dec",
  ];
  return `${MONTHS[m]} ${y}`;
}

export type GanttDomain = {
  start: number;    // earliest entry start (month index)
  end: number;      // today (month index)
  width: number;    // end - start
};

export function useDomain(entries: Entry[]): GanttDomain {
  return useMemo(() => {
    const startsAt = Math.min(...entries.map((e) => monthIndex(e.start)));
    const end = todayIndex();
    return {
      start: startsAt,
      end,
      width: Math.max(1, end - startsAt),
    };
  }, [entries]);
}

/**
 * Convert a month index → fractional x in [0,1] within the domain.
 * Clamped.
 */
export function indexToX(idx: number, domain: GanttDomain): number {
  return Math.max(0, Math.min(1, (idx - domain.start) / domain.width));
}

/**
 * Convert a fractional x in [0,1] → nearest month index.
 */
export function xToIndex(x: number, domain: GanttDomain): number {
  const raw = domain.start + x * domain.width;
  return Math.round(raw);
}

/**
 * Returns the entries active on a given month index (inclusive on both ends).
 */
export function entriesAt(entries: Entry[], idx: number): Entry[] {
  return entries.filter((e) => {
    const s = monthIndex(e.start);
    const f = e.end ? monthIndex(e.end) : todayIndex();
    return idx >= s && idx <= f;
  });
}

/**
 * Year ticks across the domain, inclusive on both ends.
 */
export function yearTicks(domain: GanttDomain): number[] {
  const startYear = Math.floor(domain.start / 12);
  const endYear = Math.floor(domain.end / 12);
  const out: number[] = [];
  for (let y = startYear; y <= endYear; y++) out.push(y * 12);
  return out;
}

type Options = {
  entries: Entry[];
  /** Element whose pointer events drive the scrub. */
  surfaceRef: React.RefObject<HTMLElement | null>;
};

export function useGanttScrub({ entries, surfaceRef }: Options) {
  const domain = useDomain(entries);
  const [playhead, setPlayhead] = useState<number>(domain.end);
  const [pinnedId, setPinnedId] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);

  // Keep playhead inside the domain if data changes.
  useEffect(() => {
    setPlayhead((p) => Math.max(domain.start, Math.min(domain.end, p)));
  }, [domain.start, domain.end]);

  const setFromClientX = useCallback(
    (clientX: number) => {
      const el = surfaceRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const x = (clientX - rect.left) / rect.width;
      setPlayhead(xToIndex(x, domain));
    },
    [surfaceRef, domain]
  );

  // Pointer drag on the scrub surface.
  useEffect(() => {
    const el = surfaceRef.current;
    if (!el) return;

    const onDown = (e: PointerEvent) => {
      if (e.button !== 0 && e.pointerType === "mouse") return;
      setDragging(true);
      setPinnedId(null);
      el.setPointerCapture(e.pointerId);
      setFromClientX(e.clientX);
    };
    const onMove = (e: PointerEvent) => {
      if (!dragging) return;
      setFromClientX(e.clientX);
    };
    const onUp = (e: PointerEvent) => {
      setDragging(false);
      if (el.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId);
    };

    el.addEventListener("pointerdown", onDown);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerup", onUp);
    el.addEventListener("pointercancel", onUp);

    return () => {
      el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerup", onUp);
      el.removeEventListener("pointercancel", onUp);
    };
  }, [surfaceRef, setFromClientX, dragging]);

  // Keyboard nav when the surface (or any of its children) has focus.
  useEffect(() => {
    const el = surfaceRef.current;
    if (!el) return;

    const onKey = (e: KeyboardEvent) => {
      let next: number | null = null;
      if (e.key === "ArrowLeft") next = playhead - (e.shiftKey ? 12 : 1);
      else if (e.key === "ArrowRight") next = playhead + (e.shiftKey ? 12 : 1);
      else if (e.key === "Home") next = domain.start;
      else if (e.key === "End") next = domain.end;
      else if (e.key === "Escape" && pinnedId) {
        e.preventDefault();
        setPinnedId(null);
        return;
      } else if (e.key === "Tab") {
        const sorted = [...entries].sort(
          (a, b) => monthIndex(a.start) - monthIndex(b.start)
        );
        const currentIdx = pinnedId
          ? sorted.findIndex((x) => x.id === pinnedId)
          : -1;
        const dir = e.shiftKey ? -1 : 1;
        const nextEntry =
          sorted[
            (currentIdx + dir + sorted.length) % sorted.length
          ];
        if (nextEntry) {
          e.preventDefault();
          setPinnedId(nextEntry.id);
          const s = monthIndex(nextEntry.start);
          const f = nextEntry.end ? monthIndex(nextEntry.end) : todayIndex();
          setPlayhead(Math.round((s + f) / 2));
        }
        return;
      }
      if (next === null) return;
      e.preventDefault();
      setPlayhead(Math.max(domain.start, Math.min(domain.end, next)));
    };

    el.addEventListener("keydown", onKey);
    return () => el.removeEventListener("keydown", onKey);
  }, [surfaceRef, playhead, domain.start, domain.end, entries, pinnedId]);

  return {
    domain,
    playhead,
    setPlayhead,
    pinnedId,
    setPinnedId,
    dragging,
  };
}
