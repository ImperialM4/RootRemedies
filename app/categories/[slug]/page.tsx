import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAllCategories, getConditionsByCategory } from "@/lib/content";
import { ConditionCard } from "@/components/condition/ConditionCard";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";

export async function generateStaticParams() {
  return getAllCategories().map((cat) => ({ slug: cat.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const cat = getAllCategories().find((c) => c.slug === slug);
  if (!cat) return {};
  return { title: cat.name, description: `Traditional home remedies for ${cat.name.toLowerCase()} conditions.` };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const cat = getAllCategories().find((c) => c.slug === slug);
  if (!cat) notFound();
  const conditions = getConditionsByCategory(cat.name);
  return (
    <div className="site-container py-10">
      <Breadcrumbs items={[{ label: "Categories", href: "/categories" }, { label: cat.name }]} className="mb-6" />
      <h1 className="font-serif text-3xl font-bold text-primary mb-2">{cat.name}</h1>
      <p className="text-muted mb-8">{cat.count} {cat.count === 1 ? "condition" : "conditions"} documented</p>
      {conditions.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {conditions.map((c) => <ConditionCard key={c.slug} condition={c} />)}
        </div>
      ) : (
        <p className="text-muted py-16 text-center">No conditions in this category yet.</p>
      )}
    </div>
  );
}
