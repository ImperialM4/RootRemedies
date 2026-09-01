import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAllCategories, getConditionsByCategory } from "@/lib/content";
import { getCategoryStyle } from "@/lib/categories";
import { ConditionCard } from "@/components/condition/ConditionCard";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { canonicalUrl } from "@/lib/seo";

export async function generateStaticParams() {
  return getAllCategories().map((cat) => ({ slug: cat.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const cat = getAllCategories().find((c) => c.slug === slug);
  if (!cat) return {};
  return {
    title: cat.name,
    description: `Traditional home remedies for ${cat.name.toLowerCase()} conditions.`,
    alternates: { canonical: canonicalUrl(`/categories/${cat.slug}`) },
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const cat = getAllCategories().find((c) => c.slug === slug);
  if (!cat) notFound();
  const conditions = getConditionsByCategory(cat.name);
  const { color, tint, Icon } = getCategoryStyle(cat.slug);
  return (
    <div className="site-container py-10">
      <Breadcrumbs items={[{ label: "Categories", href: "/categories" }, { label: cat.name }]} className="mb-6" />
      <div className="flex items-center gap-4 mb-2 animate-fade-up">
        <div className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: tint }}>
          <Icon className="w-8 h-8" style={{ color }} aria-hidden />
        </div>
        <h1 className="font-serif text-3xl font-bold text-primary">{cat.name}</h1>
      </div>
      <p className="text-muted mb-8">{cat.count} {cat.count === 1 ? "condition" : "conditions"} documented</p>
      {conditions.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {conditions.map((c, i) => (
            <div key={c.slug} className={`animate-fade-up stagger-${Math.min(i + 1, 4)}`}>
              <ConditionCard condition={c} />
            </div>
          ))}
        </div>
      ) : (
        <p className="text-muted py-16 text-center">No conditions in this category yet.</p>
      )}
    </div>
  );
}
