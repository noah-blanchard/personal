"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useMemo } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Tag } from "../ui/Tag";
import { TECH_GROUPS, type TechGroup } from "@/content/tech";
import { pick, type Locale } from "@/content/types";
import { EASE_OUT_EXPO } from "@/lib/animation";

// A deterministic pseudo-random per pill so SSR & client agree on drift params.
function pseudo(str: string, seed: number) {
  let h = 2166136261 ^ seed;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 16777619);
  }
  return ((h >>> 0) % 10000) / 10000;
}

export function Tech() {
  const t = useTranslations("tech");

  return (
    <section id="tech" aria-label="Tech and tools" className="relative border-t hairline py-32 md:py-40">
      <div className="container-grid">
        <div className="flex items-baseline justify-between border-b hairline pb-6">
          <h2 className="font-mono text-xs uppercase tracking-[0.3em] text-ink-500 dark:text-ink-400">
            <span className="text-accent">§</span> {t("sectionLabel")}
          </h2>
          <p className="font-mono text-xs text-ink-500 dark:text-ink-400">
            {t("subtitle")}
          </p>
        </div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
          className="mt-16 grid gap-12 md:grid-cols-2 md:gap-x-16 md:gap-y-14"
        >
          {TECH_GROUPS.map((g) => (
            <Group key={g.id} group={g} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function Group({ group }: { group: TechGroup }) {
  const locale = useLocale() as Locale;
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE_OUT_EXPO } },
      }}
    >
      <h3 className="font-mono text-xs uppercase tracking-[0.25em] text-ink-500 dark:text-ink-400">
        {pick(group.title, locale)}
      </h3>
      <ul className="mt-5 flex flex-wrap gap-2">
        {group.items.map((item) => (
          <Pill key={item} label={item} />
        ))}
      </ul>
    </motion.div>
  );
}

function Pill({ label }: { label: string }) {
  const reduced = useReducedMotion();
  const drift = useMemo(() => {
    const a = pseudo(label, 1);
    const b = pseudo(label, 2);
    return {
      duration: 6 + a * 4,
      delay: -b * 4,
      y: 1 + Math.round(a * 2),
    };
  }, [label]);

  const animate = reduced ? {} : { y: [0, -drift.y, 0, drift.y * 0.6, 0] };

  return (
    <motion.li
      animate={animate}
      transition={{
        duration: drift.duration,
        delay: drift.delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      className="will-change-transform"
    >
      <Tag size="md" withDot>
        {label}
      </Tag>
    </motion.li>
  );
}
