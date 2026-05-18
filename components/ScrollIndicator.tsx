"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

export function ScrollIndicator() {
  const reduced = useReducedMotion();
  const [hidden, setHidden] = useState(false);
  const t = useTranslations();

  useEffect(() => {
    const onScroll = () => setHidden(window.scrollY > 200);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.div
      aria-hidden
      initial={{ opacity: 0 }}
      animate={{ opacity: hidden ? 0 : 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="pointer-events-none absolute bottom-10 left-1/2 -translate-x-1/2"
    >
      <div className="flex flex-col items-center gap-3">
        <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-ink-500 dark:text-ink-400">
          {t("scroll")}
        </span>
        <div className="relative h-12 w-px overflow-hidden bg-ink-200 dark:bg-ink-800">
          {!reduced && (
            <motion.div
              className="absolute inset-x-0 top-0 h-1/3 bg-accent"
              animate={{ y: ["-100%", "300%"] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            />
          )}
        </div>
      </div>
    </motion.div>
  );
}
