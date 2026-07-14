// ─────────────────────────────────────────────────────────────────────────────
// types/index.ts
// Central type definitions for RootRemedies.
// ─────────────────────────────────────────────────────────────────────────────

// ---------------------------------------------------------------------------
// Remedy primitives — shared by both the on-disk YAML shape and runtime use
// ---------------------------------------------------------------------------
export interface RemedyIngredient {
  item: string;
  amount?: string;
  notes?: string;
}

export interface RemedyEquipment {
  item: string;
  notes?: string;
}

export interface RemedyStep {
  step: number;
  instruction: string;
  tip?: string;
}

// ---------------------------------------------------------------------------
// Remedy — the runtime shape used by RemedyCard and MDX components.
// This is what flows into <Remedy slug="..." /> after resolution.
// ---------------------------------------------------------------------------
export interface Remedy {
  // Computed at load time — not stored in YAML
  slug: string;

  // All fields below come directly from the YAML file
  title: string;
  description?: string;
  ingredients: RemedyIngredient[];
  equipment?: RemedyEquipment[];
  preparationSteps: RemedyStep[];
  usageInstructions: string;
  videoId?: string;   // YouTube video ID only (not full URL)
  notes?: string;
  safetyNotes?: string[];
  image?: string;      // Path under /public, e.g. "/images/remedies/ginger-honey.jpg"
  imageAlt?: string;
  imageWidth?: number;
  imageHeight?: number;
}

// ---------------------------------------------------------------------------
// RemedyFile — the raw shape parsed from a YAML file before validation.
// Used internally in lib/remedies.ts only.
// ---------------------------------------------------------------------------
export interface RemedyFile {
  title: string;
  description?: string;
  ingredients: RemedyIngredient[];
  equipment?: RemedyEquipment[];
  preparationSteps: RemedyStep[];
  usageInstructions: string;
  videoId?: string;
  notes?: string;
  safetyNotes?: string[];
  image?: string;
  imageAlt?: string;
  imageWidth?: number;
  imageHeight?: number;
}

// ---------------------------------------------------------------------------
// RemedyMap — the resolved slug→Remedy map injected into MDX at render time.
// The <Remedy slug="..."> component looks up its data here.
// ---------------------------------------------------------------------------
export type RemedyMap = Record<string, Remedy>;

// ---------------------------------------------------------------------------
// Reference — bibliographic citation
// ---------------------------------------------------------------------------
export interface Reference {
  id: string;   // e.g. "ref-1"
  title: string;
  author?: string;
  source: string;
  url?: string;
  year?: number;
  accessed?: string;  // ISO date string
}

// ---------------------------------------------------------------------------
// TOC entry — generated from MDX headings
// ---------------------------------------------------------------------------
export interface TocEntry {
  id: string;
  text: string;
  level: 2 | 3 | 4;
}

// ---------------------------------------------------------------------------
// Condition frontmatter — what goes at the top of every .mdx file
// ---------------------------------------------------------------------------
export interface ConditionFrontmatter {
  // Core identity
  title: string;
  slug: string;
  description: string;

  // Metadata
  author: string;
  lastUpdated: string;  // ISO date string
  tags: string[];
  category: string;

  // Remedy references — slugs of YAML files in content/remedies/
  // The loader resolves these at build time; MDX never touches the filesystem.
  remedySlugs: string[];

  // Media
  coverImage?: string;
  coverImageAlt?: string;

  // SEO
  seoTitle?: string;
  seoDescription?: string;

  // Content flags
  draft?: boolean;
  featured?: boolean;
}

// ---------------------------------------------------------------------------
// Condition — frontmatter + computed fields (no body content)
// ---------------------------------------------------------------------------
export interface Condition {
  frontmatter: ConditionFrontmatter;
  slug: string;
  readingTime: number;  // minutes
  wordCount: number;
  excerpt: string;
}

// ---------------------------------------------------------------------------
// Condition with full content — used on individual condition pages
// ---------------------------------------------------------------------------
export interface ConditionWithContent extends Condition {
  content: string;    // raw MDX string
  remedyMap: RemedyMap;  // pre-resolved slug → Remedy, ready to inject into MDX
}

// ---------------------------------------------------------------------------
// Search index document
// ---------------------------------------------------------------------------
export interface SearchDocument {
  id: string;   // slug
  title: string;
  description: string;
  tags: string[];
  category: string;
  content: string;  // stripped plain text
}

// ---------------------------------------------------------------------------
// Search result
// ---------------------------------------------------------------------------
export interface SearchResult {
  slug: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  score: number;
}

// ---------------------------------------------------------------------------
// Category
// ---------------------------------------------------------------------------
export interface Category {
  slug: string;
  name: string;
  description?: string;
  count: number;
}

// ---------------------------------------------------------------------------
// Navigation
// ---------------------------------------------------------------------------
export interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
}
