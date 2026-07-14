"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Users, Eye, Clock, TrendingUp, FileText, Leaf,
  ThumbsUp, Play, Download, RefreshCw, LogOut,
  MousePointerClick,
} from "lucide-react";
import type { DashboardData, AnalyticsPeriod } from "@/lib/analytics/types";

// ── Tiny chart helpers (no library needed for sparklines) ──────────────────
function Sparkline({ data, color = "#843D27" }: { data: number[]; color?: string }) {
  if (!data.length) return <div className="h-10" />;
  const max = Math.max(...data, 1);
  const w = 120, h = 40;
  const pts = data
    .map((v, i) => `${(i / (data.length - 1)) * w},${h - (v / max) * (h - 4)}`)
    .join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-10" preserveAspectRatio="none">
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ── Stat card ──────────────────────────────────────────────────────────────
function StatCard({
  icon: Icon, label, value, sub, sparkData, color,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  sub?: string;
  sparkData?: number[];
  color?: string;
}) {
  return (
    <div className="bg-bark-900 border border-bark-700 rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs text-bark-400 font-medium uppercase tracking-wide">{label}</span>
        <Icon className="w-4 h-4 text-bark-500" />
      </div>
      <div className="text-2xl font-bold text-bark-100 mb-1">{value.toLocaleString()}</div>
      {sub && <div className="text-xs text-bark-500">{sub}</div>}
      {sparkData && <div className="mt-3"><Sparkline data={sparkData} color={color} /></div>}
    </div>
  );
}

// ── Section header ─────────────────────────────────────────────────────────
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-xs font-semibold text-bark-400 uppercase tracking-widest mb-3">{title}</h2>
      {children}
    </div>
  );
}

