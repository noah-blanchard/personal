import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Terminal } from "@/components/terminal/Terminal";

export default async function NotFound() {
  const t = await getTranslations("notFound");
  const greeting = (t.raw("terminalGreeting") as string[]) ?? [];

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6">
      <div className="w-full max-w-xl space-y-6">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-ink-500">
            <span className="text-accent">§</span> {t("tag")}
          </p>
          <h1 className="mt-4 font-mono text-4xl text-ink-900 dark:text-ink-50">
            {t("headline")}<span className="text-accent">.</span>
          </h1>
          <Link
            href="/"
            className="mt-4 inline-flex text-sm text-ink-500 transition-colors hover:text-accent"
          >
            {t("home")}
          </Link>
        </div>
        <Terminal title={t("terminalTitle")} greeting={greeting} bootCommand="" />
      </div>
    </main>
  );
}
