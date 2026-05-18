"use client";

import { useTranslations } from "next-intl";
import { KbdRow } from "../ui/Kbd";

export function Legend() {
  const t = useTranslations("experience");
  const drag = t("drag");

  return (
    <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 border-t hairline pt-4">
      <KbdRow keys={[drag]} label={t("legend.playhead")} />
      <KbdRow keys={["←", "→"]} label={t("legend.stepMonth")} />
      <KbdRow keys={["⇧", "→"]} label={t("legend.stepYear")} />
      <KbdRow keys={["tab"]} label={t("legend.cycleEntries")} />
      <KbdRow keys={["esc"]} label={t("legend.unpin")} />
    </div>
  );
}
