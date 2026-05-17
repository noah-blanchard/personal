import { ImageResponse } from "next/og";

export const alt = "Kai Renner — Senior Fullstack Engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
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
        {/* Background grid */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(to right, rgba(148,163,184,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(148,163,184,0.06) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        {/* Top row */}
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
            <span>kairenner.dev</span>
          </div>
          <div style={{ fontSize: 18, color: "#94a3b8", letterSpacing: "0.2em" }}>
            §01
          </div>
        </div>

        {/* Headline */}
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
            Kai Renner
            <span style={{ color: "#a3e635" }}>.</span>
          </div>
          <div style={{ fontSize: 36, color: "#cbd5e1", maxWidth: 900 }}>
            Senior fullstack engineer. I build the full stack — fast UIs, clean APIs, and the infrastructure that ties them together.
          </div>
        </div>

        {/* Bottom row */}
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
          <span>berlin · open to opportunities</span>
        </div>
      </div>
    ),
    size
  );
}
