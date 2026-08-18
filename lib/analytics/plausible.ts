// ─────────────────────────────────────────────────────────────────────────────
// lib/analytics/plausible.ts
//
// Server-side Plausible Analytics API client.
// Plausible is privacy-friendly (no cookies, GDPR compliant, open source).
//
// Required env vars:
//   PLAUSIBLE_API_KEY   — from plausible.io → Settings → API keys
//   PLAUSIBLE_SITE_ID   — your site domain, e.g. "rootremedies.com"
//   PLAUSIBLE_BASE_URL  — optional, default "https://plausible.io" (for self-hosted)
// ─────────────────────────────────────────────────────────────────────────────

import type {
  PlausibleAggregate,
  PlausibleTimeseries,
  PlausibleBreakdown,
  OverviewMetrics,
  TimeseriesPoint,
  TopPage,
  TopCountry,
  TrafficSource,
  AnalyticsPeriod,
} from "./types";

const BASE    = process.env.PLAUSIBLE_BASE_URL ?? "https://plausible.io";
const SITE_ID = process.env.PLAUSIBLE_SITE_ID  ?? "";
const API_KEY = process.env.PLAUSIBLE_API_KEY   ?? "";

function headers() {
  return { Authorization: `Bearer ${API_KEY}`, "Content-Type": "application/json" };
}

async function get<T>(path: string, params: Record<string, string> = {}): Promise<T | null> {
  if (!API_KEY || !SITE_ID) return null;
  const url = new URL(`${BASE}/api/v1/stats${path}`);
  url.searchParams.set("site_id", SITE_ID);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);

  try {
    const res = await fetch(url.toString(), {
      headers: headers(),
      next: { revalidate: 300 }, // cache 5 minutes
    });
    if (!res.ok) return null;
    return res.json() as Promise<T>;
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export async function getOverview(period: AnalyticsPeriod): Promise<OverviewMetrics> {
  const data = await get<{ results: PlausibleAggregate }>("/aggregate", {
    period,
    metrics: "visitors,pageviews,bounce_rate,visit_duration",
  });

  if (!data) {
    return { visitors: 0, pageviews: 0, bounceRate: 0, avgDuration: 0, period };
  }

  return {
    visitors:    data.results.visitors.value,
    pageviews:   data.results.pageviews.value,
    bounceRate:  data.results.bounce_rate.value,
    avgDuration: data.results.visit_duration.value,
    period,
  };
}

export async function getTimeseries(period: AnalyticsPeriod): Promise<TimeseriesPoint[]> {
  const data = await get<{ results: PlausibleTimeseries[] }>("/timeseries", {
    period,
    metrics: "visitors,pageviews",
  });
  return (data?.results ?? []).map((r) => ({
    date:      r.date,
    visitors:  r.visitors,
    pageviews: r.pageviews,
  }));
}

export async function getTopPages(period: AnalyticsPeriod, limit = 20): Promise<TopPage[]> {
  const data = await get<{ results: PlausibleBreakdown[] }>("/breakdown", {
    period,
    property: "event:page",
    metrics:  "visitors,pageviews",
    limit:    String(limit),
  });
  return (data?.results ?? []).map((r) => ({
    page:      r.property,
    visitors:  r.visitors,
    pageviews: r.pageviews ?? 0,
  }));
}

export async function getTopCountries(period: AnalyticsPeriod, limit = 20): Promise<TopCountry[]> {
  const data = await get<{ results: PlausibleBreakdown[] }>("/breakdown", {
    period,
    property: "visit:country",
    metrics:  "visitors",
    limit:    String(limit),
  });
  return (data?.results ?? []).map((r) => ({
    country:  r.property,
    visitors: r.visitors,
  }));
}

export async function getTrafficSources(period: AnalyticsPeriod): Promise<TrafficSource[]> {
  const data = await get<{ results: PlausibleBreakdown[] }>("/breakdown", {
    period,
    property: "visit:source",
    metrics:  "visitors",
    limit:    "20",
  });
  return (data?.results ?? []).map((r) => ({
    source:   r.property || "Direct",
    visitors: r.visitors,
  }));
}

export function isConfigured(): boolean {
  return Boolean(API_KEY && SITE_ID);
}
