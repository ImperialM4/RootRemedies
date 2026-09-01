#!/usr/bin/env node
// ─────────────────────────────────────────────────────────────────────────────
// scripts/validate-content.mjs
//
// Standalone content validator, run via `npm run validate-content` (and
// automatically before every `npm run build`, see package.json's "prebuild").
//
// This exists because lib/remedies.ts already had a function
// (findBrokenRemedyReferences) written specifically to support a validator
// like this, but no script ever called it. It's plain Node + gray-matter
// (both already project dependencies) rather than TypeScript, so it needs no
// new devDependencies (no ts-node/tsx) to run.
//
// It collects every problem before exiting, rather than stopping at the
// first one, so a single run tells you everything that needs fixing.
//
// Checks performed:
//   1. Every content/conditions/*.mdx file has all required frontmatter
//      fields (title, slug, description, author, lastUpdated, tags, category).
//   2. No two condition files declare the same frontmatter `slug` — this is
//      a real duplicate-content / routing-confusion bug, not just a lint
//      nit (frontmatter.slug is used in canonical URLs and structured data
//      even though the actual route comes from the filename).
//   3. Every remedySlugs entry in a condition's frontmatter points to a real
//      file in content/remedies/*.yaml.
//   4. Every content/remedies/*.yaml file has the required Remedy fields.
// ─────────────────────────────────────────────────────────────────────────────

import fs from "fs";
import path from "path";
import matter from "gray-matter";

const ROOT           = process.cwd();
const CONDITIONS_DIR = path.join(ROOT, "content", "conditions");
const REMEDIES_DIR   = path.join(ROOT, "content", "remedies");

const errors = [];
const warnings = [];

function readConditionFiles() {
  if (!fs.existsSync(CONDITIONS_DIR)) return [];
  return fs
    .readdirSync(CONDITIONS_DIR)
    .filter((f) => f.endsWith(".mdx") && !f.startsWith("_"));
}

function readRemedySlugs() {
  if (!fs.existsSync(REMEDIES_DIR)) return new Set();
  return new Set(
    fs
      .readdirSync(REMEDIES_DIR)
      .filter((f) => f.endsWith(".yaml"))
      .map((f) => f.replace(/\.yaml$/, ""))
  );
}

const REQUIRED_CONDITION_FIELDS = [
  "title", "slug", "description", "author", "lastUpdated", "tags", "category",
];

const REQUIRED_REMEDY_FIELDS = [
  "title", "ingredients", "preparationSteps", "usageInstructions",
];

function validateConditions() {
  const files = readConditionFiles();
  const remedySlugs = readRemedySlugs();
  const seenSlugs = new Map(); // frontmatter slug -> [filenames]

  for (const filename of files) {
    const filePath = path.join(CONDITIONS_DIR, filename);
    const raw = fs.readFileSync(filePath, "utf-8");
    let data;
    try {
      ({ data } = matter(raw));
    } catch (err) {
      errors.push(`${filename}: could not parse frontmatter (${err.message})`);
      continue;
    }

    for (const field of REQUIRED_CONDITION_FIELDS) {
      if (data[field] === undefined || data[field] === null || data[field] === "") {
        errors.push(`${filename}: missing required frontmatter field "${field}"`);
      }
    }

    if (typeof data.slug === "string" && data.slug) {
      const list = seenSlugs.get(data.slug) ?? [];
      list.push(filename);
      seenSlugs.set(data.slug, list);
    }

    const expectedSlug = filename.replace(/\.mdx$/, "");
    if (typeof data.slug === "string" && data.slug && data.slug !== expectedSlug) {
      warnings.push(
        `${filename}: frontmatter slug is "${data.slug}" but the actual route is ` +
        `"/conditions/${expectedSlug}" (derived from the filename) — these should usually match.`
      );
    }

    if (Array.isArray(data.remedySlugs)) {
      for (const rs of data.remedySlugs) {
        if (!remedySlugs.has(rs)) {
          errors.push(`${filename}: remedySlugs references "${rs}", but content/remedies/${rs}.yaml does not exist`);
        }
      }
    }
  }

  for (const [slug, files] of seenSlugs.entries()) {
    if (files.length > 1) {
      errors.push(
        `Duplicate frontmatter slug "${slug}" declared in ${files.length} files: ${files.join(", ")}. ` +
        `Routing is filename-based, so these build as separate pages that both claim the same slug — ` +
        `pick one canonical file, or give the others a distinct slug.`
      );
    }
  }
}

function validateRemedies() {
  if (!fs.existsSync(REMEDIES_DIR)) return;
  const files = fs.readdirSync(REMEDIES_DIR).filter((f) => f.endsWith(".yaml"));

  for (const filename of files) {
    const filePath = path.join(REMEDIES_DIR, filename);
    const raw = fs.readFileSync(filePath, "utf-8");
    let data;
    try {
      ({ data } = matter(`---\n${raw}\n---`));
    } catch (err) {
      errors.push(`${filename}: could not parse YAML (${err.message})`);
      continue;
    }

    for (const field of REQUIRED_REMEDY_FIELDS) {
      if (data[field] === undefined || data[field] === null) {
        errors.push(`${filename}: missing required field "${field}"`);
      }
    }
    if (data.ingredients !== undefined && (!Array.isArray(data.ingredients) || data.ingredients.length === 0)) {
      errors.push(`${filename}: "ingredients" must be a non-empty array`);
    }
    if (data.preparationSteps !== undefined && (!Array.isArray(data.preparationSteps) || data.preparationSteps.length === 0)) {
      errors.push(`${filename}: "preparationSteps" must be a non-empty array`);
    }
  }
}

validateConditions();
validateRemedies();

const conditionCount = readConditionFiles().length;
const remedyCount = fs.existsSync(REMEDIES_DIR)
  ? fs.readdirSync(REMEDIES_DIR).filter((f) => f.endsWith(".yaml")).length
  : 0;

console.log(`\n[validate-content] Checked ${conditionCount} condition file(s) and ${remedyCount} remedy file(s).\n`);

if (warnings.length) {
  console.log(`⚠ ${warnings.length} warning(s):`);
  for (const w of warnings) console.log(`  - ${w}`);
  console.log("");
}

if (errors.length) {
  console.error(`✗ ${errors.length} error(s):`);
  for (const e of errors) console.error(`  - ${e}`);
  console.error("\nFix the above before deploying.\n");
  process.exit(1);
}

console.log("✓ Content is valid.\n");
