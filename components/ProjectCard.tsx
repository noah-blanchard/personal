"use client";

import { motion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { Tag } from "./ui/Tag";
import type { Project } from "@/content/work";
import { pick, type Locale } from "@/content/types";

const card = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const } },
};

export function ProjectCard({ project }: { project: Project }) {
  const locale = useLocale() as Locale;
  const t = useTranslations("work");
  const textRight = project.align === "right";

  const blurb = pick(project.blurb, locale);
  const built = pick(project.built, locale);

  return (
    <motion.article variants={card} className="group relative">
      <div className={["grid items-center gap-8 md:gap-12 lg:gap-16", "md:grid-cols-12"].join(" ")}>
        <div
          className={[
            "order-1 md:col-span-7",
            textRight ? "md:order-1" : "md:order-2",
          ].join(" ")}
        >
          <a
            href={project.href}
            data-magnet
            className="relative block aspect-[16/10] overflow-hidden rounded-xl border hairline bg-ink-100/60 transition-colors hover:border-ink-300 dark:bg-ink-900/40 dark:hover:border-ink-700"
            aria-label={`${project.title},  ${t("viewProject")}`}
          >
            <div
              aria-hidden
              className="absolute inset-0 opacity-[0.5] [background-image:linear-gradient(to_right,theme(colors.ink.200/0.5)_1px,transparent_1px),linear-gradient(to_bottom,theme(colors.ink.200/0.5)_1px,transparent_1px)] [background-size:32px_32px] dark:opacity-30 dark:[background-image:linear-gradient(to_right,theme(colors.ink.800/0.7)_1px,transparent_1px),linear-gradient(to_bottom,theme(colors.ink.800/0.7)_1px,transparent_1px)]"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="select-none font-serif text-[clamp(4rem,12vw,9rem)] leading-none text-ink-300 transition-colors group-hover:text-ink-400 dark:text-ink-700 dark:group-hover:text-ink-600">
                {project.glyph}
              </span>
            </div>
            <div className="absolute left-4 top-4 flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-ink-500 dark:text-ink-400">
              <span>{project.index}</span>
              <span aria-hidden>/</span>
              <span>{project.year}</span>
            </div>

            <motion.div
              aria-hidden
              initial={false}
              variants={{
                rest: { clipPath: "inset(0 0 100% 0)" },
                hover: { clipPath: "inset(0 0 0% 0)" },
              }}
              animate="rest"
              whileHover="hover"
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] as const }}
              className="absolute inset-0 flex items-end bg-ink-950/85 p-6 text-ink-50 backdrop-blur-[2px] md:p-8"
            >
              <div className="max-w-md">
                <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-accent">
                  {t("whatIBuilt")}
                </p>
                <p className="mt-2 text-balance text-sm leading-relaxed text-ink-200 md:text-base">
                  {built}
                </p>
              </div>
            </motion.div>

            <div className="absolute bottom-4 right-4 font-mono text-[10px] text-ink-400 transition-colors group-hover:text-accent dark:text-ink-500">
              {t("viewLabel")}
            </div>
          </a>
        </div>

        <div
          className={[
            "order-2 md:col-span-5",
            textRight ? "md:order-2 md:text-right" : "md:order-1",
          ].join(" ")}
        >
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-ink-500 dark:text-ink-400">
            <span className="text-accent">●</span> {t("projectN", { index: project.index })}
          </p>
          <h3 className="mt-3 font-serif text-4xl leading-tight tracking-tight text-ink-900 dark:text-ink-50 md:text-5xl">
            {project.title}
          </h3>
          <p className="mt-4 text-balance text-ink-600 dark:text-ink-300">{blurb}</p>
          <ul
            className={[
              "mt-5 flex flex-wrap gap-1.5",
              textRight ? "md:justify-end" : "",
            ].join(" ")}
          >
            {project.stack.map((s) => (
              <li key={s}>
                <Tag size="sm">{s}</Tag>
              </li>
            ))}
          </ul>
          <a
            href={project.href}
            data-magnet
            className="mt-6 inline-flex items-center gap-2 text-sm text-ink-900 underline decoration-ink-300 decoration-1 underline-offset-4 transition-colors hover:decoration-accent dark:text-ink-50 dark:decoration-ink-700"
          >
            {t("viewProject")}
            <span aria-hidden>→</span>
          </a>
        </div>
      </div>
    </motion.article>
  );
}
