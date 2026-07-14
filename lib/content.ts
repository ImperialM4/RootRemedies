// ─────────────────────────────────────────────────────────────────────────────
// lib/content.ts
// The content engine for RootRemedies.
// All MDX file reading, parsing, and indexing happens here.
// Components and pages NEVER touch the filesystem directly.
// ─────────────────────────────────────────────────────────────────────────────

import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";
import { resolveRemediesForCondition } from "@/lib/remedies";
import type {
  Condition,
  ConditionFrontmatter,
  ConditionWithContent,
  Category,
  SearchDocument,
} from "@/types";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------
const CONTENT_DIR = path.join(process.cwd(), "content", "conditions");

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

/**
 * Strip MDX/markdown syntax to get plain text for excerpts and search.
 */
function stripMdx(raw: string): string {
  return raw
    .replace(/^(import|export).*$/gm, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/^---[\s\S]*?---/m, "")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/[*_]{1,3}(.+?)[*_]{1,3}/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/```[\s\S]*?```/g, "")
    .replace(/`[^`]+`/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Generate a 200-character excerpt from plain text.
 */
function makeExcerpt(text: string, maxLen = 200): string {
  if (text.length <= maxLen) return text;
  const cut = text.lastIndexOf(" ", maxLen);
  return text.slice(0, cut > 0 ? cut : maxLen) + "…";
}

/**
 * Parse and validate frontmatter from a gray-matter result.
 * Throws clearly if required fields are missing.
 */
function parseFrontmatter(
  data: Record<string, unknown>,
  filePath: string
): ConditionFrontmatter {
  const required = ["title", "slug", "description", "author", "lastUpdated", "tags", "category"];
  for (const field of required) {
    if (data[field] === undefined || data[field] === null || data[field] === "") {
      throw new Error(
        `[RootRemedies] Missing required frontmatter field "${field}" in:\n  ${filePath}`
      );
    }
  }

  return {
    title: String(data.title),
    slug: String(data.slug),
    description: String(data.description),
    author: String(data.author),
    lastUpdated: String(data.lastUpdated),
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    category: String(data.category),
    // remedySlugs — optional array; defaults to empty (article may have no remedies,
    // e.g. a pure introduction page).
    remedySlugs: Array.isArray(data.remedySlugs) ? data.remedySlugs.map(String) : [],
    coverImage: data.coverImage ? String(data.coverImage) : undefined,
    coverImageAlt: data.coverImageAlt ? String(data.coverImageAlt) : undefined,
    seoTitle: data.seoTitle ? String(data.seoTitle) : undefined,
    seoDescription: data.seoDescription ? String(data.seoDescription) : undefined,
    draft: Boolean(data.draft ?? false),
    featured: Boolean(data.featured ?? false),
  };
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Returns all .mdx filenames (slugs) in the conditions directory.
 */
export function getConditionSlugs(): string[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];
  return fs
    .readdirSync(CONTENT_DIR)
    .filter((f) => f.endsWith(".mdx") && !f.startsWith("_"))
    .map((f) => f.replace(/\.mdx$/, ""));
}

/**
 * Read and parse a single condition file by slug.
 * Also resolves all referenced remedy slugs into a RemedyMap.
 * Returns null if the file doesn't exist or is a draft in production.
 */
export function getConditionBySlug(slug: string): ConditionWithContent | null {
  const filePath = path.join(CONTENT_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);

  const frontmatter = parseFrontmatter(data as Record<string, unknown>, filePath);

  if (frontmatter.draft && process.env.NODE_ENV === "production") return null;

  const plainText = stripMdx(content);
  const stats = readingTime(plainText);

  // Resolve remedy slugs → RemedyMap at load time.
  // This will throw with a clear message if any slug is missing.
  const remedyMap = resolveRemediesForCondition(frontmatter.remedySlugs, slug);

  return {
    frontmatter,
    slug,
    readingTime: Math.ceil(stats.minutes),
    wordCount: stats.words,
    excerpt: makeExcerpt(plainText),
    content,
    remedyMap,
  };
}

/**
 * Returns all conditions (without content body or remedyMap) — for listing
 * pages, search index, sitemap, etc.
 */
export function getAllConditions(): Condition[] {
  const slugs = getConditionSlugs();

  return slugs
    .map((slug) => {
      const c = getConditionBySlug(slug);
      if (!c) return null;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { content: _c, remedyMap: _r, ...rest } = c;
      return rest;
    })
    .filter((c): c is Condition => c !== null)
    .sort(
      (a, b) =>
        new Date(b.frontmatter.lastUpdated).getTime() -
        new Date(a.frontmatter.lastUpdated).getTime()
    );
}

/**
 * Returns featured conditions.
 */
export function getFeaturedConditions(limit = 6): Condition[] {
  return getAllConditions()
    .filter((c) => c.frontmatter.featured)
    .slice(0, limit);
}

/**
 * Returns conditions filtered by a single tag.
 */
export function getConditionsByTag(tag: string): Condition[] {
  return getAllConditions().filter((c) =>
    c.frontmatter.tags.map((t) => t.toLowerCase()).includes(tag.toLowerCase())
  );
}

/**
 * Returns conditions filtered by category slug.
 */
export function getConditionsByCategory(category: string): Condition[] {
  return getAllConditions().filter(
    (c) => c.frontmatter.category.toLowerCase() === category.toLowerCase()
  );
}

/**
 * Returns all unique categories with condition counts.
 */
export function getAllCategories(): Category[] {
  const conditions = getAllConditions();
  const map = new Map<string, number>();

  for (const c of conditions) {
    const cat = c.frontmatter.category;
    map.set(cat, (map.get(cat) ?? 0) + 1);
  }

  return Array.from(map.entries())
    .map(([name, count]) => ({
      slug: name.toLowerCase().replace(/\s+/g, "-"),
      name,
      count,
    }))
    .sort((a, b) => b.count - a.count);
}

/**
 * Returns all unique tags across all conditions.
 */
export function getAllTags(): string[] {
  const conditions = getAllConditions();
  const set = new Set<string>();
  for (const c of conditions) {
    for (const tag of c.frontmatter.tags) {
      set.add(tag.toLowerCase());
    }
  }
  return Array.from(set).sort();
}

/**
 * Returns related conditions based on shared tags, excluding the current slug.
 */
export function getRelatedConditions(
  currentSlug: string,
  tags: string[],
  limit = 4
): Condition[] {
  const all = getAllConditions().filter((c) => c.slug !== currentSlug);
  const lowerTags = tags.map((t) => t.toLowerCase());

  const scored = all
    .map((c) => {
      const shared = c.frontmatter.tags.filter((t) =>
        lowerTags.includes(t.toLowerCase())
      ).length;
      return { condition: c, score: shared };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score);

  return scored.slice(0, limit).map((x) => x.condition);
}

/**
 * Builds the search index documents.
 * Content is stripped of MDX syntax for clean full-text indexing.
 */
export function buildSearchIndex(): SearchDocument[] {
  const slugs = getConditionSlugs();

  return slugs
    .map((slug) => {
      const c = getConditionBySlug(slug);
      if (!c) return null;

      return {
        id: slug,
        title: c.frontmatter.title,
        description: c.frontmatter.description,
        tags: c.frontmatter.tags,
        category: c.frontmatter.category,
        content: stripMdx(c.content),
      } satisfies SearchDocument;
    })
    .filter((d): d is SearchDocument => d !== null);
}
