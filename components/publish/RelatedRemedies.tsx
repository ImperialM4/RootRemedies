import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface RelatedRemediesProps { slugs: string[]; title?: string; className?: string; }

export function RelatedRemedies({ slugs, title = "Related Remedies", className }: RelatedRemediesProps) {
  if (!slugs?.length) return null;
  return (
    <section className={cn("my-8 not-prose", className)}>
      <h3 className="font-serif text-lg font-semibold text-primary mb-3">{title}</h3>
      <div className="space-y-2">
        {slugs.map((slug) => (
          <Link
            key={slug}
            href={`/conditions?remedy=${slug}`}
            className="flex items-center justify-between gap-3 px-4 py-3 rounded-lg border border-bark-200 dark:border-bark-700 bg-surface-card hover:border-sage-300 dark:hover:border-sage-700 hover:bg-sage-50 dark:hover:bg-sage-950/20 transition-all group"
          >
            <span className="text-sm font-medium text-body group-hover:text-accent transition-colors">
              {slug.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
            </span>
            <ArrowRight className="w-4 h-4 text-muted group-hover:text-accent transition-colors shrink-0" />
          </Link>
        ))}
      </div>
    </section>
  );
}
