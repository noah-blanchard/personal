"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789·/<>";

type Props = {
  text: string;
  durationMs?: number;
  className?: string;
};

/**
 * One-shot character-reveal: each character settles in sequence, with the
 * unresolved tail flickering through random glyphs. Runs once on mount.
 */
export function ScrambleText({ text, durationMs = 800, className }: Props) {
  const reduced = useReducedMotion();
  const [display, setDisplay] = useState(text);
  const raf = useRef<number | null>(null);

  useEffect(() => {
    if (reduced) {
      setDisplay(text);
      return;
    }
    const start = performance.now();
    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(1, elapsed / durationMs);
      const resolved = Math.floor(progress * text.length);
      let out = "";
      for (let i = 0; i < text.length; i++) {
        const ch = text[i] ?? "";
        if (i < resolved || ch === " " || ch === " ") {
          out += ch;
        } else {
          out += GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        }
      }
      setDisplay(out);
      if (progress < 1) {
        raf.current = requestAnimationFrame(tick);
      } else {
        setDisplay(text);
      }
    };
    raf.current = requestAnimationFrame(tick);
    return () => {
      if (raf.current !== null) cancelAnimationFrame(raf.current);
    };
  }, [text, durationMs, reduced]);

  return (
    <span className={className} aria-label={text}>
      <span aria-hidden>{display}</span>
    </span>
  );
}
