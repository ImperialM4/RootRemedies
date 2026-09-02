"use client";

import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";
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
// Both forms should stay set to "Inline" as their Type/Placement in beehiiv.
// Beehiiv's loader script (subscribe-forms.beehiiv.com/v3/loader.js)
// branches on that per-form setting: "inline" mounts the form as a normal
// child right where our <script> tag sits, at width:100% of its container —
// anything else (Popup, Slide-in, Sticky Bar) mounts it as a position:fixed
// overlay appended to <body> instead, ignoring wherever this component is
// placed on the page.
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
 * The form itself (heading, description, input, button) is entirely
 * configured in the beehiiv dashboard — this component doesn't add any of
 * its own heading/copy on top of it, just a consistent section
 * background/spacing to match the rest of the page. Pass `bare` to drop
 * even that and embed just the form itself (e.g. inside a sidebar).
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
        <div className="max-w-xl mx-auto">
          <BeehiivEmbed />
        </div>
      </div>
    </section>
  );
}
