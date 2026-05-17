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
    did: [
      "set the technical direction for the realtime stack",
      "led the migration from polling to CRDT-backed live sync",
      "wrote the design doc that aligned 3 product teams on conflict semantics",
      "mentor 2 senior engineers and run weekly architecture reviews",
    ],
    learned: [
      "writing for engineers ≠ writing for VPs; both matter",
      "staff is mostly clearing roadblocks, not writing code",
      "consensus is cheaper to design for than to fix later",
    ],
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
    did: [
      "rewrote the ingestion path in Rust, halving CPU cost",
      "designed the ClickHouse schema + rollup strategy still in use",
      "built the Go control plane for Halyard, our internal PaaS",
      "interviewed 80+ engineers; defined the fullstack rubric",
    ],
    learned: [
      "the right schema buys you years; the wrong one costs you them",
      "code review is the highest-leverage thing a tech lead does",
      "two-timezone teams need written-first culture, not video calls",
    ],
    tags: ["TypeScript", "Go", "Rust", "ClickHouse", "K8s"],
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
    did: [
      "owned the Kafka-to-warehouse pipeline end to end",
      "shipped the deduplication layer that unblocked enterprise billing",
      "ran the on-call rotation; cut p1 incidents by 40%",
    ],
    learned: [
      "the first system you ship is the one you'll maintain longest",
      "boring tech compounds; novelty rarely does",
      "shadowing customers in their tooling beats reading their tickets",
    ],
    tags: ["Python", "Kafka", "AWS", "Snowflake"],
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
    did: [
      "built the analytics dashboard from scratch in React + Node",
      "wrote the company's first end-to-end test suite",
      "kept the legacy PHP admin alive long enough to retire it",
    ],
    learned: [
      "every prototype becomes production unless explicitly killed",
      "you don't understand a system until you've been paged by it",
      "the bug is rarely where the stack trace points",
    ],
    tags: ["React", "Node.js", "PostgreSQL"],
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
      "Distributed systems & compilers. Thesis on incremental query evaluation.",
    did: [
      "thesis: an incremental Datalog evaluator with provenance tracking",
      "TA'd Advanced Algorithms for two semesters",
      "co-organized a small reading group on Postgres internals",
    ],
    learned: [
      "why correctness proofs matter at the type level",
      "how to read a paper properly, not just skim one",
      "a thesis is mostly a rewrite of a rewrite of a rewrite",
    ],
    tags: ["Rust", "Coq", "LaTeX", "Systems"],
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
    did: [
      "implemented a toy compiler in OCaml for the term project",
      "tutored algorithms & data structures (1st-year students)",
      "ran the student CS club's weekly talks for 4 semesters",
    ],
    learned: [
      "the fundamentals you skip in week 2 will haunt year 10",
      "good notation is half the proof",
      "explaining something is the fastest way to find out you don't understand it",
    ],
    tags: ["OCaml", "Java", "Theory", "Algorithms"],
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
    did: [
      "prototyped a learning-to-rank pass for product search",
      "wrote the offline evaluation harness still used today",
    ],
    learned: [
      "an internship is mostly an interview that pays you",
      "shipping a small thing well beats shipping a big thing late",
    ],
    tags: ["Go", "Elasticsearch", "Python"],
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
    did: [
      "built an AST visitor that flagged risky COBOL constructs",
      "co-authored an internal report that fed two follow-up projects",
    ],
    learned: [
      "legacy code is often legacy because it works",
      "real research labs run on coffee and patience, not magic",
    ],
    tags: ["Static analysis", "COBOL", "Java"],
  },

  // ── side ────────────────────────────────────────────────────────────
  {
    id: "lumen",
    lane: "side",
    label: "Lumen",
    start: "2024-08",
    description:
      "Realtime collaboration engine — CRDTs, WebSockets, Postgres. Cut p99 sync latency from 380ms to 42ms.",
    did: [
      "designed the wire format and the CRDT layer from scratch",
      "wrote the WebSocket gateway in Go and the snapshot store in Postgres",
      "open-sourced the client SDK; small but real adoption",
    ],
    learned: [
      "operational simplicity beats theoretical elegance every time",
      "good benchmarks lie loudly; profilers lie quietly",
    ],
    tags: ["Go", "TypeScript", "CRDT", "Postgres"],
    href: "#work",
  },
  {
    id: "halyard",
    lane: "side",
    label: "Halyard",
    start: "2023-01",
    description:
      "Internal developer platform: previews, environments, one-command deploys for a team of 60.",
    did: [
      "wrote the Go controller that reconciles K8s previews against PRs",
      "built the Next.js dashboard engineers use daily",
      "designed the RBAC model used across all internal tools",
    ],
    learned: [
      "internal tools are products too — adoption matters",
      "the best abstraction is the one you almost didn't write",
    ],
    tags: ["Next.js", "Go", "K8s", "Terraform"],
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
    did: [
      "modeled the ClickHouse schema + materialized-view rollup strategy",
      "designed the SQL-flavored query DSL the product team still uses",
      "wrote the kafka-to-clickhouse ingest in Rust",
    ],
    learned: [
      "rollups are a hot potato — get them right early",
      "operators want one query language, not a layered DSL stack",
    ],
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
    did: [
      "designed the template engine and interactive prompt layer in Ink",
      "shipped 14 releases over 2 years; hand-maintained the changelog",
      "triaged ~120 issues from the community; merged ~40 PRs",
    ],
    learned: [
      "maintaining OSS is a slow gardening, not a sprint",
      "a CLI is a UI — error messages are the product",
    ],
    tags: ["Bun", "Ink", "TypeScript", "OSS"],
    href: "#work",
  },
];
