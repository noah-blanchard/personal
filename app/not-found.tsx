import Link from "next/link";
import { Terminal } from "@/components/terminal/Terminal";

export default function NotFound() {
  return (
    <main className="flex min-h-[100svh] flex-col justify-center pt-24">
      <div className="container-grid">
        <div className="grid items-center gap-10 md:grid-cols-12 md:gap-12">
          <div className="md:col-span-5">
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-ink-500 dark:text-ink-400">
              <span className="text-accent">§</span> 404
            </p>
            <h1 className="mt-6 font-serif text-[clamp(2.5rem,7vw,5rem)] leading-[1] tracking-tightest text-ink-900 dark:text-ink-50">
              Wandered off
              <span className="text-accent">.</span>
            </h1>
            <p className="mt-6 max-w-md text-balance text-ink-600 dark:text-ink-300">
              No route by that name. The terminal still works — try{" "}
              <code className="font-mono text-accent">cd /</code> or{" "}
              <code className="font-mono text-accent">help</code>.
            </p>
            <Link
              href="/"
              data-magnet
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-ink-900 px-5 py-2.5 text-sm font-medium text-ink-50 transition-colors hover:bg-ink-800 dark:bg-ink-50 dark:text-ink-950 dark:hover:bg-ink-200"
            >
              ← Head home
            </Link>
          </div>

          <div className="md:col-span-7">
            <Terminal
              title="kai@berlin: /unknown"
              greeting={[
                "> cd /unknown",
                "> error: ENOENT — no such directory.",
                "> hint: try `cd /` or `help`.",
              ]}
              bootCommand=""
            />
          </div>
        </div>
      </div>
    </main>
  );
}
