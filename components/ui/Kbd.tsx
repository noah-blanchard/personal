import type { ReactNode } from "react";

export function Kbd({ children }: { children: ReactNode }) {
  return (
    <kbd className="inline-flex min-w-[1.4em] items-center justify-center rounded border hairline bg-ink-100 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-widest text-ink-700 dark:bg-ink-800 dark:text-ink-200">
      {children}
    </kbd>
  );
}

/**
 * A "key combination" pill cluster + a label.
 * Example: <KbdRow keys={["←","→"]} label="step month" />
 */
export function KbdRow({
  keys,
  label,
  separator = " ",
}: {
  keys: ReactNode[];
  label: string;
  /** Optional rendered between keys (e.g. " + " for chords). Default: a space. */
  separator?: string;
}) {
  return (
    <span className="inline-flex items-center gap-2 whitespace-nowrap">
      <span className="inline-flex items-center gap-1">
        {keys.map((k, i) => (
          <span key={i} className="inline-flex items-center gap-1">
            <Kbd>{k}</Kbd>
            {i < keys.length - 1 && separator !== " " && (
              <span aria-hidden className="text-ink-400 dark:text-ink-500">
                {separator}
              </span>
            )}
          </span>
        ))}
      </span>
      <span className="font-mono text-[10px] uppercase tracking-widest text-ink-500 dark:text-ink-400">
        {label}
      </span>
    </span>
  );
}
