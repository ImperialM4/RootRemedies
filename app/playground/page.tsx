import type { Metadata } from "next";
import { COMPONENT_REGISTRY, REGISTRY_GROUPS, getComponentsByGroup } from "@/components/publish/registry";
import { ComponentCard } from "./ComponentCard";

export const metadata: Metadata = {
  title: "Component Playground",
  description: "RootRemedies design system — every publishing component with directive syntax, live previews, and prop docs.",
  robots: { index: false },
};

export default function PlaygroundPage() {
  const totalComponents = COMPONENT_REGISTRY.length;
  const withDirectives  = COMPONENT_REGISTRY.filter((c) => c.directiveExample).length;

  return (
    <div className="site-container py-10 max-w-4xl">

      {/* ── Page header ────────────────────────────────────────────────── */}
      <div className="mb-10 pb-8 border-b border-bark-200 dark:border-bark-700">
        <span className="text-xs font-semibold uppercase tracking-widest text-accent block mb-3">
          Design System
        </span>
        <h1 className="font-serif text-4xl font-bold text-primary mb-3 tracking-tight">
          Component Playground
        </h1>
        <p className="text-lg text-muted max-w-2xl mb-4">
          {totalComponents} components, {withDirectives} with directive syntax.
          Toggle <strong className="text-primary font-medium">Preview</strong> on any card for a live render.
          Switch between <span className="font-mono text-accent text-sm">:::directive</span> and{" "}
          <span className="font-mono text-sm">&lt;JSX /&gt;</span> syntax — both work in any MDX file.
        </p>

        {/* Directive syntax explainer */}
        <div className="rounded-xl border border-sage-200 dark:border-sage-800 bg-sage-50 dark:bg-sage-950/30 p-4 mb-6 max-w-2xl">
          <p className="text-xs font-semibold text-sage-700 dark:text-sage-400 uppercase tracking-wide mb-2">✦ Directive syntax</p>
          <p className="text-sm text-sage-700 dark:text-sage-400 leading-relaxed mb-3">
            Write rich components using Markdown-style blocks. No JSX required.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
            <div>
              <p className="text-muted mb-1">Self-closing (leaf)</p>
              <pre className="bg-sage-900 text-sage-100 rounded p-2.5 overflow-x-auto">{`::youtube{id="abc" title="..."}`}</pre>
            </div>
            <div>
              <p className="text-muted mb-1">With content (container)</p>
              <pre className="bg-sage-900 text-sage-100 rounded p-2.5 overflow-x-auto">{`:::quote{attribution="..."}
Your quote text here.
:::`}</pre>
            </div>
          </div>
        </div>

        {/* Group jump nav */}
        <div className="flex flex-wrap gap-2">
          {REGISTRY_GROUPS.map((group) => {
            const count = getComponentsByGroup(group).length;
            return (
              <a key={group} href={`#group-${group.toLowerCase()}`}
                className="text-sm px-3 py-1.5 rounded-lg border border-bark-200 dark:border-bark-700 text-body hover:border-sage-300 dark:hover:border-sage-700 hover:bg-sage-50 dark:hover:bg-sage-950/20 transition-all">
                {group}
                <span className="ml-1.5 text-xs text-muted">({count})</span>
              </a>
            );
          })}
        </div>
      </div>

      {/* ── Component groups ───────────────────────────────────────────── */}
      {REGISTRY_GROUPS.map((group) => {
        const components = getComponentsByGroup(group);
        if (!components.length) return null;
        return (
          <section key={group} id={`group-${group.toLowerCase()}`} className="mb-14 scroll-mt-20">
            <div className="flex items-baseline gap-3 mb-6">
              <h2 className="font-serif text-2xl font-bold text-primary">{group}</h2>
              <span className="text-sm text-muted">{components.length} component{components.length !== 1 ? "s" : ""}</span>
            </div>
            <div className="space-y-5">
              {components.map((entry) => (
                <ComponentCard key={entry.name} entry={entry} />
              ))}
            </div>
          </section>
        );
      })}

      {/* ── Footer ─────────────────────────────────────────────────────── */}
      <div className="mt-10 pt-8 border-t border-bark-200 dark:border-bark-700 space-y-3 text-sm text-muted">
        <p>
          <strong className="text-primary">To add a component:</strong> create{" "}
          <code className="inline-code">components/publish/MyComponent.tsx</code>, import it in{" "}
          <code className="inline-code">components/mdx/MDXComponents.tsx</code>, add an entry to{" "}
          <code className="inline-code">components/publish/registry.ts</code>, and optionally add a
          directive handler to <code className="inline-code">lib/directives.ts</code>.
        </p>
        <p>
          <strong className="text-primary">Directive docs:</strong> see{" "}
          <code className="inline-code">lib/directives.ts</code> for the full syntax reference and
          how to register new directive names.
        </p>
      </div>
    </div>
  );
}
