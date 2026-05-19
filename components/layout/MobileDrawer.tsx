"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import type { SectionId } from "../providers/ActiveSectionProvider";
import { SITE } from "@/content/site";

type Link = { id: SectionId; label: string };

export function MobileDrawer({ links, active }: { links: Link[]; active: SectionId | null }) {
  const t = useTranslations("drawer");
  const [open, setOpen] = useState(false);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    // Focus the first link for keyboard users
    requestAnimationFrame(() => firstLinkRef.current?.focus());
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        aria-label={t("navigate")}
        aria-expanded={open}
        aria-controls="mobile-drawer"
        onClick={() => setOpen((v) => !v)}
        data-magnet
        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-ink-200/70 text-ink-700 dark:border-ink-800/70 dark:text-ink-200"
      >
        <span className="relative block h-3 w-4">
          <span
            className={`absolute left-0 right-0 top-0 h-px bg-current transition-transform duration-300 ${open ? "translate-y-[5.5px] rotate-45" : ""}`}
          />
          <span
            className={`absolute bottom-0 left-0 right-0 h-px bg-current transition-transform duration-300 ${open ? "-translate-y-[5.5px] -rotate-45" : ""}`}
          />
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Site navigation"
            className="fixed inset-0 z-[55]"
            initial="closed"
            animate="open"
            exit="closed"
          >
            <motion.div
              className="absolute inset-0 bg-ink-950/60 backdrop-blur-sm"
              variants={{ closed: { opacity: 0 }, open: { opacity: 1 } }}
              transition={{ duration: 0.2 }}
              onClick={close}
            />
            <motion.div
              className="absolute inset-y-0 right-0 flex w-[min(20rem,85vw)] flex-col border-l hairline bg-ink-50 p-8 dark:bg-ink-950"
              variants={{
                closed: { x: "100%" },
                open: { x: "0%" },
              }}
              transition={{ type: "spring", stiffness: 320, damping: 34 }}
            >
              <p className="font-mono text-xs uppercase tracking-widest text-ink-500 dark:text-ink-400">
                {t("navigate")}
              </p>
              <ul className="mt-6 flex flex-col gap-1">
                {links.map((link, i) => (
                  <li key={link.id}>
                    <a
                      ref={i === 0 ? firstLinkRef : undefined}
                      href={`#${link.id}`}
                      onClick={close}
                      className="group flex items-baseline justify-between rounded-md py-3 font-serif text-3xl leading-none text-ink-900 transition-colors hover:text-accent dark:text-ink-50"
                    >
                      <span>{link.label}</span>
                      <span
                        className={`font-mono text-xs ${active === link.id ? "text-accent" : "text-ink-400 dark:text-ink-500"}`}
                      >
                        0{i + 1}
                      </span>
                    </a>
                  </li>
                ))}
                <li>
                  <a
                    href="/studio"
                    onClick={close}
                    className="group flex items-baseline justify-between rounded-md py-3 font-serif text-3xl leading-none text-ink-900 transition-colors hover:text-accent dark:text-ink-50"
                  >
                    <span>Studio</span>
                    <span className="font-mono text-xs text-ink-400 dark:text-ink-500">
                      0{links.length + 1}
                    </span>
                  </a>
                </li>
              </ul>
              <div className="mt-auto border-t hairline pt-6">
                <p className="font-mono text-xs text-ink-500 dark:text-ink-400">
                  {SITE.email}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
