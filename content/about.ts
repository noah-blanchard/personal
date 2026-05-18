import type { Localized } from "./types";

export const BIO: Localized<string[]> = {
  en: [
    "I build the full stack — fast UIs, clean APIs, and the infrastructure that ties them together. I care about correctness, performance, and code that future-me won't hate.",
    "Most of my work happens in TypeScript and Go, with a long tail of whatever the problem actually needs. I've led teams, written RFCs no one read, and shipped systems that quietly keep working.",
    "I prefer small teams, sharp constraints, and problems with real users on the other end.",
  ],
  fr: [
    "Je construis toute la stack — UIs rapides, APIs propres, et l'infrastructure qui les relie. Je tiens à la correction, à la performance, et à du code que mon futur moi ne détestera pas.",
    "L'essentiel de mon travail se fait en TypeScript et en Go, avec une longue traîne de ce que le problème exige vraiment. J'ai dirigé des équipes, écrit des RFCs que personne n'a lus, et livré des systèmes qui continuent silencieusement à fonctionner.",
    "Je préfère les petites équipes, les contraintes nettes, et les problèmes avec de vrais utilisateurs au bout.",
  ],
};

export const HEADLINE: Localized<string> = {
  en: "A senior engineer who actually ships.",
  fr: "Un·e ingénieur·e sénior qui livre vraiment.",
};

export type Fact = { key: string; value: Localized<string> };

// FACTS labels come from messages (about.facts.*); values stay localized here.
export const FACTS: Fact[] = [
  { key: "basedIn", value: { en: "Berlin, DE", fr: "Berlin, Allemagne" } },
  { key: "experience", value: { en: "11 years", fr: "11 ans" } },
  {
    key: "currentStack",
    value: { en: "TypeScript · Go · Postgres", fr: "TypeScript · Go · Postgres" },
  },
  {
    key: "languages",
    value: {
      en: "English · German · French",
      fr: "Anglais · Allemand · Français",
    },
  },
  {
    key: "availability",
    value: { en: "Q3 2026", fr: "T3 2026" },
  },
];

export const CURRENTLY: Localized<string[]> = {
  en: [
    "Reading the Postgres source. The query planner is a small city.",
    "Writing a toy SQL engine in Zig — for fun, mostly to learn.",
    "Mentoring two engineers transitioning into backend roles.",
  ],
  fr: [
    "Lecture des sources de Postgres. Le planificateur de requêtes est une petite ville.",
    "Écriture d'un moteur SQL jouet en Zig — pour le plaisir, surtout pour apprendre.",
    "Mentorat de deux ingénieur·e·s en transition vers le backend.",
  ],
};

export const WHOAMI: Localized<string[]> = {
  en: [
    "senior fullstack engineer · 11y · ts/go/rust",
    "builds: realtime, devtools, data pipelines",
    "not interested in: ad-tech, surveillance, crypto",
  ],
  fr: [
    "ingénieur·e fullstack sénior · 11 ans · ts/go/rust",
    "construit : temps réel, devtools, pipelines de données",
    "pas intéressé·e par : pub-tech, surveillance, crypto",
  ],
};
