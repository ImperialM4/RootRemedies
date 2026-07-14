import { ImageResponse } from "next/og";
import { OG_LOGO_DATA_URI } from "@/lib/og-logo";

// Route segment config
export const runtime = "edge";
export const alt = "RootRemedies";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Default OG image for the site.
 * Condition pages use their coverImage directly via metadata.
 */
export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#FAFAF7",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "flex-end",
          padding: "60px",
          fontFamily: "Georgia, serif",
        }}
      >
        {/* Background accent */}
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: "500px",
            height: "500px",
            background:
              "radial-gradient(circle at center, #E6C6BC 0%, transparent 70%)",
            opacity: 0.4,
          }}
        />

        {/* Logo mark */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "24px",
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              background: "#F8F1F0",
              borderRadius: 10,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img src={OG_LOGO_DATA_URI} width={40} height={40} alt="" />
          </div>
          <span style={{ fontSize: 28, fontWeight: 700, color: "#1C1712" }}>
            RootRemedies
          </span>
        </div>

        {/* Tagline */}
        <h1
          style={{
            fontSize: 56,
            fontWeight: 700,
            color: "#1C1712",
            lineHeight: 1.1,
            margin: 0,
            marginBottom: "16px",
            maxWidth: "800px",
          }}
        >
          Traditional remedies, documented with care
        </h1>

        <p
          style={{
            fontSize: 22,
            color: "#6D5A4A",
            margin: 0,
          }}
        >
          Not medical advice
        </p>
      </div>
    ),
    { ...size }
  );
}
