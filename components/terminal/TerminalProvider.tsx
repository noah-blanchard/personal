"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
  type ReactNode,
} from "react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { COMMANDS } from "./commands";
import { parse } from "./parse";
import type { CommandCtx, CommandOutput, OutputLine, TerminalT } from "./types";
import type { Locale } from "@/content/types";

type ToastFn = (msg: string) => void;

type TerminalCtxValue = {
  lines: OutputLine[];
  history: string[];
  execute: (input: string) => Promise<void>;
  clear: () => void;
  appendLine: (kind: OutputLine["kind"], content: CommandOutput) => void;
  reset: () => void;
  commands: typeof COMMANDS;
};

const TerminalCtx = createContext<TerminalCtxValue | null>(null);

let lineCounter = 0;
const nextId = () => `l${++lineCounter}_${Date.now().toString(36)}`;

export function TerminalProvider({
  children,
  toast,
}: {
  children: ReactNode;
  toast: ToastFn;
}) {
  const [lines, setLines] = useState<OutputLine[]>([]);
  const [history, setHistory] = useState<string[]>([]);

  const locale = useLocale() as Locale;
  const rawT = useTranslations("terminal");
  const router = useRouter();
  const pathname = usePathname();
  const [, startTransition] = useTransition();

  const t: TerminalT = useCallback(
    (key, params) => rawT(key, params as Parameters<typeof rawT>[1]),
    [rawT]
  );

  const appendLine = useCallback((kind: OutputLine["kind"], content: CommandOutput) => {
    setLines((prev) => [...prev, { id: nextId(), kind, content }]);
  }, []);

  const clear = useCallback(() => setLines([]), []);
  const reset = useCallback(() => {
    setLines([]);
    setHistory([]);
  }, []);

  const historyRef = useRef(history);
  const localeRef = useRef(locale);
  useEffect(() => { historyRef.current = history; }, [history]);
  useEffect(() => { localeRef.current = locale; }, [locale]);

  const setLocale = useCallback(
    (next: Locale) => {
      if (next === localeRef.current) return;
      try { localStorage.setItem("locale", next); } catch { /* */ }
      startTransition(() => {
        router.replace(pathname, { locale: next });
      });
    },
    [router, pathname]
  );

  const execute = useCallback(
    async (input: string) => {
      const trimmed = input.trim();
      appendLine("echo", trimmed);
      if (!trimmed) return;
      setHistory((prev) => [...prev, trimmed]);

      const { name, args } = parse(trimmed);
      const cmd = COMMANDS.find((c) => c.name === name || c.aliases?.includes(name));

      if (!cmd) {
        appendLine("err", t("errors.notFound", { name }));
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
        setTheme: (theme) => {
          document.documentElement.classList.toggle("dark", theme === "dark");
          try {
            localStorage.setItem("theme", theme);
            document.cookie = `theme=${theme};path=/;max-age=31536000;SameSite=Strict`;
          } catch { /* */ }
        },
        setLocale,
        open: (url) => {
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
        locale: localeRef.current,
        t,
        navigateToRoute: (path: string) => {
          startTransition(() => {
            router.push(path as "/");
          });
        },
      };

      try {
        await cmd.run(ctx, args);
      } catch (err) {
        appendLine("err", `error: ${err instanceof Error ? err.message : String(err)}`);
      }
    },
    [appendLine, clear, toast, t, setLocale]
  );

  const value = useMemo<TerminalCtxValue>(
    () => ({ lines, history, execute, clear, appendLine, reset, commands: COMMANDS }),
    [lines, history, execute, clear, appendLine, reset]
  );

  return <TerminalCtx.Provider value={value}>{children}</TerminalCtx.Provider>;
}

export function useTerminal() {
  const ctx = useContext(TerminalCtx);
  if (!ctx) throw new Error("useTerminal must be used inside <TerminalProvider>");
  return ctx;
}
