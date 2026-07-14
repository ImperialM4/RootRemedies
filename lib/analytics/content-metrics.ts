// ─────────────────────────────────────────────────────────────────────────────
// lib/analytics/content-metrics.ts
//
// Content metrics derived directly from the filesystem.
// No database needed — reads content/ to count what's published.
// ─────────────────────────────────────────────────────────────────────────────

import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { getAllConditions } from "@/lib/content";
import { getAllRemedies } from "@/lib/remedies";
import type { ContentMetrics, TopPage } from "./types";

const CONDITIONS_DIR = path.join(process.cwd(), "content", "conditions");
const REMEDIES_DIR   = path.join(process.cwd(), "content", "remedies");

function countVideoSlugs(): number {
  if (!fs.existsSync(CONDITIONS_DIR)) return 0;
  let count = 0;
  const files = fs.readdirSync(CONDITIONS_DIR).filter((f) => f.endsWith(".mdx") && !f.startsWith("_"));
  for (const file of files) {
    const raw = fs.readFileSync(path.join(CONDITIONS_DIR, file), "utf-8");
    // Count YouTubeEmbed / ::youtube directives in the body
    const matches = raw.match(/::youtube|videoId=/g);
    if (matches) count += matches.length;
  }
  // Also count videoId fields in remedy YAML files
  if (fs.existsSync(REMEDIES_DIR)) {
    const yamlFiles = fs.readdirSync(REMEDIES_DIR).filter((f) => f.endsWith(".yaml"));
    for (const file of yamlFiles) {
      const raw = fs.readFileSync(path.join(REMEDIES_DIR, file), "utf-8");
      if (raw.includes("videoId:")) count++;
    }
  }
  return count;
}

export function getContentMetrics(topPages: TopPage[]): ContentMetrics {
  const conditions = getAllConditions();
  const remedies   = getAllRemedies();
  const videos     = countVideoSlugs();

  // Map Plausible top pages to condition slugs
  const topConditions = topPages
    .filter((p) => p.page.startsWith("/conditions/") && p.page !== "/conditions")
    .map((p) => {
      const slug = p.page.replace("/conditions/", "").split("?")[0];
      const condition = conditions.find((c) => c.slug === slug);
      return condition
        ? { slug, title: condition.frontmatter.title, views: p.pageviews }
        : null;
    })
    .filter((x): x is NonNullable<typeof x> => x !== null)
    .slice(0, 10);

  return {
    totalConditions: conditions.length,
    totalRemedies:   remedies.length,
    totalVideos:     videos,
    topConditions,
  };
}
