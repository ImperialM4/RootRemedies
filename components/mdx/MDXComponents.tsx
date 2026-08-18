import React from "react";
// ─────────────────────────────────────────────────────────────────────────────
// components/mdx/MDXComponents.tsx
//
// The complete MDX component map for RootRemedies.
//
// To add a new component:
//   1. Build it in components/publish/MyComponent.tsx
//   2. Import it here and add it to the return object
//   3. Add it to components/publish/registry.ts for Playground docs
//
// The remedyMap closure pattern: remedy data is pre-resolved at the page level
// and injected here. <RecipeCard slug="..." /> looks up from this map.
// ─────────────────────────────────────────────────────────────────────────────

import type { MDXComponents } from "mdx/types";
import type { RemedyMap, Reference } from "@/types";

// Layout
import { HeroSection }   from "@/components/publish/HeroSection";
import { TwoColumn }     from "@/components/publish/TwoColumn";
import { ThreeColumn }   from "@/components/publish/ThreeColumn";
import { SectionHeader } from "@/components/publish/SectionHeader";
import { Divider }       from "@/components/publish/Divider";

// Images
import { HeroImage }        from "@/components/publish/HeroImage";
import { ImageWithCaption } from "@/components/publish/ImageWithCaption";
import { FullWidthImage }   from "@/components/publish/FullWidthImage";
import { ImageGallery }     from "@/components/publish/ImageGallery";
import { PhotoGrid }        from "@/components/publish/PhotoGrid";

// Video
import { YouTubeEmbed } from "@/components/publish/YouTubeEmbed";
import { VideoEmbed }   from "@/components/publish/VideoEmbed";

// Writing
import { Quote }      from "@/components/publish/Quote";
import { PullQuote }  from "@/components/publish/PullQuote";
import { Callout }    from "@/components/publish/Callout";
import { WarningBox } from "@/components/shared/WarningBox";

// Remedy
import { RemedyCard }      from "@/components/remedy/RemedyCard";
import { IngredientTable } from "@/components/publish/IngredientTable";
import { ProcessSteps }    from "@/components/publish/ProcessSteps";

// Information
import { FAQ }           from "@/components/publish/FAQ";
import { Timeline }      from "@/components/publish/Timeline";
import { ReferenceList } from "@/components/shared/ReferenceList";

// Navigation
import { RelatedRemedies }    from "@/components/publish/RelatedRemedies";
import { RelatedConditions }  from "@/components/condition/RelatedConditions";

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

function SafetyDisclaimer() {
  return (
    <WarningBox variant="warning" title="Medical Disclaimer" className="my-8">
      <p>
        This information is for reference only.
        It is <strong>not medical advice</strong>. Always consult a qualified healthcare
        provider before trying any remedy.
      </p>
    </WarningBox>
  );
}

