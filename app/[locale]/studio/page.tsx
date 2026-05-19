import { StudioSwitcher } from "@/components/studio/StudioSwitcher"
import { NoScroll } from "@/components/studio/shared/NoScroll"

export default function StudioPage() {
  return (
    <main
      className="h-screen overflow-hidden flex items-start justify-center pt-20 pb-6 px-4"
      style={{ position: "relative", zIndex: 1 }}
    >
      <NoScroll />
      <div className="w-full overflow-y-auto" style={{ maxHeight: "calc(100vh - 6.5rem)" }}>
        <StudioSwitcher />
      </div>
    </main>
  )
}
