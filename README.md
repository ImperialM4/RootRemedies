# RootRemedies

An educational website documenting traditional home remedies.

> **Not medical advice.** All content is for educational purposes only.

---

## Tech Stack

- **Next.js 15** (App Router) — framework
- **TypeScript** — type safety throughout
- **Tailwind CSS** — styling
- **MDX** — article format (Markdown + React components)
- **next-mdx-remote** — MDX rendering
- **MiniSearch** — client-side full-text search
- **Vercel** — deployment

---

## Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Copy environment variables
cp .env.example .env.local
# Edit .env.local with your values

# 3. Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Writing an Article

**You never need to touch React code.** Just add an MDX file.

### 1. Copy the template

```bash
cp content/conditions/_TEMPLATE.mdx content/conditions/your-condition.mdx
```

### 2. Fill in the frontmatter

Open the file and fill in the YAML at the top:

```yaml
---
title: "Your Condition Title"
slug: "your-condition"          # Must match the filename
description: "Short description shown in search and listings."
author: "Your Name"
lastUpdated: "2024-01-15"
tags:
  - your-tag
  - another-tag
category: "Respiratory"         # Keep consistent across articles
coverImage: "/images/conditions/your-condition.jpg"
coverImageAlt: "Alt text for the image"
featured: false                  # Set true to show on homepage
draft: false                     # Set true to hide in production
---
```

### 3. Define your remedies as JavaScript objects

At the top of the MDX body (below the frontmatter), export your remedy data:

```mdx
export const honeyLemonTea = {
  title: "Honey Lemon Tea",
  description: "A classic soothing drink.",
  ingredients: [
    { item: "Raw honey", amount: "1 tablespoon" },
    { item: "Fresh lemon juice", amount: "1 tablespoon" },
    { item: "Hot water", amount: "1 cup" },
  ],
  equipment: [
    { item: "Mug" },
    { item: "Spoon" },
  ],
  preparationSteps: [
    { step: 1, instruction: "Heat water to just below boiling.", tip: "Do not boil — very hot water destroys some honey properties." },
    { step: 2, instruction: "Squeeze lemon juice into mug." },
    { step: 3, instruction: "Add honey and pour hot water over." },
    { step: 4, instruction: "Stir until honey dissolves." },
  ],
  usageInstructions: "Drink while warm, up to 3 times per day. Best consumed at the first sign of symptoms.",
  safetyNotes: [
    "Do not give honey to children under 12 months — risk of infant botulism.",
    "Lemon may aggravate acid reflux in some individuals.",
  ],
};
```

### 4. Write the article body

Use standard Markdown plus the custom components:

```mdx
## Introduction

Write your introduction here using regular Markdown.

<Info title="Traditional context">
Note the cultural background of this remedy.
</Info>

## Remedies

<Remedy remedy={honeyLemonTea} index={0} />

## Safety

<Warning title="Consult a doctor if...">
List who should be cautious.
</Warning>

<SafetyDisclaimer />

<References references={references} />
```

### 5. That's it

Save the file. The site automatically:
- Creates the route `/conditions/your-condition`
- Adds the article to the `/conditions` listing
- Adds it to the category page
- Adds it to full-text search
- Generates a sitemap entry

---

## Available MDX Components

| Component | Usage | Description |
|-----------|-------|-------------|
| `<Remedy>` | `<Remedy remedy={obj} index={0} />` | Full remedy card with ingredients, steps, video |
| `<Warning>` | `<Warning title="...">text</Warning>` | Amber warning box |
| `<Info>` | `<Info title="...">text</Info>` | Blue info box |
| `<Tip>` | `<Tip title="...">text</Tip>` | Green tip box |
| `<Danger>` | `<Danger title="...">text</Danger>` | Red danger box |
| `<Video>` | `<Video videoId="..." title="..." />` | Lazy-loaded YouTube embed |
| `<References>` | `<References references={array} />` | Formatted reference list |
| `<SafetyDisclaimer>` | `<SafetyDisclaimer />` | Standard medical disclaimer |

---

## Remedy Data Schema

