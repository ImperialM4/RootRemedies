// ─────────────────────────────────────────────────────────────────────────────
// components/publish/registry.ts
//
// Single source of truth for all publishing components.
//
// To add a new component:
//   1. Create components/publish/MyComponent.tsx
//   2. Import + register it in components/mdx/MDXComponents.tsx
//   3. Add one entry here — it appears in Playground automatically
//   4. Optionally add a directive handler in lib/directives.ts
// ─────────────────────────────────────────────────────────────────────────────

export type PlaygroundGroup =
  | "Layout" | "Images" | "Video" | "Writing" | "Remedy" | "Information" | "Navigation";

export interface PropDefinition {
  name: string;
  type: string;
  required: boolean;
  default?: string;
  description: string;
}

export interface ComponentEntry {
  /** Name used in MDX JSX: <HeroSection /> */
  name: string;
  group: PlaygroundGroup;
  description: string;
  /** Full JSX example */
  mdxExample: string;
  /** Simplified directive syntax (:::name) — shown as the "authoring" syntax */
  directiveExample?: string;
  /** Directive name, e.g. "hero" for :::hero */
  directiveName?: string;
  props: PropDefinition[];
  notes?: string;
}

export const COMPONENT_REGISTRY: ComponentEntry[] = [
  // ── Layout ────────────────────────────────────────────────────────────────
  {
    name: "HeroSection",
    group: "Layout",
    directiveName: "hero",
    description: "Full-width editorial hero with title, subtitle, and optional CTA.",
    mdxExample: `<HeroSection
  title="Everything starts with a root"
  subtitle="Traditional remedies passed down through generations."
  eyebrow="Feature"
  align="center"
/>`,
    directiveExample: `:::hero{title="Everything starts with a root" subtitle="Traditional remedies passed down through generations." align="center"}`,
    props: [
      { name: "title",    type: "string",                          required: true,  description: "Large display headline." },
      { name: "subtitle", type: "string",                          required: false, description: "Supporting text beneath the title." },
      { name: "align",    type: '"left" | "center"',               required: false, default: '"left"',   description: "Text alignment." },
      { name: "eyebrow",  type: "string",                          required: false, description: "Small label above the title." },
      { name: "cta",      type: '{ label: string; href: string }', required: false, description: "Optional call-to-action button." },
    ],
  },
  {
    name: "TwoColumn",
    group: "Layout",
    directiveName: "two-column",
    description: "Two-column responsive grid. Collapses to one column on mobile.",
    mdxExample: `<TwoColumn ratio="2:1">
  <div>Left column — text, images, any content.</div>
  <div>Right column — text, images, any content.</div>
</TwoColumn>`,
    directiveExample: `:::two-column{ratio="2:1"}
Left column content here.

---col---

Right column content here.
:::`,
    props: [
      { name: "children",       type: "ReactNode",                  required: true,  description: "Two child elements." },
      { name: "ratio",          type: '"1:1" | "2:1" | "1:2"',     required: false, default: '"1:1"',   description: "Column width ratio." },
      { name: "gap",            type: '"sm" | "md" | "lg"',         required: false, default: '"md"',    description: "Gap between columns." },
      { name: "reverseOnMobile",type: "boolean",                    required: false, default: "false",   description: "Swap column order on mobile." },
    ],
  },
  {
    name: "ThreeColumn",
    group: "Layout",
    description: "Three-column responsive grid.",
    mdxExample: `<ThreeColumn>
  <div>First column.</div>
  <div>Second column.</div>
  <div>Third column.</div>
</ThreeColumn>`,
    props: [
      { name: "children", type: "ReactNode",             required: true,  description: "Three child elements." },
      { name: "gap",      type: '"sm" | "md" | "lg"',   required: false, default: '"md"', description: "Gap between columns." },
    ],
  },
  {
    name: "SectionHeader",
    group: "Layout",
    directiveName: "section-header",
    description: "Consistent section title with optional subtitle.",
    mdxExample: `<SectionHeader
  title="Documented Remedies"
  subtitle="Recorded from multiple traditional sources."
/>`,
    directiveExample: `::section-header{title="Documented Remedies" subtitle="Recorded from multiple traditional sources."}`,
    props: [
      { name: "title",    type: "string",             required: true,  description: "Section heading." },
      { name: "subtitle", type: "string",             required: false, description: "Supporting sentence." },
      { name: "align",    type: '"left" | "center"',  required: false, default: '"left"', description: "Text alignment." },
    ],
  },
  {
    name: "Divider",
    group: "Layout",
    directiveName: "divider",
    description: "Visual separator between content sections.",
    mdxExample: `<Divider style="leaf" />`,
    directiveExample: `::divider{style="leaf"}`,
    props: [
      { name: "style", type: '"line" | "dots" | "leaf"', required: false, default: '"line"', description: "Visual style." },
      { name: "label", type: "string",                   required: false, description: 'Center label (with style="leaf").' },
    ],
  },

  // ── Images ────────────────────────────────────────────────────────────────
  {
    name: "HeroImage",
    group: "Images",
    directiveName: "hero-image",
    description: "Large, full-width editorial image.",
    mdxExample: `<HeroImage
  src="/images/conditions/elderflower.jpg"
  alt="Elderflower blossoms"
  caption="Elderflower has been used in traditional European medicine for centuries."
  credit="Photo: Unsplash"
/>`,
    directiveExample: `::hero-image{src="/images/conditions/elderflower.jpg" alt="Elderflower blossoms" caption="Elderflower in traditional European medicine." credit="Photo: Unsplash"}`,
    props: [
      { name: "src",      type: "string",  required: true,  description: "Image path or URL." },
      { name: "alt",      type: "string",  required: true,  description: "Alt text." },
      { name: "caption",  type: "string",  required: false, description: "Caption below the image." },
      { name: "credit",   type: "string",  required: false, description: "Photo credit." },
      { name: "priority", type: "boolean", required: false, default: "false", description: "Set true for above-fold images." },
    ],
  },
  {
    name: "ImageWithCaption",
    group: "Images",
    directiveName: "image",
    description: "Inline image with caption, lightbox, and styling options.",
    mdxExample: `<ImageWithCaption
  src="/images/conditions/ginger-root.jpg"
  alt="Fresh ginger root"
  caption="Fresh ginger root — used in dozens of traditional remedies."
  rounded="lg"
  shadow
  expandable
/>`,
    directiveExample: `::image{src="/images/conditions/ginger-root.jpg" alt="Fresh ginger root" caption="Fresh ginger root." rounded="lg" shadow expandable}`,
    props: [
      { name: "src",        type: "string",                                    required: true,  description: "Image path or URL." },
      { name: "alt",        type: "string",                                    required: true,  description: "Alt text." },
      { name: "caption",    type: "string",                                    required: false, description: "Caption text." },
      { name: "credit",     type: "string",                                    required: false, description: "Photo credit." },
      { name: "rounded",    type: '"none" | "sm" | "md" | "lg" | "full"',     required: false, default: '"md"',   description: "Corner rounding." },
      { name: "shadow",     type: "boolean",                                   required: false, default: "false",  description: "Drop shadow." },
      { name: "border",     type: "boolean",                                   required: false, default: "false",  description: "Border." },
      { name: "expandable", type: "boolean",                                   required: false, default: "false",  description: "Lightbox on click." },
      { name: "width",      type: '"sm" | "md" | "lg" | "full"',              required: false, default: '"full"', description: "Image width." },
    ],
  },
  {
    name: "FullWidthImage",
    group: "Images",
    directiveName: "full-width-image",
    description: "Edge-to-edge image that bleeds past the article column.",
    mdxExample: `<FullWidthImage
  src="/images/conditions/herb-garden.jpg"
  alt="A sunlit herb garden"
  height="lg"
/>`,
    directiveExample: `::full-width-image{src="/images/conditions/herb-garden.jpg" alt="A sunlit herb garden" height="lg"}`,
    props: [
      { name: "src",     type: "string",              required: true,  description: "Image path or URL." },
      { name: "alt",     type: "string",              required: true,  description: "Alt text." },
      { name: "caption", type: "string",              required: false, description: "Caption." },
      { name: "credit",  type: "string",              required: false, description: "Photo credit." },
      { name: "height",  type: '"sm" | "md" | "lg"', required: false, default: '"md"', description: "Image height." },
    ],
  },
  {
    name: "PhotoRight",
    group: "Images",
    directiveName: "photo-right",
    description: "Shorthand: image floated right, text on the left. No layout code needed.",
    mdxExample: `<TwoColumn ratio="2:1">
  <div>
    Your article text flows naturally here on the left side.
  </div>
  <ImageWithCaption
    src="/images/ingredients/honey.jpg"
    alt="Raw honey"
    rounded="lg"
    shadow
  />
</TwoColumn>`,
    directiveExample: `:::photo-right{src="/images/ingredients/honey.jpg" alt="Raw honey" caption="Raw honey"}
Your article text flows naturally here on the left side.
:::`,
    props: [
      { name: "src",     type: "string", required: true,  description: "Image path." },
      { name: "alt",     type: "string", required: true,  description: "Alt text." },
      { name: "caption", type: "string", required: false, description: "Caption." },
      { name: "children",type: "ReactNode", required: true, description: "Left-side content." },
    ],
    notes: "Directive-only shorthand. Use :::photo-left for the mirror layout.",
  },
  {
    name: "ImageGallery",
    group: "Images",
    directiveName: "gallery",
    description: "Responsive image gallery with lightbox.",
    mdxExample: `<ImageGallery
  images={[
    { src: "/images/remedies/chamomile-1.jpg", alt: "Chamomile in field" },
    { src: "/images/remedies/chamomile-2.jpg", alt: "Dried chamomile" },
    { src: "/images/remedies/chamomile-3.jpg", alt: "Chamomile tea" },
  ]}
  columns={3}
/>`,
    directiveExample: `:::gallery{columns="3"}
/images/remedies/chamomile-1.jpg | Chamomile in field
/images/remedies/chamomile-2.jpg | Dried chamomile | Dried and ready to steep
/images/remedies/chamomile-3.jpg | Chamomile tea
:::`,
    props: [
      { name: "images",  type: "Array<{ src: string; alt: string; caption?: string }>", required: true, description: "Image list." },
      { name: "columns", type: "2 | 3 | 4", required: false, default: "3", description: "Desktop columns." },
    ],
    notes: "In directive syntax, each line is: path | Alt text | Optional caption",
  },
  {
    name: "PhotoGrid",
    group: "Images",
    description: "Uniform square-crop photo grid.",
    mdxExample: `<PhotoGrid
  photos={[
    { src: "/images/ingredients/honey.jpg",  alt: "Raw honey" },
    { src: "/images/ingredients/lemon.jpg",  alt: "Fresh lemon" },
    { src: "/images/ingredients/ginger.jpg", alt: "Ginger root" },
  ]}
  caption="Common ingredients."
/>`,
    props: [
      { name: "photos",  type: "Array<{ src: string; alt: string }>", required: true, description: "Photos." },
      { name: "caption", type: "string",  required: false, description: "Caption below." },
      { name: "columns", type: "2|3|4|5", required: false, default: "4", description: "Columns." },
    ],
  },

  // ── Video ─────────────────────────────────────────────────────────────────
  {
    name: "YouTubeEmbed",
    group: "Video",
    directiveName: "youtube",
    description: "Lazy-loaded YouTube embed with thumbnail.",
    mdxExample: `<YouTubeEmbed
  videoId="dQw4w9WgXcQ"
  title="How to prepare ginger honey tea"
  caption="Demonstrated step by step."
/>`,
    directiveExample: `::youtube{id="dQw4w9WgXcQ" title="How to prepare ginger honey tea" caption="Demonstrated step by step."}`,
    props: [
      { name: "videoId", type: "string", required: true,  description: "YouTube video ID." },
      { name: "title",   type: "string", required: true,  description: "Accessible title." },
      { name: "caption", type: "string", required: false, description: "Caption below." },
    ],
  },
  {
    name: "VideoEmbed",
    group: "Video",
    description: "Embed an MP4 file.",
    mdxExample: `<VideoEmbed
  src="/videos/ginger-preparation.mp4"
  title="Ginger preparation"
  caption="Traditional preparation."
  poster="/images/video-poster.jpg"
/>`,
    props: [
      { name: "src",     type: "string", required: true,  description: "MP4 path or URL." },
      { name: "title",   type: "string", required: true,  description: "Accessible title." },
      { name: "caption", type: "string", required: false, description: "Caption." },
      { name: "poster",  type: "string", required: false, description: "Thumbnail." },
    ],
  },

  // ── Writing ───────────────────────────────────────────────────────────────
  {
    name: "Quote",
    group: "Writing",
    directiveName: "quote",
    description: "Styled blockquote with optional attribution.",
    mdxExample: `<Quote attribution="Hippocrates" source="Aphorisms, 400 BCE">
  Let food be thy medicine and medicine be thy food.
</Quote>`,
    directiveExample: `:::quote{attribution="Hippocrates" source="Aphorisms, 400 BCE"}
Let food be thy medicine and medicine be thy food.
:::`,
    props: [
      { name: "children",     type: "ReactNode", required: true,  description: "Quote text." },
      { name: "attribution",  type: "string",    required: false, description: "Who said it." },
      { name: "source",       type: "string",    required: false, description: "Source title." },
    ],
  },
  {
    name: "PullQuote",
    group: "Writing",
    directiveName: "pull-quote",
    description: "Large typographic pull quote for visual emphasis.",
    mdxExample: `<PullQuote>
  The history of herbal medicine is the history of humanity itself.
</PullQuote>`,
    directiveExample: `:::pull-quote
The history of herbal medicine is the history of humanity itself.
:::`,
    props: [
      { name: "children", type: "ReactNode",         required: true,  description: "Quote text." },
      { name: "align",    type: '"left" | "center"', required: false, default: '"left"', description: "Alignment." },
    ],
  },
  {
    name: "Callout",
    group: "Writing",
    directiveName: "callout",
    description: "Highlighted callout box for key facts.",
    mdxExample: `<Callout title="Key fact" icon="🌿">
  Ginger has been used medicinally for over 5,000 years.
</Callout>`,
    directiveExample: `:::callout{title="Key fact" icon="🌿"}
Ginger has been used medicinally for over 5,000 years.
:::`,
    props: [
      { name: "children", type: "ReactNode", required: true,  description: "Content." },
      { name: "title",    type: "string",    required: false, description: "Bold heading." },
      { name: "icon",     type: "string",    required: false, description: "Emoji icon." },
    ],
  },
  {
    name: "Warning",
    group: "Writing",
    directiveName: "warning",
    description: "Amber warning box for safety notes.",
    mdxExample: `<Warning title="Consult a doctor first">
  Not suitable for children under 2 or people with aspirin allergies.
</Warning>`,
    directiveExample: `:::warning{title="Consult a doctor first"}
Not suitable for children under 2 or people with aspirin allergies.
:::`,
    props: [
      { name: "children", type: "ReactNode", required: true,  description: "Content." },
      { name: "title",    type: "string",    required: false, description: "Heading." },
    ],
  },
  {
    name: "Info",
    group: "Writing",
    directiveName: "info",
    description: "Blue information box.",
    mdxExample: `<Info title="Historical context">
  First recorded in the Ebers Papyrus, dating to 1550 BCE.
</Info>`,
    directiveExample: `:::info{title="Historical context"}
First recorded in the Ebers Papyrus, dating to 1550 BCE.
:::`,
    props: [
      { name: "children", type: "ReactNode", required: true,  description: "Content." },
      { name: "title",    type: "string",    required: false, description: "Heading." },
    ],
  },
  {
    name: "Tip",
    group: "Writing",
    directiveName: "tip",
    description: "Green tip box for practical suggestions.",
    mdxExample: `<Tip title="Preparation tip">
  Use raw, unfiltered honey — beneficial enzymes are preserved.
</Tip>`,
    directiveExample: `:::tip{title="Preparation tip"}
Use raw, unfiltered honey — beneficial enzymes are preserved.
:::`,
    props: [
      { name: "children", type: "ReactNode", required: true,  description: "Content." },
      { name: "title",    type: "string",    required: false, description: "Heading." },
    ],
  },

  // ── Remedy ────────────────────────────────────────────────────────────────
  {
    name: "RecipeCard",
    group: "Remedy",
    directiveName: "recipe",
    description: "Remedy details (ingredients, prep, how to use) from a YAML file in content/remedies/.",
    mdxExample: `<RecipeCard slug="honey-lemon-tea" />`,
    directiveExample: `::recipe{slug="honey-lemon-tea"}`,
    props: [
      { name: "slug", type: "string", required: true, description: "Remedy slug (must exist in content/remedies/)." },
    ],
    notes: "The slug must be listed in the condition's remedySlugs frontmatter. Pair this with a ::section-header above it for the remedy's name and number — RecipeCard itself only renders the practical details, so the name isn't shown twice.",
  },
  {
    name: "IngredientTable",
    group: "Remedy",
    directiveName: "ingredients",
    description: "Ingredient list only from a remedy.",
    mdxExample: `<IngredientTable slug="honey-lemon-tea" />`,
    directiveExample: `::ingredients{slug="honey-lemon-tea"}`,
    props: [
      { name: "slug", type: "string", required: true, description: "Remedy slug." },
    ],
  },
  {
    name: "ProcessSteps",
    group: "Remedy",
    directiveName: "steps",
    description: "Preparation steps only from a remedy.",
    mdxExample: `<ProcessSteps slug="honey-lemon-tea" />`,
    directiveExample: `::steps{slug="honey-lemon-tea"}`,
    props: [
      { name: "slug", type: "string", required: true, description: "Remedy slug." },
    ],
  },

  // ── Information ───────────────────────────────────────────────────────────
  {
    name: "FAQ",
    group: "Information",
    directiveName: "faq",
    description: "Accordion FAQ section.",
    mdxExample: `<FAQ title="Common questions" items={[
  { question: "Is this safe for children?", answer: "Consult a pediatrician first." },
  { question: "How long does it take?", answer: "Relief within 20–30 minutes for acute discomfort." },
]} />`,
    directiveExample: `:::faq{title="Common questions"}
- question: Is this safe for children?
  answer: Consult a pediatrician first.
- question: How long does it take?
  answer: Relief within 20–30 minutes for acute discomfort.
:::`,
    props: [
      { name: "items", type: "Array<{ question: string; answer: string }>", required: true, description: "Questions and answers." },
      { name: "title", type: "string", required: false, description: "Section heading." },
    ],
  },
  {
    name: "Timeline",
    group: "Information",
    directiveName: "timeline",
    description: "Vertical timeline for history or process.",
    mdxExample: `<Timeline title="History of Use" items={[
  { year: "3000 BCE", label: "Ancient Egypt", description: "Honey used as a wound dressing." },
  { year: "400 BCE",  label: "Ancient Greece", description: "Hippocrates documents willow bark for fever." },
]} />`,
    directiveExample: `:::timeline{title="History of Use"}
- year: 3000 BCE
  label: Ancient Egypt
  description: Honey used as a wound dressing.
- year: 400 BCE
  label: Ancient Greece
  description: Hippocrates documents willow bark for fever.
:::`,
    props: [
      { name: "items", type: "Array<{ year: string; label?: string; description: string }>", required: true, description: "Timeline events." },
      { name: "title", type: "string", required: false, description: "Section heading." },
    ],
  },
  {
    name: "ReferenceList",
    group: "Information",
    description: "Formatted bibliography.",
    mdxExample: `<ReferenceList references={[
  {
    id: "ref-1",
    title: "The Complete German Commission E Monographs",
    author: "Mark Blumenthal",
    source: "American Botanical Council",
    year: 1998,
  },
]} />`,
    props: [
      { name: "references", type: "Reference[]", required: true, description: "Array of references." },
    ],
  },

  // ── Navigation ────────────────────────────────────────────────────────────
  {
    name: "RelatedRemedies",
    group: "Navigation",
    directiveName: "related-remedies",
    description: "Compact list linking to related remedies.",
    mdxExample: `<RelatedRemedies slugs={["ginger-honey-tea", "salt-water-gargle"]} />`,
    directiveExample: `:::related-remedies{title="Try these next"}
- ginger-honey-tea
- salt-water-gargle
:::`,
    props: [
      { name: "slugs", type: "string[]", required: true,  description: "Remedy slugs." },
      { name: "title", type: "string",   required: false, default: '"Related Remedies"', description: "Section heading." },
    ],
  },
  {
    name: "SafetyDisclaimer",
    group: "Navigation",
    directiveName: "disclaimer",
    description: "Standard medical disclaimer block.",
    mdxExample: `<SafetyDisclaimer />`,
    directiveExample: `::disclaimer`,
    props: [],
    notes: "Always include at the bottom of every condition article.",
  },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
export const REGISTRY_GROUPS: PlaygroundGroup[] = [
  "Layout", "Images", "Video", "Writing", "Remedy", "Information", "Navigation",
];

export function getComponentsByGroup(group: PlaygroundGroup): ComponentEntry[] {
  return COMPONENT_REGISTRY.filter((c) => c.group === group);
}

export function getComponentEntry(name: string): ComponentEntry | undefined {
  return COMPONENT_REGISTRY.find((c) => c.name === name);
}
