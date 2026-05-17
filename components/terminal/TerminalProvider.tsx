"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { COMMANDS } from "./commands";
import { parse } from "./parse";
import type { CommandCtx, CommandOutput, OutputLine, SectionId } from "./types";

const STORAGE_LINES = "term:lines";
const STORAGE_HISTORY = "term:history";
const STORAGE_FEATURES = "term:features";
const MAX_PERSIST_LINES = 500;

type Features = { fortune: boolean };

type ToastFn = (msg: string) => void;

type TerminalCtxValue = {
  lines: OutputLine[];
  history: string[];
  features: Features;
  execute: (input: string) => Promise<void>;
  clear: () => void;
  appendLine: (kind: OutputLine["kind"], content: CommandOutput) => void;
  reset: () => void;
  unlock: (feature: keyof Features) => void;
  commands: typeof COMMANDS;
};

const TerminalCtx = createContext<TerminalCtxValue | null>(null);

let lineCounter = 0;
const nextId = () => `l${++lineCounter}_${Date.now().toString(36)}`;

// Serializable lines only (strings / string[]); ReactNode outputs are intentionally
// not persisted. Commands that emit ReactNode are interactive and re-runnable.
function serializableLines(lines: OutputLine[]): OutputLine[] {
  return lines
    .filter((l) => typeof l.content === "string" || Array.isArray(l.content))
    .slice(-MAX_PERSIST_LINES);
}

function loadJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function TerminalProvider({
  children,
  toast,
}: {
  children: ReactNode;
  toast: ToastFn;
}) {
  const [lines, setLines] = useState<OutputLine[]>([]);
  const [history, setHistory] = useState<string[]>([]);
  const [features, setFeatures] = useState<Features>({ fortune: false });
  const hydrated = useRef(false);

  // Hydrate from localStorage post-mount (avoids SSR mismatch).
  useEffect(() => {
    const persistedLines = loadJSON<OutputLine[]>(STORAGE_LINES, []);
    const persistedHistory = loadJSON<string[]>(STORAGE_HISTORY, []);
    const persistedFeatures = loadJSON<Features>(STORAGE_FEATURES, { fortune: false });
    setLines(persistedLines);
    setHistory(persistedHistory);
    setFeatures(persistedFeatures);
    hydrated.current = true;
  }, []);

  // Persist
  useEffect(() => {
    if (!hydrated.current) return;
    try {
      localStorage.setItem(STORAGE_LINES, JSON.stringify(serializableLines(lines)));
    } catch { /* quota */ }
  }, [lines]);

  useEffect(() => {
    if (!hydrated.current) return;
    try {
      localStorage.setItem(STORAGE_HISTORY, JSON.stringify(history.slice(-200)));
    } catch { /* quota */ }
  }, [history]);

  useEffect(() => {
    if (!hydrated.current) return;
    try {
      localStorage.setItem(STORAGE_FEATURES, JSON.stringify(features));
    } catch { /* quota */ }
  }, [features]);

  const appendLine = useCallback((kind: OutputLine["kind"], content: CommandOutput) => {
    setLines((prev) => [...prev, { id: nextId(), kind, content }]);
  }, []);

  const clear = useCallback(() => {
    setLines([]);
  }, []);

  const reset = useCallback(() => {
    setLines([]);
    setHistory([]);
  }, []);

  const unlock = useCallback((feature: keyof Features) => {
    setFeatures((prev) => ({ ...prev, [feature]: true }));
  }, []);

  // Keep refs to current history/features so execute()'s ctx sees fresh values
  // mid-run without re-creating the function on every change.
  const historyRef = useRef(history);
  const featuresRef = useRef(features);
  useEffect(() => { historyRef.current = history; }, [history]);
  useEffect(() => { featuresRef.current = features; }, [features]);

  const execute = useCallback(
    async (input: string) => {
      const trimmed = input.trim();
      // Echo the prompt+input regardless
      appendLine("echo", trimmed);
      if (!trimmed) return;
      setHistory((prev) => [...prev, trimmed]);

      const { name, args } = parse(trimmed);
      const cmd = COMMANDS.find(
        (c) => c.name === name || c.aliases?.includes(name)
      );

      if (!cmd) {
        appendLine("err", `command not found: ${name}. type \`help\`.`);
        return;
      }

      const ctx: CommandCtx = {
        print: (line) => {
          if (Array.isArray(line)) {
            for (const l of line) appendLine("out", l);
          } else {
            appendLine("out", line);
          }
        },
        clear,
        navigate: (id: SectionId) => {
          if (typeof document === "undefined") return;
          if (id === "top") {
            window.scrollTo({ top: 0, behavior: "smooth" });
            return;
          }
          const el = document.getElementById(id);
          el?.scrollIntoView({ behavior: "smooth", block: "start" });
        },
        setTheme: (t) => {
          document.documentElement.classList.toggle("dark", t === "dark");
          try { localStorage.setItem("theme", t); } catch { /* */ }
        },
        open: (url) => {
          if (url.startsWith("#")) {
            const id = url.slice(1);
            const el = document.getElementById(id);
            if (el) {
              el.scrollIntoView({ behavior: "smooth", block: "start" });
              return;
            }
          }
          window.open(url, url.startsWith("http") ? "_blank" : "_self", "noopener,noreferrer");
        },
        copy: async (text) => {
          try {
            await navigator.clipboard.writeText(text);
            return true;
          } catch {
            return false;
          }
        },
        toast,
        history: historyRef.current,
        commands: COMMANDS,
        features: featuresRef.current,
      };

      try {
        await cmd.run(ctx, args);
      } catch (err) {
        appendLine("err", `error: ${err instanceof Error ? err.message : String(err)}`);
      }
    },
    [appendLine, clear, toast]
  );

  const value = useMemo<TerminalCtxValue>(
    () => ({
      lines,
      history,
      features,
      execute,
      clear,
      appendLine,
      reset,
      unlock,
      commands: COMMANDS,
    }),
    [lines, history, features, execute, clear, appendLine, reset, unlock]
  );

  return <TerminalCtx.Provider value={value}>{children}</TerminalCtx.Provider>;
}

export function useTerminal() {
  const ctx = useContext(TerminalCtx);
  if (!ctx) throw new Error("useTerminal must be used inside <TerminalProvider>");
  return ctx;
}
