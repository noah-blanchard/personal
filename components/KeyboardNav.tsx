"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";

type Target = "top" | "work" | "about" | "experience" | "tech" | "contact";

const SHORTCUTS: { keys: string; label: string; target: Target }[] = [
  { keys: "g g", label: "Top", target: "top" },
  { keys: "g w", label: "Work", target: "work" },
  { keys: "g a", label: "About", target: "about" },
  { keys: "g e", label: "Experience", target: "experience" },
  { keys: "g t", label: "Tech", target: "tech" },
  { keys: "g c", label: "Contact", target: "contact" },
];

function isEditable(el: EventTarget | null): boolean {
  if (!(el instanceof HTMLElement)) return false;
  const tag = el.tagName.toLowerCase();
  if (tag === "input" || tag === "textarea" || tag === "select") return true;
  if (el.isContentEditable) return true;
  return false;
}

function scrollTo(target: Target) {
  if (typeof document === "undefined") return;
  if (target === "top") {
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }
  document.getElementById(target)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function KeyboardNav() {
  const [gMode, setGMode] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const gTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const exitG = useCallback(() => {
    if (gTimer.current) clearTimeout(gTimer.current);
    gTimer.current = null;
    setGMode(false);
  }, []);

  const enterG = useCallback(() => {
    if (gTimer.current) clearTimeout(gTimer.current);
    setGMode(true);
    gTimer.current = setTimeout(() => setGMode(false), 1200);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (isEditable(e.target)) return;

      // `?` toggles the cheat sheet
      if (e.key === "?" || (e.shiftKey && e.key === "/")) {
        e.preventDefault();
        setHelpOpen((v) => !v);
        return;
      }
      if (e.key === "Escape" && helpOpen) {
        setHelpOpen(false);
        return;
      }

      if (gMode) {
        const key = e.key.toLowerCase();
        const map: Record<string, Target> = {
          g: "top",
          w: "work",
          a: "about",
          e: "experience",
          t: "tech",
          c: "contact",
        };
        const target = map[key];
        if (target) {
          e.preventDefault();
          scrollTo(target);
        }
        exitG();
        return;
      }

      if (e.key === "g") {
        e.preventDefault();
        enterG();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [gMode, helpOpen, enterG, exitG]);

  useEffect(() => () => {
    if (gTimer.current) clearTimeout(gTimer.current);
  }, []);

  return (
    <>
      <AnimatePresence>
        {gMode && (
          <motion.div
            key="gmode"
            aria-hidden
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.12 }}
            className="pointer-events-none fixed bottom-4 right-4 z-[65] rounded-md border hairline bg-ink-50/90 px-2 py-1 font-mono text-xs text-ink-700 backdrop-blur dark:bg-ink-900/80 dark:text-ink-200"
          >
            <span className="text-accent">g</span>_
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {helpOpen && (
          <motion.div
            key="help"
            className="fixed inset-0 z-[75] flex items-center justify-center px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <div
              className="absolute inset-0 bg-ink-950/60 backdrop-blur-sm"
              onClick={() => setHelpOpen(false)}
              aria-hidden
            />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Keyboard shortcuts"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              className="relative w-[min(24rem,100%)] overflow-hidden rounded-xl border hairline bg-ink-50/95 p-6 shadow-2xl shadow-ink-950/30 backdrop-blur dark:bg-ink-900/95"
            >
              <p className="font-mono text-xs uppercase tracking-[0.25em] text-ink-500 dark:text-ink-400">
                Keyboard shortcuts
              </p>
              <ul className="mt-5 space-y-2">
                {SHORTCUTS.map((s) => (
                  <li key={s.keys} className="flex items-center justify-between">
                    <span className="text-sm text-ink-800 dark:text-ink-200">{s.label}</span>
                    <ShortcutKeys keys={s.keys} />
                  </li>
                ))}
                <li className="flex items-center justify-between pt-2">
                  <span className="text-sm text-ink-800 dark:text-ink-200">Command palette</span>
                  <span className="flex gap-1">
                    <Kbd>⌘</Kbd>
                    <Kbd>K</Kbd>
                  </span>
                </li>
                <li className="flex items-center justify-between">
                  <span className="text-sm text-ink-800 dark:text-ink-200">This sheet</span>
                  <Kbd>?</Kbd>
                </li>
              </ul>
              <p className="mt-6 font-mono text-[10px] uppercase tracking-widest text-ink-400 dark:text-ink-500">
                press esc or ? to close
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function ShortcutKeys({ keys }: { keys: string }) {
  return (
    <span className="flex gap-1">
      {keys.split(" ").map((k, i) => (
        <Kbd key={i}>{k}</Kbd>
      ))}
    </span>
  );
}

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="rounded border hairline bg-ink-100 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-widest text-ink-700 dark:bg-ink-800 dark:text-ink-200">
      {children}
    </kbd>
  );
}
