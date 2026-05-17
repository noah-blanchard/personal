import type { Entry } from "./types";

// ⭐ Extension point — add or edit experience entries here.
// Dates are "YYYY-MM". Omit `end` for ongoing.
export const ENTRIES: Entry[] = [
  // ── work ────────────────────────────────────────────────────────────
  {
    id: "hooli",
    lane: "work",
    label: "Hooli",
    role: "Staff Engineer",
    start: "2025-03",
    location: "Berlin",
    description:
      "Leading the realtime collaboration team. Owns the wire format and the sync gateway across three regions.",
    tags: ["Go", "Postgres", "WebSockets", "CRDT"],
    href: "#work",
  },
  {
    id: "acme",
    lane: "work",
    label: "Acme Corp",
    role: "Senior Fullstack → Tech Lead",
    start: "2021-09",
    end: "2025-02",
    location: "Berlin",
    description:
      "Built Tessera (event analytics pipeline) and Halyard (internal devtools platform). Led a 6-engineer team across two timezones.",
    tags: ["TypeScript", "Go", "Rust", "ClickHouse"],
    href: "#work",
  },
  {
    id: "piedpiper",
    lane: "work",
    label: "Pied Piper",
    role: "Software Engineer",
    start: "2019-06",
    end: "2021-08",
    location: "Zurich",
    description:
      "Built the data ingestion path that became the company's core revenue engine. Promoted twice in two years.",
    tags: ["Python", "Kafka", "AWS"],
  },
  {
    id: "startupx",
    lane: "work",
    label: "StartupX",
    role: "Junior Developer",
    start: "2017-08",
    end: "2019-05",
    location: "Bern",
    description:
      "First job. Shipped a customer-facing dashboard in React and learned what production actually means.",
    tags: ["React", "Node.js"],
  },

  // ── education ───────────────────────────────────────────────────────
  {
    id: "msc-eth",
    lane: "education",
    label: "M.Sc. CS",
    role: "ETH Zurich",
    start: "2018-09",
    end: "2021-06",
    location: "Zurich",
    description:
      "Focus on distributed systems and compilers. Thesis on incremental query evaluation.",
    tags: ["Systems", "Compilers"],
  },
  {
    id: "bsc-bern",
    lane: "education",
    label: "B.Sc. CS",
    role: "University of Bern",
    start: "2014-09",
    end: "2017-07",
    location: "Bern",
    description:
      "Read too many compiler papers. Built the wrong tools for the right reasons.",
    tags: ["Theory", "Algorithms"],
  },

  // ── internships ─────────────────────────────────────────────────────
  {
    id: "intern-pp",
    lane: "internship",
    label: "Pied Piper",
    role: "Summer Intern",
    start: "2020-06",
    end: "2020-08",
    location: "Zurich",
    description:
      "Three months prototyping the search relevance pipeline. Returned full-time the next year.",
    tags: ["Go", "Elasticsearch"],
  },
  {
    id: "intern-ibm",
    lane: "internship",
    label: "IBM Research",
    role: "Research Intern",
    start: "2016-06",
    end: "2016-09",
    location: "Zurich",
    description:
      "Worked on static analysis for COBOL modernization. The legacy code outlived us all.",
    tags: ["Static analysis", "COBOL"],
  },

  // ── side ────────────────────────────────────────────────────────────
  {
    id: "lumen",
    lane: "side",
    label: "Lumen",
    start: "2024-08",
    description:
      "Realtime collaboration engine — CRDTs, WebSockets, Postgres. Cut p99 sync latency from 380ms to 42ms.",
    tags: ["Go", "TypeScript", "CRDT"],
    href: "#work",
  },
  {
    id: "halyard",
    lane: "side",
    label: "Halyard",
    start: "2023-01",
    description:
      "Internal developer platform: previews, environments, one-command deploys for a team of 60.",
    tags: ["Next.js", "Go", "K8s"],
    href: "#work",
  },
  {
    id: "tessera",
    lane: "side",
    label: "Tessera",
    start: "2022-03",
    end: "2023-05",
    description:
      "Event analytics pipeline ingesting 2B events/day with sub-second query response.",
    tags: ["Rust", "Kafka", "ClickHouse"],
    href: "#work",
  },
  {
    id: "foundry",
    lane: "side",
    label: "Foundry",
    start: "2020-11",
    end: "2022-07",
    description:
      "Open-source CLI for scaffolding TypeScript projects. Two years, 14 releases.",
    tags: ["Bun", "Ink", "OSS"],
    href: "#work",
  },
];
