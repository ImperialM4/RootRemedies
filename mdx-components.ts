// mdx-components.ts
// ─────────────────────────────────────────────────────────────────────────────
// Required by Next.js App Router when @next/mdx is configured.
// Registers component overrides for MDX files used as pages/routes
// (e.g. app/some-page.mdx).
//
// For content/conditions/*.mdx files loaded via next-mdx-remote, components
// are provided directly in [slug]/page.tsx via getMDXComponents(remedyMap).
// That path has access to the pre-resolved remedy map; this path does not,
// so remedy-lookup components gracefully show a "not found" state if used
// outside a condition page context.
// ─────────────────────────────────────────────────────────────────────────────

import type { MDXComponents } from "mdx/types";
import { getMDXComponents } from "@/components/mdx/MDXComponents";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  // Pass empty remedyMap — @next/mdx page routes don't have remedy data.
  // All other publishing components (layout, images, writing, etc.) work fully.
  return getMDXComponents({}, components);
}
