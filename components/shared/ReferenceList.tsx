import { ExternalLink, BookOpen } from "lucide-react";
import type { Reference } from "@/types";
import { cn } from "@/lib/utils";

interface ReferenceListProps { references: Reference[]; className?: string; }

export function ReferenceList({ references, className }: ReferenceListProps) {
  if (!references?.length) return null;
  return (
    <section aria-label="References" className={cn("mt-10 pt-8 border-t border-bark-200 dark:border-bark-700", className)}>
      <h2 className="flex items-center gap-2 font-serif text-lg font-semibold text-primary mb-4">
        <BookOpen className="w-4 h-4 text-accent" aria-hidden />
        References
      </h2>
      <ol className="space-y-3">
        {references.map((ref, i) => (
          <li key={ref.id} id={ref.id} className="flex gap-3 text-sm text-muted">
            <span className="shrink-0 text-faint font-mono tabular-nums">[{i + 1}]</span>
            <div>
              {ref.author && <span className="text-body">{ref.author}. </span>}
              <span className="font-medium text-primary">&ldquo;{ref.title}&rdquo;</span>
              {ref.source && <span className="text-muted"> — {ref.source}</span>}
              {ref.year   && <span className="text-faint"> ({ref.year})</span>}
              {ref.url    && (
                <> <a href={ref.url} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-accent underline underline-offset-2 hover:opacity-80 transition-opacity">
                  Link <ExternalLink className="w-3 h-3" aria-hidden />
                </a></>
              )}
              {ref.accessed && <span className="text-faint text-xs ml-1">(accessed {ref.accessed})</span>}
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