```typescript
{
  title: string;
  description?: string;
  ingredients: Array<{
    item: string;
    amount?: string;
    notes?: string;
  }>;
  equipment?: Array<{
    item: string;
    notes?: string;
  }>;
  preparationSteps: Array<{
    step: number;
    instruction: string;
    tip?: string;
  }>;
  usageInstructions: string;
  videoId?: string;       // YouTube video ID only (not full URL)
  notes?: string;
  safetyNotes?: string[];
}
```

---

## Folder Structure

```
rootremedies/
├── app/                          # Next.js App Router
│   ├── layout.tsx                # Root layout (Navbar + Footer)
│   ├── page.tsx                  # Home page
│   ├── not-found.tsx             # 404 page
│   ├── sitemap.ts                # Auto-generated sitemap
│   ├── robots.ts                 # robots.txt
│   ├── conditions/
│   │   ├── page.tsx              # /conditions listing with tag filter
│   │   └── [slug]/
│   │       └── page.tsx          # /conditions/[slug] — auto-generated
│   ├── categories/
│   │   ├── page.tsx              # /categories listing
│   │   └── [slug]/
│   │       └── page.tsx          # /categories/[slug]
│   ├── about/page.tsx
│   ├── disclaimer/page.tsx
│   ├── contact/page.tsx
│   └── api/
│       └── search-index/
│           └── route.ts          # Serves serialized MiniSearch index
│
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx            # Sticky top nav with mobile menu + search
│   │   └── Footer.tsx
│   ├── condition/
│   │   ├── ConditionHeader.tsx   # Title, meta, cover image, breadcrumbs
│   │   ├── ConditionCard.tsx     # Card for listing pages (2 variants)
│   │   ├── TableOfContents.tsx   # Sticky sidebar TOC with active tracking
│   │   └── RelatedConditions.tsx
│   ├── remedy/
│   │   ├── RemedyCard.tsx        # Full remedy block
│   │   ├── IngredientList.tsx    # Ingredients + equipment
│   │   └── PreparationSteps.tsx  # Numbered steps
│   ├── shared/
│   │   ├── SearchDialog.tsx      # Full-text search modal (Cmd+K)
│   │   ├── Breadcrumbs.tsx
│   │   ├── WarningBox.tsx        # Info/warning/tip/danger callouts
│   │   ├── VideoEmbed.tsx        # Lazy YouTube embed
│   │   └── ReferenceList.tsx
│   └── mdx/
│       └── MDXComponents.tsx     # Maps MDX component names → React components
│
├── content/
│   └── conditions/               # ← YOUR ARTICLES GO HERE
│       └── _TEMPLATE.mdx         # Copy this to start a new article
│
├── lib/
│   ├── content.ts                # File system → typed Condition objects
│   ├── search.ts                 # MiniSearch setup (server + client)
│   ├── toc.ts                    # Heading extractor for TOC
│   └── utils.ts                  # cn(), formatDate(), etc.
│
├── types/
│   └── index.ts                  # All TypeScript interfaces
│
└── styles/
    └── globals.css               # Tailwind + custom properties + fonts
```

---

## Deployment (Vercel)

1. Push to GitHub
2. Connect the repo to Vercel
3. Set environment variable: `NEXT_PUBLIC_SITE_URL=https://yourdomain.com`
4. Deploy

Every `git push` to `main` triggers a new build. New MDX files are picked up automatically.

---

## Categories

Categories are derived automatically from the `category` field in frontmatter. You don't need to register them anywhere — just use the same string consistently across related articles.

---

## Search

Search is powered by MiniSearch, a fast client-side full-text search library. The index is built from all MDX files at build time (or request time in development) and served as JSON from `/api/search-index`. The browser downloads the index once and caches it — searches happen entirely client-side with no server round-trips.

Trigger search with **Cmd+K** (Mac) or **Ctrl+K** (Windows).

---

## Publishing System

RootRemedies has a full editorial component library. Every component is usable in MDX with no code changes.

### Full component reference: `/playground`

Visit `/playground` in the browser for live docs, copyable MDX examples, and prop tables for every component.

