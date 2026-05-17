"use client";

import { motion } from "framer-motion";
import { ProjectCard, type Project } from "./ProjectCard";

const PROJECTS: Project[] = [
  {
    index: "01",
    title: "Lumen",
    year: "2025",
    blurb:
      "A realtime collaboration engine for design tools — CRDTs, presence, and conflict-free history.",
    built:
      "Designed the wire format and the CRDT layer. Wrote the WebSocket gateway in Go and the Postgres-backed snapshot store. Cut p99 sync latency from 380ms to 42ms across three regions.",
    stack: ["Go", "TypeScript", "Postgres", "WebSockets", "CRDT"],
    href: "#",
    align: "left",
    glyph: "L",
  },
  {
    index: "02",
    title: "Halyard",
    year: "2024",
    blurb:
      "An internal developer platform: previews, environments, and one-command deploys for a team of 60.",
    built:
      "Built the Next.js control plane and the Go controller that reconciles K8s resources. Owned the auth model, RBAC, and the API surface shipped to engineering.",
    stack: ["Next.js", "Go", "Kubernetes", "Terraform"],
    href: "#",
    align: "right",
    glyph: "H",
  },
  {
    index: "03",
    title: "Tessera",
    year: "2023",
    blurb:
      "An event analytics pipeline ingesting 2B events/day with sub-second query response.",
    built:
      "Rewrote the ingestion path in Rust to halve CPU cost. Modeled the ClickHouse schema and the rollup strategy. Built the SQL-flavored query DSL the product team uses today.",
    stack: ["Rust", "Kafka", "ClickHouse", "gRPC"],
    href: "#",
    align: "left",
    glyph: "T",
  },
  {
    index: "04",
    title: "Foundry",
    year: "2022",
    blurb:
      "An open-source CLI for scaffolding TypeScript projects — opinionated, fast, no plugins.",
    built:
      "Wrote the template engine and the interactive prompt layer in Ink. Maintained for two years across 14 releases. Shipped on Bun before it was cool.",
    stack: ["Bun", "Ink", "TypeScript"],
    href: "#",
    align: "right",
    glyph: "F",
  },
];

const list = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12 },
  },
};

export function Work() {
  return (
    <section
      id="work"
      aria-label="Selected work"
      className="relative py-32 md:py-40"
    >
      <div className="container-grid">
        <div className="flex items-baseline justify-between border-b hairline pb-6">
          <h2 className="font-mono text-xs uppercase tracking-[0.3em] text-ink-500 dark:text-ink-400">
            <span className="text-accent">§</span> Selected work
          </h2>
          <p className="font-mono text-xs text-ink-500 dark:text-ink-400">
            {PROJECTS.length.toString().padStart(2, "0")} projects
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
            <ProjectCard key={p.index} project={p} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
