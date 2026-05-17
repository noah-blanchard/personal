"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type SectionId = "work" | "about" | "experience" | "tech" | "contact";

const SECTION_IDS: SectionId[] = ["work", "about", "experience", "tech", "contact"];

type Ctx = { active: SectionId | null };
const ActiveSectionContext = createContext<Ctx>({ active: null });

export function ActiveSectionProvider({ children }: { children: ReactNode }) {
  const [active, setActive] = useState<SectionId | null>(null);

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;

    const visibility = new Map<SectionId, number>();
    SECTION_IDS.forEach((id) => visibility.set(id, 0));

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = entry.target.id as SectionId;
          if (!SECTION_IDS.includes(id)) continue;
          visibility.set(id, entry.intersectionRatio);
        }
        let best: SectionId | null = null;
        let bestRatio = 0;
        for (const id of SECTION_IDS) {
          const r = visibility.get(id) ?? 0;
          if (r > bestRatio) {
            bestRatio = r;
            best = id;
          }
        }
        setActive(bestRatio > 0.15 ? best : null);
      },
      {
        // Bias toward the section that occupies the upper-middle of the viewport.
        rootMargin: "-25% 0px -45% 0px",
        threshold: [0, 0.15, 0.3, 0.5, 0.75, 1],
      }
    );

    const nodes: Element[] = [];
    for (const id of SECTION_IDS) {
      const el = document.getElementById(id);
      if (el) {
        observer.observe(el);
        nodes.push(el);
      }
    }
    return () => {
      nodes.forEach((n) => observer.unobserve(n));
      observer.disconnect();
    };
  }, []);

  const value = useMemo(() => ({ active }), [active]);
  return (
    <ActiveSectionContext.Provider value={value}>
      {children}
    </ActiveSectionContext.Provider>
  );
}

export function useActiveSection() {
  return useContext(ActiveSectionContext).active;
}