### Quick reference

**Layout:** `<HeroSection>` `<TwoColumn>` `<ThreeColumn>` `<SectionHeader>` `<Divider>`

**Images:** `<HeroImage>` `<ImageWithCaption>` `<FullWidthImage>` `<ImageGallery>` `<PhotoGrid>`

**Video:** `<YouTubeEmbed>` `<VideoEmbed>`

**Writing:** `<Quote>` `<PullQuote>` `<Callout>` `<Warning>` `<Info>` `<Tip>`

**Remedy:** `<RecipeCard slug="...">` `<IngredientTable slug="...">` `<ProcessSteps slug="...">`

**Information:** `<FAQ>` `<Timeline>` `<ReferenceList>`

**Navigation:** `<RelatedRemedies>` `<SafetyDisclaimer>`

### Adding a new component

1. Create `components/publish/MyComponent.tsx`
2. Import it in `components/mdx/MDXComponents.tsx` and add to the return object
3. Add one entry to `components/publish/registry.ts`

It will appear in `/playground` and be available in every MDX file.

### Dark mode

Dark mode is automatic — follows the OS preference by default, toggleable via the moon/sun icon in the navbar.

---

## Directive Syntax (simplified authoring)

Instead of JSX component syntax, you can write rich publishing blocks using Markdown-style directives.

### Self-closing (leaf directives)

```md
::name{prop="value" boolProp}
```

### With content body (container directives)

```md
:::name{prop="value"}
Your Markdown content here.
:::
```

### Full reference

| Directive | Component | Notes |
|-----------|-----------|-------|
| `::hero{title="..." subtitle="..."}` | `HeroSection` | |
| `::section-header{title="..." subtitle="..."}` | `SectionHeader` | |
| `::divider{style="leaf"}` | `Divider` | styles: line, dots, leaf |
| `::hero-image{src="..." alt="..."}` | `HeroImage` | |
| `::image{src="..." alt="..." shadow expandable}` | `ImageWithCaption` | boolean flags need no value |
| `::full-width-image{src="..." alt="..." height="lg"}` | `FullWidthImage` | |
| `::youtube{id="VIDEO_ID" title="..."}` | `YouTubeEmbed` | |
| `::recipe{slug="..."}` | `RecipeCard` | slug must be in remedySlugs |
| `::ingredients{slug="..."}` | `IngredientTable` | |
| `::steps{slug="..."}` | `ProcessSteps` | |
| `::disclaimer` | `SafetyDisclaimer` | |
| `:::quote{attribution="..."}` ... `:::` | `Quote` | |
| `:::pull-quote` ... `:::` | `PullQuote` | |
| `:::callout{title="..." icon="🌿"}` ... `:::` | `Callout` | |
| `:::warning{title="..."}` ... `:::` | `Warning` | |
| `:::info{title="..."}` ... `:::` | `Info` | |
| `:::tip{title="..."}` ... `:::` | `Tip` | |
| `:::two-column{ratio="2:1"}` ... `---col---` ... `:::` | `TwoColumn` | use `---col---` to split |
| `:::photo-right{src="..." alt="..."}` content `:::` | `TwoColumn` + `ImageWithCaption` | image right |
| `:::photo-left{src="..." alt="..."}` content `:::` | `TwoColumn` + `ImageWithCaption` | image left |
| `:::gallery{columns="3"}` paths `:::` | `ImageGallery` | one image per line: `path \| alt \| caption` |
| `:::timeline{title="..."}` items `:::` | `Timeline` | YAML list format |
| `:::faq{title="..."}` items `:::` | `FAQ` | YAML list format |
| `:::related-remedies` slugs `:::` | `RelatedRemedies` | one slug per line with `- ` prefix |

Both syntaxes work anywhere. JSX is still fully supported.

### Adding a new directive

1. Add the directive handler to `lib/directives.ts` in `DIRECTIVE_MAP`
2. Add `directiveExample` and `directiveName` to the registry entry in `components/publish/registry.ts`

Done — the directive works in all MDX files and the Playground shows it automatically.
