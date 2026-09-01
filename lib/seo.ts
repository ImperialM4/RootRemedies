// ─────────────────────────────────────────────────────────────────────────────
// lib/seo.ts
// One place to build the canonical public URL for any path, so every page's
// generateMetadata (or static metadata) can set `alternates.canonical`
// consistently instead of each hand-rolling `${SITE_URL}${path}`.
// ─────────────────────────────────────────────────────────────────────────────

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://rootremedies.com";

/**
 * Builds an absolute canonical URL for a site-relative path.
 * canonicalUrl("/conditions/sore-throat") -> "https://rootremedies.com/conditions/sore-throat"
 * canonicalUrl() or canonicalUrl("/")     -> "https://rootremedies.com"
 */
export function canonicalUrl(path: string = "/"): string {
  const cleanBase = SITE_URL.replace(/\/+$/, "");
  const cleanPath = path === "/" ? "" : `/${path.replace(/^\/+/, "")}`;
  return `${cleanBase}${cleanPath}`;
}
