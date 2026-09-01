import type { Metadata } from "next";
import Script from "next/script";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { SiteChrome } from "@/components/layout/SiteChrome";
import "@/styles/globals.css";

// Single source of truth for the site's canonical public URL — falls back to
// the production domain so local dev / previews without the env var set
// still produce valid (if not perfectly accurate) absolute URLs.
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://rootremedies.com";

export const metadata: Metadata = {
  title: {
    template: "%s | RootRemedies",
    default:  "RootRemedies — Traditional Home Remedies",
  },
  description: "Traditional home remedies documented by Maanav Kakkad. Not medical advice.",
  keywords:    ["home remedies", "traditional medicine", "natural remedies", "folk medicine"],
  authors:     [{ name: "Maanav Kakkad" }],
  creator:     "Maanav Kakkad",
  openGraph: {
    type:        "website",
    locale:      "en_US",
    url:         SITE_URL,
    siteName:    "RootRemedies",
    title:       "RootRemedies — Traditional Home Remedies",
    description: "Traditional home remedies documented by Maanav Kakkad. Not medical advice.",
  },
  twitter: {
    card:        "summary_large_image",
    title:       "RootRemedies",
    description: "Traditional home remedies. Not medical advice.",
  },
  metadataBase: new URL(SITE_URL),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const siteId = process.env.NEXT_PUBLIC_PLAUSIBLE_SITE_ID ?? process.env.PLAUSIBLE_SITE_ID ?? "";

  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col antialiased bg-surface text-body transition-colors duration-base">
        <ThemeProvider>
          <SiteChrome>{children}</SiteChrome>
        </ThemeProvider>

        {/* Plausible analytics — privacy-friendly, no cookies, GDPR compliant.
            Only loads when PLAUSIBLE_SITE_ID is configured. */}
        {siteId && (
          <Script
            defer
            data-domain={siteId}
            src="https://plausible.io/js/script.js"
            strategy="afterInteractive"
          />
        )}
      </body>
    </html>
  );
}
