export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t hairline py-10">
      <div className="container-grid flex flex-col items-start justify-between gap-3 font-mono text-xs text-ink-500 dark:text-ink-400 sm:flex-row sm:items-center">
        <p>
          © {year} Kai Renner. Built with caffeine and TypeScript.
        </p>
        <p className="flex items-center gap-2">
          <span className="h-1 w-1 rounded-full bg-accent" />
          <span>v1.0 — all systems nominal</span>
        </p>
      </div>
    </footer>
  );
}
