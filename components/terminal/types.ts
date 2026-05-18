import type { ReactNode } from "react";
import type { Locale, Localized } from "@/content/types";

export type CommandOutput = string | string[] | ReactNode;

export type SectionId = "top" | "work" | "about" | "experience" | "tech" | "contact";

/**
 * Translate a key under the `terminal` namespace.
 * Mirrors `useTranslations("terminal")` from next-intl, but typed as a plain
 * function so commands stay framework-agnostic.
 */
export type TerminalT = (key: string, params?: Record<string, string | number>) => string;

export type CommandCtx = {
  print: (line: CommandOutput) => void;
  clear: () => void;
  navigate: (id: SectionId) => void;
  setTheme: (t: "light" | "dark") => void;
  setLocale: (l: Locale) => void;
  open: (url: string) => void;
  copy: (text: string) => Promise<boolean>;
  toast: (msg: string) => void;
  history: readonly string[];
  commands: readonly Command[];
  features: { fortune: boolean };
  locale: Locale;
  /** Translate a key under the `terminal` namespace. */
  t: TerminalT;
};

export type Command = {
  /** Canonical command name. Stays in English for muscle memory. */
  name: string;
  /** Short description, shown in `help` and the palette. Localizable. */
  description: Localized<string>;
  aliases?: string[];
  usage?: string;
  hidden?: boolean;
  run: (ctx: CommandCtx, args: string[]) => void | Promise<void>;
};

export type OutputKind = "echo" | "out" | "err" | "info";

export type OutputLine = {
  id: string;
  kind: OutputKind;
  content: CommandOutput;
};
