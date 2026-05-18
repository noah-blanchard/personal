import { ImageResponse } from "next/og";
import { SITE } from "@/content/site";
import { pick, type Locale } from "@/content/types";

export const alt = SITE.name;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const safeLocale: Locale = locale === "fr" ? "fr" : "en";
  const role = pick(SITE.roleShort, safeLocale);
  const description = pick(SITE.description, safeLocale);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#020617",
          color: "#f8fafc",
          padding: 80,
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(to right, rgba(148,163,184,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(148,163,184,0.06) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            position: "relative",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              fontSize: 18,
              color: "#94a3b8",
              letterSpacing: "0.3em",
              textTransform: "uppercase",
            }}
          >
            <div style={{ width: 10, height: 10, borderRadius: 9999, background: "#a3e635" }} />
            <span>noahblanchard.dev</span>
          </div>
          <div style={{ fontSize: 18, color: "#94a3b8", letterSpacing: "0.2em" }}>
            §01 · {safeLocale.toUpperCase()}
          </div>
        </div>

        <div style={{ position: "relative", display: "flex", flexDirection: "column", gap: 24 }}>
          <div
            style={{
              fontSize: 132,
              fontWeight: 400,
              lineHeight: 1,
              letterSpacing: "-0.04em",
              display: "flex",
              alignItems: "baseline",
            }}
          >
            {SITE.name}
            <span style={{ color: "#a3e635" }}>.</span>
          </div>
          <div style={{ fontSize: 36, color: "#cbd5e1", maxWidth: 900 }}>
            {role}. {description}
          </div>
        </div>

        <div
          style={{
            position: "relative",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            color: "#94a3b8",
            fontSize: 20,
            fontFamily: "monospace",
          }}
        >
          <span>typescript · go · postgres · k8s</span>
          <span>
            {pick(SITE.location, safeLocale).toLowerCase()} ·{" "}
            {safeLocale === "fr" ? "ouvert·e aux opportunités" : "open to opportunities"}
          </span>
        </div>
      </div>
    ),
    size
  );
}
