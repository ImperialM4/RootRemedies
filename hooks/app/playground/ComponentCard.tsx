"use client";

// ─────────────────────────────────────────────────────────────────────────────
// ComponentCard — interactive card for each component in the Playground.
//
// Features:
//   - Tab: :::directive syntax ↔ <JSX /> syntax
//   - Live preview (iframe, postMessage auto-sizing)
//   - Copy button for the active syntax
//   - Collapsible prop table
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect, useRef, useCallback } from "react";
import { Eye, EyeOff, ChevronRight, Loader2 } from "lucide-react";
import { CopyButton } from "./CopyButton";
import type { ComponentEntry } from "@/components/publish/registry";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Prop table
// ---------------------------------------------------------------------------
function PropTable({ props }: { props: ComponentEntry["props"] }) {
  if (!props.length) {
    return <p className="text-xs text-muted italic py-2">No configurable props.</p>;
  }
  return (
    <div className="overflow-x-auto rounded-lg border border-bark-200 dark:border-bark-700">
      <table className="w-full text-xs border-collapse">
        <thead>
          <tr className="bg-bark-50 dark:bg-bark-800 border-b border-bark-200 dark:border-bark-700">
            {["Prop", "Type", "Req", "Default", "Description"].map((h) => (
              <th key={h} className="text-left py-2 px-3 text-muted font-semibold">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-bark-100 dark:divide-bark-800">
          {props.map((p) => (
            <tr key={p.name} className="hover:bg-bark-50 dark:hover:bg-bark-800/40 transition-colors">
              <td className="py-2 px-3 font-mono text-primary font-medium whitespace-nowrap">{p.name}</td>
              <td className="py-2 px-3 font-mono text-sage-600 dark:text-sage-400 max-w-[160px]">
                <span className="block truncate" title={p.type}>{p.type}</span>
              </td>
              <td className="py-2 px-3 text-center">
                {p.required
                  ? <span className="text-clay-500 font-bold">✓</span>
                  : <span className="text-muted">—</span>}
              </td>
              <td className="py-2 px-3 font-mono text-bark-400 whitespace-nowrap">{p.default ?? "—"}</td>
              <td className="py-2 px-3 text-body leading-snug">{p.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Live preview iframe with postMessage-based auto-sizing
// ---------------------------------------------------------------------------
interface PreviewFrameProps {
  componentName: string;
}

function PreviewFrame({ componentName }: PreviewFrameProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [height, setHeight] = useState(200);
  const [loaded, setLoaded] = useState(false);

  const handleMessage = useCallback((e: MessageEvent) => {
    if (
      e.data?.type === "preview-height" &&
      typeof e.data.height === "number" &&
      e.data.height > 0
    ) {
      // Add padding, cap at 600px
      setHeight(Math.min(e.data.height + 32, 600));
    }
  }, []);

  useEffect(() => {
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [handleMessage]);

  return (
    <div className="relative">
      {/* Traffic-light decorations */}
      <div className="flex items-center gap-1.5 px-3 py-2 bg-bark-100 dark:bg-bark-800 border-b border-bark-200 dark:border-bark-700">
        <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
        <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
        <span className="w-2.5 h-2.5 rounded-full bg-green-400" />
        <span className="text-xs text-muted ml-2 font-mono">
          Live preview — {componentName}
        </span>
      </div>

      {/* Loading state */}
      {!loaded && (
        <div
          className="absolute inset-x-0 flex items-center justify-center bg-bark-50 dark:bg-bark-800/50"
          style={{ top: "36px", height: `${height}px` }}
        >
          <Loader2 className="w-4 h-4 text-muted animate-spin" />
        </div>
      )}

      <iframe
        ref={iframeRef}
        src={`/playground/preview?component=${encodeURIComponent(componentName)}`}
        title={`Live preview of ${componentName}`}
        className={cn(
          "w-full border-0 transition-opacity duration-300",
          loaded ? "opacity-100" : "opacity-0"
        )}
        style={{ height: `${height}px` }}
        loading="lazy"
        onLoad={() => setLoaded(true)}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Component card
// ---------------------------------------------------------------------------
type SyntaxTab = "directive" | "jsx";

interface ComponentCardProps {
  entry: ComponentEntry;
}

export function ComponentCard({ entry }: ComponentCardProps) {
  const hasDirective = Boolean(entry.directiveExample);
  const [tab,         setTab]         = useState<SyntaxTab>(hasDirective ? "directive" : "jsx");
  const [showPreview, setShowPreview] = useState(false);
  const [showProps,   setShowProps]   = useState(false);

  const activeCode = tab === "directive"
    ? (entry.directiveExample ?? entry.mdxExample)
    : entry.mdxExample;

  return (
    <div
      id={entry.name}
      className="rounded-xl border border-bark-200 dark:border-bark-700 overflow-hidden bg-surface-card scroll-mt-24"
    >
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="flex items-start justify-between gap-4 px-5 py-4 border-b border-bark-200 dark:border-bark-700 bg-bark-50/80 dark:bg-bark-800/40">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h3 className="font-mono text-sm font-semibold text-primary">
              &lt;{entry.name} /&gt;
            </h3>
            {entry.directiveName && (
              <code className="text-xs text-accent bg-sage-100 dark:bg-sage-950/50 border border-sage-200 dark:border-sage-800 px-1.5 py-0.5 rounded font-mono">
                :::{entry.directiveName}
              </code>
            )}
            <span className="text-xs text-muted bg-bark-100 dark:bg-bark-700/60 px-2 py-0.5 rounded-full">
              {entry.group}
            </span>
          </div>
          <p className="text-xs text-muted leading-relaxed">{entry.description}</p>
        </div>

        <button
          onClick={() => setShowPreview((v) => !v)}
          className={cn(
            "shrink-0 flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-md font-medium transition-all",
            showPreview
              ? "bg-sage-100 dark:bg-sage-900/40 text-sage-700 dark:text-sage-300"
              : "text-muted hover:text-primary bg-bark-100 dark:bg-bark-700 hover:bg-bark-200 dark:hover:bg-bark-600"
          )}
          aria-pressed={showPreview}
          aria-label={showPreview ? "Hide live preview" : "Show live preview"}
        >
          {showPreview ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          {showPreview ? "Hide preview" : "Preview"}
        </button>
      </div>

      {/* ── Live preview ──────────────────────────────────────────────── */}
      {showPreview && (
        <div className="border-b border-bark-200 dark:border-bark-700 animate-fade-in">
          <PreviewFrame componentName={entry.name} />
        </div>
      )}

      <div className="p-5 space-y-4">
        {/* ── Syntax tabs + code ────────────────────────────────────── */}
        <div>
          {/* Tab switcher */}
          {hasDirective && (
            <div className="flex items-center gap-1.5 mb-2.5">
              <button
                onClick={() => setTab("directive")}
                className={cn(
                  "text-xs px-3 py-1.5 rounded-md font-medium transition-all",
                  tab === "directive"
                    ? "bg-sage-600 dark:bg-sage-500 text-white shadow-sm"
                    : "text-muted hover:text-primary bg-bark-100 dark:bg-bark-700 hover:bg-bark-200"
                )}
              >
                ✦ Directive
              </button>
              <button
                onClick={() => setTab("jsx")}
                className={cn(
                  "text-xs px-3 py-1.5 rounded-md font-medium transition-all",
                  tab === "jsx"
                    ? "bg-bark-800 dark:bg-bark-600 text-white shadow-sm"
                    : "text-muted hover:text-primary bg-bark-100 dark:bg-bark-700 hover:bg-bark-200"
                )}
              >
                {"<>"} JSX
              </button>
              <div className="flex-1" />
              <CopyButton
                text={activeCode}
                label={tab === "directive" ? "Copy directive" : "Copy JSX"}
                variant={tab === "directive" ? "primary" : "default"}
              />
            </div>
          )}

          {/* Code block */}
          <div className="relative group">
            {!hasDirective && (
              <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                <CopyButton text={activeCode} />
              </div>
            )}
            <pre className={cn(
              "rounded-xl text-xs p-4 overflow-x-auto leading-relaxed font-mono",
              tab === "directive"
                ? "bg-[#0d1f0f] text-[#a8d4a8]"
                : "bg-bark-950 dark:bg-[#0a0806] text-bark-200"
            )}>
              <code>{activeCode}</code>
            </pre>
          </div>

          {/* Equivalence note */}
          {tab === "directive" && hasDirective && (
            <p className="text-xs text-muted mt-2 flex items-center gap-1.5">
              <span className="text-accent">✦</span>
              Simplified authoring syntax — renders identically to the JSX version.
            </p>
          )}
        </div>

        {/* ── Props (collapsible) ───────────────────────────────────── */}
        {entry.props.length > 0 && (
          <div>
            <button
              onClick={() => setShowProps((v) => !v)}
              className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-muted hover:text-primary transition-colors"
              aria-expanded={showProps}
            >
              <ChevronRight className={cn(
                "w-3 h-3 transition-transform duration-150",
                showProps && "rotate-90"
              )} />
              Props ({entry.props.length})
            </button>
            {showProps && (
              <div className="mt-2 animate-fade-in">
                <PropTable props={entry.props} />
              </div>
            )}
          </div>
        )}

        {/* ── Notes ────────────────────────────────────────────────── */}
        {entry.notes && (
          <div className="rounded-lg bg-sage-50 dark:bg-sage-950/30 border border-sage-200 dark:border-sage-800 px-4 py-3">
            <p className="text-xs font-semibold text-sage-700 dark:text-sage-400 uppercase tracking-wide mb-1">
              Note
            </p>
            <p className="text-xs text-sage-700 dark:text-sage-400 leading-relaxed">{entry.notes}</p>
          </div>
        )}
      </div>
    </div>
  );
}
