"use client";

import { useTranslations } from "next-intl";
import { SITE } from "@/content/site";

export function Footer() {
  const year = new Date().getFullYear();
  const t = useTranslations("footer");
  return (
    <footer className="border-t hairline py-10">
      <div className="container-grid flex flex-col items-start justify-between gap-3 font-mono text-xs text-ink-500 dark:text-ink-400 sm:flex-row sm:items-center">
        <p>{t("copyright", { year, name: SITE.name })}</p>
        <p className="flex items-center gap-2">
          <span className="h-1 w-1 rounded-full bg-accent" />
          <span>{t("version")}</span>
        </p>
      </div>
    </footer>
  );
}
