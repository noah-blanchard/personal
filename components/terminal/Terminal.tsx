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
import { useTranslations } from "next-intl";
import { useTerminal } from "./TerminalProvider";
import { LineRow } from "./LineRow";

type Props = {
  title?: string;
  greeting?: ReactNode[];
  bootCommand?: string;
  maxHeightClass?: string;
  className?: string;
  fullscreen?: boolean;
};

export function Terminal({
  title,
  greeting,
  bootCommand = "whoami",
  maxHeightClass = "h-80 md:h-[26rem]",
  className,
  fullscreen = false,
}: Props) {
  const t = useTranslations("terminal");
  const titleText = title ?? t("title");
  const greetingLines: ReactNode[] = greeting ?? [t("boot")];
  const { lines, history, execute, appendLine, commands } = useTerminal();

  const [input, setInput] = useState("");
  const [pos, setPos] = useState(0);
  const [focused, setFocused] = useState(false);
  const [histIdx, setHistIdx] = useState<number | null>(null);
  const [draft, setDraft] = useState("");

  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const booted = useRef(false);

  // Programmatic value update,  used for history nav and autocomplete.
  // Places the caret at end after React commits the new value.
  const setInputAtEnd = useCallback((val: string) => {
    setInput(val);
    setPos(val.length);
    requestAnimationFrame(() => {
      const el = inputRef.current;
      if (el) el.setSelectionRange(val.length, val.length);
    });
  }, []);

  // Sync caret position from the real input,  called on click/keyup/select
  // so left/right arrow, home/end, and pointer clicks keep the block aligned.
  const syncCaret = useCallback(() => {
    const el = inputRef.current;
    if (el) setPos(el.selectionStart ?? el.value.length);
  }, []);

  // Ghost-text suggestion: the completion tail for the current first-token prefix.
  // Empty when the cursor isn't at the end, when the input already has whitespace,
  // or when nothing matches. Hidden commands are excluded,  discovery stays in `ls`.
  const suggestion = useMemo(() => {
    if (!input) return "";
    if (pos !== input.length) return "";
    if (/\s/.test(input)) return "";
    const prefix = input.toLowerCase();
    const match = commands
      .filter((c) => !c.hidden)
      .map((c) => c.name)
      .find((n) => n.startsWith(prefix) && n !== prefix);
    return match ? match.slice(input.length) : "";
  }, [input, pos, commands]);

  // Greeting + boot command on very first mount (no persisted scrollback)
  useEffect(() => {
    if (booted.current) return;
    booted.current = true;
    // Wait one tick so hydration from localStorage completes
    const timer = setTimeout(() => {
      if (lines.length === 0) {
        for (const g of greetingLines) appendLine("info", g);
        if (bootCommand) void execute(bootCommand);
      }
    }, 0);
    return () => clearTimeout(timer);
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
        setInputAtEnd("");
        setHistIdx(null);
        return;
      }
      // Enter → execute
      if (e.key === "Enter") {
        e.preventDefault();
        const val = input;
        setInputAtEnd("");
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
          setInputAtEnd(history[history.length - 1] ?? "");
        } else if (histIdx > 0) {
          setHistIdx(histIdx - 1);
          setInputAtEnd(history[histIdx - 1] ?? "");
        }
        return;
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        if (histIdx === null) return;
        const next = histIdx + 1;
        if (next >= history.length) {
          setHistIdx(null);
          setInputAtEnd(draft);
        } else {
          setHistIdx(next);
          setInputAtEnd(history[next] ?? "");
        }
        return;
      }
      // Right arrow at end of input accepts the current ghost suggestion (fish-style).
      if (e.key === "ArrowRight" && suggestion && pos === input.length) {
        e.preventDefault();
        setInputAtEnd(input + suggestion);
        return;
      }
      // Tab → accept ghost suggestion, or print multi-match options.
      if (e.key === "Tab") {
        e.preventDefault();
        if (suggestion) {
          setInputAtEnd(input + suggestion + " ");
          return;
        }
        const parts = input.split(/\s+/);
        if (parts.length > 1) return; // only complete the command, not args
        const prefix = (parts[0] ?? "").toLowerCase();
        if (!prefix) return;
        const matches = commands
          .filter((c) => !c.hidden)
          .map((c) => c.name)
          .filter((n) => n.startsWith(prefix));
        if (matches.length > 1) {
          appendLine("info", matches.join("  "));
        }
        return;
      }
    },
    [input, pos, suggestion, history, histIdx, draft, commands, appendLine, execute, setInputAtEnd]
  );

  const promptUser = useMemo(
    () => (
      <span className="select-none">
        <span className="text-accent">noah</span>
        <span className="text-ink-500">@</span>
        <span className="text-ink-700 dark:text-ink-300">mtl</span>
        <span className="text-ink-500"> ~ </span>
        <span className="text-ink-500">$ </span>
      </span>
    ),
    []
  );

  return (
    <div
      onClick={focusInput}
      className={[
        "group/term relative flex flex-col overflow-hidden font-mono text-[13px] leading-relaxed",
        fullscreen
          ? "h-screen w-screen rounded-none border-0 bg-ink-50 text-ink-800 dark:bg-ink-950 dark:text-ink-300"
          : "rounded-lg border hairline bg-ink-50/95 text-ink-700 shadow-lg shadow-ink-900/5 dark:bg-ink-950/80 dark:text-ink-300",
        className ?? "",
      ].join(" ")}
    >
      {/* Title bar */}
      <div className={["flex items-center gap-2 border-b px-3 py-2", fullscreen ? "border-ink-200 bg-ink-100 dark:border-ink-800 dark:bg-ink-900/60" : "hairline bg-ink-100/70 dark:bg-ink-900/50"].join(" ")}>
        <span className="inline-flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]/80" />
        </span>
        <span className="flex-1 text-center text-[11px] uppercase tracking-widest text-ink-500 dark:text-ink-400">
          {titleText}
        </span>
        <span className="w-10" aria-hidden />
      </div>

      {/* Scrollback */}
      <div
        ref={scrollRef}
        className={[
          "scrollbar-thin overflow-y-auto px-4 py-3",
          fullscreen ? "flex-1" : maxHeightClass,
        ].join(" ")}
      >
        {lines.map((line) => (
          <LineRow key={line.id} line={line} prompt={promptUser} />
        ))}

        {/* Live prompt + input */}
        <div className="mt-1 flex items-baseline">
          {promptUser}
          <div className="relative mx-1 flex-1 font-mono text-[13px] leading-relaxed">
            {/* Shadow layer: visible text + the block cursor. The real input
                below is fully transparent and captures all interaction. */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 whitespace-pre text-ink-900 dark:text-ink-50"
            >
              <span>{input.slice(0, pos)}</span>
              <span
                className={[
                  "inline-block",
                  focused
                    ? "animate-caret-blink bg-accent text-ink-950"
                    : "outline outline-1 -outline-offset-[1px] outline-ink-400 dark:outline-ink-600",
                ].join(" ")}
                style={{ minWidth: "1ch" }}
              >
                {input[pos] ?? " "}
              </span>
              <span>{input.slice(pos + 1)}</span>
              {suggestion && (
                <span className="text-ink-400/70 dark:text-ink-500/70">{suggestion}</span>
              )}
            </div>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                setPos(e.target.selectionStart ?? e.target.value.length);
              }}
              onKeyDown={onKeyDown}
              onKeyUp={syncCaret}
              onClick={syncCaret}
              onSelect={syncCaret}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
              aria-label={t("ariaLabel")}
              className="relative z-10 w-full border-0 bg-transparent p-0 font-mono text-[13px] text-transparent caret-transparent outline-none focus:ring-0"
            />
          </div>
        </div>
      </div>
    </div>
  );
}


