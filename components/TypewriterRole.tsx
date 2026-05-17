"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

type Props = {
  roles: string[];
  /** ms per character on type / delete */
  typeSpeed?: number;
  deleteSpeed?: number;
  /** ms to hold a completed role before deleting */
  holdMs?: number;
  className?: string;
};

/**
 * Cycles through `roles` with a type+delete effect on first load.
 * Settles on the LAST role permanently (no infinite loop).
 */
export function TypewriterRole({
  roles,
  typeSpeed = 55,
  deleteSpeed = 28,
  holdMs = 1400,
  className,
}: Props) {
  const reduced = useReducedMotion();
  const safeRoles = roles.length > 0 ? roles : [""];
  const finalRole = safeRoles[safeRoles.length - 1] ?? "";
  const [text, setText] = useState(reduced ? finalRole : "");
  const [done, setDone] = useState(Boolean(reduced));
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (reduced) return;

    let idx = 0;
    let charCount = 0;
    let deleting = false;
    let cancelled = false;

    const tick = () => {
      if (cancelled) return;
      const current = safeRoles[idx] ?? "";
      const isLast = idx === safeRoles.length - 1;

      if (!deleting) {
        charCount++;
        setText(current.slice(0, charCount));
        if (charCount >= current.length) {
          if (isLast) {
            setDone(true);
            return;
          }
          timer.current = setTimeout(() => {
            deleting = true;
            tick();
          }, holdMs);
          return;
        }
        timer.current = setTimeout(tick, typeSpeed);
      } else {
        charCount--;
        setText(current.slice(0, Math.max(0, charCount)));
        if (charCount <= 0) {
          deleting = false;
          idx = (idx + 1) % safeRoles.length;
          timer.current = setTimeout(tick, 220);
          return;
        }
        timer.current = setTimeout(tick, deleteSpeed);
      }
    };

    timer.current = setTimeout(tick, 700); // small pre-roll so it doesn't fight the scramble

    return () => {
      cancelled = true;
      if (timer.current) clearTimeout(timer.current);
    };
  }, [safeRoles, typeSpeed, deleteSpeed, holdMs, reduced]);

  return (
    <span className={className}>
      <span>{text}</span>
      <span
        aria-hidden
        className={`ml-0.5 inline-block h-[0.9em] w-[2px] translate-y-[2px] bg-current align-middle ${done ? "opacity-0" : "animate-caret-blink"}`}
      />
    </span>
  );
}
