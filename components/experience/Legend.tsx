import { KbdRow } from "../ui/Kbd";

export function Legend() {
  return (
    <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 border-t hairline pt-4">
      <KbdRow keys={["drag"]} label="playhead" />
      <KbdRow keys={["←", "→"]} label="step month" />
      <KbdRow keys={["⇧", "→"]} label="step year" />
      <KbdRow keys={["tab"]} label="cycle entries" />
      <KbdRow keys={["esc"]} label="unpin" />
    </div>
  );
}
