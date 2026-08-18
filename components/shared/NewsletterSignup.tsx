"use client";

import Script from "next/script";
import { Mail } from "lucide-react";
import { cn } from "@/lib/utils";

interface NewsletterSignupProps {
  className?: string;
  /** Renders just the embed, without the surrounding section chrome —
   *  useful for embedding inline inside an article or sidebar. */
  bare?: boolean;
}

// Beehiiv's own embedded subscribe form (created in beehiiv → Audience →
// Subscribe forms). The loader script mounts an iframe into this container;
// all subscription handling, validation, and success/error states are
// managed by beehiiv inside that iframe, so no API route or credentials are
// needed on our side.
//
// `next/script` with strategy="afterInteractive" loads the script on the
// client after the page is interactive — the same approach already used for
// Plausible in app/layout.tsx — so it never runs during SSR and can't cause
// a hydration mismatch.
function BeehiivEmbed({ className }: { className?: string }) {
  return (
    <div className={cn("w-full", className)}>
      <div data-beehiiv-form="0f93fe72-94c7-4e2d-894e-2222abfc75d4" />
      <Script
        id="beehiiv-subscribe-loader"
        src="https://subscribe-forms.beehiiv.com/v3/loader.js"
        data-beehiiv-form="0f93fe72-94c7-4e2d-894e-2222abfc75d4"
        strategy="afterInteractive"
        async
      />
      <Script
        id="beehiiv-attribution"
        src="https://subscribe-forms.beehiiv.com/attribution.js"
        strategy="afterInteractive"
        async
      />
    </div>
  );
}

/**
 * Site-wide newsletter signup, backed by beehiiv's embedded subscribe form.
 * Rendered as a full section by default; pass `bare` to embed just the form
 * elsewhere (e.g. inside an article).
 */
export function NewsletterSignup({ className, bare = false }: NewsletterSignupProps) {
  if (bare) {
    return <BeehiivEmbed className={className} />;
  }

  return (
    <section
      className={cn(
        "border-y border-bark-200 dark:border-bark-800 bg-white dark:bg-bark-900/60",
        className
      )}
    >
      <div className="site-container py-14">
        <div className="max-w-xl mx-auto text-center">
          <div
            className="w-11 h-11 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ backgroundColor: "var(--color-accent-light)" }}
          >
            <Mail className="w-5 h-5" style={{ color: "var(--color-accent)" }} aria-hidden />
          </div>
          <h2
            className="font-serif text-2xl font-semibold mb-2"
            style={{ color: "var(--color-text-primary)" }}
          >
            Get remedies in your inbox
          </h2>
          <p
            className="text-sm leading-relaxed mb-6"
            style={{ color: "var(--color-text-muted)" }}
          >
            New remedies, seasonal picks, and traditional-medicine notes — no spam, unsubscribe anytime.
          </p>

          <div className="max-w-sm mx-auto">
            <BeehiivEmbed />
          </div>
        </div>
      </div>
    </section>
  );
}
