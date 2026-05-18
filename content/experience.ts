import type { Localized } from "./types";

export type Lane = "work" | "education" | "internship" | "side";

export const LANE_ORDER: Lane[] = ["work", "education", "internship", "side"];

// Lane display labels — translated UI chrome. Kept here next to LANE_ORDER for cohesion.
export const LANE_META: Record<Lane, { label: Localized<string> }> = {
  work: { label: { en: "WORK", fr: "TRAVAIL" } },
  education: { label: { en: "EDU", fr: "ÉTUDES" } },
  internship: { label: { en: "INT", fr: "STAGE" } },
  side: { label: { en: "SIDE", fr: "PERSO" } },
};

export type Entry = {
  id: string;
  lane: Lane;
  label: string; // company / school name, proper noun → not localized
  role?: Localized<string>;
  start: string; // "YYYY-MM"
  end?: string;
  location?: string; // city name, usually identical across locales
  description?: Localized<string>;
  did?: Localized<string[]>;
  learned?: Localized<string[]>;
  tags?: string[];
  href?: string;
};

// ⭐ Extension point — add / edit experience entries here.
export const ENTRIES: Entry[] = [
  // ── work ────────────────────────────────────────────────────────────
  {
    id: "hooli",
    lane: "work",
    label: "Hooli",
    role: { en: "Staff Engineer", fr: "Ingénieur·e Staff" },
    start: "2025-03",
    location: "Berlin",
    description: {
      en: "Leading the realtime collaboration team. Owns the wire format and the sync gateway across three regions.",
      fr: "Direction de l'équipe collaboration temps réel. Responsable du format réseau et de la passerelle de synchronisation sur trois régions.",
    },
    did: {
      en: [
        "set the technical direction for the realtime stack",
        "led the migration from polling to CRDT-backed live sync",
        "wrote the design doc that aligned 3 product teams on conflict semantics",
        "mentor 2 senior engineers and run weekly architecture reviews",
      ],
      fr: [
        "défini la direction technique de la stack temps réel",
        "piloté la migration du polling vers la synchro live adossée aux CRDTs",
        "rédigé le design doc qui a aligné 3 équipes produit sur la sémantique des conflits",
        "mentore 2 ingénieur·e·s sénior et anime les revues d'architecture hebdomadaires",
      ],
    },
    learned: {
      en: [
        "writing for engineers ≠ writing for VPs; both matter",
        "staff is mostly clearing roadblocks, not writing code",
        "consensus is cheaper to design for than to fix later",
      ],
      fr: [
        "écrire pour des ingénieur·e·s ≠ écrire pour des VPs ; les deux comptent",
        "être staff, c'est surtout dégager les obstacles, pas écrire du code",
        "le consensus se conçoit plus à moindre coût qu'il ne se répare",
      ],
    },
    tags: ["Go", "Postgres", "WebSockets", "CRDT"],
    href: "#work",
  },
  {
    id: "acme",
    lane: "work",
    label: "Acme Corp",
    role: {
      en: "Senior Fullstack → Tech Lead",
      fr: "Fullstack sénior → Tech Lead",
    },
    start: "2021-09",
    end: "2025-02",
    location: "Berlin",
    description: {
      en: "Built Tessera (event analytics pipeline) and Halyard (internal devtools platform). Led a 6-engineer team across two timezones.",
      fr: "Construit Tessera (pipeline d'analytique d'événements) et Halyard (plateforme devtools interne). Direction d'une équipe de 6 ingénieur·e·s sur deux fuseaux.",
    },
    did: {
      en: [
        "rewrote the ingestion path in Rust, halving CPU cost",
        "designed the ClickHouse schema + rollup strategy still in use",
        "built the Go control plane for Halyard, our internal PaaS",
        "interviewed 80+ engineers; defined the fullstack rubric",
      ],
      fr: [
        "réécrit le chemin d'ingestion en Rust, divisant par deux le coût CPU",
        "conçu le schéma ClickHouse + la stratégie de rollups encore en usage",
        "construit le plan de contrôle Go pour Halyard, notre PaaS interne",
        "passé en entretien plus de 80 ingénieur·e·s ; défini la grille fullstack",
      ],
    },
    learned: {
      en: [
        "the right schema buys you years; the wrong one costs you them",
        "code review is the highest-leverage thing a tech lead does",
        "two-timezone teams need written-first culture, not video calls",
      ],
      fr: [
        "le bon schéma t'achète des années ; le mauvais te les coûte",
        "la code review est la chose à plus fort levier qu'un·e tech lead puisse faire",
        "les équipes sur deux fuseaux ont besoin d'une culture de l'écrit, pas de visios",
      ],
    },
    tags: ["TypeScript", "Go", "Rust", "ClickHouse", "K8s"],
    href: "#work",
  },
  {
    id: "piedpiper",
    lane: "work",
    label: "Pied Piper",
    role: { en: "Software Engineer", fr: "Ingénieur·e logiciel" },
    start: "2019-06",
    end: "2021-08",
    location: "Zurich",
    description: {
      en: "Built the data ingestion path that became the company's core revenue engine. Promoted twice in two years.",
      fr: "Construit le chemin d'ingestion de données devenu le moteur de revenus central de l'entreprise. Promu·e deux fois en deux ans.",
    },
    did: {
      en: [
        "owned the Kafka-to-warehouse pipeline end to end",
        "shipped the deduplication layer that unblocked enterprise billing",
        "ran the on-call rotation; cut p1 incidents by 40%",
      ],
      fr: [
        "responsable du pipeline Kafka-vers-entrepôt de bout en bout",
        "livré la couche de déduplication qui a débloqué la facturation entreprise",
        "animé la rotation d'astreinte ; baisse de 40 % des incidents p1",
      ],
    },
    learned: {
      en: [
        "the first system you ship is the one you'll maintain longest",
        "boring tech compounds; novelty rarely does",
        "shadowing customers in their tooling beats reading their tickets",
      ],
      fr: [
        "le premier système livré est celui qu'on maintiendra le plus longtemps",
        "la tech ennuyeuse capitalise ; la nouveauté rarement",
        "observer les clients dans leurs outils vaut mieux que lire leurs tickets",
      ],
    },
    tags: ["Python", "Kafka", "AWS", "Snowflake"],
  },
  {
    id: "startupx",
    lane: "work",
    label: "StartupX",
    role: { en: "Junior Developer", fr: "Développeur·euse junior" },
    start: "2017-08",
    end: "2019-05",
    location: "Bern",
    description: {
      en: "First job. Shipped a customer-facing dashboard in React and learned what production actually means.",
      fr: "Premier poste. Livré un tableau de bord client en React, appris ce que veut dire « la prod ».",
    },
    did: {
      en: [
        "built the analytics dashboard from scratch in React + Node",
        "wrote the company's first end-to-end test suite",
        "kept the legacy PHP admin alive long enough to retire it",
      ],
      fr: [
        "construit le tableau de bord d'analytique de zéro en React + Node",
        "écrit la première suite de tests end-to-end de l'entreprise",
        "maintenu l'admin PHP legacy en vie assez longtemps pour la retirer",
      ],
    },
    learned: {
      en: [
        "every prototype becomes production unless explicitly killed",
        "you don't understand a system until you've been paged by it",
        "the bug is rarely where the stack trace points",
      ],
      fr: [
        "tout prototype devient de la prod sauf si on le tue explicitement",
        "on ne comprend un système qu'après s'être fait réveiller par lui",
        "le bug est rarement là où pointe la stack trace",
      ],
    },
    tags: ["React", "Node.js", "PostgreSQL"],
  },

  // ── education ───────────────────────────────────────────────────────
  {
    id: "msc-eth",
    lane: "education",
    label: "M.Sc. CS",
    role: { en: "ETH Zurich", fr: "ETH Zurich" },
    start: "2018-09",
    end: "2021-06",
    location: "Zurich",
    description: {
      en: "Distributed systems & compilers. Thesis on incremental query evaluation.",
      fr: "Systèmes distribués & compilateurs. Mémoire sur l'évaluation incrémentale de requêtes.",
    },
    did: {
      en: [
        "thesis: an incremental Datalog evaluator with provenance tracking",
        "TA'd Advanced Algorithms for two semesters",
        "co-organized a small reading group on Postgres internals",
      ],
      fr: [
        "mémoire : un évaluateur Datalog incrémental avec suivi de provenance",
        "TP d'Algorithmique avancée pendant deux semestres",
        "co-animation d'un petit groupe de lecture sur les internals de Postgres",
      ],
    },
    learned: {
      en: [
        "why correctness proofs matter at the type level",
        "how to read a paper properly, not just skim one",
        "a thesis is mostly a rewrite of a rewrite of a rewrite",
      ],
      fr: [
        "pourquoi les preuves de correction comptent au niveau des types",
        "comment lire vraiment un article, pas seulement le survoler",
        "un mémoire, c'est surtout une réécriture d'une réécriture d'une réécriture",
      ],
    },
    tags: ["Rust", "Coq", "LaTeX", "Systems"],
  },
  {
    id: "bsc-bern",
    lane: "education",
    label: "B.Sc. CS",
    role: {
      en: "University of Bern",
      fr: "Université de Berne",
    },
    start: "2014-09",
    end: "2017-07",
    location: "Bern",
    description: {
      en: "Read too many compiler papers. Built the wrong tools for the right reasons.",
      fr: "Lu trop d'articles de compilateurs. Construit les mauvais outils pour les bonnes raisons.",
    },
    did: {
      en: [
        "implemented a toy compiler in OCaml for the term project",
        "tutored algorithms & data structures (1st-year students)",
        "ran the student CS club's weekly talks for 4 semesters",
      ],
      fr: [
        "implémenté un compilateur jouet en OCaml pour le projet de fin de semestre",
        "tutorat d'algorithmique et structures de données (étudiant·e·s de 1ère année)",
        "animation des conférences hebdomadaires du club info pendant 4 semestres",
      ],
    },
    learned: {
      en: [
        "the fundamentals you skip in week 2 will haunt year 10",
        "good notation is half the proof",
        "explaining something is the fastest way to find out you don't understand it",
      ],
      fr: [
        "les bases qu'on saute en semaine 2 te hantent dix ans plus tard",
        "une bonne notation, c'est la moitié de la preuve",
        "expliquer quelque chose est le moyen le plus rapide de découvrir qu'on ne le comprend pas",
      ],
    },
    tags: ["OCaml", "Java", "Theory", "Algorithms"],
  },

  // ── internships ─────────────────────────────────────────────────────
  {
    id: "intern-pp",
    lane: "internship",
    label: "Pied Piper",
    role: { en: "Summer Intern", fr: "Stagiaire d'été" },
    start: "2020-06",
    end: "2020-08",
    location: "Zurich",
    description: {
      en: "Three months prototyping the search relevance pipeline. Returned full-time the next year.",
      fr: "Trois mois à prototyper le pipeline de pertinence de recherche. Retour à plein temps l'année suivante.",
    },
    did: {
      en: [
        "prototyped a learning-to-rank pass for product search",
        "wrote the offline evaluation harness still used today",
      ],
      fr: [
        "prototypé une passe d'apprentissage de classement pour la recherche produit",
        "écrit le harnais d'évaluation hors-ligne toujours utilisé aujourd'hui",
      ],
    },
    learned: {
      en: [
        "an internship is mostly an interview that pays you",
        "shipping a small thing well beats shipping a big thing late",
      ],
      fr: [
        "un stage, c'est surtout un entretien qui te paie",
        "livrer petit et bien vaut mieux que livrer gros et en retard",
      ],
    },
    tags: ["Go", "Elasticsearch", "Python"],
  },
  {
    id: "intern-ibm",
    lane: "internship",
    label: "IBM Research",
    role: { en: "Research Intern", fr: "Stagiaire recherche" },
    start: "2016-06",
    end: "2016-09",
    location: "Zurich",
    description: {
      en: "Worked on static analysis for COBOL modernization. The legacy code outlived us all.",
      fr: "Analyse statique pour la modernisation COBOL. Le code legacy nous aura tous survécus.",
    },
    did: {
      en: [
        "built an AST visitor that flagged risky COBOL constructs",
        "co-authored an internal report that fed two follow-up projects",
      ],
      fr: [
        "construit un visiteur d'AST signalant les constructions COBOL à risque",
        "co-rédigé un rapport interne qui a alimenté deux projets suivants",
      ],
    },
    learned: {
      en: [
        "legacy code is often legacy because it works",
        "real research labs run on coffee and patience, not magic",
      ],
      fr: [
        "le code legacy est souvent legacy parce qu'il fonctionne",
        "les vrais labos de recherche tournent au café et à la patience, pas à la magie",
      ],
    },
    tags: ["Static analysis", "COBOL", "Java"],
  },

  // ── side ────────────────────────────────────────────────────────────
  {
    id: "lumen",
    lane: "side",
    label: "Lumen",
    start: "2024-08",
    description: {
      en: "Realtime collaboration engine — CRDTs, WebSockets, Postgres. Cut p99 sync latency from 380ms to 42ms.",
      fr: "Moteur de collaboration temps réel — CRDTs, WebSockets, Postgres. Latence p99 de sync ramenée de 380ms à 42ms.",
    },
    did: {
      en: [
        "designed the wire format and the CRDT layer from scratch",
        "wrote the WebSocket gateway in Go and the snapshot store in Postgres",
        "open-sourced the client SDK; small but real adoption",
      ],
      fr: [
        "conçu le format réseau et la couche CRDT depuis zéro",
        "écrit la passerelle WebSocket en Go et le store de snapshots en Postgres",
        "ouvert le SDK client en open source ; adoption modeste mais réelle",
      ],
    },
    learned: {
      en: [
        "operational simplicity beats theoretical elegance every time",
        "good benchmarks lie loudly; profilers lie quietly",
      ],
      fr: [
        "la simplicité d'exploitation bat toujours l'élégance théorique",
        "les bons benchmarks mentent fort ; les profilers mentent doucement",
      ],
    },
    tags: ["Go", "TypeScript", "CRDT", "Postgres"],
    href: "#work",
  },
  {
    id: "halyard",
    lane: "side",
    label: "Halyard",
    start: "2023-01",
    description: {
      en: "Internal developer platform: previews, environments, one-command deploys for a team of 60.",
      fr: "Plateforme de développement interne : previews, environnements, déploiements en une commande pour une équipe de 60.",
    },
    did: {
      en: [
        "wrote the Go controller that reconciles K8s previews against PRs",
        "built the Next.js dashboard engineers use daily",
        "designed the RBAC model used across all internal tools",
      ],
      fr: [
        "écrit le contrôleur Go qui réconcilie les previews K8s avec les PRs",
        "construit le tableau de bord Next.js qu'utilisent les ingénieur·e·s au quotidien",
        "conçu le modèle RBAC utilisé sur tous les outils internes",
      ],
    },
    learned: {
      en: [
        "internal tools are products too — adoption matters",
        "the best abstraction is the one you almost didn't write",
      ],
      fr: [
        "les outils internes sont aussi des produits — l'adoption compte",
        "la meilleure abstraction est celle qu'on a failli ne pas écrire",
      ],
    },
    tags: ["Next.js", "Go", "K8s", "Terraform"],
    href: "#work",
  },
  {
    id: "tessera",
    lane: "side",
    label: "Tessera",
    start: "2022-03",
    end: "2023-05",
    description: {
      en: "Event analytics pipeline ingesting 2B events/day with sub-second query response.",
      fr: "Pipeline d'analytique d'événements ingérant 2 milliards d'événements/jour avec des requêtes sous la seconde.",
    },
    did: {
      en: [
        "modeled the ClickHouse schema + materialized-view rollup strategy",
        "designed the SQL-flavored query DSL the product team still uses",
        "wrote the kafka-to-clickhouse ingest in Rust",
      ],
      fr: [
        "modélisé le schéma ClickHouse + la stratégie de rollups en vues matérialisées",
        "conçu le DSL de requête type SQL toujours utilisé par l'équipe produit",
        "écrit l'ingest kafka-vers-clickhouse en Rust",
      ],
    },
    learned: {
      en: [
        "rollups are a hot potato — get them right early",
        "operators want one query language, not a layered DSL stack",
      ],
      fr: [
        "les rollups sont une patate chaude — il faut les caler tôt",
        "les opérateur·rice·s veulent un seul langage de requête, pas une pile de DSLs",
      ],
    },
    tags: ["Rust", "Kafka", "ClickHouse"],
    href: "#work",
  },
  {
    id: "foundry",
    lane: "side",
    label: "Foundry",
    start: "2020-11",
    end: "2022-07",
    description: {
      en: "Open-source CLI for scaffolding TypeScript projects. Two years, 14 releases.",
      fr: "CLI open source pour échafauder des projets TypeScript. Deux ans, 14 versions.",
    },
    did: {
      en: [
        "designed the template engine and interactive prompt layer in Ink",
        "shipped 14 releases over 2 years; hand-maintained the changelog",
        "triaged ~120 issues from the community; merged ~40 PRs",
      ],
      fr: [
        "conçu le moteur de templates et la couche de prompts interactifs en Ink",
        "livré 14 versions sur 2 ans ; tenu à la main le changelog",
        "trié ~120 issues de la communauté ; mergé ~40 PRs",
      ],
    },
    learned: {
      en: [
        "maintaining OSS is a slow gardening, not a sprint",
        "a CLI is a UI — error messages are the product",
      ],
      fr: [
        "maintenir un projet open source, c'est du jardinage lent, pas un sprint",
        "un CLI, c'est une UI — les messages d'erreur sont le produit",
      ],
    },
    tags: ["Bun", "Ink", "TypeScript", "OSS"],
    href: "#work",
  },
];
