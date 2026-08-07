// ─────────────────────────────────────────────────────────────────────────────
// lib/remedies.ts
//
// Loads remedy data from content/remedies/*.yaml.
//
// Design decisions:
//
// 1. YAML format — human-friendly: no commas, no quotes required, comments
//    allowed. gray-matter already ships js-yaml so no new dependency.
//
// 2. Slug = filename — content/remedies/honey-lemon-tea.yaml has slug
//    "honey-lemon-tea". The slug field is computed, never stored in the file.
//
// 3. Strict validation at load time — missing required fields throw clearly
//    named errors at build time, never silently render broken UI at runtime.
//
// 4. RemedyMap — resolveRemediesForCondition returns a plain object keyed by
//    slug. This is serialisable and safe to pass through Next.js RSC → client
//    component boundaries (no class instances, no functions).
//
// 5. Reuse — the same YAML file can be referenced by any number of conditions.
//    One edit propagates everywhere.
//
// ─────────────────────────────────────────────────────────────────────────────

import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type { Remedy, RemedyFile, RemedyMap } from "@/types";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------
const REMEDIES_DIR = path.join(process.cwd(), "content", "remedies");

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------

const REQUIRED_FIELDS: (keyof RemedyFile)[] = [
  "title",
  "ingredients",
  "preparationSteps",
  "usageInstructions",
];

/**
 * Validates the raw parsed YAML object and returns a typed RemedyFile.
 * Throws a descriptive error at build time if any required field is missing
 * or structurally wrong — you'll see the problem immediately, not in prod.
 */
function validateRemedyFile(
  raw: Record<string, unknown>,
  filePath: string
): RemedyFile {
  for (const field of REQUIRED_FIELDS) {
    if (raw[field] === undefined || raw[field] === null) {
      throw new Error(
        `[RootRemedies] Remedy file is missing required field "${field}".\n` +
        `  File: ${filePath}`
      );
    }
  }

  if (!Array.isArray(raw.ingredients) || raw.ingredients.length === 0) {
    throw new Error(
      `[RootRemedies] "ingredients" must be a non-empty array.\n` +
      `  File: ${filePath}`
    );
  }

  if (!Array.isArray(raw.preparationSteps) || raw.preparationSteps.length === 0) {
    throw new Error(
      `[RootRemedies] "preparationSteps" must be a non-empty array.\n` +
      `  File: ${filePath}`
    );
  }

  return {
    title: String(raw.title),
    description: raw.description ? String(raw.description) : undefined,
    ingredients: (raw.ingredients as Record<string, unknown>[]).map((ing) => ({
      item: String(ing.item ?? ""),
      amount: ing.amount ? String(ing.amount) : undefined,
      notes: ing.notes ? String(ing.notes) : undefined,
    })),
    equipment: Array.isArray(raw.equipment)
      ? (raw.equipment as Record<string, unknown>[]).map((eq) => ({
          item: String(eq.item ?? ""),
          notes: eq.notes ? String(eq.notes) : undefined,
        }))
      : undefined,
    preparationSteps: (raw.preparationSteps as Record<string, unknown>[]).map(
      (s, i) => ({
        step: typeof s.step === "number" ? s.step : i + 1,
        instruction: String(s.instruction ?? ""),
        tip: s.tip ? String(s.tip) : undefined,
      })
    ),
    usageInstructions: String(raw.usageInstructions),
    videoId: raw.videoId ? String(raw.videoId) : undefined,
    notes: raw.notes ? String(raw.notes) : undefined,
    safetyNotes: Array.isArray(raw.safetyNotes)
      ? raw.safetyNotes.map(String)
      : undefined,
    image: raw.image ? String(raw.image) : undefined,
    imageAlt: raw.imageAlt ? String(raw.imageAlt) : undefined,
    imageWidth: raw.imageWidth ? Number(raw.imageWidth) : undefined,
    imageHeight: raw.imageHeight ? Number(raw.imageHeight) : undefined,
  };
}

// ---------------------------------------------------------------------------
// Core loader
// ---------------------------------------------------------------------------

/**
 * Reads and parses a single remedy YAML file by slug.
 * Throws if the file doesn't exist — a missing slug in a condition's frontmatter
 * is always a content error that should fail loudly.
 */
