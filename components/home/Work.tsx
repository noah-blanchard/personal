"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { ProjectCard } from "./ProjectCard";
import { PROJECTS } from "@/content/work";

const list = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12 },
  },
};

export function Work() {
  const t = useTranslations("work");

  return (
    <section
      id="work"
      aria-label="Selected work"
      className="relative py-32 md:py-40"
    >
      <div className="container-grid">
        <div className="flex items-baseline justify-between border-b hairline pb-6">
          <h2 className="font-mono text-xs uppercase tracking-[0.3em] text-ink-500 dark:text-ink-400">
            <span className="text-accent">§</span> {t("sectionLabel")}
          </h2>
          <p className="font-mono text-xs text-ink-500 dark:text-ink-400">
            {t("count", { count: PROJECTS.length })}
          </p>
        </div>

        <motion.div
          variants={list}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          className="mt-16 flex flex-col gap-24 md:gap-32"
        >
          {PROJECTS.map((p) => (
            <ProjectCard key={p.id} project={p} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
