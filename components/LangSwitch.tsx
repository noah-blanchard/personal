"use client";

import { useLocale, useTranslations } from "next-intl";
import { useTransition } from "react";
import { usePathname, useRouter } from "@/i18n/navigation";
import { LOCALES, type Locale } from "@/content/types";

export function LangSwitch() {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("langSwitch");
  const [isPending, startTransition] = useTransition();

  const set = (next: Locale) => {
    if (next === locale) return;
    startTransition(() => {
      router.replace(pathname, { locale: next });
    });
  };

  return (
    <div
      role="group"
      aria-label={t("label")}
      className="inline-flex items-center gap-0.5 rounded-full border hairline p-0.5"
    >
      {LOCALES.map((l) => {
        const active = l === locale;
        return (
          <button
            key={l}
            type="button"
            onClick={() => set(l)}
            disabled={isPending}
            data-magnet
            aria-pressed={active}
            className={[
              "rounded-full px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest transition-colors",
              active
                ? "bg-ink-900 text-ink-50 dark:bg-ink-50 dark:text-ink-900"
                : "text-ink-500 hover:text-ink-900 dark:text-ink-400 dark:hover:text-ink-50",
            ].join(" ")}
          >
            {t(l)}
          </button>
        );
      })}
    </div>
  );
}
