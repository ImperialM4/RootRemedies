import { cn } from "@/lib/utils";

interface QuoteProps {
  children: React.ReactNode;
  attribution?: string;
  source?: string;
  className?: string;
}

export function Quote({ children, attribution, source, className }: QuoteProps) {
  return (
    <blockquote
      className={cn(
        "my-8 pl-6 border-l-4 border-sage-400 dark:border-sage-600",
        className
      )}
    >
      {/*
        Never wrap children in <p>. MDX already wraps paragraph text in <p>,
        so <p>{children}</p> produces invalid <p><p>…</p></p> nesting.
        Use a <div> with the same typography styles — block-level, inherits fine.
      */}
      <div className="font-serif text-xl italic text-primary leading-relaxed [&>p]:my-0 [&>p:first-child]:mt-0 [&>p:last-child]:mb-0">
        {children}
      </div>
      {(attribution || source) && (
        <footer className="mt-3 text-sm text-muted not-italic">
          {attribution && (
            <cite className="font-medium not-italic">{attribution}</cite>
          )}
          {attribution && source && <span className="mx-1">—</span>}
          {source && <span>{source}</span>}
        </footer>
      )}
    </blockquote>
  );
}
