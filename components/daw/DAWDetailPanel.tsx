"use client"

import { AnimatePresence, motion } from "framer-motion"
import { useDAW } from "./DAWProvider"
import { useDAWAudio } from "./audio/useDAWAudio"
import { BIO, FACTS, CURRENTLY } from "@/content/about"
import { PROJECTS } from "@/content/work"
import { TECH_GROUPS } from "@/content/tech"
import { ENTRIES } from "@/content/experience"
import { SITE, SOCIALS } from "@/content/site"
import { pick } from "@/content/types"
import type { DAWSection } from "./types"

export function DAWDetailPanel() {
  const { selectedLane, setDetailOpen, locale } = useDAW()
  const audio = useDAWAudio()

  function handleClose() {
    audio.playClose()
    setDetailOpen(false)
  }

  return (
    <div className="flex h-full flex-col overflow-hidden border-t border-stone-300 dark:border-zinc-800 bg-stone-50 dark:bg-zinc-900">
      {/* Header */}
      <div className="flex shrink-0 items-center gap-2 border-b border-stone-200 dark:border-zinc-800 px-3 py-2">
        {selectedLane && (
          <>
            <div className={`flex h-4 w-4 items-center justify-center rounded text-[10px] ${selectedLane.file.color} text-white shrink-0`}>
              {selectedLane.file.glyph}
            </div>
            <span className="text-[11px] text-stone-700 dark:text-zinc-300">
              {selectedLane.file.name}
              <span className="text-stone-400 dark:text-zinc-600">.{selectedLane.file.ext}</span>
            </span>
          </>
        )}
        {!selectedLane && (
          <span className="text-[10px] text-stone-400 dark:text-zinc-600">no file selected</span>
        )}
        <button
          onClick={handleClose}
          className="ml-auto flex h-5 w-5 items-center justify-center rounded text-[11px] text-stone-400 dark:text-zinc-600 hover:bg-stone-200 dark:hover:bg-zinc-800 hover:text-stone-600 dark:hover:text-zinc-300 transition-colors"
        >
          ✕
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        <AnimatePresence mode="wait">
          {selectedLane && (
            <motion.div
              key={selectedLane.file.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
            >
              <SectionContent section={selectedLane.file.id} locale={locale} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

function SectionContent({ section, locale }: { section: DAWSection; locale: "en" | "fr" }) {
  switch (section) {
    case "about":      return <AboutContent locale={locale} />
    case "experience": return <ExperienceContent locale={locale} />
    case "projects":   return <ProjectsContent locale={locale} />
    case "skills":     return <SkillsContent locale={locale} />
    case "contact":    return <ContactContent locale={locale} />
    case "cv":         return <CVContent />
    default:           return null
  }
}

/* ─── About ─────────────────────────────────────────────── */

function AboutContent({ locale }: { locale: "en" | "fr" }) {
  return (
    <div className="space-y-4 text-[12px] leading-relaxed">
      <div className="space-y-2">
        {BIO[locale].map((para, i) => (
          <p key={i} className="text-stone-700 dark:text-zinc-300">{para}</p>
        ))}
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2">
        {FACTS.map((f) => (
          <div key={f.key} className="rounded border border-stone-200 dark:border-zinc-800 px-3 py-2">
            <p className="text-[10px] uppercase tracking-wider text-stone-400 dark:text-zinc-600">{f.key}</p>
            <p className="text-stone-700 dark:text-zinc-200">{f.value[locale]}</p>
          </div>
        ))}
      </div>
      <div className="mt-2">
        <p className="mb-1 text-[10px] uppercase tracking-wider text-stone-400 dark:text-zinc-600">currently</p>
        <ul className="space-y-1">
          {CURRENTLY[locale].map((item, i) => (
            <li key={i} className="flex gap-2 text-stone-600 dark:text-zinc-400">
              <span className="text-amber-500 dark:text-amber-400 shrink-0">—</span>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

/* ─── Experience ─────────────────────────────────────────── */

function ExperienceContent({ locale }: { locale: "en" | "fr" }) {
  const work = ENTRIES.filter((e) => e.lane === "work").slice(0, 4)

  return (
    <div className="space-y-4 text-[12px]">
      {work.map((entry) => (
        <div key={entry.id} className="border-l-2 border-amber-500/40 pl-3">
          <div className="flex items-baseline gap-2">
            <span className="font-bold text-stone-800 dark:text-zinc-200">{entry.label}</span>
            {entry.role && (
              <span className="text-stone-500 dark:text-zinc-500">— {pick(entry.role, locale)}</span>
            )}
          </div>
          <div className="mt-0.5 text-[10px] text-stone-400 dark:text-zinc-600">
            {entry.start.slice(0, 4)}{entry.end ? ` – ${entry.end.slice(0, 4)}` : " – now"}{entry.location ? ` · ${entry.location}` : ""}
          </div>
          {entry.description && (
            <p className="mt-1.5 leading-relaxed text-stone-600 dark:text-zinc-400">
              {pick(entry.description, locale)}
            </p>
          )}
          {entry.tags && (
            <div className="mt-2 flex flex-wrap gap-1">
              {entry.tags.map((tag) => (
                <span key={tag} className="rounded bg-stone-200 dark:bg-zinc-800 px-1.5 py-0.5 text-[10px] text-stone-500 dark:text-zinc-400">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

/* ─── Projects ───────────────────────────────────────────── */

function ProjectsContent({ locale }: { locale: "en" | "fr" }) {
  return (
    <div className="space-y-4 text-[12px]">
      {PROJECTS.map((project) => (
        <div key={project.id} className="border-l-2 border-amber-500/40 pl-3">
          <div className="flex items-baseline gap-2">
            <span className="font-bold text-stone-800 dark:text-zinc-200">{project.title}</span>
            <span className="text-stone-400 dark:text-zinc-700">{project.year}</span>
          </div>
          <p className="mt-1 leading-relaxed text-stone-600 dark:text-zinc-400">
            {pick(project.blurb, locale)}
          </p>
          <div className="mt-2 flex flex-wrap gap-1">
            {project.stack.map((tag) => (
              <span key={tag} className="rounded bg-stone-200 dark:bg-zinc-800 px-1.5 py-0.5 text-[10px] text-stone-500 dark:text-zinc-400">
                {tag}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

/* ─── Skills ─────────────────────────────────────────────── */

function SkillsContent({ locale }: { locale: "en" | "fr" }) {
  return (
    <div className="grid grid-cols-2 gap-4 text-[12px]">
      {TECH_GROUPS.map((group) => (
        <div key={group.id}>
          <p className="mb-2 text-[10px] uppercase tracking-wider text-amber-500 dark:text-amber-400">
            {pick(group.title, locale)}
          </p>
          <div className="flex flex-wrap gap-1">
            {group.items.map((item) => (
              <span key={item} className="rounded border border-stone-300 dark:border-zinc-800 px-1.5 py-0.5 text-stone-600 dark:text-zinc-300">
                {item}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

/* ─── Contact ────────────────────────────────────────────── */

function ContactContent({ locale }: { locale: "en" | "fr" }) {
  return (
    <div className="space-y-4 text-[12px]">
      <div>
        <p className="mb-1 text-[10px] uppercase tracking-wider text-stone-400 dark:text-zinc-600">email</p>
        <a href={`mailto:${SITE.email}`} className="text-amber-500 dark:text-amber-400 hover:underline">
          {SITE.email}
        </a>
      </div>
      <div>
        <p className="mb-2 text-[10px] uppercase tracking-wider text-stone-400 dark:text-zinc-600">socials</p>
        <div className="flex flex-col gap-1.5">
          {SOCIALS.map((social) => (
            <a
              key={social.id}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-stone-600 dark:text-zinc-300 hover:text-amber-500 dark:hover:text-amber-400 transition-colors"
            >
              <span className="w-14 text-[10px] uppercase tracking-wider text-stone-400 dark:text-zinc-600">
                {social.label}
              </span>
              <span>{social.href === "#" ? "[coming soon]" : social.href}</span>
            </a>
          ))}
        </div>
      </div>
      <div>
        <p className="mb-1 text-[10px] uppercase tracking-wider text-stone-400 dark:text-zinc-600">location</p>
        <p className="text-stone-700 dark:text-zinc-300">{SITE.location[locale]}</p>
      </div>
    </div>
  )
}

/* ─── CV ─────────────────────────────────────────────────── */

function CVContent() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-8 text-[12px]">
      <span className="text-4xl text-stone-300 dark:text-zinc-700">≡</span>
      <p className="text-stone-500 dark:text-zinc-400">cv.txt</p>
      <a
        href="/cv.txt"
        download
        className="rounded border border-amber-500/50 px-4 py-2 text-amber-500 dark:text-amber-400 hover:bg-amber-500/10 transition-colors"
      >
        download cv.txt
      </a>
    </div>
  )
}
