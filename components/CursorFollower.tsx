"use client";

import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { useEffect, useState } from "react";

export function CursorFollower() {
  const reduced = useReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState(false);
  const [magnet, setMagnet] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 320, damping: 28, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 320, damping: 28, mass: 0.4 });

  useEffect(() => {
    if (reduced) return;
    // Disable on coarse pointers (touch) or when the user can't hover.
    const mq = window.matchMedia("(pointer: fine) and (hover: hover)");
    setEnabled(mq.matches);
    const onChange = () => setEnabled(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [reduced]);

  useEffect(() => {
    if (!enabled) return;
    const move = (e: PointerEvent) => {
      setVisible(true);
      const target = e.target as Element | null;
      const interactive = target?.closest("a, button, [role='button'], [data-magnet]");
      setMagnet(Boolean(interactive));
      x.set(e.clientX);
      y.set(e.clientY);
    };
    const leave = () => setVisible(false);
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerleave", leave);
    document.addEventListener("mouseleave", leave);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerleave", leave);
      document.removeEventListener("mouseleave", leave);
    };
  }, [enabled, x, y]);

  if (!enabled) return null;

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[60] -translate-x-1/2 -translate-y-1/2 will-change-transform"
      style={{ x: sx, y: sy }}
      animate={{
        opacity: visible ? 1 : 0,
        scale: magnet ? 1.8 : 1,
      }}
      transition={{ opacity: { duration: 0.2 }, scale: { duration: 0.2, ease: "easeOut" } }}
    >
      <div
        className={[
          "h-2 w-2 rounded-full transition-colors duration-200",
          magnet ? "bg-accent/80" : "bg-ink-400 dark:bg-ink-300/80",
          magnet ? "mix-blend-normal" : "mix-blend-difference",
        ].join(" ")}
      />
    </motion.div>
  );
}
