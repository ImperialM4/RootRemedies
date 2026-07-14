// ─────────────────────────────────────────────────────────────────────────────
// lib/analytics/types.ts
//
// All analytics types. Designed so new metric categories can be added
// by extending these interfaces without touching existing code.
// ─────────────────────────────────────────────────────────────────────────────

// ---------------------------------------------------------------------------
// Plausible API response shapes
// ---------------------------------------------------------------------------
export interface PlausibleAggregate {
  visitors:     { value: number };
  pageviews:    { value: number };
  bounce_rate:  { value: number };
  visit_duration:{ value: number };
}

export interface PlausibleTimeseries {
  date:       string;
  visitors:   number;
  pageviews:  number;
}

export interface PlausibleBreakdown {
  property: string;
  visitors:  number;
  pageviews?: number;
  bounce_rate?: number;
  visit_duration?: number;
}

// ---------------------------------------------------------------------------
// Internal event types tracked via /api/track
// ---------------------------------------------------------------------------
export type EventType =
  | "search_query"
  | "search_no_results"
  | "video_play"
  | "video_complete"
  | "gallery_interaction"
  | "article_helpful_yes"
  | "article_helpful_no"
  | "scroll_depth";

export interface TrackEventPayload {
  event:      EventType;
  page?:      string;      // e.g. "/conditions/sore-throat"
  slug?:      string;      // condition or remedy slug
  query?:     string;      // for search events
  depth?:     number;      // 25 | 50 | 75 | 100 for scroll_depth
  videoId?:   string;
  extra?:     Record<string, string | number | boolean>;
}

// ---------------------------------------------------------------------------
// Dashboard data shapes
// ---------------------------------------------------------------------------
export interface OverviewMetrics {
  visitors:        number;
  pageviews:       number;
  bounceRate:      number;
  avgDuration:     number;   // seconds
  period:          string;   // "7d" | "30d" | "90d"
}

export interface TimeseriesPoint {
  date:      string;
  visitors:  number;
  pageviews: number;
}

export interface TopPage {
  page:      string;
  visitors:  number;
  pageviews: number;
}

export interface TopCountry {
  country:   string;
  visitors:  number;
}

export interface TrafficSource {
  source:    string;
  visitors:  number;
}

export interface SearchQueryStat {
  query:      string;
  count:      number;
  noResults:  boolean;
}

export interface ContentMetrics {
  totalConditions: number;
  totalRemedies:   number;
  totalVideos:     number;
  topConditions:   { slug: string; title: string; views: number }[];
}

export interface EngagementMetrics {
  videoPlays:       number;
  videoCompletions: number;
  galleryClicks:    number;
  helpfulYes:       number;
  helpfulNo:        number;
  scrollDepths:     { depth: 25 | 50 | 75 | 100; count: number }[];
}

export interface DashboardData {
  overview:     OverviewMetrics;
  timeseries:   TimeseriesPoint[];
  topPages:     TopPage[];
  topCountries: TopCountry[];
  sources:      TrafficSource[];
  content:      ContentMetrics;
  engagement:   EngagementMetrics;
  searches:     SearchQueryStat[];
  generatedAt:  string;   // ISO timestamp
}

// Period options for the dashboard filter
export type AnalyticsPeriod = "7d" | "30d" | "90d" | "12mo";
