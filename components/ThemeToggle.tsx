"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark";
const THEME_COOKIE = "theme";
const THEME_MAX_AGE = 60 * 60 * 24 * 365;

function readCookieTheme(): Theme | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie
    .split("; ")
    .find((entry) => entry.startsWith(`${THEME_COOKIE}=`));
  if (!match) return null;
  const value = decodeURIComponent(match.split("=")[1] ?? "");
  return value === "light" || value === "dark" ? value : null;
}

function readTheme(): Theme {
  if (typeof window === "undefined") return "dark";
  const cookieTheme = readCookieTheme();
  if (cookieTheme) return cookieTheme;
  const stored = localStorage.getItem(THEME_COOKIE);
  if (stored === "light" || stored === "dark") return stored;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyTheme(next: Theme) {
  document.documentElement.classList.toggle("dark", next === "dark");
  try {
    localStorage.setItem(THEME_COOKIE, next);
  } catch {
    /* localStorage unavailable; in-memory toggle still works */
  }
  document.cookie = `${THEME_COOKIE}=${encodeURIComponent(next)}; Path=/; Max-Age=${THEME_MAX_AGE}; SameSite=Lax`;
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const initial = readTheme();
    setTheme(initial);
    applyTheme(initial);
  }, []);

  const toggle = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    applyTheme(next);
  };

  const label = theme === "dark" ? "Switch to light theme" : "Switch to dark theme";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      title={label}
      data-magnet
      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-ink-200/70 text-ink-600 transition-colors hover:border-ink-300 hover:text-ink-900 dark:border-ink-800/70 dark:text-ink-300 dark:hover:border-ink-700 dark:hover:text-ink-50"
    >
      {/* Icons swap based on theme. Keep both server-render-safe via opacity to avoid hydration mismatch. */}
      <span className="relative block h-4 w-4">
        <SunIcon className={`absolute inset-0 transition-all ${mounted && theme === "dark" ? "opacity-0 rotate-90" : "opacity-100 rotate-0"}`} />
        <MoonIcon className={`absolute inset-0 transition-all ${mounted && theme === "dark" ? "opacity-100 rotate-0" : "opacity-0 -rotate-90"}`} />
      </span>
    </button>
  );
}

function SunIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  );
}

function MoonIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}
