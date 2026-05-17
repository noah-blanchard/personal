"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTerminal } from "./TerminalProvider";

export function CommandPalette() {
  const { commands, execute, features } = useTerminal();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Global hotkey
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
        return;
      }
      if (e.key === "Escape" && open) {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // Reset on open + focus
  useEffect(() => {
    if (open) {
      setQuery("");
      setSelected(0);
      requestAnimationFrame(() => inputRef.current?.focus());
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [open]);

  const visible = useMemo(
    () => commands.filter((c) => !c.hidden || (c.name === "fortune" && features.fortune)),
    [commands, features.fortune]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return visible;
    return visible.filter((c) => {
      if (c.name.toLowerCase().includes(q)) return true;
      if (c.description.toLowerCase().includes(q)) return true;
      if (c.aliases?.some((a) => a.toLowerCase().includes(q))) return true;
      return false;
    });
  }, [visible, query]);

  // Clamp selection when results change
  useEffect(() => {
    setSelected((s) => Math.min(Math.max(0, s), Math.max(0, filtered.length - 1)));
  }, [filtered.length]);

  const onItemRun = useCallback(
    (name: string) => {
      setOpen(false);
      // Run in the shared engine — output flows into the hero terminal
      void execute(name);
    },
    [execute]
  );

  const onInputKey = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelected((s) => Math.min(s + 1, filtered.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelected((s) => Math.max(s - 1, 0));
      } else if (e.key === "Enter") {
        e.preventDefault();
        const cmd = filtered[selected];
        if (cmd) onItemRun(cmd.name);
      } else if (e.key === "Escape") {
        e.preventDefault();
        setOpen(false);
      }
    },
    [filtered, selected, onItemRun]
  );

  // Subtle floating hint button (corner), only shown on non-touch devices.
  // We keep the trigger discoverable without owning visual real estate.
  return (
    <>
      <HintButton onClick={() => setOpen(true)} />
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[80] flex items-start justify-center px-4 pt-[15vh]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <div
              className="absolute inset-0 bg-ink-950/60 backdrop-blur-sm"
              onClick={() => setOpen(false)}
              aria-hidden
            />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Command palette"
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.98 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              className="relative w-[min(30rem,100%)] overflow-hidden rounded-xl border hairline bg-ink-50/95 shadow-2xl shadow-ink-950/30 backdrop-blur dark:bg-ink-900/95"
            >
              <div className="flex items-center gap-2 border-b hairline px-4 py-3">
                <span className="font-mono text-xs text-accent">$</span>
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={onInputKey}
                  placeholder="run a command…"
                  className="flex-1 border-0 bg-transparent p-0 text-sm text-ink-900 outline-none placeholder:text-ink-400 focus:ring-0 dark:text-ink-50 dark:placeholder:text-ink-500"
                  aria-label="Command query"
                />
                <kbd className="font-mono text-[10px] uppercase tracking-widest text-ink-400 dark:text-ink-500">
                  esc
                </kbd>
              </div>
              <ul className="max-h-[40vh] overflow-y-auto py-1" role="listbox">
                {filtered.length === 0 && (
                  <li className="px-4 py-3 font-mono text-xs text-ink-500 dark:text-ink-400">
                    no commands match
                  </li>
                )}
                {filtered.map((cmd, i) => (
                  <li key={cmd.name}>
                    <button
                      type="button"
                      role="option"
                      aria-selected={i === selected}
                      onMouseEnter={() => setSelected(i)}
                      onClick={() => onItemRun(cmd.name)}
                      className={[
                        "flex w-full items-baseline justify-between gap-4 px-4 py-2 text-left",
                        i === selected
                          ? "bg-ink-100 dark:bg-ink-800/60"
                          : "hover:bg-ink-100/60 dark:hover:bg-ink-800/40",
                      ].join(" ")}
                    >
                      <span className="flex items-baseline gap-3">
                        <span className="font-mono text-xs text-accent">›</span>
                        <span className="font-mono text-sm text-ink-900 dark:text-ink-50">
                          {cmd.name}
                        </span>
                        <span className="text-xs text-ink-500 dark:text-ink-400">
                          {cmd.description}
                        </span>
                      </span>
                      {cmd.aliases?.[0] && (
                        <span className="font-mono text-[10px] uppercase tracking-widest text-ink-400 dark:text-ink-500">
                          {cmd.aliases[0]}
                        </span>
                      )}
                    </button>
                  </li>
                ))}
              </ul>
              <div className="flex items-center justify-between border-t hairline bg-ink-100/40 px-4 py-2 font-mono text-[10px] uppercase tracking-widest text-ink-500 dark:bg-ink-950/40 dark:text-ink-400">
                <span>↑↓ navigate · ↵ run</span>
                <span>output appears in the terminal</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function HintButton({ onClick }: { onClick: () => void }) {
  const [isMac, setIsMac] = useState(false);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    setIsMac(/Mac|iPhone|iPod|iPad/.test(navigator.platform));
    const mq = window.matchMedia("(pointer: fine) and (hover: hover)");
    setEnabled(mq.matches);
  }, []);

  if (!enabled) return null;

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Open command palette"
      data-magnet
      className="fixed bottom-4 left-4 z-40 hidden items-center gap-2 rounded-full border hairline bg-ink-50/80 px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest text-ink-500 backdrop-blur transition-colors hover:text-ink-900 dark:bg-ink-900/70 dark:text-ink-400 dark:hover:text-ink-50 md:inline-flex"
    >
      <span className="h-1 w-1 rounded-full bg-accent" />
      <span>palette</span>
      <kbd className="rounded border hairline px-1 py-px text-ink-600 dark:text-ink-300">
        {isMac ? "⌘" : "ctrl"}
      </kbd>
      <kbd className="rounded border hairline px-1 py-px text-ink-600 dark:text-ink-300">
        K
      </kbd>
    </button>
  );
}

