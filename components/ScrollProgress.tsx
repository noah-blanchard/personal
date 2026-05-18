"use client";

import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion";
import { usePathname } from "next/navigation";

export function ScrollProgress() {
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const width = useSpring(scrollYProgress, { stiffness: 220, damping: 30, mass: 0.3 });
  const pathname = usePathname();

  if (pathname.includes("/studio")) return null;

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed inset-x-0 top-16 z-50 h-px origin-left bg-accent/80"
      style={{ scaleX: reduced ? scrollYProgress : width }}
    />
  );
}
