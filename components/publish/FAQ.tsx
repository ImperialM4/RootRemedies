"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface FAQItem { question: string; answer: string; }
interface FAQProps { items: FAQItem[]; title?: string; className?: string; }

export function FAQ({ items, title, className }: FAQProps) {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <section className={cn("my-8 not-prose", className)} aria-label={title ?? "Frequently asked questions"}>
      {title && <h3 className="font-serif text-xl font-semibold text-primary mb-4">{title}</h3>}
      <div className="divide-y divide-bark-200 dark:divide-bark-700 border border-bark-200 dark:border-bark-700 rounded-xl overflow-hidden">
        {items.map((item, i) => {
          const isOpen = openIdx === i;
          return (
            <div key={i} className="bg-surface-card">
              <button
                onClick={() => setOpenIdx(isOpen ? null : i)}
                className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-bark-50 dark:hover:bg-bark-800 transition-colors"
                aria-expanded={isOpen}
              >
                <span className="font-medium text-primary text-sm">{item.question}</span>
                <ChevronDown className={cn(
                  "w-4 h-4 text-muted shrink-0 transition-transform duration-base",
                  isOpen && "rotate-180"
                )} />
              </button>
              {isOpen && (
                <div className="px-5 pb-4 text-sm text-body leading-relaxed animate-fade-in">
                  {item.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
