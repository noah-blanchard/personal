import type { Localized } from "./types";

export const SITE = {
  // Brand / identity — proper nouns mostly don't translate
  name: "Kai Renner",
  initials: "kr",
  email: "hello@kairenner.dev",
  url: "https://kairenner.dev",
  twitter: "@kairenner",

  // Short tagline used in metadata + OG
  roleShort: {
    en: "Senior Fullstack Engineer",
    fr: "Ingénieur·e fullstack sénior",
  } satisfies Localized<string>,

  // Long description used as meta description
  description: {
    en: "I build the full stack — fast UIs, clean APIs, and the infrastructure that ties them together.",
    fr: "Je construis toute la stack — UIs rapides, APIs propres, et l'infrastructure qui les relie.",
  } satisfies Localized<string>,

  // City, used in several places
  location: {
    en: "Berlin",
    fr: "Berlin",
  } satisfies Localized<string>,

  timezone: "UTC+1",
} as const;

export const SOCIALS: { id: "gh" | "li" | "x"; label: string; href: string }[] = [
  { id: "gh", label: "GitHub", href: "#" },
  { id: "li", label: "LinkedIn", href: "#" },
  { id: "x", label: "Twitter / X", href: "#" },
];
