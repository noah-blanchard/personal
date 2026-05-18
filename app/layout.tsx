// The root layout is intentionally a pass-through. The localized layout at
// app/[locale]/layout.tsx provides <html>, <body>, fonts, and providers.
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
