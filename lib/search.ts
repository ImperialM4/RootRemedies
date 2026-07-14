// ─────────────────────────────────────────────────────────────────────────────
// lib/search.ts
// Client-side search using MiniSearch.
// The index is serialized to JSON at build time via the API route,
// then downloaded once and reused across searches in the browser.
// ─────────────────────────────────────────────────────────────────────────────

import MiniSearch from "minisearch";
import type { SearchDocument, SearchResult } from "@/types";

// ---------------------------------------------------------------------------
// MiniSearch configuration
// Must be identical on both the server (when building the index)
// and the client (when loading and searching it).
// ---------------------------------------------------------------------------
export const MINISEARCH_OPTIONS: ConstructorParameters<typeof MiniSearch>[0] = {
  fields: ["title", "description", "tags", "content", "category"],
  storeFields: ["title", "description", "category", "tags"],
  searchOptions: {
    boost: { title: 3, description: 2, tags: 2 },
    prefix: true,
    fuzzy: 0.2,
  },
};

// Internal shape actually fed to MiniSearch: tags flattened from string[] to a
// single space-joined string, since MiniSearch indexes/tokenizes string fields.
type IndexableDocument = Omit<SearchDocument, "tags"> & { tags: string };

// ---------------------------------------------------------------------------
// Server-side: build serialized index (called in API route or build step)
// ---------------------------------------------------------------------------
export function createSearchIndex(documents: SearchDocument[]): string {
  const index = new MiniSearch<IndexableDocument>(MINISEARCH_OPTIONS);

  // Flatten tags array to a string for indexing
  const docs: IndexableDocument[] = documents.map((d) => ({
    ...d,
    tags: d.tags.join(" "),
  }));

  index.addAll(docs);
  return JSON.stringify(index.toJSON());
}

// ---------------------------------------------------------------------------
// Client-side: load the serialized index and search it
// ---------------------------------------------------------------------------
export class SearchEngine {
  private index: MiniSearch | null = null;
  private static instance: SearchEngine | null = null;

  static getInstance(): SearchEngine {
    if (!SearchEngine.instance) {
      SearchEngine.instance = new SearchEngine();
    }
    return SearchEngine.instance;
  }

  async ensureLoaded(): Promise<void> {
    if (this.index) return;

    try {
      const res = await fetch("/api/search-index");
      if (!res.ok) throw new Error("Failed to fetch search index");
      const serialized = await res.json();
      this.index = MiniSearch.loadJSON<SearchDocument>(
        JSON.stringify(serialized),
        MINISEARCH_OPTIONS
      );
    } catch (err) {
      console.error("[Search] Failed to load index:", err);
      this.index = null;
    }
  }

  async search(query: string): Promise<SearchResult[]> {
    if (!query.trim()) return [];
    await this.ensureLoaded();
    if (!this.index) return [];

    const results = this.index.search(query);
    return results.map((r) => ({
      slug: String(r.id),
      title: String(r.title ?? ""),
      description: String(r.description ?? ""),
      category: String(r.category ?? ""),
      tags: Array.isArray(r.tags)
        ? r.tags
        : String(r.tags ?? "")
            .split(" ")
            .filter(Boolean),
      score: r.score,
    }));
  }

  invalidate(): void {
    this.index = null;
    SearchEngine.instance = null;
  }
}
