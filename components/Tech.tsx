"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useMemo } from "react";

type Group = { title: string; items: string[] };

const GROUPS: Group[] = [
  {
    title: "Frontend",
    items: ["TypeScript", "React", "Next.js", "Tailwind", "Framer Motion", "Svelte"],
  },
  {
    title: "Backend",
    items: ["Go", "Node.js", "Rust", "Postgres", "Redis", "ClickHouse", "gRPC"],
  },
  {
    title: "Infra",
    items: ["Kubernetes", "Terraform", "AWS", "Cloudflare", "Docker", "GitHub Actions"],
  },
  {
    title: "Tooling",
    items: ["Neovim", "Tmux", "pnpm", "Bun", "OpenTelemetry", "Datadog"],
  },
];

// A deterministic pseudo-random per pill so SSR & client agree on drift params.
function pseudo(str: string, seed: number) {
  let h = 2166136261 ^ seed;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 16777619);
  }
  // 0..1
  return ((h >>> 0) % 10000) / 10000;
}

export function Tech() {
  return (
    <section id="tech" aria-label="Tech and tools" className="relative border-t hairline py-32 md:py-40">
      <div className="container-grid">
        <div className="flex items-baseline justify-between border-b hairline pb-6">
          <h2 className="font-mono text-xs uppercase tracking-[0.3em] text-ink-500 dark:text-ink-400">
            <span className="text-accent">§</span> Tech &amp; tools
          </h2>
          <p className="font-mono text-xs text-ink-500 dark:text-ink-400">
            things i actually use
          </p>
        </div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
          className="mt-16 grid gap-12 md:grid-cols-2 md:gap-x-16 md:gap-y-14"
        >
          {GROUPS.map((g) => (
            <Group key={g.title} group={g} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function Group({ group }: { group: Group }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
      }}
    >
      <h3 className="font-mono text-xs uppercase tracking-[0.25em] text-ink-500 dark:text-ink-400">
        {group.title}
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
      duration: 6 + a * 4, // 6s..10s
      delay: -b * 4,       // negative delay desyncs them
      y: 1 + Math.round(a * 2), // 1..3 px
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
      <span className="group inline-flex items-center gap-2 rounded-full border hairline bg-ink-100/50 px-3 py-1.5 font-mono text-xs text-ink-700 transition-colors hover:border-accent/60 hover:text-ink-900 dark:bg-ink-900/40 dark:text-ink-300 dark:hover:text-ink-50">
        <span className="h-1 w-1 rounded-full bg-ink-400 transition-colors group-hover:bg-accent dark:bg-ink-600" />
        {label}
      </span>
    </motion.li>
  );
}
