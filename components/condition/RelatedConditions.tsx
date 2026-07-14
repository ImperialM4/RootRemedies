import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Condition } from "@/types";
import { cn } from "@/lib/utils";

interface RelatedConditionsProps {
  conditions: Condition[];
  className?: string;
}

export function RelatedConditions({ conditions, className }: RelatedConditionsProps) {
  if (!conditions || conditions.length === 0) return null;
  return (
    <section
      aria-label="Related conditions"
      className={cn("mt-12 pt-8 border-t border-bark-200 dark:border-bark-700", className)}
    >
      <h2 className="font-serif text-lg font-semibold text-primary mb-4">Related Conditions</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {conditions.map((condition) => (
          <Link
            key={condition.slug}
            href={`/conditions/${condition.slug}`}
            className="group flex items-center gap-3 p-3 rounded-lg border border-bark-200 dark:border-bark-700 bg-surface-card hover:border-sage-300 dark:hover:border-sage-700 hover:bg-sage-50 dark:hover:bg-sage-950/20 transition-all"
          >
            <div className="flex-1 min-w-0">
              <p className="text-xs text-accent font-medium mb-0.5">{condition.frontmatter.category}</p>
              <p className="text-sm font-medium text-body group-hover:text-accent transition-colors truncate">
                {condition.frontmatter.title}
              </p>
            </div>
            <ArrowRight className="w-4 h-4 text-muted group-hover:text-accent transition-colors shrink-0" />
          </Link>
        ))}
      </div>
    </section>
  );
}
