import type { Metadata } from "next";
import { getAllConditions, getAllTags } from "@/lib/content";
import { ConditionCard } from "@/components/condition/ConditionCard";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";

export const metadata: Metadata = {
  title: "All Conditions",
  description: "Browse all documented traditional home remedies by condition.",
};

interface ConditionsPageProps {
  searchParams: Promise<{ tag?: string; category?: string }>;
}

export default async function ConditionsPage({ searchParams }: ConditionsPageProps) {
  const params       = await searchParams;
  const activeTag      = params.tag?.toLowerCase();
  const activeCategory = params.category?.toLowerCase();
  const allConditions  = getAllConditions();
  const allTags        = getAllTags();

  const filtered = allConditions.filter((c) => {
    if (activeTag)      return c.frontmatter.tags.map((t) => t.toLowerCase()).includes(activeTag);
    if (activeCategory) return c.frontmatter.category.toLowerCase() === activeCategory;
    return true;
  });

  return (
    <div className="site-container py-10">
      <Breadcrumbs items={[{ label: "Conditions" }]} className="mb-6" />

      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="font-serif text-3xl font-bold text-primary mb-2">
            {activeTag ? `Tagged: ${activeTag}` : activeCategory ? `Category: ${activeCategory}` : "All Conditions"}
          </h1>
          <p className="text-muted text-sm">
            {filtered.length} {filtered.length === 1 ? "condition" : "conditions"}
            {allConditions.length !== filtered.length && ` of ${allConditions.length} total`}
          </p>
        </div>
        {(activeTag || activeCategory) && (
          <a href="/conditions" className="text-sm text-accent hover:opacity-80 underline">Clear filter</a>
        )}
      </div>

      {allTags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8 pb-6 border-b border-bark-100 dark:border-bark-800">
          <span className="text-xs text-muted self-center mr-1">Filter:</span>
          {allTags.map((tag) => (
            <a key={tag} href={`/conditions?tag=${encodeURIComponent(tag)}`}
              className={`tag-pill ${activeTag === tag ? "!bg-sage-600 !text-white dark:!bg-sage-500" : ""}`}>
              {tag}
            </a>
          ))}
        </div>
      )}

      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((c) => <ConditionCard key={c.slug} condition={c} />)}
        </div>
      ) : (
        <div className="py-20 text-center text-muted">
          <p className="text-lg mb-2">No conditions found.</p>
          <a href="/conditions" className="text-sm text-accent underline">Clear filters</a>
        </div>
      )}
    </div>
  );
}
