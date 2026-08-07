// ─────────────────────────────────────────────────────────────────────────────
// lib/categories.ts
// Visual identity per condition category — a signature color, a pale tint
// (for badges/backgrounds), and a hand-drawn icon. Keyed by category slug
// (lowercased, spaces → hyphens), matching `Category.slug` from lib/content.ts.
//
// Adding a new category to your content just works: anything not listed here
// falls back to DEFAULT_CATEGORY_STYLE (the brand accent + a leaf icon), so
// nothing breaks — you can add a bespoke entry for it whenever you like.
// ─────────────────────────────────────────────────────────────────────────────
import {
  DigestiveIcon,
  RespiratoryIcon,
  EarIcon,
  GeneralHealthIcon,
  GeneralIcon,
} from "@/components/icons/CategoryIcons";
import type { ComponentType, SVGProps } from "react";

export interface CategoryStyle {
  /** Solid accent color — text, icon strokes, borders on hover. */
  color: string;
  /** Pale tint of `color` — badge/icon-tile backgrounds. */
  tint: string;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
}

export const CATEGORY_STYLES: Record<string, CategoryStyle> = {
  "digestive": {
    color: "var(--cat-digestive)",
    tint: "var(--cat-digestive-tint)",
    Icon: DigestiveIcon,
  },
  "respiratory": {
    color: "var(--cat-respiratory)",
    tint: "var(--cat-respiratory-tint)",
    Icon: RespiratoryIcon,
  },
  "ear-health": {
    color: "var(--cat-ear-health)",
    tint: "var(--cat-ear-health-tint)",
    Icon: EarIcon,
  },
  "general-health": {
    color: "var(--cat-general-health)",
    tint: "var(--cat-general-health-tint)",
    Icon: GeneralHealthIcon,
  },
};

export const DEFAULT_CATEGORY_STYLE: CategoryStyle = {
  color: "var(--color-accent)",
  tint: "var(--color-accent-light)",
  Icon: GeneralIcon,
};

/** Look up a category's visual style by slug, with a safe fallback. */
export function getCategoryStyle(slug: string): CategoryStyle {
  return CATEGORY_STYLES[slug] ?? DEFAULT_CATEGORY_STYLE;
}

/** Convenience — derive the same slug format lib/content.ts uses for category names. */
export function categoryNameToSlug(name: string): string {
  return name.toLowerCase().replace(/\s+/g, "-");
}
