import type { Localized } from "./types";

export const HERO = {
  // The name shown in the scramble effect,  proper noun, no FR variant
  scrambleName: "Noah Blanchard",

  // The terminal that introduces Kai pre-populates with `whoami`; this is just
  // the visible role line on the left column.
  roleLine: {
    en: "Fullstack Software Developer.",
    fr: "Développeur logiciel Fullstack.",
  } satisfies Localized<string>,

  // Path to the CV file (locale-agnostic placeholder for now)
  cvHref: "/cv.txt",
} as const;
