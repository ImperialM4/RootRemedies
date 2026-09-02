"use client";

// ─────────────────────────────────────────────────────────────────────────────
// components/layout/SiteChrome.tsx
//
// Decides whether the public Navbar / Footer wrap the current page. The
// admin dashboard (/admin/*) needs its own full-bleed dark UI with none of
// the public chrome — but it must NOT declare its own <html>/<body>, since
// app/admin isn't a route group and would otherwise nest a second <html>
// inside the root layout's (invalid HTML, and it also meant admin pages
// inherited the public Navbar/Footer around them by accident).
//
// Keeping this decision in one client component means there's still exactly
// one <html>/<body> for the whole app, and adding another "chrome-free"
// section later (if ever) is a one-line change here.
//
// Newsletter signup used to render here too, sitewide, right before the
// footer — which meant it showed up generically at the bottom of every
// single page (about, contact, disclaimer...) instead of somewhere
// deliberate. It now lives in two intentional spots instead: mid-page on
// the homepage (app/page.tsx) and at the end of every article
// (app/conditions/[slug]/page.tsx).
// ─────────────────────────────────────────────────────────────────────────────

import { usePathname } from "next/navigation";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin") ?? false;

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <Navbar />
      <main id="main-content" className="flex-1">
        {children}
      </main>
      <Footer />
    </>
  );
}
