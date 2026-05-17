"use client";

import { motion } from "framer-motion";
import { ScrambleText } from "./ScrambleText";
import { TypewriterRole } from "./TypewriterRole";
import { ScrollIndicator } from "./ScrollIndicator";

const ROLES = [
  "I build the full stack.",
  "TypeScript, Go, and the glue between.",
  "Shipping since 2014.",
  "Open to select work in 2026.",
];

const enter = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] } },
};

export function Hero() {
  return (
    <section
      aria-label="Introduction"
      className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden pt-24"
    >
      <div className="container-grid">
        <motion.p
          initial="hidden"
          animate="show"
          variants={enter}
          className="font-mono text-xs uppercase tracking-[0.3em] text-ink-500 dark:text-ink-400"
        >
          <span className="inline-flex items-center gap-2">
            <span className="relative inline-flex h-2 w-2">
              <span className="absolute inset-0 animate-pulse-soft rounded-full bg-accent" />
              <span className="absolute inset-0 rounded-full bg-accent/40 blur-[3px]" />
            </span>
            Open to opportunities
          </span>
        </motion.p>

        <motion.h1
          initial="hidden"
          animate="show"
          variants={{ ...enter, show: { ...enter.show, transition: { ...enter.show.transition, delay: 0.05 } } }}
          className="mt-8 font-serif text-[clamp(3rem,10vw,8rem)] leading-[0.95] tracking-tightest text-ink-900 dark:text-ink-50"
        >
          <ScrambleText text="Kai Renner" />
          <span className="text-accent">.</span>
        </motion.h1>

        <motion.p
          initial="hidden"
          animate="show"
          variants={{ ...enter, show: { ...enter.show, transition: { ...enter.show.transition, delay: 0.15 } } }}
          className="mt-6 max-w-2xl text-balance text-lg text-ink-600 dark:text-ink-300 md:text-xl"
        >
          Senior fullstack engineer.{" "}
          <span className="text-ink-900 dark:text-ink-50">
            <TypewriterRole roles={ROLES} />
          </span>
        </motion.p>

        <motion.div
          initial="hidden"
          animate="show"
          variants={{ ...enter, show: { ...enter.show, transition: { ...enter.show.transition, delay: 0.3 } } }}
          className="mt-12 flex flex-wrap items-center gap-3"
        >
          <a
            href="#work"
            data-magnet
            className="group inline-flex items-center gap-2 rounded-full bg-ink-900 px-5 py-2.5 text-sm font-medium text-ink-50 transition-colors hover:bg-ink-800 dark:bg-ink-50 dark:text-ink-950 dark:hover:bg-ink-200"
          >
            View Work
            <ArrowIcon className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </a>
          <a
            href="/cv.txt"
            data-magnet
            className="inline-flex items-center gap-2 rounded-full border border-ink-300/80 px-5 py-2.5 text-sm font-medium text-ink-700 transition-colors hover:border-ink-500 hover:text-ink-900 dark:border-ink-700/80 dark:text-ink-300 dark:hover:border-ink-500 dark:hover:text-ink-50"
          >
            Download CV
            <DownloadIcon className="h-3.5 w-3.5" />
          </a>
        </motion.div>

        <motion.p
          initial="hidden"
          animate="show"
          variants={{ ...enter, show: { ...enter.show, transition: { ...enter.show.transition, delay: 0.45 } } }}
          className="mt-10 font-mono text-xs text-ink-500 dark:text-ink-400"
        >
          Berlin · UTC+1 · hello@kairenner.dev
        </motion.p>
      </div>

      <ScrollIndicator />

      {/* A single, very subtle accent rule. The site's only ambient decoration. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-ink-200/80 to-transparent dark:via-ink-800/80"
      />
    </section>
  );
}

function ArrowIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <path d="M3 8h10M9 4l4 4-4 4" />
    </svg>
  );
}

function DownloadIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <path d="M8 2v8M4 7l4 4 4-4M3 14h10" />
    </svg>
  );
}
