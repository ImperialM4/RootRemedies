"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import type { TocEntry } from "@/types";

interface TableOfContentsProps {
  entries: TocEntry[];
  className?: string;
}

export function TableOfContents({ entries, className }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    if (entries.length === 0) return;
    const observer = new IntersectionObserver(
      (obs) => {
        for (const o of obs) {
          if (o.isIntersecting) setActiveId(o.target.id);
        }
      },
      { rootMargin: "-80px 0px -70% 0px", threshold: 0 }
    );
    for (const e of entries) {
      const el = document.getElementById(e.id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [entries]);

  if (entries.length === 0) return null;

  return (
    <nav aria-label="Table of contents" className={cn("text-sm", className)}>
      <p className="text-xs font-semibold uppercase tracking-widest text-muted mb-3">
        On this page
      </p>
      <ul className="space-y-1">
        {entries.map((entry) => (
          <li key={entry.id} style={{ paddingLeft: entry.level === 3 ? "0.75rem" : entry.level === 4 ? "1.5rem" : "0" }}>
            <a
              href={`#${entry.id}`}
              className={cn(
                "block py-1 leading-snug transition-colors text-[0.8125rem]",
                activeId === entry.id
                  ? "text-accent font-medium"
                  : "text-muted hover:text-primary"
              )}
              onClick={(e) => {
                e.preventDefault();
                document.getElementById(entry.id)?.scrollIntoView({ behavior: "smooth" });
                window.history.replaceState(null, "", `#${entry.id}`);
              }}
            >
              {activeId === entry.id && (
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-accent mr-2 mb-0.5" />
              )}
              {entry.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
