// ─────────────────────────────────────────────────────────────────────────────
// lib/mdx-plugins.ts
//
// Shared remark/rehype plugin pipeline for ALL MDX processing in RootRemedies.
//
// Imported by:
//   - next.config.ts           → createMDX() for @next/mdx page routes
//   - app/conditions/[slug]/page.tsx → MDXRemote for content/conditions/*.mdx
//   - app/playground/preview/PreviewRenderer.tsx → MDXRemote for previews
//
// Single source of truth — :::directive syntax, heading IDs, and GFM all
// behave identically everywhere because they share this pipeline.
// ─────────────────────────────────────────────────────────────────────────────

import remarkGfm from "remark-gfm";
import remarkDirective from "remark-directive";
import rehypeSlug from "rehype-slug";
// Relative import so this file is safe to load from next.config.ts context
import { remarkDirectivesToComponents } from "./directives";

// ---------------------------------------------------------------------------
// remarkPlugins — order is significant:
//   1. remarkGfm                    tables, strikethrough, task lists
//   2. remarkDirective              :::name{} → MDAST directive nodes
//   3. remarkDirectivesToComponents directive nodes → MDX JSX elements
// ---------------------------------------------------------------------------
export const remarkPlugins = [
  remarkGfm,
  remarkDirective,
  remarkDirectivesToComponents,
] as const;

// ---------------------------------------------------------------------------
// rehypePlugins
//   rehypeSlug  id="" on headings for TOC anchor links
// ---------------------------------------------------------------------------
export const rehypePlugins = [
  rehypeSlug,
] as const;
