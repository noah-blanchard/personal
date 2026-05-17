"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useActiveSection, type SectionId } from "./ActiveSectionProvider";
import { ThemeToggle } from "./ThemeToggle";
import { MobileDrawer } from "./MobileDrawer";

const LINKS: { id: SectionId; label: string }[] = [
  { id: "work", label: "Work" },
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "contact", label: "Contact" },
];

export function Nav() {
  const active = useActiveSection();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      aria-label="Primary"
      className={[
        "fixed inset-x-0 top-0 z-50 transition-all duration-300 ease-out-expo",
        scrolled
          ? "border-b hairline bg-ink-50/70 backdrop-blur-md dark:bg-ink-950/60"
          : "border-b border-transparent bg-transparent",
      ].join(" ")}
    >
      <div className="container-grid flex h-16 items-center justify-between">
        <a
          href="#top"
          className="group flex items-center gap-2 text-sm font-medium tracking-tight text-ink-900 dark:text-ink-50"
          data-magnet
        >
          <span className="font-serif text-lg leading-none">Kai Renner</span>
          <span className="hidden text-xs text-ink-500 dark:text-ink-400 sm:inline">
            — fullstack engineer
          </span>
        </a>

        <div className="hidden items-center gap-1 md:flex">
          <ul className="flex items-center gap-1">
            {LINKS.map((link) => (
              <li key={link.id}>
                <NavLink id={link.id} label={link.label} active={active === link.id} />
              </li>
            ))}
          </ul>
          <div className="mx-3 h-5 w-px bg-ink-200 dark:bg-ink-800" aria-hidden />
          <ThemeToggle />
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <MobileDrawer links={LINKS} active={active} />
        </div>
      </div>
    </nav>
  );
}

function NavLink({ id, label, active }: { id: SectionId; label: string; active: boolean }) {
  return (
    <a
      href={`#${id}`}
      data-magnet
      className="relative px-3 py-2 text-sm text-ink-600 transition-colors hover:text-ink-900 dark:text-ink-300 dark:hover:text-ink-50"
      aria-current={active ? "true" : undefined}
    >
      <span className="relative inline-flex items-center gap-4">
        <span className={active ? "text-ink-900 dark:text-ink-50" : ""}>{label}</span>
      </span>
    </a>
  );
}