function RemedyNotFound({ slug }: { slug: string }) {
  return (
    <div className="my-6 rounded-xl border-2 border-dashed border-red-300 dark:border-red-800 bg-red-50 dark:bg-red-950/30 p-5">
      <p className="font-semibold text-red-700 dark:text-red-400 text-sm mb-1">
        Remedy not found: <code className="font-mono">&quot;{slug}&quot;</code>
      </p>
      <p className="text-red-600 dark:text-red-500 text-xs">
        Check that <code className="font-mono">content/remedies/{slug}.yaml</code> exists
        and is listed in this condition&apos;s <code className="font-mono">remedySlugs</code> frontmatter.
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// getMDXComponents — pass the pre-resolved remedyMap for this condition page
// ---------------------------------------------------------------------------
export function getMDXComponents(
  remedyMap: RemedyMap = {},
  overrides: MDXComponents = {}
): MDXComponents {
  // Helper: look up remedy or render not-found
  const withRemedy = (slug: string, render: (r: NonNullable<RemedyMap[string]>) => React.ReactNode) => {
    const remedy = remedyMap[slug];
    return remedy ? render(remedy) : <RemedyNotFound slug={slug} />;
  };

  return {
    // ── Layout ──────────────────────────────────────────────────────────────
    HeroSection,
    TwoColumn,
    ThreeColumn,
    SectionHeader,
    Divider,

    // ── Images ──────────────────────────────────────────────────────────────
    HeroImage,
    ImageWithCaption,
    FullWidthImage,
    ImageGallery,
    PhotoGrid,

    // ── Video ────────────────────────────────────────────────────────────────
    YouTubeEmbed,
    VideoEmbed,

    // ── Writing ──────────────────────────────────────────────────────────────
    Quote,
    PullQuote,
    Callout,
    Warning: ({ title, children }: { title?: string; children: React.ReactNode }) => (
      <WarningBox variant="warning" title={title} className="my-5">{children}</WarningBox>
    ),
    Info: ({ title, children }: { title?: string; children: React.ReactNode }) => (
      <WarningBox variant="info" title={title} className="my-5">{children}</WarningBox>
    ),
    Tip: ({ title, children }: { title?: string; children: React.ReactNode }) => (
      <WarningBox variant="success" title={title ?? "Tip"} className="my-5">{children}</WarningBox>
    ),
    Danger: ({ title, children }: { title?: string; children: React.ReactNode }) => (
      <WarningBox variant="danger" title={title} className="my-5">{children}</WarningBox>
    ),
    SafetyDisclaimer,

    // ── Remedy ───────────────────────────────────────────────────────────────
    // Usage: <RecipeCard slug="honey-lemon-tea" />
    // Note: `index` is accepted (and still emitted by the ::recipe directive)
    // for backwards compatibility, but is no longer rendered — the remedy's
    // number belongs to the SectionHeader above it ("1. Saltwater Gargle"),
    // not repeated inside the card itself.
    RecipeCard: ({ slug }: { slug: string; index?: number }) =>
      withRemedy(slug, (r) => <RemedyCard remedy={r} />),

    // Usage: <Remedy slug="..." /> (legacy alias kept for backwards compat)
    Remedy: ({ slug }: { slug: string; index?: number }) =>
      withRemedy(slug, (r) => <RemedyCard remedy={r} />),

    // Usage: <IngredientTable slug="honey-lemon-tea" />
    IngredientTable: ({ slug }: { slug: string }) =>
      withRemedy(slug, (r) => <IngredientTable remedy={r} />),

    // Usage: <ProcessSteps slug="honey-lemon-tea" />
    ProcessSteps: ({ slug }: { slug: string }) =>
      withRemedy(slug, (r) => <ProcessSteps remedy={r} />),

    // ── Information ──────────────────────────────────────────────────────────
    FAQ,
    Timeline,
    References: ({ references }: { references: Reference[] }) => (
      <ReferenceList references={references} />
    ),

    // ── Navigation ───────────────────────────────────────────────────────────
    RelatedRemedies,
    // RelatedConditions receives pre-resolved conditions from the page level —
    // for MDX use, we render a placeholder directing authors to use the automatic sidebar
    RelatedConditions: ({ conditions }: { conditions?: React.ComponentProps<typeof RelatedConditions>["conditions"] }) =>
      conditions ? <RelatedConditions conditions={conditions} /> : null,

    // ── HTML element overrides ───────────────────────────────────────────────
    h2: ({ children, id }: { children: React.ReactNode; id?: string }) => (
      <h2 id={id} className="font-serif text-2xl font-semibold text-primary mt-10 mb-4 scroll-mt-24 tracking-tight">{children}</h2>
    ),
    h3: ({ children, id }: { children: React.ReactNode; id?: string }) => (
      <h3 id={id} className="font-serif text-xl font-semibold text-primary mt-8 mb-3 scroll-mt-24">{children}</h3>
    ),
    h4: ({ children, id }: { children: React.ReactNode; id?: string }) => (
      <h4 id={id} className="font-sans text-base font-semibold text-primary mt-6 mb-2 scroll-mt-24">{children}</h4>
    ),
    p:  ({ children }: { children: React.ReactNode }) => (
      <p className="text-body leading-relaxed mb-5">{children}</p>
    ),
    ul: ({ children }: { children: React.ReactNode }) => (
      <ul className="list-disc list-outside pl-5 space-y-1.5 mb-5 text-body">{children}</ul>
    ),
    ol: ({ children }: { children: React.ReactNode }) => (
      <ol className="list-decimal list-outside pl-5 space-y-1.5 mb-5 text-body">{children}</ol>
    ),
    li:         ({ children }: { children: React.ReactNode }) => <li className="leading-relaxed">{children}</li>,
    blockquote: ({ children }: { children: React.ReactNode }) => (
      <blockquote className="border-l-4 border-sage-300 dark:border-sage-700 pl-5 py-1 my-6 italic text-muted bg-sage-50 dark:bg-sage-950/20 rounded-r-lg">{children}</blockquote>
    ),
    a: ({ href, children }: { href?: string; children: React.ReactNode }) => (
      <a href={href}
        className="text-accent underline underline-offset-2 decoration-sage-300 dark:decoration-sage-700 hover:decoration-sage-500 transition-colors"
        target={href?.startsWith("http") ? "_blank" : undefined}
        rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
      >{children}</a>
    ),
    hr:     () => <hr className="border-bark-200 dark:border-bark-700 my-10" />,
    strong: ({ children }: { children: React.ReactNode }) => (
      <strong className="font-semibold text-primary">{children}</strong>
    ),
    code: ({ children }: { children: React.ReactNode }) => (
      <code className="inline-code">{children}</code>
    ),
    table: ({ children }: { children: React.ReactNode }) => (
      <div className="overflow-x-auto my-6">
        <table className="w-full text-sm border-collapse border border-bark-200 dark:border-bark-700 rounded-lg overflow-hidden">{children}</table>
      </div>
    ),
    th: ({ children }: { children: React.ReactNode }) => (
      <th className="text-left px-4 py-3 bg-bark-50 dark:bg-bark-800 font-semibold text-primary border-b border-bark-200 dark:border-bark-700">{children}</th>
    ),
    td: ({ children }: { children: React.ReactNode }) => (
      <td className="px-4 py-3 border-b border-bark-100 dark:border-bark-800 text-body">{children}</td>
    ),

    ...overrides,
  };
}
