import Link from "next/link";
import Image from "next/image";
import { Clock, ArrowRight } from "lucide-react";
import { formatReadingTime, formatDateShort } from "@/lib/utils";
import { getCategoryStyle, categoryNameToSlug } from "@/lib/categories";
import type { Condition } from "@/types";
import { cn } from "@/lib/utils";

interface ConditionCardProps {
  condition: Condition;
  className?: string;
  variant?: "default" | "compact";
}

export function ConditionCard({ condition, className, variant = "default" }: ConditionCardProps) {
  const { frontmatter, readingTime, slug } = condition;
  const { color, tint, Icon } = getCategoryStyle(categoryNameToSlug(frontmatter.category));

  if (variant === "compact") {
    return (
      <Link
        href={`/conditions/${slug}`}
        className={cn(
          "flex items-center gap-4 p-4 rounded-lg border transition-all group",
          "border-bark-200 dark:border-bark-700 bg-surface-card card-hover",
          className
        )}
      >
        <div className="relative w-16 h-16 rounded-md overflow-hidden shrink-0 flex items-center justify-center" style={{ backgroundColor: tint }}>
          {frontmatter.coverImage ? (
            <>
              <Image src={frontmatter.coverImage} alt={frontmatter.coverImageAlt ?? frontmatter.title}
                fill className="object-cover" sizes="64px" />
              <div className="absolute inset-x-0 bottom-0 h-6 bg-gradient-to-t from-black/55 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </>
          ) : (
            <Icon className="w-8 h-8 transition-transform duration-300 group-hover:scale-110" style={{ color }} aria-hidden />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium mb-0.5" style={{ color }}>{frontmatter.category}</p>
          <p className="text-sm font-semibold text-primary truncate group-hover:text-accent transition-colors">
            {frontmatter.title}
          </p>
          <p className="text-xs text-muted mt-0.5">{formatReadingTime(readingTime)}</p>
        </div>
        <ArrowRight className="w-4 h-4 text-muted group-hover:text-accent transition-colors shrink-0" />
      </Link>
    );
  }

  return (
    <article className={cn(
      "group flex flex-col rounded-xl border overflow-hidden card-hover",
      "border-bark-200 dark:border-bark-700 bg-surface-card",
      className
    )}>
      {frontmatter.coverImage ? (
        <Link href={`/conditions/${slug}`} className="block relative aspect-[16/9] bg-bark-100 dark:bg-bark-800">
          <Image src={frontmatter.coverImage} alt={frontmatter.coverImageAlt ?? frontmatter.title}
            fill className="object-cover transition-transform duration-slow group-hover:scale-105"
            sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw" />
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/55 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
        </Link>
      ) : (
        <Link href={`/conditions/${slug}`} className="block aspect-[16/9] flex items-center justify-center overflow-hidden" style={{ backgroundColor: tint }}>
          <Icon className="w-14 h-14 transition-transform duration-slow group-hover:scale-110" style={{ color }} aria-hidden />
        </Link>
      )}

      <div className="flex flex-col flex-1 p-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold uppercase tracking-wide" style={{ color }}>
            {frontmatter.category}
          </span>
          <span className="text-xs text-muted">{formatDateShort(frontmatter.lastUpdated)}</span>
        </div>

        <Link href={`/conditions/${slug}`}>
          <h2 className="font-serif font-semibold text-lg text-primary mb-2 leading-snug group-hover:text-accent transition-colors">
            {frontmatter.title}
          </h2>
        </Link>

        <p className="text-sm text-muted leading-relaxed flex-1 mb-4 line-clamp-3">{frontmatter.description}</p>

        <div className="flex items-center justify-between pt-3 border-t border-bark-100 dark:border-bark-800">
          <div className="flex items-center gap-1.5 text-xs text-muted">
            <Clock className="w-3.5 h-3.5" />
            {formatReadingTime(readingTime)}
          </div>
          <Link href={`/conditions/${slug}`}
            className="flex items-center gap-1 text-xs font-medium text-accent hover:opacity-80 transition-opacity">
            Read more <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </article>
  );
}
