import Image from "next/image";
import { Calendar, Clock, User, Tag } from "lucide-react";
import { formatDate, formatReadingTime } from "@/lib/utils";
import type { Condition } from "@/types";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { cn } from "@/lib/utils";

interface ConditionHeaderProps {
  condition: Condition;
  className?: string;
}

export function ConditionHeader({ condition, className }: ConditionHeaderProps) {
  const { frontmatter, readingTime } = condition;
  return (
    <header className={cn("mb-10", className)}>
      <Breadcrumbs
        items={[
          { label: "Conditions", href: "/conditions" },
          { label: frontmatter.category, href: `/categories/${frontmatter.category.toLowerCase().replace(/\s+/g, "-")}` },
          { label: frontmatter.title },
        ]}
        className="mb-6"
      />

      {frontmatter.coverImage && (
        <div className="relative w-full aspect-[21/9] rounded-xl overflow-hidden mb-8 bg-bark-100 dark:bg-bark-800">
          <Image src={frontmatter.coverImage} alt={frontmatter.coverImageAlt ?? frontmatter.title}
            fill className="object-cover" priority
            sizes="(max-width:768px) 100vw, (max-width:1200px) 80vw, 900px" />
        </div>
      )}

      <div className="mb-3">
        <span className="text-xs font-semibold uppercase tracking-widest text-accent">
          {frontmatter.category}
        </span>
      </div>

      <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-primary leading-tight mb-4 tracking-tight">
        {frontmatter.title}
      </h1>

      <p className="text-lg text-muted leading-relaxed mb-6 max-w-2xl">
        {frontmatter.description}
      </p>

      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted mb-5">
        <span className="flex items-center gap-1.5">
          <User className="w-3.5 h-3.5" aria-hidden />
          {frontmatter.author}
        </span>
        <span className="flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5" aria-hidden />
          Updated {formatDate(frontmatter.lastUpdated)}
        </span>
        <span className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5" aria-hidden />
          {formatReadingTime(readingTime)}
        </span>
      </div>

      {frontmatter.tags.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5">
          <Tag className="w-3.5 h-3.5 text-muted" aria-hidden />
          {frontmatter.tags.map((tag) => (
            <a key={tag} href={`/conditions?tag=${encodeURIComponent(tag)}`} className="tag-pill">
              {tag}
            </a>
          ))}
        </div>
      )}
    </header>
  );
}
