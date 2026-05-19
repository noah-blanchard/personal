import type { ReactNode } from "react";
import type { Locale, Localized } from "@/content/types";

export type CommandOutput = string | string[] | ReactNode;

export type TerminalT = (key: string, params?: Record<string, string | number>) => string;

export type CommandCtx = {
  print: (line: CommandOutput) => void;
  clear: () => void;
  setTheme: (t: "light" | "dark") => void;
  setLocale: (l: Locale) => void;
  open: (url: string) => void;
  copy: (text: string) => Promise<boolean>;
  toast: (msg: string) => void;
  history: readonly string[];
  commands: readonly Command[];
  locale: Locale;
  t: TerminalT;
  navigateToRoute: (path: string) => void;
};

export type Command = {
  name: string;
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
