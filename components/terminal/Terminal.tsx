"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useTerminal } from "./TerminalProvider";
import type { OutputLine } from "./types";

type Props = {
  title?: string;
  /** Lines printed before any user interaction; only shown if persisted scrollback is empty. */
  greeting?: ReactNode[];
  /** Command auto-run on first ever mount (e.g. "whoami"). Only if persisted scrollback is empty. */
  bootCommand?: string;
  /** Max height of the scrollback area. */
  maxHeightClass?: string;
  className?: string;
};

export function Terminal({
  title = "kai@berlin: ~/",
  greeting = ["kai-os 1.0.0 — type `help` for commands"],
  bootCommand = "whoami",
  maxHeightClass = "h-80 md:h-[26rem]",
  className,
}: Props) {
  const { lines, history, execute, appendLine, commands } = useTerminal();

  const [input, setInput] = useState("");
  const [histIdx, setHistIdx] = useState<number | null>(null);
  const [draft, setDraft] = useState("");

  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const booted = useRef(false);

  // Greeting + boot command on very first mount (no persisted scrollback)
  useEffect(() => {
    if (booted.current) return;
    booted.current = true;
    // Wait one tick so hydration from localStorage completes
    const t = setTimeout(() => {
      if (lines.length === 0) {
        for (const g of greeting) appendLine("info", g);
        if (bootCommand) void execute(bootCommand);
      }
    }, 0);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-scroll to bottom on new output
  useLayoutEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [lines.length]);

  const focusInput = useCallback(() => {
    inputRef.current?.focus();
  }, []);

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      // Ctrl+L → clear
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "l") {
        e.preventDefault();
        void execute("clear");
        return;
      }
      // Ctrl+C → cancel current input
      if (e.ctrlKey && e.key.toLowerCase() === "c" && !window.getSelection()?.toString()) {
        e.preventDefault();
        if (input) appendLine("echo", `${input}^C`);
        setInput("");
        setHistIdx(null);
        return;
      }
      // Enter → execute
      if (e.key === "Enter") {
        e.preventDefault();
        const val = input;
        setInput("");
        setHistIdx(null);
        setDraft("");
        void execute(val);
        return;
      }
      // Up/Down → history
      if (e.key === "ArrowUp") {
        e.preventDefault();
        if (history.length === 0) return;
        if (histIdx === null) {
          setDraft(input);
          setHistIdx(history.length - 1);
          setInput(history[history.length - 1] ?? "");
        } else if (histIdx > 0) {
          setHistIdx(histIdx - 1);
          setInput(history[histIdx - 1] ?? "");
        }
        return;
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        if (histIdx === null) return;
        const next = histIdx + 1;
        if (next >= history.length) {
          setHistIdx(null);
          setInput(draft);
        } else {
          setHistIdx(next);
          setInput(history[next] ?? "");
        }
        return;
      }
      // Tab → autocomplete command name (first token only)
      if (e.key === "Tab") {
        e.preventDefault();
        const parts = input.split(/\s+/);
        if (parts.length > 1) return; // only complete the command, not args
        const prefix = (parts[0] ?? "").toLowerCase();
        if (!prefix) return;
        const matches = commands
          .filter((c) => !c.hidden)
          .map((c) => c.name)
          .filter((n) => n.startsWith(prefix));
        if (matches.length === 1) {
          setInput(matches[0] + " ");
        } else if (matches.length > 1) {
          appendLine("info", matches.join("  "));
        }
        return;
      }
    },
    [input, history, histIdx, draft, commands, appendLine, execute]
  );

  const promptUser = useMemo(
    () => (
      <span className="select-none">
        <span className="text-accent">kai</span>
        <span className="text-ink-500">@</span>
        <span className="text-ink-700 dark:text-ink-300">berlin</span>
        <span className="text-ink-500"> $ </span>
      </span>
    ),
    []
  );

  return (
    <div
      onClick={focusInput}
      className={[
        "group/term relative flex flex-col overflow-hidden rounded-lg border hairline bg-ink-50/95 font-mono text-[13px] leading-relaxed text-ink-700 shadow-lg shadow-ink-900/5 dark:bg-ink-950/80 dark:text-ink-300",
        className ?? "",
      ].join(" ")}
    >
      {/* Title bar */}
      <div className="flex items-center gap-2 border-b hairline bg-ink-100/70 px-3 py-2 dark:bg-ink-900/50">
        <span className="inline-flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]/80" />
        </span>
        <span className="flex-1 text-center text-[11px] uppercase tracking-widest text-ink-500 dark:text-ink-400">
          {title}
        </span>
        <span className="w-10" aria-hidden />
      </div>

      {/* Scrollback */}
      <div
        ref={scrollRef}
        className={[
          "scrollbar-thin overflow-y-auto px-4 py-3",
          maxHeightClass,
        ].join(" ")}
      >
        {lines.map((line) => (
          <LineRow key={line.id} line={line} prompt={promptUser} />
        ))}

        {/* Live prompt + input */}
        <div className="mt-1 flex items-baseline">
          {promptUser}
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
            aria-label="Terminal input"
            className="flex-1 border-0 bg-transparent mx-1 p-0 font-mono text-[13px] text-ink-900 caret-accent outline-none focus:ring-0 dark:text-ink-50"
          />
        </div>
      </div>
    </div>
  );
}

function LineRow({ line, prompt }: { line: OutputLine; prompt: ReactNode }) {
  if (line.kind === "echo") {
    return (
      <div className="flex items-baseline">
        {prompt}
        <span className="text-ink-900 dark:text-ink-50">{line.content as ReactNode}</span>
      </div>
    );
  }
  const color =
    line.kind === "err"
      ? "text-[#ff5f57]"
      : line.kind === "info"
        ? "text-ink-500 dark:text-ink-400"
        : "text-ink-600 dark:text-ink-400";
  return (
    <div className={`flex items-baseline ${color}`}>
      <span className="select-none text-ink-400 dark:text-ink-600">&gt;&nbsp;</span>
      <span className="whitespace-pre-wrap">{line.content as ReactNode}</span>
    </div>
  );
}

