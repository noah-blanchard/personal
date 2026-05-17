export type Lane = "work" | "education" | "internship" | "side";

export type Entry = {
  id: string;
  lane: Lane;
  label: string;        // short name, e.g. "Hooli"
  role?: string;        // appears in pinned details ("Staff Engineer")
  start: string;        // "YYYY-MM"
  end?: string;         // "YYYY-MM"; omitted = ongoing
  location?: string;
  description?: string; // one sentence, pinned mode
  did?: string[];       // what I did / responsibilities (bullets)
  learned?: string[];   // what I learned (bullets)
  tags?: string[];
  href?: string;
};

export const LANE_ORDER: Lane[] = ["work", "education", "internship", "side"];

export const LANE_META: Record<Lane, { label: string; tone: string }> = {
  work: { label: "WORK", tone: "accent" },
  education: { label: "EDU", tone: "neutral" },
  internship: { label: "INT", tone: "neutral" },
  side: { label: "SIDE", tone: "accent-dim" },
};
