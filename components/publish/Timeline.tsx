import { cn } from "@/lib/utils";

interface TimelineItem { year: string; label?: string; description: string; }
interface TimelineProps { items: TimelineItem[]; title?: string; className?: string; }

export function Timeline({ items, title, className }: TimelineProps) {
  return (
    <section className={cn("my-8 not-prose", className)}>
      {title && <h3 className="font-serif text-xl font-semibold text-primary mb-6">{title}</h3>}
      <ol className="relative border-l-2 border-bark-200 dark:border-bark-700 ml-4 space-y-8">
        {items.map((item, i) => (
          <li key={i} className="ml-6">
            {/* Dot */}
            <span className="absolute -left-[9px] flex h-4 w-4 items-center justify-center rounded-full bg-sage-600 dark:bg-sage-500 ring-4 ring-surface" />
            <div>
              <div className="flex items-baseline gap-3 mb-1">
                <span className="text-xs font-mono font-semibold text-accent">{item.year}</span>
                {item.label && <span className="text-xs font-medium text-muted uppercase tracking-wide">{item.label}</span>}
              </div>
              <p className="text-sm text-body leading-relaxed">{item.description}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
