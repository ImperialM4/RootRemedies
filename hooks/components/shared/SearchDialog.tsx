"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { Search, X, Loader2, ArrowRight } from "lucide-react";
import { SearchEngine } from "@/lib/search";
import { track } from "@/lib/analytics/track";
import type { SearchResult } from "@/types";
import { cn } from "@/lib/utils";

interface SearchDialogProps { open: boolean; onClose: () => void; }

export function SearchDialog({ open, onClose }: SearchDialogProps) {
  const [query,         setQuery]         = useState("");
  const [results,       setResults]       = useState<SearchResult[]>([]);
  const [loading,       setLoading]       = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef  = useRef<HTMLInputElement>(null);
  const engineRef = useRef(SearchEngine.getInstance());

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery(""); setResults([]); setSelectedIndex(0);
    }
  }, [open]);

  const doSearch = useCallback(async (q: string) => {
    if (!q.trim()) { setResults([]); return; }
    setLoading(true);
    try {
      const found = (await engineRef.current.search(q)).slice(0, 8);
      setResults(found);
      setSelectedIndex(0);
      // Track search after a short debounce so partial queries don't flood the log
      if (found.length > 0) {
        track.searchQuery(q);
      } else {
        track.searchNoResults(q);
      }
    } finally { setLoading(false); }
  }, []);

  useEffect(() => {
    const t = setTimeout(() => doSearch(query), 400); // slightly longer debounce for tracking
    return () => clearTimeout(t);
  }, [query, doSearch]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if      (e.key === "Escape")    { onClose(); }
    else if (e.key === "ArrowDown") { e.preventDefault(); setSelectedIndex((i) => Math.min(i + 1, results.length - 1)); }
    else if (e.key === "ArrowUp")   { e.preventDefault(); setSelectedIndex((i) => Math.max(i - 1, 0)); }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh] px-4"
      role="dialog" aria-modal aria-label="Search conditions">
      <div className="absolute inset-0 bg-bark-900/50 dark:bg-black/60 backdrop-blur-sm" onClick={onClose} aria-hidden />

      <div className="relative w-full max-w-xl bg-surface-card rounded-xl shadow-2xl border border-bark-200 dark:border-bark-700 overflow-hidden animate-scale-in">
        <div className="flex items-center gap-3 px-4 py-3 border-b border-bark-100 dark:border-bark-800">
          <Search className="w-4 h-4 text-muted shrink-0" />
          <input ref={inputRef} type="text" value={query} onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search conditions, remedies, symptoms…"
            className="flex-1 text-sm text-primary placeholder:text-muted outline-none bg-transparent"
            autoComplete="off" spellCheck={false} />
          {loading && <Loader2 className="w-4 h-4 text-muted animate-spin shrink-0" />}
          <button onClick={onClose} className="p-1 rounded hover:bg-bark-100 dark:hover:bg-bark-800 text-muted hover:text-primary transition-colors" aria-label="Close">
            <X className="w-4 h-4" />
          </button>
        </div>

        {results.length > 0 && (
          <ul className="py-2 max-h-80 overflow-y-auto" role="listbox">
            {results.map((r, i) => (
              <li key={r.slug} role="option" aria-selected={i === selectedIndex}>
                <Link href={`/conditions/${r.slug}`} onClick={onClose}
                  className={cn("flex items-center gap-3 px-4 py-3 transition-colors",
                    i === selectedIndex ? "bg-sage-50 dark:bg-sage-950/30" : "hover:bg-bark-50 dark:hover:bg-bark-800/50"
                  )}>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-primary truncate">{r.title}</div>
                    <div className="text-xs text-muted truncate mt-0.5">{r.description}</div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs text-muted bg-bark-100 dark:bg-bark-800 px-2 py-0.5 rounded-full">{r.category}</span>
                    {i === selectedIndex && <ArrowRight className="w-3 h-3 text-accent" />}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}

        {query && !loading && results.length === 0 && (
          <div className="py-12 text-center text-muted text-sm">No results for &ldquo;{query}&rdquo;</div>
        )}

        {!query && (
          <div className="px-4 py-4 text-xs text-faint flex items-center gap-4">
            <span>↑↓ navigate</span><span>↵ select</span><span>esc close</span>
          </div>
        )}
      </div>
    </div>
  );
}
