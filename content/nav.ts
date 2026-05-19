// Nav link IDs. The labels themselves live in messages/{en,fr}.json under nav.*
// because they're short UI chrome strings.
import type { SectionId } from "@/components/providers/ActiveSectionProvider";

export const NAV_LINKS: { id: SectionId; messageKey: string }[] = [
  { id: "work", messageKey: "work" },
  { id: "about", messageKey: "about" },
  { id: "experience", messageKey: "experience" },
  { id: "contact", messageKey: "contact" },
];
