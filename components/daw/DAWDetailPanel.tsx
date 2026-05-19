"use client"

import { AnimatePresence, motion } from "framer-motion"
import { useEffect } from "react"
import { useDAW } from "./DAWProvider"
import { useDAWAudio } from "./audio/useDAWAudio"
import { useSamplePreview } from "./audio/useSamplePreview"
import { DAW_FILES_BY_ID, DAW_FOLDER_BY_ID } from "./files"
import { BIO, FACTS, CURRENTLY, WHOAMI } from "@/content/about"
import { ENTRIES } from "@/content/experience"
import { PROJECTS } from "@/content/work"
import { TECH_GROUPS } from "@/content/tech"
import { SITE, SOCIALS } from "@/content/site"
import { pick } from "@/content/types"
import type { DAWFile, DAWFolderId } from "./types"

export function DAWDetailPanel() {
  const { detailSelection, openFileDetail, setDetailOpen, locale } = useDAW()
  const audio = useDAWAudio()
  const preview = useSamplePreview()

  const selectedFile =
    detailSelection?.type === "file" ? DAW_FILES_BY_ID[detailSelection.fileId] : null
  const selectedFolder =
    detailSelection?.type === "folder" ? DAW_FOLDER_BY_ID[detailSelection.folderId] : null

  function handleClose() {
    audio.playClose()
    preview.stopPreview()
    setDetailOpen(false)
  }

  async function handlePreviewToggle(fileId: string) {
    if (preview.isPlaying(fileId)) {
      preview.stopPreview()
    } else {
      const url = `/audio/${selectedFile?.folderId}/${selectedFile?.itemId}.mp3`
      await preview.playPreview(fileId, url)
    }
  }

  // Stop preview when selection changes to a different file
  useEffect(() => {
    if (preview.currentFileId && preview.currentFileId !== selectedFile?.id) {
      preview.stopPreview()
    }
  }, [selectedFile?.id])

  function handleSelectFile(fileId: string) {
    audio.playOpen()
    openFileDetail(fileId)
  }

  return (
    <div className="flex h-full flex-col overflow-hidden border-t border-stone-300 dark:border-zinc-800 bg-stone-50 dark:bg-zinc-900">
      {/* Header */}
      <div className="flex shrink-0 items-center gap-2 border-b border-stone-200 dark:border-zinc-800 px-3 py-2">
        {selectedFile && (
          <>
            <div className={`flex h-4 w-4 items-center justify-center rounded text-[10px] ${selectedFile.color} text-white shrink-0`}>
              {selectedFile.glyph}
            </div>
            <span className="text-[11px] text-stone-700 dark:text-zinc-300">
              {selectedFile.name}
              <span className="text-stone-400 dark:text-zinc-600">.{selectedFile.ext}</span>
            </span>            {/* Preview Play Button */}
            <button
              onClick={() => handlePreviewToggle(selectedFile.id)}
              className={`ml-1 flex h-5 w-5 items-center justify-center rounded text-[10px] transition-colors ${
                preview.isPlaying(selectedFile.id)
                  ? "bg-amber-500 text-black"
                  : "text-stone-400 dark:text-zinc-600 hover:bg-stone-200 dark:hover:bg-zinc-800 hover:text-stone-600 dark:hover:text-zinc-300"
              }`}
              title={preview.isPlaying(selectedFile.id) ? "Stop preview" : "Play preview"}
            >
              {preview.isPlaying(selectedFile.id) ? "⏸" : "▶"}
            </button>          </>
        )}
        {!selectedFile && selectedFolder && (
          <>
            <span className="text-[11px] text-stone-600 dark:text-zinc-300 uppercase tracking-wider">
              {selectedFolder.name}
            </span>
            <span className="text-[10px] text-stone-400 dark:text-zinc-600">summary</span>
          </>
        )}
        {!selectedFile && !selectedFolder && (
          <span className="text-[10px] text-stone-400 dark:text-zinc-600">no selection</span>
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
          {selectedFile && (
            <motion.div
              key={selectedFile.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
            >
              <FileDetailContent file={selectedFile} locale={locale} />
            </motion.div>
          )}
          {!selectedFile && selectedFolder && (
            <motion.div
              key={`folder-${selectedFolder.id}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
            >
              <FolderSummary folderId={selectedFolder.id} locale={locale} onSelectFile={handleSelectFile} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

function FileDetailContent({ file, locale }: { file: DAWFile; locale: "en" | "fr" }) {
  switch (file.folderId) {
    case "about":
      return <AboutFileContent itemId={file.itemId} locale={locale} />
    case "experience":
      return <ExperienceEntryContent entryId={file.itemId} locale={locale} />
    case "projects":
      return <ProjectContent projectId={file.itemId} locale={locale} />
    case "skills":
      return <SkillGroupContent groupId={file.itemId} locale={locale} />
    case "contact":
      return <ContactContent locale={locale} />
    case "cv":
      return <CVContent label={file.name} />
    default:
      return null
  }
}

function FolderSummary({
  folderId,
  locale,
  onSelectFile,
}: {
  folderId: DAWFolderId
  locale: "en" | "fr"
  onSelectFile: (fileId: string) => void
}) {
  switch (folderId) {
    case "about":
      return (
        <div className="grid gap-3 text-[12px]">
          {ABOUT_ITEMS.map((item) => {
            const file = getFile("about", item.id)
            if (!file) return null
            return (
              <SummaryCard
                key={file.id}
                file={file}
                title={item.title}
                subtitle={item.subtitle(locale)}
                onClick={() => onSelectFile(file.id)}
              />
            )
          })}
        </div>
      )
    case "experience":
      return (
        <div className="grid gap-3 text-[12px]">
          {ENTRIES.map((entry) => {
            const file = getFile("experience", entry.id)
            if (!file) return null
            const role = entry.role ? pick(entry.role, locale) : ""
            const period = `${entry.start.slice(0, 4)}${entry.end ? ` – ${entry.end.slice(0, 4)}` : " – now"}`
            const subtitle = [role, period, entry.location].filter(Boolean).join(" · ")
            return (
              <SummaryCard
                key={file.id}
                file={file}
                title={entry.label}
                subtitle={subtitle}
                onClick={() => onSelectFile(file.id)}
              />
            )
          })}
        </div>
      )
    case "projects":
      return (
        <div className="grid gap-3 text-[12px]">
          {PROJECTS.map((project) => {
            const file = getFile("projects", project.id)
            if (!file) return null
            return (
              <SummaryCard
                key={file.id}
                file={file}
                title={project.title}
                subtitle={`${project.year} · ${pick(project.blurb, locale)}`}
                onClick={() => onSelectFile(file.id)}
              />
            )
          })}
        </div>
      )
    case "skills":
      return (
        <div className="grid gap-3 text-[12px]">
          {TECH_GROUPS.map((group) => {
            const file = getFile("skills", group.id)
            if (!file) return null
            return (
              <SummaryCard
                key={file.id}
                file={file}
                title={pick(group.title, locale)}
                subtitle={`${group.items.length} items`}
                onClick={() => onSelectFile(file.id)}
              />
            )
          })}
        </div>
      )
    case "contact": {
      const file = getFile("contact", "contact")
      if (!file) return null
      return (
        <SummaryCard
          file={file}
          title={SITE.email}
          subtitle={SITE.location[locale]}
          onClick={() => onSelectFile(file.id)}
        />
      )
    }
    case "cv": {
      const file = getFile("cv", "cv_en")
      if (!file) return null
      return (
        <SummaryCard
          file={file}
          title={file.name}
          subtitle="download"
          onClick={() => onSelectFile(file.id)}
        />
      )
    }
    default:
      return null
  }
}

const ABOUT_ITEMS = [
  {
    id: "bio",
    title: "bio",
    subtitle: (locale: "en" | "fr") => `${BIO[locale].length} paragraphs`,
  },
  {
    id: "facts",
    title: "facts",
    subtitle: () => `${FACTS.length} facts`,
  },
  {
    id: "currently",
    title: "currently",
    subtitle: (locale: "en" | "fr") => `${CURRENTLY[locale].length} items`,
  },
  {
    id: "whoami",
    title: "whoami",
    subtitle: (locale: "en" | "fr") => `${WHOAMI[locale].length} lines`,
  },
]

function getFile(folderId: DAWFolderId, itemId: string) {
  const folder = DAW_FOLDER_BY_ID[folderId]
  return folder?.files.find((file) => file.itemId === itemId) ?? null
}

function SummaryCard({
  file,
  title,
  subtitle,
  onClick,
}: {
  file: DAWFile
  title: string
  subtitle?: string
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-start gap-3 rounded border border-stone-200 dark:border-zinc-800 bg-stone-50 dark:bg-zinc-900/40 px-3 py-2 text-left transition-colors hover:border-amber-500/60"
    >
      <div className={`flex h-7 w-7 items-center justify-center rounded text-[11px] text-white ${file.color}`}>
        {file.glyph}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-2">
          <span className="truncate text-[12px] font-semibold text-stone-700 dark:text-zinc-200">
            {title}
          </span>
          <span className="text-[9px] text-stone-400 dark:text-zinc-600">.{file.ext}</span>
        </div>
        {subtitle && (
          <p className="mt-1 text-[10px] text-stone-500 dark:text-zinc-500 line-clamp-2">
            {subtitle}
          </p>
        )}
      </div>
    </button>
  )
}

/* ─── About ─────────────────────────────────────────────── */

function AboutFileContent({ itemId, locale }: { itemId: string; locale: "en" | "fr" }) {
  switch (itemId) {
    case "bio":
      return <AboutBioContent locale={locale} />
    case "facts":
      return <AboutFactsContent locale={locale} />
    case "currently":
      return <AboutCurrentlyContent locale={locale} />
    case "whoami":
      return <AboutWhoamiContent locale={locale} />
    default:
      return <EmptyDetail label="about" />
  }
}

function AboutBioContent({ locale }: { locale: "en" | "fr" }) {
  return (
    <div className="space-y-2 text-[12px] leading-relaxed">
      {BIO[locale].map((para, i) => (
        <p key={i} className="text-stone-700 dark:text-zinc-300">{para}</p>
      ))}
    </div>
  )
}

function AboutFactsContent({ locale }: { locale: "en" | "fr" }) {
  return (
    <div className="grid grid-cols-2 gap-2 text-[12px]">
      {FACTS.map((fact) => (
        <div key={fact.key} className="rounded border border-stone-200 dark:border-zinc-800 px-3 py-2">
          <p className="text-[10px] uppercase tracking-wider text-stone-400 dark:text-zinc-600">{fact.key}</p>
          <p className="text-stone-700 dark:text-zinc-200">{fact.value[locale]}</p>
        </div>
      ))}
    </div>
  )
}

function AboutCurrentlyContent({ locale }: { locale: "en" | "fr" }) {
  return (
    <div className="text-[12px]">
      <p className="mb-2 text-[10px] uppercase tracking-wider text-stone-400 dark:text-zinc-600">currently</p>
      <ul className="space-y-1">
        {CURRENTLY[locale].map((item, i) => (
          <li key={i} className="flex gap-2 text-stone-600 dark:text-zinc-400">
            <span className="text-amber-500 dark:text-amber-400 shrink-0">—</span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}

function AboutWhoamiContent({ locale }: { locale: "en" | "fr" }) {
  return (
    <div className="text-[12px]">
      <p className="mb-2 text-[10px] uppercase tracking-wider text-stone-400 dark:text-zinc-600">whoami</p>
      <ul className="space-y-1">
        {WHOAMI[locale].map((item, i) => (
          <li key={i} className="flex gap-2 text-stone-600 dark:text-zinc-400">
            <span className="text-amber-500 dark:text-amber-400 shrink-0">—</span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}

/* ─── Experience ─────────────────────────────────────────── */

function ExperienceEntryContent({ entryId, locale }: { entryId: string; locale: "en" | "fr" }) {
  const entry = ENTRIES.find((item) => item.id === entryId)
  if (!entry) return <EmptyDetail label="experience" />

  return (
    <div className="space-y-4 text-[12px]">
      <div>
        <div className="flex items-baseline gap-2">
          <span className="font-bold text-stone-800 dark:text-zinc-200">{entry.label}</span>
          {entry.role && (
            <span className="text-stone-500 dark:text-zinc-500">— {pick(entry.role, locale)}</span>
          )}
        </div>
        <div className="mt-0.5 text-[10px] text-stone-400 dark:text-zinc-600">
          {entry.start.slice(0, 4)}{entry.end ? ` – ${entry.end.slice(0, 4)}` : " – now"}{entry.location ? ` · ${entry.location}` : ""}
        </div>
      </div>
      {entry.description && (
        <p className="leading-relaxed text-stone-600 dark:text-zinc-400">
          {pick(entry.description, locale)}
        </p>
      )}
      {entry.did && (
        <div>
          <p className="mb-1 text-[10px] uppercase tracking-wider text-stone-400 dark:text-zinc-600">did</p>
          <ul className="space-y-1">
            {pick(entry.did, locale).map((item) => (
              <li key={item} className="flex gap-2 text-stone-600 dark:text-zinc-400">
                <span className="text-amber-500 dark:text-amber-400 shrink-0">—</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}
      {entry.learned && (
        <div>
          <p className="mb-1 text-[10px] uppercase tracking-wider text-stone-400 dark:text-zinc-600">learned</p>
          <ul className="space-y-1">
            {pick(entry.learned, locale).map((item) => (
              <li key={item} className="flex gap-2 text-stone-600 dark:text-zinc-400">
                <span className="text-amber-500 dark:text-amber-400 shrink-0">—</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}
      {entry.tags && (
        <div className="flex flex-wrap gap-1">
          {entry.tags.map((tag) => (
            <span key={tag} className="rounded bg-stone-200 dark:bg-zinc-800 px-1.5 py-0.5 text-[10px] text-stone-500 dark:text-zinc-400">
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

/* ─── Projects ───────────────────────────────────────────── */

function ProjectContent({ projectId, locale }: { projectId: string; locale: "en" | "fr" }) {
  const project = PROJECTS.find((item) => item.id === projectId)
  if (!project) return <EmptyDetail label="project" />

  return (
    <div className="space-y-4 text-[12px]">
      <div className="flex items-baseline gap-2">
        <span className="font-bold text-stone-800 dark:text-zinc-200">{project.title}</span>
        <span className="text-stone-400 dark:text-zinc-700">{project.year}</span>
      </div>
      <p className="leading-relaxed text-stone-600 dark:text-zinc-400">
        {pick(project.blurb, locale)}
      </p>
      <p className="leading-relaxed text-stone-600 dark:text-zinc-400">
        {pick(project.built, locale)}
      </p>
      <div className="flex flex-wrap gap-1">
        {project.stack.map((tag) => (
          <span key={tag} className="rounded bg-stone-200 dark:bg-zinc-800 px-1.5 py-0.5 text-[10px] text-stone-500 dark:text-zinc-400">
            {tag}
          </span>
        ))}
      </div>
    </div>
  )
}

/* ─── Skills ─────────────────────────────────────────────── */

function SkillGroupContent({ groupId, locale }: { groupId: string; locale: "en" | "fr" }) {
  const group = TECH_GROUPS.find((item) => item.id === groupId)
  if (!group) return <EmptyDetail label="skills" />

  return (
    <div className="text-[12px]">
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

function CVContent({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-8 text-[12px]">
      <span className="text-4xl text-stone-300 dark:text-zinc-700">≡</span>
      <p className="text-stone-500 dark:text-zinc-400">{label}.txt</p>
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

function EmptyDetail({ label }: { label: string }) {
  return (
    <div className="text-[12px] text-stone-500 dark:text-zinc-500">
      no details for {label}
    </div>
  )
}
