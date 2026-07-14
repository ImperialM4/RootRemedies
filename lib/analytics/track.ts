// ─────────────────────────────────────────────────────────────────────────────
// lib/analytics/track.ts
//
// Client-side event tracking. Call these from components.
// Fire-and-forget — never blocks the UI.
// ─────────────────────────────────────────────────────────────────────────────

import type { TrackEventPayload } from "./types";

async function send(payload: TrackEventPayload): Promise<void> {
  try {
    await fetch("/api/track", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify(payload),
    });
  } catch {
    // Silently ignore — analytics should never break the user experience
  }
}

export const track = {
  searchQuery(query: string, page?: string) {
    return send({ event: "search_query", query, page });
  },
  searchNoResults(query: string) {
    return send({ event: "search_no_results", query });
  },
  videoPlay(videoId: string, page?: string) {
    return send({ event: "video_play", videoId, page });
  },
  videoComplete(videoId: string, page?: string) {
    return send({ event: "video_complete", videoId, page });
  },
  galleryInteraction(slug?: string, page?: string) {
    return send({ event: "gallery_interaction", slug, page });
  },
  articleHelpful(helpful: boolean, slug: string) {
    return send({
      event: helpful ? "article_helpful_yes" : "article_helpful_no",
      slug,
    });
  },
  scrollDepth(depth: 25 | 50 | 75 | 100, page: string) {
    return send({ event: "scroll_depth", depth, page });
  },
};