// ── Bar component ──────────────────────────────────────────────────────────
function Bar({ label, value, max, sub }: { label: string; value: number; max: number; sub?: string }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span className="text-bark-300 truncate max-w-[65%]">{label}</span>
        <span className="text-bark-400">{sub ?? value.toLocaleString()}</span>
      </div>
      <div className="h-1.5 bg-bark-800 rounded-full overflow-hidden">
        <div className="h-full bg-sage-600 rounded-full transition-all" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

// ── Main dashboard ─────────────────────────────────────────────────────────
const PERIODS: { label: string; value: AnalyticsPeriod }[] = [
  { label: "7 days",   value: "7d" },
  { label: "30 days",  value: "30d" },
  { label: "90 days",  value: "90d" },
  { label: "12 months",value: "12mo" },
];

export default function AdminDashboard() {
  const router  = useRouter();
  const [data,    setData]    = useState<DashboardData | null>(null);
  const [period,  setPeriod]  = useState<AnalyticsPeriod>("30d");
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState("");

  const secret = typeof window !== "undefined" ? sessionStorage.getItem("adminSecret") : null;

  const load = useCallback(async (p: AnalyticsPeriod) => {
    if (!secret) { router.replace("/admin/login"); return; }
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/analytics?period=${p}`, {
        headers: { "x-admin-secret": secret },
      });
      if (res.status === 401) { router.replace("/admin/login"); return; }
      if (!res.ok) throw new Error("Failed to load");
      setData(await res.json());
    } catch {
      setError("Failed to load analytics data.");
    } finally {
      setLoading(false);
    }
  }, [secret, router]);

  useEffect(() => { load(period); }, [period, load]);

  const handleExport = async () => {
    if (!secret) return;
    const res = await fetch("/api/analytics/export", { headers: { "x-admin-secret": secret } });
    const blob = await res.blob();
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href = url;
    a.download = `rootremedies-events-${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleLogout = () => {
    sessionStorage.removeItem("adminSecret");
    router.push("/admin/login");
  };

  const visitorsSpark = data?.timeseries.map((t) => t.visitors) ?? [];
  const pageviewsSpark = data?.timeseries.map((t) => t.pageviews) ?? [];

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-sage-600 rounded-lg flex items-center justify-center">
            <Leaf className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="font-serif text-lg font-semibold text-bark-100">RootRemedies Analytics</h1>
            {data && (
              <p className="text-xs text-bark-500">
                Updated {new Date(data.generatedAt).toLocaleTimeString()}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Period selector */}
          <div className="flex bg-bark-900 border border-bark-700 rounded-lg p-0.5 gap-0.5">
            {PERIODS.map((p) => (
              <button
                key={p.value}
                onClick={() => setPeriod(p.value)}
                className={`text-xs px-2.5 py-1.5 rounded-md font-medium transition-colors ${
                  period === p.value
                    ? "bg-sage-600 text-white"
                    : "text-bark-400 hover:text-bark-200"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          <button
            onClick={() => load(period)}
            className="p-2 bg-bark-900 border border-bark-700 rounded-lg text-bark-400 hover:text-bark-200 transition-colors"
            aria-label="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>

          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 px-3 py-2 bg-bark-900 border border-bark-700 rounded-lg text-xs text-bark-400 hover:text-bark-200 transition-colors"
          >
            <Download className="w-3.5 h-3.5" /> Export CSV
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-2 bg-bark-900 border border-bark-700 rounded-lg text-xs text-bark-400 hover:text-red-400 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" /> Logout
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 bg-red-950/40 border border-red-800 rounded-lg px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      {loading && !data ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-pulse">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-bark-900 rounded-xl h-24 border border-bark-800" />
          ))}
        </div>
      ) : data ? (
        <div className="space-y-8">

          {/* ── Traffic overview ────────────────────────────────────────── */}
          <Section title="Traffic Overview">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <StatCard
                icon={Users} label="Visitors" value={data.overview.visitors}
                sub={`Last ${period}`} sparkData={visitorsSpark} color="#843D27"
              />
              <StatCard
                icon={Eye} label="Page Views" value={data.overview.pageviews}
                sub={`Last ${period}`} sparkData={pageviewsSpark} color="#8C7460"
              />
              <StatCard
                icon={TrendingUp} label="Bounce Rate" value={`${data.overview.bounceRate}%`}
                sub="Lower is better"
              />
              <StatCard
                icon={Clock} label="Avg. Duration" value={`${Math.round(data.overview.avgDuration)}s`}
                sub="Per session"
              />
            </div>
          </Section>

          {/* ── Content + Engagement ─────────────────────────────────── */}
          <div className="grid md:grid-cols-2 gap-8">

            {/* Content */}
            <Section title="Published Content">
              <div className="bg-bark-900 border border-bark-700 rounded-xl p-4 space-y-4">
                <div className="grid grid-cols-3 gap-3 pb-4 border-b border-bark-800">
                  {[
                    { label: "Conditions", value: data.content.totalConditions, icon: FileText },
                    { label: "Remedies",   value: data.content.totalRemedies,   icon: Leaf },
                    { label: "Videos",     value: data.content.totalVideos,     icon: Play },
                  ].map(({ label, value, icon: Icon }) => (
                    <div key={label} className="text-center">
                      <Icon className="w-4 h-4 text-sage-500 mx-auto mb-1" />
                      <div className="text-xl font-bold text-bark-100">{value}</div>
                      <div className="text-xs text-bark-500">{label}</div>
                    </div>
                  ))}
                </div>

                {data.content.topConditions.length > 0 ? (
                  <div className="space-y-2.5">
                    <p className="text-xs text-bark-500 font-medium">Top Conditions</p>
                    {data.content.topConditions.map((c) => (
                      <Bar
                        key={c.slug}
                        label={c.title}
                        value={c.views}
                        max={data.content.topConditions[0]?.views ?? 1}
                        sub={`${c.views.toLocaleString()} views`}
                      />
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-bark-600 text-center py-4">No page view data yet</p>
                )}
              </div>
            </Section>

            {/* Engagement */}
            <Section title="Engagement">
              <div className="bg-bark-900 border border-bark-700 rounded-xl p-4 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "Video Plays",   value: data.engagement.videoPlays,       icon: Play },
                    { label: "Completions",   value: data.engagement.videoCompletions,  icon: Play },
                    { label: "Helpful ✓",     value: data.engagement.helpfulYes,        icon: ThumbsUp },
                    { label: "Gallery Clicks",value: data.engagement.galleryClicks,     icon: MousePointerClick },
                  ].map(({ label, value, icon: Icon }) => (
                    <div key={label} className="flex items-center gap-2 bg-bark-800 rounded-lg px-3 py-2.5">
                      <Icon className="w-3.5 h-3.5 text-sage-500 shrink-0" />
                      <div>
                        <div className="text-sm font-bold text-bark-100">{value}</div>
                        <div className="text-xs text-bark-500">{label}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Scroll depth */}
                <div>
                  <p className="text-xs text-bark-500 font-medium mb-2">Scroll Depth</p>
                  <div className="space-y-2">
                    {data.engagement.scrollDepths.map(({ depth, count }) => (
                      <Bar
                        key={depth}
                        label={`${depth}%`}
                        value={count}
                        max={data.engagement.scrollDepths[0]?.count ?? 1}
                        sub={`${count} readers`}
                      />
                    ))}
                  </div>
                </div>

                {/* Helpful ratio */}
                {(data.engagement.helpfulYes + data.engagement.helpfulNo) > 0 && (
                  <div>
                    <p className="text-xs text-bark-500 font-medium mb-2">Article Satisfaction</p>
                    <div className="h-2 bg-bark-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-sage-600 rounded-full"
                        style={{
                          width: `${Math.round(
                            (data.engagement.helpfulYes /
                              (data.engagement.helpfulYes + data.engagement.helpfulNo)) * 100
                          )}%`,
                        }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-bark-500 mt-1">
                      <span>{data.engagement.helpfulYes} helpful</span>
                      <span>{data.engagement.helpfulNo} not helpful</span>
                    </div>
                  </div>
                )}
              </div>
            </Section>
          </div>

          {/* ── Geographic + Sources ─────────────────────────────────── */}
          <div className="grid md:grid-cols-2 gap-8">
            <Section title="Top Countries">
              <div className="bg-bark-900 border border-bark-700 rounded-xl p-4 space-y-2.5">
                {data.topCountries.length > 0 ? (
                  data.topCountries.slice(0, 10).map((c, i) => (
                    <Bar
                      key={c.country}
                      label={`${i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : "  "} ${c.country}`}
                      value={c.visitors}
                      max={data.topCountries[0]?.visitors ?? 1}
                      sub={`${c.visitors.toLocaleString()} visitors`}
                    />
                  ))
                ) : (
                  <p className="text-xs text-bark-600 text-center py-6">
                    No geographic data yet.{" "}
                    {!process.env.NEXT_PUBLIC_PLAUSIBLE_SITE_ID && "Configure Plausible to enable."}
                  </p>
                )}
              </div>
            </Section>

            <Section title="Traffic Sources">
              <div className="bg-bark-900 border border-bark-700 rounded-xl p-4 space-y-2.5">
                {data.sources.length > 0 ? (
                  data.sources.slice(0, 10).map((s) => (
                    <Bar
                      key={s.source}
                      label={s.source}
                      value={s.visitors}
                      max={data.sources[0]?.visitors ?? 1}
                      sub={`${s.visitors.toLocaleString()} visitors`}
                    />
                  ))
                ) : (
                  <p className="text-xs text-bark-600 text-center py-6">
                    No source data yet.
                  </p>
                )}
              </div>
            </Section>
          </div>

          {/* ── Search queries ──────────────────────────────────────── */}
          <Section title="Search Queries">
            <div className="bg-bark-900 border border-bark-700 rounded-xl overflow-hidden">
              {data.searches.length > 0 ? (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-bark-800">
                      <th className="text-left px-4 py-2.5 text-xs font-semibold text-bark-400">Query</th>
                      <th className="text-right px-4 py-2.5 text-xs font-semibold text-bark-400">Searches</th>
                      <th className="text-right px-4 py-2.5 text-xs font-semibold text-bark-400">Results</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-bark-800">
                    {data.searches.slice(0, 25).map((s) => (
                      <tr key={s.query} className="hover:bg-bark-800/50 transition-colors">
                        <td className="px-4 py-2.5 text-bark-200 font-mono text-xs">{s.query}</td>
                        <td className="px-4 py-2.5 text-right text-bark-400 text-xs">{s.count}</td>
                        <td className="px-4 py-2.5 text-right text-xs">
                          {s.noResults
                            ? <span className="text-red-400">No results</span>
                            : <span className="text-sage-500">Found</span>
                          }
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-xs text-bark-600 text-center py-8">
                  Search queries will appear here once visitors start searching.
                </p>
              )}
            </div>
          </Section>

          {/* ── Top pages ───────────────────────────────────────────── */}
          <Section title="Top Pages">
            <div className="bg-bark-900 border border-bark-700 rounded-xl overflow-hidden">
              {data.topPages.length > 0 ? (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-bark-800">
                      <th className="text-left px-4 py-2.5 text-xs font-semibold text-bark-400">Page</th>
                      <th className="text-right px-4 py-2.5 text-xs font-semibold text-bark-400">Visitors</th>
                      <th className="text-right px-4 py-2.5 text-xs font-semibold text-bark-400">Views</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-bark-800">
                    {data.topPages.slice(0, 15).map((p) => (
                      <tr key={p.page} className="hover:bg-bark-800/50 transition-colors">
                        <td className="px-4 py-2.5 text-bark-200 font-mono text-xs truncate max-w-xs">{p.page}</td>
                        <td className="px-4 py-2.5 text-right text-bark-400 text-xs">{p.visitors.toLocaleString()}</td>
                        <td className="px-4 py-2.5 text-right text-bark-400 text-xs">{p.pageviews.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-xs text-bark-600 text-center py-8">
                  No page view data yet. Configure Plausible to enable traffic analytics.
                </p>
              )}
            </div>
          </Section>

          {/* ── Setup reminder if Plausible not configured ────────── */}
          {!data.overview.visitors && (
            <div className="bg-bark-900 border border-sage-800 rounded-xl p-5">
              <h3 className="text-sm font-semibold text-sage-400 mb-2">Set up Plausible Analytics</h3>
              <p className="text-xs text-bark-400 mb-3">
                Traffic data (visitors, countries, sources) requires a Plausible account.
                Internal events (search, scroll depth, helpful votes) work without it.
              </p>
              <ol className="text-xs text-bark-400 space-y-1 list-decimal list-inside">
                <li>Create a free account at <a href="https://plausible.io" target="_blank" rel="noopener noreferrer" className="text-sage-400 underline">plausible.io</a></li>
                <li>Add your site domain</li>
                <li>Set <code className="text-sage-500">PLAUSIBLE_SITE_ID</code> = your domain in Vercel env vars</li>
                <li>Set <code className="text-sage-500">PLAUSIBLE_API_KEY</code> = your API key in Vercel env vars</li>
              </ol>
            </div>
          )}

        </div>
      ) : null}
    </div>
  );
}
