"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import type { Locale } from "@/content/types"
import { DAWSplash } from "@/components/daw/DAWSplash"
import { DAWLayout } from "@/components/daw/DAWLayout"
import { DAWProvider } from "@/components/daw/DAWProvider"
import { MobileFallback } from "@/components/daw/MobileFallback"

export default function StudioPage() {
  const params = useParams()
  const locale = (params.locale as Locale) ?? "en"
  const [splashDone, setSplashDone] = useState(false)

  // Mobile detection via CSS — render MobileFallback on small screens
  return (
    <>
      {/* Mobile fallback */}
      <div className="md:hidden">
        <MobileFallback locale={locale} />
      </div>

      {/* DAW — desktop only */}
      <div className="hidden md:block h-screen overflow-hidden">
        <DAWProvider locale={locale}>
          {!splashDone && <DAWSplash onComplete={() => setSplashDone(true)} />}
          <DAWLayout />
        </DAWProvider>
      </div>
    </>
  )
}
