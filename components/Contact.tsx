"use client";

import { motion } from "framer-motion";
import { CopyableEmail } from "./CopyableEmail";

const SOCIALS = [
  { label: "GitHub", href: "#", icon: GitHubIcon },
  { label: "LinkedIn", href: "#", icon: LinkedInIcon },
  { label: "Twitter / X", href: "#", icon: XIcon },
];

const fade = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const } },
};

export function Contact() {
  return (
    <section
      id="contact"
      aria-label="Contact"
      className="relative border-t hairline py-32 md:py-40"
    >
      <div className="container-grid">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}
          className="max-w-3xl"
        >
          <motion.p
            variants={fade}
            className="font-mono text-xs uppercase tracking-[0.3em] text-ink-500 dark:text-ink-400"
          >
            <span className="text-accent">§</span> Contact
          </motion.p>

          <motion.h2
            variants={fade}
            className="mt-6 font-serif text-5xl leading-[1.05] tracking-tight text-ink-900 dark:text-ink-50 md:text-7xl"
          >
            Have something worth building?
          </motion.h2>

          <motion.p
            variants={fade}
            className="mt-6 max-w-xl text-balance text-lg text-ink-600 dark:text-ink-300"
          >
            I read every message. The fastest way to reach me is email — no form,
            no funnel.
          </motion.p>

          <motion.div variants={fade} className="mt-10">
            <CopyableEmail
              email="hello@kairenner.dev"
              className="group inline-flex items-center gap-3 font-serif text-3xl text-ink-900 underline decoration-ink-300 decoration-1 underline-offset-[6px] transition-colors hover:text-accent hover:decoration-accent dark:text-ink-50 dark:decoration-ink-700 md:text-5xl"
            >
              <span>hello@kairenner.dev</span>
              <span aria-hidden className="text-accent transition-transform group-hover:translate-x-1">
                →
              </span>
            </CopyableEmail>
          </motion.div>

          <motion.ul variants={fade} className="mt-14 flex flex-wrap items-center gap-3">
            {SOCIALS.map(({ label, href, icon: Icon }) => (
              <li key={label}>
                <a
                  href={href}
                  data-magnet
                  aria-label={label}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border hairline text-ink-600 transition-colors hover:border-accent/60 hover:text-ink-900 dark:text-ink-300 dark:hover:text-ink-50"
                >
                  <Icon className="h-4 w-4" />
                </a>
              </li>
            ))}
          </motion.ul>
        </motion.div>
      </div>
    </section>
  );
}

function GitHubIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M12 .5C5.65.5.5 5.65.5 12.02c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56 0-.28-.01-1.02-.02-2-3.2.7-3.87-1.54-3.87-1.54-.52-1.33-1.28-1.69-1.28-1.69-1.05-.72.08-.71.08-.71 1.16.08 1.77 1.2 1.77 1.2 1.03 1.78 2.71 1.27 3.37.97.1-.76.4-1.27.73-1.56-2.55-.29-5.24-1.28-5.24-5.71 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.47.11-3.07 0 0 .98-.31 3.2 1.19a11.1 11.1 0 0 1 5.83 0c2.22-1.5 3.2-1.19 3.2-1.19.63 1.6.23 2.78.11 3.07.74.81 1.19 1.84 1.19 3.1 0 4.44-2.69 5.42-5.25 5.7.41.36.78 1.06.78 2.14 0 1.55-.01 2.8-.01 3.18 0 .31.21.67.8.55C20.22 21.4 23.5 17.1 23.5 12.02 23.5 5.65 18.35.5 12 .5z" />
    </svg>
  );
}

function LinkedInIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.36V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z" />
    </svg>
  );
}

function XIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M18.244 2H21.5l-7.5 8.57L23 22h-6.844l-5.36-7.012L4.62 22H1.36l8.04-9.188L1 2h7.012l4.85 6.41L18.244 2zm-2.4 18h1.86L7.27 4H5.31l10.53 16z" />
    </svg>
  );
}
