"use client";

import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { Mail } from "lucide-react";
import { cn } from "@/lib/utils";

interface NewsletterSignupProps {
  className?: string;
  /** Renders just the embed, without the surrounding section chrome —
   *  useful for embedding inline inside an article or sidebar. */
  bare?: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// Two separate beehiiv forms — one styled for each theme in the beehiiv
// dashboard (Audience → Subscribe forms) — swapped based on the site's
// active theme.
//
// IMPORTANT — this only renders correctly if both forms' "Type" /
// "Placement" setting in beehiiv is set to "Inline". Beehiiv's own embed
// script (subscribe-forms.beehiiv.com/v3/loader.js) fetches each form's
// config from beehiiv and branches on that config's render_type:
//   - "inline"  → mounts the form as a normal child right where our
//                 <script> tag sits, at width:100% of its container.
//   - "popup" / "slide_in_left" / "slide_in_right" / "sticky_top" /
//     "sticky_bottom" → mounts it as a position:fixed overlay appended
//                 directly to <body>, sized to its own content width,
//                 completely ignoring where our component is placed.
// The earlier version of this component looked "stuck at the bottom and
// not full-width" because the dark-theme form was (and possibly still is)
// configured with one of those overlay types in beehiiv, not "Inline" — a
// dashboard setting, not something this component can override. If it still
// doesn't render in place, check that setting on both forms before assuming
// it's a code issue.
const BEEHIIV_FORM_ID_LIGHT = "b41635fd-f0d3-4e4e-9635-f4a0f97b574b";
const BEEHIIV_FORM_ID_DARK  = "8d1a115e-0f77-475a-999d-69c1a8e2de9a";

const LOADER_SRC      = "https://subscribe-forms.beehiiv.com/v3/loader.js";
const ATTRIBUTION_SRC = "https://subscribe-forms.beehiiv.com/attribution.js";

/**
 * Mounts beehiiv's real embedded subscribe form for whichever form matches
 * the site's currently active theme.
 *
 * beehiiv's loader script reads `data-beehiiv-form` off a <script> tag once,
 * the moment that tag first runs — it has no support for changing which
 * form an already-mounted script points to. So switching themes needs a
 * genuinely new <script> element, not just a changed attribute on an
 * existing one. This creates those script tags itself (rather than using
 * next/script, which caches loads by id/src — not a fit for "swap the src
 * based on client-only theme state") and tears the old ones down cleanly
 * whenever the theme changes, so exactly one form is ever mounted at a time.
 */
function BeehiivEmbed({ className }: { className?: string }) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!mounted || !containerRef.current) return;
    const container = containerRef.current;
    const formId = resolvedTheme === "dark" ? BEEHIIV_FORM_ID_DARK : BEEHIIV_FORM_ID_LIGHT;

    // Clear out whatever the previous theme's script + injected form left
    // behind before mounting the new one.
    container.innerHTML = "";

    const loader = document.createElement("script");
    loader.async = true;
    loader.src = LOADER_SRC;
    loader.setAttribute("data-beehiiv-form", formId);

    const attribution = document.createElement("script");
    attribution.type = "text/javascript";
    attribution.async = true;
    attribution.src = ATTRIBUTION_SRC;

    container.appendChild(loader);
    container.appendChild(attribution);

    return () => {
      container.innerHTML = "";
    };
  }, [mounted, resolvedTheme]);

  // Nothing is rendered server-side or before the theme is known — that
  // avoids ever mounting the wrong theme's form during hydration. A
  // min-height placeholder keeps the page from jumping once it does mount.
  if (!mounted) {
    return <div className={cn("w-full min-h-[64px]", className)} aria-hidden />;
  }

  return <div ref={containerRef} className={cn("w-full beehiiv-embed", className)} />;
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

          <BeehiivEmbed />
        </div>
      </div>
    </section>
  );
}
