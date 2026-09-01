import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getConditionBySlug, getConditionSlugs, getRelatedConditions } from "@/lib/content";
import { extractToc } from "@/lib/toc";
import { getMDXComponents } from "@/components/mdx/MDXComponents";
import { ConditionHeader } from "@/components/condition/ConditionHeader";
import { TableOfContents } from "@/components/condition/TableOfContents";
import { RelatedConditions } from "@/components/condition/RelatedConditions";
import { ArticleHelpful } from "@/components/shared/ArticleHelpful";
import { ScrollDepthTracker } from "@/components/shared/ScrollDepthTracker";
import { remarkPlugins, rehypePlugins } from "@/lib/mdx-plugins";
import { canonicalUrl, SITE_URL } from "@/lib/seo";
import type { ConditionWithContent } from "@/types";

export async function generateStaticParams() {
  return getConditionSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const condition = getConditionBySlug(slug);
  if (!condition) return {};
  const { frontmatter } = condition;
  return {
    title:       frontmatter.seoTitle ?? frontmatter.title,
    description: frontmatter.seoDescription ?? frontmatter.description,
    keywords:    frontmatter.tags,
    authors:     [{ name: frontmatter.author }],
    alternates:  { canonical: canonicalUrl(`/conditions/${slug}`) },
    openGraph: {
      title:         frontmatter.title,
      description:   frontmatter.description,
      type:          "article",
      publishedTime: frontmatter.lastUpdated,
      tags:          frontmatter.tags,
      ...(frontmatter.coverImage && { images: [{ url: frontmatter.coverImage }] }),
    },
  };
}

/**
 * Article structured data built strictly from real frontmatter — nothing
 * invented (no rating, no review count, no fabricated publish date beyond
 * the one date the content actually tracks: lastUpdated). Deliberately typed
 * as generic "Article" rather than "MedicalWebPage" or "HowTo": those schema
 * types signal medical/instructional authority to search engines, which
 * would misrepresent a site that's explicitly documenting traditional
 * practices rather than issuing medical guidance.
 */
function buildArticleJsonLd(condition: ConditionWithContent, slug: string) {
  const { frontmatter } = condition;
  const url = canonicalUrl(`/conditions/${slug}`);
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: frontmatter.title,
    description: frontmatter.description,
    author: { "@type": "Person", name: frontmatter.author },
    publisher: { "@type": "Organization", name: "RootRemedies", url: SITE_URL },
    dateModified: frontmatter.lastUpdated,
    mainEntityOfPage: url,
    url,
    keywords: frontmatter.tags.join(", "),
    ...(frontmatter.coverImage && { image: [canonicalUrl(frontmatter.coverImage)] }),
  };
}

export default async function ConditionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const condition = getConditionBySlug(slug);
  if (!condition) notFound();

  const { frontmatter, content, remedyMap } = condition;
  const toc     = extractToc(content);
  const related = getRelatedConditions(slug, frontmatter.tags, 4);
  const jsonLd  = buildArticleJsonLd(condition, slug);

  return (
    <div className="site-container py-10">
      {/* Article structured data — see buildArticleJsonLd for what it deliberately omits. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Invisible — activates scroll-depth tracking for this page */}
      <ScrollDepthTracker />

      {/* max-w-6xl mx-auto keeps the reading column + TOC centered as a unit,
          instead of pinning a narrow article to the left of the full 7xl
          site-container and leaving a huge empty gutter on wide screens. */}
      <div className="max-w-6xl mx-auto flex gap-10 items-start">
        <article className="flex-1 min-w-0 max-w-3xl mx-auto lg:mx-0">
          <ConditionHeader condition={condition} />

          <div className="article-prose">
            <MDXRemote
              source={content}
              components={getMDXComponents(remedyMap)}
              options={{
                mdxOptions: {
                  remarkPlugins: [...remarkPlugins],
                  rehypePlugins: [...rehypePlugins],
                },
              }}
            />
          </div>

          {related.length > 0 && <RelatedConditions conditions={related} />}

          <ArticleHelpful slug={slug} />
        </article>

        {toc.length > 0 && (
          // Was xl:block (1280px+) — bumped down to lg:block (1024px+) so the
          // sidebar actually fills the space on ordinary laptop screens
          // instead of leaving it blank.
          <aside className="hidden lg:block w-56 shrink-0">
            <div className="sticky top-24">
              <TableOfContents entries={toc} />
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
