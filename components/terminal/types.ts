import type { ReactNode } from "react";

export type CommandOutput = string | string[] | ReactNode;

export type SectionId = "top" | "work" | "about" | "experience" | "tech" | "contact";

export type CommandCtx = {
  print: (line: CommandOutput) => void;
  clear: () => void;
  navigate: (id: SectionId) => void;
  setTheme: (t: "light" | "dark") => void;
  open: (url: string) => void;
  copy: (text: string) => Promise<boolean>;
  toast: (msg: string) => void;
  history: readonly string[];
  commands: readonly Command[];
  features: { fortune: boolean };
};

export type Command = {
  name: string;
  description: string;
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
