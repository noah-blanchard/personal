"use client";

import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion";
import { useEffect, useRef, useState } from "react";

export function ScrollProgress() {
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const width = useSpring(scrollYProgress, {
    stiffness: 220,
    damping: 30,
    mass: 0.3,
  });

  const [active, setActive] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const onScroll = () => {
      setActive(true);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setActive(false), 800);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed left-0 right-0 top-16 z-40 h-px origin-left bg-accent"
      style={{ scaleX: reduced ? scrollYProgress : width }}
      animate={{ opacity: reduced ? 1 : active ? 1 : 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    />
  );
}
