import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Terminal } from "@/components/terminal/Terminal";

export default async function NotFound() {
  const t = await getTranslations("notFound");
  const greeting = (t.raw("terminalGreeting") as string[]) ?? [];

  return (
    <main className="flex min-h-[100svh] flex-col justify-center pt-24">
      <div className="container-grid">
        <div className="grid items-center gap-10 md:grid-cols-12 md:gap-12">
          <div className="md:col-span-5">
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-ink-500 dark:text-ink-400">
              <span className="text-accent">§</span> {t("tag")}
            </p>
            <h1 className="mt-6 font-serif text-[clamp(2.5rem,7vw,5rem)] leading-[1] tracking-tightest text-ink-900 dark:text-ink-50">
              {t("headline")}
              <span className="text-accent">.</span>
            </h1>
            <p className="mt-6 max-w-md text-balance text-ink-600 dark:text-ink-300">
              {t.rich("copy", {
                a: (chunks) => <code className="font-mono text-accent">{chunks}</code>,
                b: (chunks) => <code className="font-mono text-accent">{chunks}</code>,
              })}
            </p>
            <Link
              href="/"
              data-magnet
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-ink-900 px-5 py-2.5 text-sm font-medium text-ink-50 transition-colors hover:bg-ink-800 dark:bg-ink-50 dark:text-ink-950 dark:hover:bg-ink-200"
            >
              {t("home")}
            </Link>
          </div>

          <div className="md:col-span-7">
            <Terminal
              title={t("terminalTitle")}
              greeting={greeting}
              bootCommand=""
            />
          </div>
        </div>
      </div>
    </main>
  );
}
