export const LOCALES = ["en", "fr"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "en";

export type Localized<T = string> = Record<Locale, T>;

/**
 * Pick the right side of a Localized<T>. Accepts a bare T too — useful for
 * proper nouns and values that don't translate (e.g. "Hooli", "Postgres").
 */
export function pick<T>(field: Localized<T> | T, locale: Locale): T {
  if (
    field !== null &&
    typeof field === "object" &&
    "en" in (field as object) &&
    "fr" in (field as object)
  ) {
    return (field as Localized<T>)[locale];
  }
  return field as T;
}

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}
