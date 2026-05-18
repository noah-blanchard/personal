import type { Localized } from "./types";

export type Project = {
  id: string;
  index: string; // "01", "02", ...
  title: string; // proper noun, not localized
  year: string;
  blurb: Localized<string>;
  built: Localized<string>;
  stack: string[]; // tech names, not localized
  href: string;
  align: "left" | "right";
  glyph: string; // ASCII mark in the visual layer
};

export const PROJECTS: Project[] = [
  {
    id: "lumen",
    index: "01",
    title: "Lumen",
    year: "2025",
    blurb: {
      en: "A realtime collaboration engine for design tools — CRDTs, presence, and conflict-free history.",
      fr: "Un moteur de collaboration temps réel pour outils de design — CRDTs, présence, et historique sans conflit.",
    },
    built: {
      en: "Designed the wire format and the CRDT layer. Wrote the WebSocket gateway in Go and the Postgres-backed snapshot store. Cut p99 sync latency from 380ms to 42ms across three regions.",
      fr: "Conception du format réseau et de la couche CRDT. Écriture de la passerelle WebSocket en Go et du store de snapshots adossé à Postgres. Réduction de la latence p99 de synchronisation de 380ms à 42ms sur trois régions.",
    },
    stack: ["Go", "TypeScript", "Postgres", "WebSockets", "CRDT"],
    href: "#",
    align: "left",
    glyph: "L",
  },
  {
    id: "halyard",
    index: "02",
    title: "Halyard",
    year: "2024",
    blurb: {
      en: "An internal developer platform: previews, environments, and one-command deploys for a team of 60.",
      fr: "Une plateforme de développement interne : previews, environnements, et déploiements en une commande pour une équipe de 60 personnes.",
    },
    built: {
      en: "Built the Next.js control plane and the Go controller that reconciles K8s resources. Owned the auth model, RBAC, and the API surface shipped to engineering.",
      fr: "Construit le plan de contrôle Next.js et le contrôleur Go qui réconcilie les ressources K8s. Responsable du modèle d'auth, du RBAC, et de l'API livrée à l'ingénierie.",
    },
    stack: ["Next.js", "Go", "Kubernetes", "Terraform"],
    href: "#",
    align: "right",
    glyph: "H",
  },
  {
    id: "tessera",
    index: "03",
    title: "Tessera",
    year: "2023",
    blurb: {
      en: "An event analytics pipeline ingesting 2B events/day with sub-second query response.",
      fr: "Un pipeline d'analytique d'événements ingérant 2 milliards d'événements/jour avec des requêtes sous la seconde.",
    },
    built: {
      en: "Rewrote the ingestion path in Rust to halve CPU cost. Modeled the ClickHouse schema and the rollup strategy. Built the SQL-flavored query DSL the product team uses today.",
      fr: "Réécriture du chemin d'ingestion en Rust pour diviser par deux le coût CPU. Modélisation du schéma ClickHouse et de la stratégie de rollups. Construction du DSL de requête type SQL qu'utilise aujourd'hui l'équipe produit.",
    },
    stack: ["Rust", "Kafka", "ClickHouse", "gRPC"],
    href: "#",
    align: "left",
    glyph: "T",
  },
  {
    id: "foundry",
    index: "04",
    title: "Foundry",
    year: "2022",
    blurb: {
      en: "An open-source CLI for scaffolding TypeScript projects — opinionated, fast, no plugins.",
      fr: "Un CLI open-source pour échafauder des projets TypeScript — opinionné, rapide, sans plugins.",
    },
    built: {
      en: "Wrote the template engine and the interactive prompt layer in Ink. Maintained for two years across 14 releases. Shipped on Bun before it was cool.",
      fr: "Écriture du moteur de templates et de la couche de prompts interactifs en Ink. Maintenu pendant deux ans sur 14 versions. Livré sur Bun avant que ce ne soit cool.",
    },
    stack: ["Bun", "Ink", "TypeScript"],
    href: "#",
    align: "right",
    glyph: "F",
  },
];
