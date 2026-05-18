"use client";

import { motion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { ScrambleText } from "./ScrambleText";
import { ScrollIndicator } from "./ScrollIndicator";
import { CopyableEmail } from "./CopyableEmail";
import { Terminal } from "./terminal/Terminal";
import { SITE } from "@/content/site";
import { HERO } from "@/content/hero";
import { pick, type Locale } from "@/content/types";

const enter = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] as const } },
};

export function Hero() {
  const t = useTranslations("hero");
  const locale = useLocale() as Locale;

  return (
    <section
      aria-label="Introduction"
      className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden pt-24"
    >
      <div className="container-grid">
        <div className="grid items-center gap-10 md:grid-cols-12 md:gap-12">
          <div className="md:col-span-5">
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
                {t("availability")}
              </span>
            </motion.p>

            <motion.h1
              initial="hidden"
              animate="show"
              variants={{ ...enter, show: { ...enter.show, transition: { ...enter.show.transition, delay: 0.05 } } }}
              className="mt-8 font-serif text-[clamp(2.75rem,8vw,6rem)] leading-[0.95] tracking-tightest text-ink-900 dark:text-ink-50"
            >
              <ScrambleText text={HERO.scrambleName} />
              <span className="text-accent">.</span>
            </motion.h1>

            <motion.div
              initial="hidden"
              animate="show"
              variants={{ ...enter, show: { ...enter.show, transition: { ...enter.show.transition, delay: 0.2 } } }}
              className="mt-10 flex flex-wrap items-center gap-3"
            >
              <a
                href="#work"
                data-magnet
                className="group inline-flex items-center gap-2 rounded-full bg-ink-900 px-5 py-2.5 text-sm font-medium text-ink-50 transition-colors hover:bg-ink-800 dark:bg-ink-50 dark:text-ink-950 dark:hover:bg-ink-200"
              >
                {t("ctaWork")}
                <ArrowIcon className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </a>
              <a
                href={HERO.cvHref}
                data-magnet
                className="inline-flex items-center gap-2 rounded-full border border-ink-300/80 px-5 py-2.5 text-sm font-medium text-ink-700 transition-colors hover:border-ink-500 hover:text-ink-900 dark:border-ink-700/80 dark:text-ink-300 dark:hover:border-ink-500 dark:hover:text-ink-50"
              >
                {t("ctaCv")}
                <DownloadIcon className="h-3.5 w-3.5" />
              </a>
            </motion.div>

            <motion.p
              initial="hidden"
              animate="show"
              variants={{ ...enter, show: { ...enter.show, transition: { ...enter.show.transition, delay: 0.35 } } }}
              className="mt-8 font-mono text-xs text-ink-500 dark:text-ink-400"
            >
              {pick(SITE.location, locale)}
              {" · "}
              {SITE.timezone}
              {" · "}
              <CopyableEmail
                email={SITE.email}
                className="underline decoration-ink-300 decoration-1 underline-offset-2 transition-colors hover:text-ink-900 hover:decoration-accent dark:decoration-ink-700 dark:hover:text-ink-50"
              />
            </motion.p>

            <motion.p
              initial="hidden"
              animate="show"
              variants={{ ...enter, show: { ...enter.show, transition: { ...enter.show.transition, delay: 0.5 } } }}
              className="mt-6 hidden font-mono text-[11px] uppercase tracking-widest text-ink-400 dark:text-ink-500 md:block"
            >
              {t.rich("terminalHint", {
                cmd: (chunks) => <span className="text-accent">{chunks}</span>,
              })}
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4, ease: [0.16, 1, 0.3, 1] as const }}
            className="md:col-span-7"
          >
            <Terminal />
          </motion.div>
        </div>
      </div>

      {/* <ScrollIndicator /> */}

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
