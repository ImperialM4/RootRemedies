import type { Metadata } from "next";
import Script from "next/script";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { NewsletterSignup } from "@/components/shared/NewsletterSignup";
import "@/styles/globals.css";

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
    url:         "https://rootremedies.com",
    siteName:    "RootRemedies",
    title:       "RootRemedies — Traditional Home Remedies",
    description: "Traditional home remedies documented by Maanav Kakkad. Not medical advice.",
  },
  twitter: {
    card:        "summary_large_image",
    title:       "RootRemedies",
    description: "Traditional home remedies. Not medical advice.",
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://rootremedies.com"),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const siteId = process.env.NEXT_PUBLIC_PLAUSIBLE_SITE_ID ?? process.env.PLAUSIBLE_SITE_ID ?? "";

  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col antialiased bg-surface text-body transition-colors duration-base">
        <ThemeProvider>
          <a href="#main-content" className="skip-link">Skip to main content</a>
          <Navbar />
          <main id="main-content" className="flex-1">
            {children}
          </main>
          <NewsletterSignup />
          <Footer />
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
