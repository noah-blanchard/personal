import type { Metadata, Viewport } from "next";
import { Inter, Instrument_Serif, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ActiveSectionProvider } from "@/components/ActiveSectionProvider";
import { CursorFollower } from "@/components/CursorFollower";

const sans = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
  weight: ["400", "500", "600"],
});

const serif = Instrument_Serif({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-serif",
  weight: ["400"],
  style: ["normal", "italic"],
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-mono",
  weight: ["400", "500"],
});

const SITE_URL = "https://kairenner.dev";
const NAME = "Kai Renner";
const TITLE = `${NAME} — Senior Fullstack Engineer`;
const DESCRIPTION =
  "I build the full stack — fast UIs, clean APIs, and the infrastructure that ties them together.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: TITLE, template: `%s · ${NAME}` },
  description: DESCRIPTION,
  applicationName: NAME,
  authors: [{ name: NAME }],
  creator: NAME,
  keywords: [
    "Kai Renner",
    "senior fullstack engineer",
    "TypeScript",
    "Go",
    "Next.js",
    "distributed systems",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    title: TITLE,
    description: DESCRIPTION,
    siteName: NAME,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    creator: "@kairenner",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8fafc" },
    { media: "(prefers-color-scheme: dark)", color: "#020617" },
  ],
  width: "device-width",
  initialScale: 1,
};

// Inlined pre-hydration script: avoids FOUC by applying the saved/system theme
// before React mounts. Kept tiny on purpose.
const themeBootstrap = `
(function(){try{
  var s=localStorage.getItem('theme');
  var d=s?s==='dark':window.matchMedia('(prefers-color-scheme: dark)').matches;
  document.documentElement.classList.toggle('dark',d);
}catch(e){document.documentElement.classList.add('dark');}})();
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${serif.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootstrap }} />
      </head>
      <body>
        <a
          href="#work"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-ink-900 focus:px-3 focus:py-2 focus:text-ink-50 dark:focus:bg-ink-100 dark:focus:text-ink-900"
        >
          Skip to content
        </a>
        <ActiveSectionProvider>
          <CursorFollower />
          {children}
        </ActiveSectionProvider>
      </body>
    </html>
  );
}
