import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { getAllCategories } from "@/lib/content";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";

export const metadata: Metadata = {
  title: "Categories",
  description: "Browse traditional home remedies organized by health category.",
};

export default function CategoriesPage() {
  const categories = getAllCategories();
  return (
    <div className="site-container py-10">
      <Breadcrumbs items={[{ label: "Categories" }]} className="mb-6" />
      <h1 className="font-serif text-3xl font-bold text-primary mb-2">Categories</h1>
      <p className="text-muted mb-8">Browse traditional remedies organized by health area.</p>

      {categories.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((cat) => (
            <Link key={cat.slug} href={`/categories/${cat.slug}`}
              className="group flex items-center gap-4 p-5 bg-surface-card rounded-xl border border-bark-200 dark:border-bark-700 hover:border-sage-300 dark:hover:border-sage-700 hover:shadow-sm transition-all">
              <div className="w-12 h-12 bg-sage-100 dark:bg-sage-950/40 rounded-lg flex items-center justify-center shrink-0">
                <Image src="/images/brand/logo-icon.png" alt="" width={24} height={27} className="w-6 h-auto" aria-hidden />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="font-semibold text-primary group-hover:text-accent transition-colors">{cat.name}</h2>
                <p className="text-sm text-muted mt-0.5">{cat.count} {cat.count === 1 ? "condition" : "conditions"}</p>
              </div>
              <ArrowRight className="w-4 h-4 text-muted group-hover:text-accent transition-colors shrink-0" />
            </Link>
          ))}
        </div>
      ) : (
        <div className="py-20 text-center text-muted">
          <p>No categories yet. Add MDX files to <code className="inline-code">content/conditions/</code></p>
        </div>
      )}
    </div>
  );
}
