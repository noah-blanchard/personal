"use client";

import { motion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { BIO, CURRENTLY, FACTS, HEADLINE, WHOAMI } from "@/content/about";
import { pick, type Locale } from "@/content/types";
import { EASE_OUT_EXPO } from "@/lib/animation";

const block = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE_OUT_EXPO } },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

export function About() {
  const locale = useLocale() as Locale;
  const t = useTranslations("about");

  const bio = pick(BIO, locale);
  const currently = pick(CURRENTLY, locale);
  const whoami = pick(WHOAMI, locale);

  return (
    <section id="about" aria-label="About" className="relative border-t hairline py-32 md:py-40">
      <div className="container-grid">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="grid gap-16 md:grid-cols-12 md:gap-12"
        >
          <motion.div variants={block} className="md:col-span-7">
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-ink-500 dark:text-ink-400">
              <span className="text-accent">§</span> {t("sectionLabel")}
            </p>
            <h2 className="mt-6 font-serif text-4xl leading-tight tracking-tight text-ink-900 dark:text-ink-50 md:text-5xl">
              {pick(HEADLINE, locale)}
            </h2>
            <div className="mt-8 space-y-5 text-lg leading-relaxed text-ink-700 dark:text-ink-300">
              {bio.map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>

            <motion.div
              variants={block}
              className="mt-10 rounded-lg border hairline bg-ink-50/95 font-mono text-[13px] leading-relaxed text-ink-700 shadow-lg shadow-ink-900/5 dark:bg-ink-950/80 dark:text-ink-300"
            >
              <div className="flex items-center gap-2 border-b hairline bg-ink-100/70 px-3 py-2 dark:bg-ink-900/50 text-[11px] uppercase tracking-widest text-ink-500 dark:text-ink-400">
                <span className="inline-flex gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]/80" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]/80" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]/80" />
                </span>
                <span className="flex-1 text-center">{t("terminalPath")}</span>
                <span className="w-10" aria-hidden />
              </div>
              <div className="px-4 py-3">
                <div className="flex items-baseline">
                  <span className="select-none">
                    <span className="text-accent">noah</span>
                    <span className="text-ink-500">@</span>
                    <span className="text-ink-700 dark:text-ink-300">mtl</span>
                    <span className="text-ink-500"> $ </span>
                  </span>
                  <span className="text-ink-900 dark:text-ink-50">whoami</span>
                </div>
                {whoami.map((line, i) => (
                  <div key={i} className="flex items-baseline text-ink-600 dark:text-ink-400">
                    <span className="select-none text-ink-400 dark:text-ink-600">&gt;&nbsp;</span>
                    <span className="whitespace-pre-wrap">{line}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>

          <motion.aside variants={block} className="md:col-span-5">
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-ink-500 dark:text-ink-400">
              {t("factsLabel")}
            </p>
            <dl className="mt-6 divide-y hairline border-y hairline">
              {FACTS.map((f) => (
                <div key={f.key} className="flex items-baseline justify-between gap-6 py-3">
                  <dt className="font-mono text-xs uppercase tracking-wider text-ink-500 dark:text-ink-400">
                    {t(`facts.${f.key}`)}
                  </dt>
                  <dd className="text-right text-sm text-ink-800 dark:text-ink-200">
                    {pick(f.value, locale)}
                  </dd>
                </div>
              ))}
            </dl>

            <div className="mt-10">
              <p className="font-mono text-xs uppercase tracking-[0.3em] text-ink-500 dark:text-ink-400">
                {t("currentlyLabel")}
              </p>
              <ul className="mt-4 space-y-3 text-sm text-ink-700 dark:text-ink-300">
                {currently.map((line, i) => (
                  <li key={i} className="flex gap-3">
                    <span
                      className={`mt-1.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full ${
                        i === 0 ? "bg-accent" : "bg-ink-400 dark:bg-ink-600"
                      }`}
                    />
                    {line}
                  </li>
                ))}
              </ul>
            </div>
          </motion.aside>
        </motion.div>
      </div>

    </section>
  );
}