export function getRemedyBySlug(slug: string): Remedy {
  const filePath = path.join(REMEDIES_DIR, `${slug}.yaml`);

  if (!fs.existsSync(filePath)) {
    throw new Error(
      `[RootRemedies] Remedy file not found for slug "${slug}".\n` +
      `  Expected file: ${filePath}\n` +
      `  Check the "remedySlugs" list in your condition's frontmatter.`
    );
  }

  const raw = fs.readFileSync(filePath, "utf-8");

  // gray-matter handles YAML natively — no extra parser needed.
  // For a bare YAML file (no --- frontmatter delimiters), we parse the whole
  // file as the content body using the `engines` option.
  let parsed: Record<string, unknown>;
  try {
    // Try treating the whole file as YAML frontmatter with empty content
    const result = matter(`---\n${raw}\n---`);
    parsed = result.data as Record<string, unknown>;
  } catch (err) {
    throw new Error(
      `[RootRemedies] Failed to parse YAML in remedy file "${filePath}":\n` +
      `  ${err instanceof Error ? err.message : String(err)}`
    );
  }

  const remedyFile = validateRemedyFile(parsed, filePath);

  // Attach the slug (computed from filename, not stored in YAML)
  return { ...remedyFile, slug };
}

// ---------------------------------------------------------------------------
// Batch resolver
// ---------------------------------------------------------------------------

/**
 * Resolves an array of remedy slugs into a RemedyMap.
 * Called once per page render in the condition [slug] page.
 *
 * Returns a plain object — safe to pass across RSC/client boundaries.
 * Throws at the first slug that can't be resolved, with a clear error pointing
 * to the specific condition file and missing remedy slug.
 *
 * @param slugs        - The remedySlugs array from a condition's frontmatter
 * @param conditionSlug - The parent condition slug, used in error messages only
 */
export function resolveRemediesForCondition(
  slugs: string[],
  conditionSlug: string
): RemedyMap {
  const map: RemedyMap = {};

  for (const slug of slugs) {
    try {
      map[slug] = getRemedyBySlug(slug);
    } catch (err) {
      // Re-throw with context about which condition triggered the lookup
      throw new Error(
        `[RootRemedies] Failed to load remedy "${slug}" referenced in condition "${conditionSlug}".\n` +
        `  ${err instanceof Error ? err.message : String(err)}`
      );
    }
  }

  return map;
}

// ---------------------------------------------------------------------------
// Listing helpers
// ---------------------------------------------------------------------------

/**
 * Returns slugs of all remedy YAML files in content/remedies/.
 * Useful for build-time validation and future admin tooling.
 */
export function getAllRemedySlugs(): string[] {
  if (!fs.existsSync(REMEDIES_DIR)) return [];
  return fs
    .readdirSync(REMEDIES_DIR)
    .filter((f) => f.endsWith(".yaml"))
    .map((f) => f.replace(/\.yaml$/, ""));
}

/**
 * Returns all remedies. Primarily for future use (e.g. a /remedies index page).
 * Skips files that fail validation rather than crashing the whole build —
 * listing pages are non-critical, individual condition pages are.
 */
export function getAllRemedies(): Remedy[] {
  return getAllRemedySlugs().flatMap((slug) => {
    try {
      return [getRemedyBySlug(slug)];
    } catch (err) {
      console.warn(`[RootRemedies] Skipping remedy "${slug}":`, err);
      return [];
    }
  });
}

/**
 * Checks that every remedy slug referenced across all condition frontmatters
 * actually has a corresponding YAML file. Returns a list of broken references.
 * Called by the build validation script (scripts/validate-content.ts).
 */
export function findBrokenRemedyReferences(
  conditionRemedySlugs: Array<{ conditionSlug: string; remedySlugs: string[] }>
): Array<{ conditionSlug: string; missingSlug: string }> {
  const existing = new Set(getAllRemedySlugs());
  const broken: Array<{ conditionSlug: string; missingSlug: string }> = [];

  for (const { conditionSlug, remedySlugs } of conditionRemedySlugs) {
    for (const rs of remedySlugs) {
      if (!existing.has(rs)) {
        broken.push({ conditionSlug, missingSlug: rs });
      }
    }
  }

  return broken;
}
