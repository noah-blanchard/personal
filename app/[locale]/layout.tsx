import type { Metadata, Viewport } from "next";
import { cookies } from "next/headers";
import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import "../globals.css";
import { Providers } from "@/components/providers/Providers";
import { routing } from "@/i18n/routing";
import { SITE } from "@/content/site";
import { pick, type Locale } from "@/content/types";

const sans = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
  weight: ["400", "500", "600"],
});

const serif = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-serif",
  weight: ["400", "500", "600", "700"],
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-mono",
  weight: ["400", "500"],
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const safeLocale: Locale = hasLocale(routing.locales, locale)
    ? (locale as Locale)
    : routing.defaultLocale;

  const role = pick(SITE.roleShort, safeLocale);
  const description = pick(SITE.description, safeLocale);
  const title = `${SITE.name},  ${role}`;

  return {
    metadataBase: new URL(SITE.url),
    title: { default: title, template: `%s · ${SITE.name}` },
    description,
    applicationName: SITE.name,
    authors: [{ name: SITE.name }],
    creator: SITE.name,
    alternates: {
      canonical: `/${safeLocale}`,
      languages: { en: "/en", fr: "/fr" },
    },
    openGraph: {
      type: "website",
      url: `/${safeLocale}`,
      title,
      description,
      siteName: SITE.name,
      locale: safeLocale === "fr" ? "fr_FR" : "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      creator: SITE.twitter,
    },
    robots: { index: true, follow: true },
  };
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#eef1f5" },
    { media: "(prefers-color-scheme: dark)", color: "#020617" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const cookieStore = await cookies();
  const themeCookie = cookieStore.get("theme")?.value;
  const themeClass = themeCookie === "dark" ? "dark" : themeCookie === "light" ? "" : undefined;

  return (
    <html
      lang={locale}
      className={`${sans.variable} ${serif.variable} ${mono.variable}${themeClass !== undefined ? ` ${themeClass}` : ""}`}
      suppressHydrationWarning
    >
      <body>
        <NextIntlClientProvider>
          <Providers>{children}</Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
