// ─────────────────────────────────────────────────────────────────────────────
// lib/toc.ts
// Extracts heading structure from raw MDX for the table of contents.
// ─────────────────────────────────────────────────────────────────────────────

import type { TocEntry } from "@/types";

/**
 * Parses the raw MDX string and returns a flat list of headings at levels 2-4.
 * Heading IDs are generated to match what rehype-slug produces.
 */
export function extractToc(mdxContent: string): TocEntry[] {
  const headingRegex = /^(#{2,4})\s+(.+)$/gm;
  const entries: TocEntry[] = [];

  let match;
  while ((match = headingRegex.exec(mdxContent)) !== null) {
    const level = match[1].length as 2 | 3 | 4;
    const rawText = match[2];

    // Strip any inline code or other markdown from the heading text
    const text = rawText.replace(/`[^`]+`/g, "").trim();

    // Generate slug matching rehype-slug behavior
    const id = text
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");

    entries.push({ id, text, level });
  }

  return entries;
}
