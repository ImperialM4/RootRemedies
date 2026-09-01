// GET /api/analytics?period=30d
// Aggregates all metrics and returns them to the admin dashboard.
// Protected by ADMIN_SECRET env var — never public.

import { NextRequest, NextResponse } from "next/server";
import { getOverview, getTimeseries, getTopPages, getTopCountries, getTrafficSources } from "@/lib/analytics/plausible";
import { getSearchStats, getEngagementMetrics, isEventStoreWritable } from "@/lib/analytics/events";
import { getContentMetrics } from "@/lib/analytics/content-metrics";
import type { DashboardData, AnalyticsPeriod } from "@/lib/analytics/types";

export async function GET(req: NextRequest) {
  // Auth check
  const secret = req.headers.get("x-admin-secret");
  if (!process.env.ADMIN_SECRET || secret !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const period = (req.nextUrl.searchParams.get("period") ?? "30d") as AnalyticsPeriod;

  // Fetch all data in parallel
  const [overview, timeseries, topPages, topCountries, sources] = await Promise.all([
    getOverview(period),
    getTimeseries(period),
    getTopPages(period),
    getTopCountries(period),
    getTrafficSources(period),
  ]);

  const content    = getContentMetrics(topPages);
  const engagement = getEngagementMetrics();
  const searches   = getSearchStats();

  const data: DashboardData = {
    overview,
    timeseries,
    topPages,
    topCountries,
    sources,
    content,
    engagement,
    searches,
    generatedAt: new Date().toISOString(),
    localEventStoreWritable: isEventStoreWritable(),
  };

  return NextResponse.json(data, {
    headers: { "Cache-Control": "no-store" },
  });
}
