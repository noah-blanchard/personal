import type { Localized } from "./types";

export type TechGroup = {
  id: string;
  title: Localized<string>;
  items: string[]; // tech names, not localized
};

export const TECH_GROUPS: TechGroup[] = [
  {
    id: "frontend",
    title: { en: "Frontend", fr: "Frontend" },
    items: ["TypeScript", "React", "Next.js", "Tailwind", "Framer Motion", "Svelte"],
  },
  {
    id: "backend",
    title: { en: "Backend", fr: "Backend" },
    items: ["Go", "Node.js", "Rust", "Postgres", "Redis", "ClickHouse", "gRPC"],
  },
  {
    id: "infra",
    title: { en: "Infra", fr: "Infrastructure" },
    items: ["Kubernetes", "Terraform", "AWS", "Cloudflare", "Docker", "GitHub Actions"],
  },
  {
    id: "tooling",
    title: { en: "Tooling", fr: "Outillage" },
    items: ["Neovim", "Tmux", "pnpm", "Bun", "OpenTelemetry", "Datadog"],
  },
];
