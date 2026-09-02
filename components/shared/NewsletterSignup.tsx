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
// Subscribe forms). The v3 loader script reads its target form from its own
// `data-beehiiv-form` attribute and mounts the real subscribe form itself —
// all subscription handling, validation, and success/error states are
// handled by beehiiv, so no API route or credentials are needed on our side.
// Wrapping both scripts in a container div keeps whatever beehiiv injects
// contained inside our styled layout instead of landing wherever in the DOM.
//
// `next/script` with strategy="afterInteractive" loads the script on the
// client after the page is interactive — the same approach already used for
// Plausible in app/layout.tsx — so it never runs during SSR and can't cause
// a hydration mismatch. Attributes below are copied exactly from beehiiv's
// provided embed snippet; don't change the form id or script URLs without
// grabbing a fresh snippet from the beehiiv dashboard.
function BeehiivEmbed({ className }: { className?: string }) {
  return (
    <div className={cn("w-full beehiiv-embed", className)}>
      <Script
        id="beehiiv-subscribe-loader"
        async
        src="https://subscribe-forms.beehiiv.com/v3/loader.js"
        data-beehiiv-form="8d1a115e-0f77-475a-999d-69c1a8e2de9a"
        strategy="afterInteractive"
      />
      <Script
        id="beehiiv-attribution"
        type="text/javascript"
        async
        src="https://subscribe-forms.beehiiv.com/attribution.js"
        strategy="afterInteractive"
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
