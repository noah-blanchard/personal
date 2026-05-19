"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { AnimatePresence, motion } from "framer-motion";

type Toast = { id: number; msg: string };

type ToasterCtx = {
  toast: (msg: string) => void;
};

const Ctx = createContext<ToasterCtx | null>(null);

const TTL_MS = 3500;
const MAX_VISIBLE = 3;

let nextId = 0;

export function ToasterProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const timers = useRef(new Map<number, ReturnType<typeof setTimeout>>());

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    const t = timers.current.get(id);
    if (t) {
      clearTimeout(t);
      timers.current.delete(id);
    }
  }, []);

  const toast = useCallback((msg: string) => {
    const id = ++nextId;
    setToasts((prev) => [...prev.slice(-(MAX_VISIBLE - 1)), { id, msg }]);
    const handle = setTimeout(() => dismiss(id), TTL_MS);
    timers.current.set(id, handle);
  }, [dismiss]);

  useEffect(() => () => {
    timers.current.forEach((h) => clearTimeout(h));
    timers.current.clear();
  }, []);

  return (
    <Ctx.Provider value={{ toast }}>
      {children}
      <div
        aria-live="polite"
        aria-atomic="false"
        className="pointer-events-none fixed bottom-4 right-4 z-[70] flex w-[min(20rem,90vw)] flex-col items-end gap-2"
      >
        <AnimatePresence initial={false}>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, y: 12, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.98 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              onClick={() => dismiss(t.id)}
              className="pointer-events-auto flex items-center gap-2 rounded-lg border hairline bg-ink-50/95 px-3 py-2 font-mono text-xs text-ink-800 shadow-lg shadow-ink-900/5 backdrop-blur dark:bg-ink-900/95 dark:text-ink-200"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden />
              <span>{t.msg}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </Ctx.Provider>
  );
}

export function useToast(): ToasterCtx["toast"] {
  const ctx = useContext(Ctx);
  if (!ctx) {
    // Safe no-op fallback for islands that render outside the provider tree.
    return () => {};
  }
  return ctx.toast;
}
