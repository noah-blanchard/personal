# Personal Website

A single-page personal site for a senior fullstack engineer. Next.js App Router, TypeScript, Framer Motion, Tailwind.

## Run locally

```bash
bun install
bun run dev
```

Then open <http://localhost:3000>.

Production smoke test:

```bash
bun run build && bun run start
```

## What's in here

```
app/
  layout.tsx          # fonts, metadata, theme bootstrap, providers
  page.tsx            # composes Nav + sections + Footer
  globals.css         # tailwind + ~20 lines of base CSS
  icon.tsx            # favicon (initials, generated)
  opengraph-image.tsx # 1200x630 OG card (generated)
components/
  Nav.tsx, MobileDrawer.tsx
  Hero.tsx, ScrambleText.tsx, TypewriterRole.tsx, ScrollIndicator.tsx
  Work.tsx, ProjectCard.tsx
  About.tsx
  Tech.tsx
  Contact.tsx
  Footer.tsx
  CursorFollower.tsx
  ThemeToggle.tsx
  ActiveSectionProvider.tsx
```

## Replacing the persona

The site ships with a stand-in persona, **Kai Renner**. To make it yours, edit:

| File | What to change |
|---|---|
| `app/layout.tsx` | `SITE_URL`, `NAME`, `TITLE`, `DESCRIPTION`, `twitter.creator` |
| `app/opengraph-image.tsx` | Name, tagline, footer line |
| `app/icon.tsx` | Initials (`kr`) |
| `components/Nav.tsx` | Name in the brand link |
| `components/Hero.tsx` | Name, `ROLES` array, location line |
| `components/About.tsx` | Bio paragraphs, `FACTS`, `Currently`, `$ whoami` lines |
| `components/Work.tsx` | `PROJECTS` array |
| `components/Tech.tsx` | `GROUPS` array |
| `components/Contact.tsx` | Email + `SOCIALS` href values |
| `components/Footer.tsx` | Footer line |
| `public/cv.txt` | Replace with `cv.pdf` and update href in `components/Hero.tsx` |

## Design choices, briefly

- **Dark-first**, class-based with a pre-hydration bootstrap script to avoid FOUC. The toggle persists to `localStorage`.
- **Typography-led**: Instrument Serif for display, Inter for body, JetBrains Mono for labels/code. Loaded via `next/font` with `display: swap`.
- **Motion**: Framer Motion only. Everything respects `prefers-reduced-motion` via `useReducedMotion()`. Only `transform` and `opacity` are animated.
- **Active nav indicator**: a single `IntersectionObserver` in `ActiveSectionProvider` feeds a `[ ... ]` bracket marker that animates between links via `layoutId`.
- **Cursor follower**: spring-physics dot, magnetizes onto anything with `data-magnet`, `<a>`, `<button>`. Hidden on touch / coarse pointers and when reduced motion is on.
- **No image assets** in v1 — project cards use a typographic visual layer. To add screenshots, drop them in `public/` and use `next/image` inside `ProjectCard.tsx`.
- **A11y**: semantic landmarks, skip link, keyboard-reachable everything, visible focus rings, AA contrast for body copy.

## Lighthouse

Targeted ≥95 on Perf / A11y / SEO / Best Practices (mobile, throttled). To verify: build, start, then run Lighthouse from Chrome DevTools.

## Stack

- Next.js 15 (App Router) · React 19 · TypeScript (strict)
- Tailwind CSS 3
- Framer Motion 11
- `next/font` (Inter, Instrument Serif, JetBrains Mono)
- Node 20+ recommended
