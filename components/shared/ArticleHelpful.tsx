"use client";

import { useState } from "react";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { track } from "@/lib/analytics/track";
import { cn } from "@/lib/utils";

interface ArticleHelpfulProps {
  slug: string;
  className?: string;
}

export function ArticleHelpful({ slug, className }: ArticleHelpfulProps) {
  const [voted, setVoted] = useState<"yes" | "no" | null>(null);

  const vote = (helpful: boolean) => {
    if (voted) return;
    const v = helpful ? "yes" : "no";
    setVoted(v);
    track.articleHelpful(helpful, slug);
  };

  return (
    <div className={cn("mt-10 pt-6 border-t border-bark-200 dark:border-bark-700", className)}>
      {voted ? (
        <p className="text-sm text-muted text-center">
          Thanks for the feedback!
        </p>
      ) : (
        <div className="flex flex-col sm:flex-row items-center gap-3 justify-center">
          <p className="text-sm text-muted">Was this article helpful?</p>
          <div className="flex gap-2">
            <button
              onClick={() => vote(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg border border-bark-200 dark:border-bark-700 text-muted hover:border-sage-400 hover:text-sage-600 dark:hover:border-sage-600 dark:hover:text-sage-400 transition-all"
            >
              <ThumbsUp className="w-3.5 h-3.5" /> Yes
            </button>
            <button
              onClick={() => vote(false)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg border border-bark-200 dark:border-bark-700 text-muted hover:border-red-300 hover:text-red-600 dark:hover:border-red-700 dark:hover:text-red-400 transition-all"
            >
              <ThumbsDown className="w-3.5 h-3.5" /> No
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
