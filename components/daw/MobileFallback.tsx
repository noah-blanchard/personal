"use client"

import { BIO } from "@/content/about"
import { PROJECTS } from "@/content/work"
import { TECH_GROUPS } from "@/content/tech"
import { ENTRIES } from "@/content/experience"
import { SITE, SOCIALS } from "@/content/site"
import { pick } from "@/content/types"
import type { Locale } from "@/content/types"

export function MobileFallback({ locale }: { locale: Locale }) {
  return (
    <main className="min-h-screen bg-stone-50 dark:bg-zinc-950 px-6 py-12 font-mono">
      {/* Header */}
      <header className="mb-12 border-b border-stone-300 dark:border-zinc-800 pb-6">
        <div className="text-sm tracking-[0.3em] text-amber-500 dark:text-amber-400 mb-1">NOAH.DAW</div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
          {SITE.name}
        </h1>
        <p className="mt-1 text-sm text-stone-500 dark:text-zinc-500">
          {SITE.roleShort[locale]}
        </p>
      </header>

      <div className="space-y-12 max-w-lg mx-auto">
        {/* About */}
        <Section label="about.mp3">
          <div className="space-y-3 text-sm text-stone-600 dark:text-zinc-400 leading-relaxed">
            {BIO[locale].map((para, i) => <p key={i}>{para}</p>)}
          </div>
        </Section>

        {/* Projects */}
        <Section label="projects.wav">
          <div className="space-y-4">
            {PROJECTS.map((p) => (
              <div key={p.id} className="border-l-2 border-amber-500/40 pl-3">
                <div className="flex gap-2 items-baseline">
                  <span className="text-sm font-bold text-zinc-800 dark:text-zinc-200">{p.title}</span>
                  <span className="text-xs text-stone-500 dark:text-zinc-600">{p.year}</span>
                </div>
                <p className="mt-1 text-xs text-stone-500 dark:text-zinc-500">{pick(p.blurb, locale)}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* Experience */}
        <Section label="experience.mid">
          <div className="space-y-4">
            {ENTRIES.filter((e) => e.lane === "work").slice(0, 3).map((e) => (
              <div key={e.id} className="border-l-2 border-amber-500/40 pl-3">
                <div className="text-sm font-bold text-zinc-800 dark:text-zinc-200">{e.label}</div>
                {e.role && <div className="text-xs text-stone-500 dark:text-zinc-500">{pick(e.role, locale)}</div>}
                <div className="text-xs text-stone-400 dark:text-zinc-700">
                  {e.start.slice(0, 4)}{e.end ? ` – ${e.end.slice(0, 4)}` : " – now"}
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* Skills */}
        <Section label="skills.flac">
          <div className="space-y-3">
            {TECH_GROUPS.map((g) => (
              <div key={g.id}>
                <p className="text-[10px] uppercase tracking-wider text-amber-500 dark:text-amber-400 mb-1">{pick(g.title, locale)}</p>
                <p className="text-xs text-stone-600 dark:text-zinc-400">{g.items.join(" · ")}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* Contact */}
        <Section label="contact.ogg">
          <div className="space-y-2 text-sm">
            <a href={`mailto:${SITE.email}`} className="block text-amber-500 dark:text-amber-400 hover:underline">
              {SITE.email}
            </a>
            {SOCIALS.map((s) => (
              <a key={s.id} href={s.href} target="_blank" rel="noopener noreferrer"
                className="flex gap-2 text-stone-600 dark:text-zinc-400 hover:text-amber-500 dark:hover:text-amber-400 transition-colors">
                <span className="w-10 text-stone-500 dark:text-zinc-600 text-xs uppercase tracking-wider">{s.id}</span>
                <span className="text-xs">{s.label}</span>
              </a>
            ))}
          </div>
        </Section>

        <div className="pt-4 text-center text-[10px] text-stone-400 dark:text-zinc-700">
          open on desktop for the full experience
        </div>
      </div>
    </main>
  )
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <section>
      <div className="mb-3 flex items-center gap-2">
        <span className="h-px flex-1 bg-stone-200 dark:bg-zinc-800" />
        <span className="text-[10px] tracking-widest text-amber-500 dark:text-amber-400 uppercase">{label}</span>
        <span className="h-px flex-1 bg-stone-200 dark:bg-zinc-800" />
      </div>
      {children}
    </section>
  )
}
