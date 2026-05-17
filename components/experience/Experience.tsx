"use client";

import { motion } from "framer-motion";
import { useRef } from "react";
import { ENTRIES } from "./data";
import { Gantt } from "./Gantt";
import { DetailsPanel } from "./DetailsPanel";
import { useDomain, useGanttScrub } from "./useGantt";

export function Experience() {
  const surfaceRef = useRef<HTMLDivElement | null>(null);
  const domain = useDomain(ENTRIES);
  const { playhead, pinnedId, setPinnedId } = useGanttScrub({
    entries: ENTRIES,
    surfaceRef,
  });

  return (
    <section
      id="experience"
      aria-label="Experience"
      className="relative border-t hairline py-32 md:py-40"
    >
      <div className="container-grid">
        <div className="flex items-baseline justify-between border-b hairline pb-6">
          <h2 className="font-mono text-xs uppercase tracking-[0.3em] text-ink-500 dark:text-ink-400">
            <span className="text-accent">§</span> Experience
          </h2>
          <p className="font-mono text-xs text-ink-500 dark:text-ink-400">
            {ENTRIES.length} entries · 4 lanes
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }}
          className="mt-10"
        >
          <Gantt
            ref={surfaceRef}
            entries={ENTRIES}
            domain={domain}
            playhead={playhead}
            pinnedId={pinnedId}
            onPin={setPinnedId}
          />

          <DetailsPanel
            entries={ENTRIES}
            playhead={playhead}
            pinnedId={pinnedId}
            onUnpin={() => setPinnedId(null)}
          />
        </motion.div>
      </div>
    </section>
  );
}
