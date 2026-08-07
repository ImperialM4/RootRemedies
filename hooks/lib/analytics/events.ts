// ─────────────────────────────────────────────────────────────────────────────
// lib/analytics/events.ts
//
// Server-side storage for internal events (search queries, video plays,
// scroll depth, helpful votes, gallery interactions).
//
// Storage: a single JSON file at data/analytics-events.json
// This is intentionally simple — no database required to get started.
// Replace with a proper DB (Postgres, SQLite via Turso, etc.) when scale demands.
//
// The file is append-only in structure: we write one JSON object per line
// (newline-delimited JSON / NDJSON) so appends are O(1) and reads are streaming.
// ─────────────────────────────────────────────────────────────────────────────

import fs from "fs";
import path from "path";
import type { TrackEventPayload, SearchQueryStat, EngagementMetrics } from "./types";

const DATA_DIR   = path.join(process.cwd(), "data");
const EVENTS_FILE = path.join(DATA_DIR, "analytics-events.ndjson");

// Ensure data/ directory exists
function ensureDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
}

// ---------------------------------------------------------------------------
// Write
// ---------------------------------------------------------------------------
export function appendEvent(payload: TrackEventPayload): void {
  ensureDir();
  const line = JSON.stringify({
    ...payload,
    ts: new Date().toISOString(),
  }) + "\n";
  fs.appendFileSync(EVENTS_FILE, line, "utf-8");
}

// ---------------------------------------------------------------------------
// Read all events
// ---------------------------------------------------------------------------
function readEvents(): (TrackEventPayload & { ts: string })[] {
  if (!fs.existsSync(EVENTS_FILE)) return [];
  const raw = fs.readFileSync(EVENTS_FILE, "utf-8");
  return raw
    .split("\n")
    .filter(Boolean)
    .map((line) => {
      try { return JSON.parse(line); }
      catch { return null; }
    })
    .filter(Boolean);
}

// ---------------------------------------------------------------------------
// Aggregations
// ---------------------------------------------------------------------------
export function getSearchStats(): SearchQueryStat[] {
  const events = readEvents().filter(
    (e) => e.event === "search_query" || e.event === "search_no_results"
  );

  const map = new Map<string, { count: number; noResults: boolean }>();
  for (const e of events) {
    const q = (e.query ?? "").toLowerCase().trim();
    if (!q) continue;
    const existing = map.get(q) ?? { count: 0, noResults: false };
    map.set(q, {
      count:     existing.count + 1,
      noResults: e.event === "search_no_results" ? true : existing.noResults,
    });
  }

  return Array.from(map.entries())
    .map(([query, stats]) => ({ query, ...stats }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 50);
}

export function getEngagementMetrics(): EngagementMetrics {
  const events = readEvents();

  const scrollBuckets: Record<number, number> = { 25: 0, 50: 0, 75: 0, 100: 0 };

  let videoPlays = 0, videoCompletions = 0, galleryClicks = 0;
  let helpfulYes = 0, helpfulNo = 0;

  for (const e of events) {
    switch (e.event) {
      case "video_play":         videoPlays++;        break;
      case "video_complete":     videoCompletions++;  break;
      case "gallery_interaction":galleryClicks++;     break;
      case "article_helpful_yes":helpfulYes++;        break;
      case "article_helpful_no": helpfulNo++;         break;
      case "scroll_depth":
        if (e.depth && e.depth in scrollBuckets) scrollBuckets[e.depth]++;
        break;
    }
  }

  return {
    videoPlays,
    videoCompletions,
    galleryClicks,
    helpfulYes,
    helpfulNo,
    scrollDepths: [25, 50, 75, 100].map((d) => ({
      depth: d as 25 | 50 | 75 | 100,
      count: scrollBuckets[d],
    })),
  };
}

// ---------------------------------------------------------------------------
// Export to CSV
// ---------------------------------------------------------------------------
export function exportEventsCSV(): string {
  const events = readEvents();
  if (!events.length) return "timestamp,event,page,slug,query,depth\n";
  const header = "timestamp,event,page,slug,query,depth";
  const rows = events.map((e) =>
    [e.ts, e.event, e.page ?? "", e.slug ?? "", e.query ?? "", e.depth ?? ""].join(",")
  );
  return [header, ...rows].join("\n");
}
