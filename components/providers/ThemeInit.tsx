"use client";

import { useLayoutEffect } from "react";

export function ThemeInit() {
  useLayoutEffect(() => {
    try {
      const stored = localStorage.getItem("theme");
      if (stored === "dark" || stored === "light") {
        document.documentElement.classList.toggle("dark", stored === "dark");
      } else if (matchMedia("(prefers-color-scheme: dark)").matches) {
        document.documentElement.classList.add("dark");
        document.cookie = "theme=dark;path=/;max-age=31536000;SameSite=Strict";
      }
    } catch { /* */ }
  }, []);

  return null;
}
