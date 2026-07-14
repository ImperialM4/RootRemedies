import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Leaf, ShieldCheck, BookOpen } from "lucide-react";
import { getAllConditions, getFeaturedConditions, getAllCategories } from "@/lib/content";
import { ConditionCard } from "@/components/condition/ConditionCard";

export default function HomePage() {
  const featured        = getFeaturedConditions(6);
  const recent          = getAllConditions().slice(0, 3);
  const categories      = getAllCategories().slice(0, 6);
  const totalConditions = getAllConditions().length;

  return (
    <div>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-bark-50 dark:bg-bark-900 pt-16 pb-20 px-4">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: [
              "radial-gradient(ellipse 60% 50% at 20% 60%, rgba(157,187,147,0.18) 0%, transparent 70%)",
              "radial-gradient(ellipse 40% 40% at 80% 20%, rgba(194,176,154,0.14) 0%, transparent 60%)",
            ].join(", "),
          }}
          aria-hidden
        />
        <div className="relative site-container text-center max-w-3xl mx-auto">
          <div
            className="inline-flex items-center gap-2 bg-white dark:bg-bark-800 border border-bark-200 dark:border-bark-700 rounded-full px-3 py-1.5 text-sm font-medium mb-6 animate-fade-up"
            style={{ color: "var(--color-accent)" }}
          >
            <Leaf className="w-3.5 h-3.5" />
            Not medical advice
          </div>

          <h1
            className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight mb-6 animate-fade-up stagger-1"
            style={{ color: "var(--color-text-primary)" }}
          >
            Traditional remedies,
            <br />
            <span style={{ color: "var(--color-accent)" }}>documented with care</span>
          </h1>

          <p
            className="text-lg leading-relaxed mb-8 max-w-2xl mx-auto animate-fade-up stagger-2"
            style={{ color: "var(--color-text-body)" }}
          >
            RootRemedies documents traditional home remedies so the knowledge
            passed down through generations isn't lost. Every remedy is recorded
            with ingredients, preparation steps, safety notes, and cultural context.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 animate-fade-up stagger-3">
            <Link
              href="/conditions"
              className="inline-flex items-center gap-2 bg-sage-600 dark:bg-sage-500 text-white px-6 py-3 rounded-lg font-medium text-sm hover:bg-sage-700 dark:hover:bg-sage-400 transition-colors shadow-sm"
            >
              Browse Conditions <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium text-sm transition-colors border border-bark-300 dark:border-bark-600 hover:bg-white dark:hover:bg-bark-800"
              style={{ color: "var(--color-text-body)" }}
            >
              Why I built this
            </Link>
          </div>

          {totalConditions > 0 && (
            <p className="mt-6 text-sm animate-fade-up stagger-4" style={{ color: "var(--color-text-muted)" }}>
              {totalConditions} condition{totalConditions !== 1 ? "s" : ""} documented
            </p>
          )}
        </div>
      </section>

      {/* ── Trust signals ────────────────────────────────────────────────── */}
      <section className="border-y border-bark-200 dark:border-bark-800 bg-white dark:bg-bark-900/60">
        <div className="site-container py-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            {[
              { Icon: BookOpen,    title: "Structured Documentation",  desc: "Every remedy follows the same format — ingredients, steps, safety notes, and context." },
              { Icon: ShieldCheck, title: "Not Medical Advice",        desc: "This is documentation, not a prescription. Always consult a professional for health decisions." },
              { Icon: Leaf,        title: "Traditional Knowledge",     desc: "Preserving remedies passed down through generations before they're forgotten." },
            ].map(({ Icon, title, desc }) => (
              <div key={title} className="flex flex-col items-center gap-2 py-2">
                <Icon className="w-6 h-6" style={{ color: "var(--color-accent)" }} />
                <h3 className="font-semibold text-sm" style={{ color: "var(--color-text-primary)" }}>{title}</h3>
                <p className="text-xs max-w-xs" style={{ color: "var(--color-text-muted)" }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured conditions ──────────────────────────────────────────── */}
      {featured.length > 0 && (
        <section className="site-container py-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-serif text-2xl font-semibold" style={{ color: "var(--color-text-primary)" }}>
              Featured Conditions
            </h2>
            <Link href="/conditions" className="flex items-center gap-1.5 text-sm font-medium hover:opacity-75 transition-opacity" style={{ color: "var(--color-accent)" }}>
              View all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {featured.map((c) => <ConditionCard key={c.slug} condition={c} />)}
          </div>
        </section>
      )}

      {/* ── Categories ───────────────────────────────────────────────────── */}
      {categories.length > 0 && (
        <section className="border-y border-bark-200 dark:border-bark-800 bg-bark-50 dark:bg-bark-900/40">
          <div className="site-container py-16">
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-serif text-2xl font-semibold" style={{ color: "var(--color-text-primary)" }}>
                Browse by Category
              </h2>
              <Link href="/categories" className="flex items-center gap-1.5 text-sm font-medium hover:opacity-75 transition-opacity" style={{ color: "var(--color-accent)" }}>
                All categories <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {categories.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/categories/${cat.slug}`}
                  className="group flex flex-col items-center gap-2 p-4 bg-white dark:bg-bark-800 rounded-xl border border-bark-200 dark:border-bark-700 hover:border-sage-400 dark:hover:border-sage-600 hover:shadow-sm transition-all text-center"
                >
                  <Image src="/images/brand/logo-icon.png" alt="" width={24} height={27} className="w-6 h-auto" aria-hidden />
                  <span className="text-sm font-medium leading-snug group-hover:text-accent transition-colors" style={{ color: "var(--color-text-body)" }}>
                    {cat.name}
                  </span>
                  <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                    {cat.count} {cat.count === 1 ? "condition" : "conditions"}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Recent ───────────────────────────────────────────────────────── */}
      {recent.length > 0 && (
        <section className="site-container py-16">
          <h2 className="font-serif text-2xl font-semibold mb-8" style={{ color: "var(--color-text-primary)" }}>
            Recently Updated
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {recent.map((c) => <ConditionCard key={c.slug} condition={c} variant="compact" />)}
          </div>
        </section>
      )}

      {/* ── Empty state ──────────────────────────────────────────────────── */}
      {totalConditions === 0 && (
        <section className="site-container py-24 text-center">
          <Leaf className="w-12 h-12 mx-auto mb-4 text-bark-200 dark:text-bark-700" />
          <h2 className="font-serif text-2xl font-semibold mb-3" style={{ color: "var(--color-text-primary)" }}>
            No conditions yet
          </h2>
          <p className="mb-6 max-w-md mx-auto" style={{ color: "var(--color-text-muted)" }}>
            Add your first MDX file to <code className="inline-code">content/conditions/</code> and it will appear here automatically.
          </p>
          <Link href="/about" className="text-sm underline hover:opacity-80 transition-opacity" style={{ color: "var(--color-accent)" }}>
            Learn how to write articles →
          </Link>
        </section>
      )}
    </div>
  );
}
