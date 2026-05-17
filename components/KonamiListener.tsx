"use client";

import { useEffect, useRef } from "react";
import { useTerminal } from "./terminal/TerminalProvider";
import { useToast } from "./Toaster";

const SEQUENCE = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];

export function KonamiListener() {
  const { features, unlock } = useTerminal();
  const toast = useToast();
  const buffer = useRef<string[]>([]);

  useEffect(() => {
    if (features.fortune) return; // already unlocked, no need to listen

    const onKey = (e: KeyboardEvent) => {
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      const expected = SEQUENCE[buffer.current.length];
      if (key === expected) {
        buffer.current.push(key);
        if (buffer.current.length === SEQUENCE.length) {
          buffer.current = [];
          unlock("fortune");
          toast("you found it. try `fortune` in the terminal.");
        }
      } else {
        // Allow restart on first key
        buffer.current = key === SEQUENCE[0] ? [key] : [];
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [features.fortune, unlock, toast]);

  return null;
}
