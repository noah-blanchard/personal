"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

type Props = {
  frames: string[];
  intervalMs: number;
};

export function AsciiAnimation({ frames, intervalMs }: Props) {
  const reduced = useReducedMotion();
  const last = Math.max(0, frames.length - 1);
  const [i, setI] = useState(reduced ? last : 0);

  useEffect(() => {
    if (reduced) return;
    if (i >= last) return;
    const t = setTimeout(() => setI((x) => x + 1), intervalMs);
    return () => clearTimeout(t);
  }, [i, last, intervalMs, reduced]);

  return (
    <pre className="whitespace-pre overflow-x-auto font-mono leading-[1.15] text-accent">
      {frames[i] ?? ""}
    </pre>
  );
}
