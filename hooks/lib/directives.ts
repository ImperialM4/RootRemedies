// ─────────────────────────────────────────────────────────────────────────────
// lib/directives.ts
//
// Remark plugin: transforms :::directive syntax → MDX JSX component calls.
//
// PIPELINE POSITION
//   remarkPlugins: [remarkGfm, remarkDirective, remarkDirectivesToComponents]
//                                ↑ parses :::    ↑ this file: converts to JSX
//
// HOW IT WORKS
//   1. remark-directive parses :::name{attrs} into MDAST "containerDirective",
//      "leafDirective", or "textDirective" nodes.
//   2. This plugin walks those nodes and replaces them with mdxJsxFlowElement
//      nodes, which next-mdx-remote renders as the React components already
//      registered in getMDXComponents().
//   3. React components are never modified. This is purely a parsing layer.
//
// ADDING A NEW DIRECTIVE
//   1. Add a handler to DIRECTIVE_MAP below.
//   2. Add a directiveExample to registry.ts.
//   Done — no other changes needed.
//
// SYNTAX REFERENCE
//   Self-closing leaf (no body):
//     ::name{prop="value" boolProp}
//
//   Container with Markdown body:
//     :::name{prop="value"}
//     Body content rendered as Markdown/MDX.
//     :::
//
//   Container with structured list body (for FAQ, Timeline, etc.):
//     :::faq{title="Questions"}
//     - question: Is this safe?
//       answer: Consult a doctor.
//     :::
//
//   Two-column split:
//     :::two-column{ratio="2:1"}
//     Left content.
//     ---col---
//     Right content.
//     :::
//
//   Gallery (pipe-separated lines):
//     :::gallery
//     /img/a.jpg | Alt text
//     /img/b.jpg | Alt text | Optional caption
//     :::
// ─────────────────────────────────────────────────────────────────────────────

import type { Plugin } from "unified";
import type { Root } from "mdast";
import { visit } from "unist-util-visit";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface DirectiveAttributes {
  [key: string]: string | undefined;
}

interface DirectiveNode {
  type: "containerDirective" | "leafDirective" | "textDirective";
  name: string;
  attributes?: DirectiveAttributes;
  children: unknown[];
  data?: Record<string, unknown>;
}

// ---------------------------------------------------------------------------
// Text extraction — get plain text from MDAST nodes
// ---------------------------------------------------------------------------
function childrenToText(children: unknown[]): string {
  const parts: string[] = [];
  function walk(nodes: unknown[]) {
    for (const node of nodes) {
      const n = node as { type: string; value?: string; children?: unknown[] };
      if (n.type === "text" && n.value) parts.push(n.value);
      else if (n.children) walk(n.children);
    }
  }
  walk(children);
  return parts.join("").trim();
}

// ---------------------------------------------------------------------------
// Structured list parser — parses YAML-like list body into records
//
//   - key1: value1
//     key2: value2
//   - key1: value3
//     key2: value4
//
// Returns: [{ key1: "value1", key2: "value2" }, { key1: "value3", ... }]
// ---------------------------------------------------------------------------
function parseListBody(raw: string): Record<string, string>[] {
  const items: Record<string, string>[] = [];
  let current: Record<string, string> | null = null;

  for (const line of raw.split("\n")) {
    const trimmed = line.trimStart();
    if (trimmed.startsWith("- ")) {
      if (current) items.push(current);
      current = {};
      const rest = trimmed.slice(2).trim();
      const colon = rest.indexOf(":");
      if (colon !== -1) {
        current[rest.slice(0, colon).trim()] = rest.slice(colon + 1).trim();
      }
    } else if (current && trimmed.includes(":")) {
      const colon = trimmed.indexOf(":");
      const k = trimmed.slice(0, colon).trim();
      if (k) current[k] = trimmed.slice(colon + 1).trim();
    }
  }
  if (current) items.push(current);
  return items;
}

// ---------------------------------------------------------------------------
// ESTree / MDX AST builders
// ---------------------------------------------------------------------------

/** Convert a JS value to an ESTree expression node */
function toEstree(value: unknown): unknown {
  if (Array.isArray(value)) {
    return { type: "ArrayExpression", elements: value.map(toEstree) };
  }
  if (value !== null && typeof value === "object") {
    return {
      type: "ObjectExpression",
      properties: Object.entries(value as Record<string, unknown>).map(([k, v]) => ({
        type: "Property",
        key: { type: "Identifier", name: k },
        value: toEstree(v),
        kind: "init", computed: false, shorthand: false, method: false,
      })),
    };
  }
  if (typeof value === "string")  return { type: "Literal", value, raw: JSON.stringify(value) };
  if (typeof value === "number")  return { type: "Literal", value, raw: String(value) };
  if (typeof value === "boolean") return { type: "Literal", value, raw: String(value) };
  return { type: "Literal", value: null, raw: "null" };
}

/** Build an mdxJsxAttribute for a string value */
function strAttr(name: string, value: string) {
  return { type: "mdxJsxAttribute", name, value };
}

/** Build an mdxJsxAttribute for any non-string value (object, array, number, boolean) */
function exprAttr(name: string, value: unknown) {
  return {
    type: "mdxJsxAttribute",
    name,
    value: {
      type: "mdxJsxAttributeValueExpression",
      value: JSON.stringify(value),
      data: {
        estree: {
          type: "Program",
          sourceType: "module",
          body: [{ type: "ExpressionStatement", expression: toEstree(value) }],
        },
      },
    },
  };
}

/** Build an mdxJsxAttribute — picks str or expr automatically */
function attr(name: string, value: unknown) {
  return typeof value === "string" ? strAttr(name, value) : exprAttr(name, value);
}

/** Boolean prop — renders as `propName={true}` in JSX */
function boolAttr(name: string) {
  return exprAttr(name, true);
}

type MdxAttr = ReturnType<typeof strAttr> | ReturnType<typeof exprAttr>;

/** Build an mdxJsxFlowElement node */
function jsxEl(name: string, attrs: MdxAttr[], children: unknown[] = []) {
  return {
    type: "mdxJsxFlowElement",
    name,
    attributes: attrs,
    children,
    data: { _mdxExplicitJsx: true },
  };
}

/** Convenience: build attrs from an attributes object, skipping undefined */
function attrsFrom(
  raw: DirectiveAttributes,
  map: Record<string, string | ((v: string) => MdxAttr)>
): MdxAttr[] {
  const result: MdxAttr[] = [];
  for (const [attrName, handler] of Object.entries(map)) {
    const v = raw[attrName];
    if (v === undefined) continue;
    if (typeof handler === "string") {
      // handler = prop name to map to
      result.push(attr(handler, v));
    } else {
      result.push(handler(v));
    }
  }
  return result;
}

// ---------------------------------------------------------------------------
// Directive handlers
// ---------------------------------------------------------------------------

type DirectiveHandler = (node: DirectiveNode) => unknown;

const DIRECTIVE_MAP: Record<string, DirectiveHandler> = {

  // ── Layout ────────────────────────────────────────────────────────────────

  "hero": (node) => {
    const a = node.attributes ?? {};
    return jsxEl("HeroSection", [
      ...attrsFrom(a, { title: "title", subtitle: "subtitle", eyebrow: "eyebrow", align: "align" }),
    ]);
  },

  "section-header": (node) => {
    const a = node.attributes ?? {};
    return jsxEl("SectionHeader", [
      ...attrsFrom(a, { title: "title", subtitle: "subtitle", align: "align" }),
    ]);
  },

  "divider": (node) => {
    const a = node.attributes ?? {};
    return jsxEl("Divider", [
      ...attrsFrom(a, { style: "style", label: "label" }),
    ]);
  },

  "two-column": (node) => {
    const a = node.attributes ?? {};
    const kids = node.children as Array<{ type: string; children?: unknown[] }>;

    // Split children at a paragraph containing exactly "---col---"
    const splitIdx = kids.findIndex((c) => {
      if (c.type !== "paragraph") return false;
      return childrenToText(c.children ?? []).trim() === "---col---";
    });

    const leftKids  = splitIdx !== -1 ? kids.slice(0, splitIdx) : kids;
    const rightKids = splitIdx !== -1 ? kids.slice(splitIdx + 1) : [];

    const wrapDiv = (children: unknown[]) =>
      ({ type: "mdxJsxFlowElement", name: "div", attributes: [], children });

    return jsxEl("TwoColumn", [
      ...attrsFrom(a, { ratio: "ratio", gap: "gap" }),
      ...(a.reverseOnMobile ? [boolAttr("reverseOnMobile")] : []),
    ], [wrapDiv(leftKids), wrapDiv(rightKids)]);
  },

  // ── Writing ───────────────────────────────────────────────────────────────

  "quote": (node) => {
    const a = node.attributes ?? {};
    return jsxEl("Quote", [
      ...attrsFrom(a, { attribution: "attribution", source: "source" }),
    ], node.children as unknown[]);
  },

  "pull-quote": (node) => {
    const a = node.attributes ?? {};
    return jsxEl("PullQuote", [
      ...attrsFrom(a, { align: "align" }),
    ], node.children as unknown[]);
  },

  "callout": (node) => {
    const a = node.attributes ?? {};
    return jsxEl("Callout", [
      ...attrsFrom(a, { title: "title", icon: "icon" }),
    ], node.children as unknown[]);
  },

  "warning": (node) => {
    const a = node.attributes ?? {};
    return jsxEl("Warning", [
      ...attrsFrom(a, { title: "title" }),
    ], node.children as unknown[]);
  },

  "info": (node) => {
    const a = node.attributes ?? {};
    return jsxEl("Info", [
      ...attrsFrom(a, { title: "title" }),
    ], node.children as unknown[]);
  },

  "tip": (node) => {
    const a = node.attributes ?? {};
    return jsxEl("Tip", [
      ...attrsFrom(a, { title: "title" }),
    ], node.children as unknown[]);
  },

  // ── Images ────────────────────────────────────────────────────────────────

  "image": (node) => {
    const a = node.attributes ?? {};
    return jsxEl("ImageWithCaption", [
      ...attrsFrom(a, {
        src: "src", alt: "alt", caption: "caption", credit: "credit",
        rounded: "rounded", width: "width",
      }),
      // Boolean flags — present in attributes means true
      ...(a.shadow     !== undefined ? [boolAttr("shadow")]     : []),
      ...(a.border     !== undefined ? [boolAttr("border")]     : []),
      ...(a.expandable !== undefined ? [boolAttr("expandable")] : []),
    ]);
  },

  "hero-image": (node) => {
    const a = node.attributes ?? {};
    return jsxEl("HeroImage", [
      ...attrsFrom(a, { src: "src", alt: "alt", caption: "caption", credit: "credit" }),
      ...(a.priority !== undefined ? [boolAttr("priority")] : []),
    ]);
  },

  "full-width-image": (node) => {
    const a = node.attributes ?? {};
    return jsxEl("FullWidthImage", [
      ...attrsFrom(a, { src: "src", alt: "alt", caption: "caption", credit: "credit", height: "height" }),
    ]);
  },

  // Shorthand: image floated to the right, body text on the left
  "photo-right": (node) => {
    const a = node.attributes ?? {};
    const img = jsxEl("ImageWithCaption", [
      ...attrsFrom(a, { src: "src", alt: "alt", caption: "caption" }),
      strAttr("rounded", "lg"),
      boolAttr("shadow"),
    ]);
    return jsxEl("TwoColumn", [attr("ratio", "2:1")], [
      { type: "mdxJsxFlowElement", name: "div", attributes: [], children: node.children as unknown[] },
      { type: "mdxJsxFlowElement", name: "div", attributes: [], children: [img] },
    ]);
  },

  // Shorthand: image floated to the left
  "photo-left": (node) => {
    const a = node.attributes ?? {};
    const img = jsxEl("ImageWithCaption", [
      ...attrsFrom(a, { src: "src", alt: "alt", caption: "caption" }),
      strAttr("rounded", "lg"),
      boolAttr("shadow"),
    ]);
    return jsxEl("TwoColumn", [attr("ratio", "1:2")], [
      { type: "mdxJsxFlowElement", name: "div", attributes: [], children: [img] },
      { type: "mdxJsxFlowElement", name: "div", attributes: [], children: node.children as unknown[] },
    ]);
  },

  // Gallery: each line is "src | alt | optional caption"
  "gallery": (node) => {
    const a = node.attributes ?? {};
    const body = childrenToText(node.children);
    const images = body
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => l.startsWith("/") || l.startsWith("http"))
      .map((line) => {
        const [src = "", alt = "", caption] = line.split("|").map((s) => s.trim());
        return caption ? { src, alt, caption } : { src, alt };
      });
    return jsxEl("ImageGallery", [
      exprAttr("images", images),
      ...(a.columns ? [exprAttr("columns", Number(a.columns))] : []),
    ]);
  },

  // ── Video ─────────────────────────────────────────────────────────────────

  "youtube": (node) => {
    const a = node.attributes ?? {};
    return jsxEl("YouTubeEmbed", [
      // directive uses "id", component uses "videoId"
      ...(a.id    ? [strAttr("videoId", a.id)]    : []),
      ...(a.title ? [strAttr("title",   a.title)] : []),
      ...(a.caption ? [strAttr("caption", a.caption)] : []),
    ]);
  },

  // ── Remedy ────────────────────────────────────────────────────────────────

  "recipe": (node) => {
    const a = node.attributes ?? {};
    return jsxEl("RecipeCard", [
      ...attrsFrom(a, { slug: "slug" }),
      ...(a.index ? [exprAttr("index", Number(a.index))] : []),
    ]);
  },

  "ingredients": (node) => {
    const a = node.attributes ?? {};
    return jsxEl("IngredientTable", [...attrsFrom(a, { slug: "slug" })]);
  },

  "steps": (node) => {
    const a = node.attributes ?? {};
    return jsxEl("ProcessSteps", [...attrsFrom(a, { slug: "slug" })]);
  },

  // ── Information ───────────────────────────────────────────────────────────

  "timeline": (node) => {
    const a = node.attributes ?? {};
    const items = parseListBody(childrenToText(node.children));
    return jsxEl("Timeline", [
      exprAttr("items", items),
      ...attrsFrom(a, { title: "title" }),
    ]);
  },

  "faq": (node) => {
    const a = node.attributes ?? {};
    const items = parseListBody(childrenToText(node.children));
    return jsxEl("FAQ", [
      exprAttr("items", items),
      ...attrsFrom(a, { title: "title" }),
    ]);
  },

  // ── Navigation ────────────────────────────────────────────────────────────

  "related-remedies": (node) => {
    const a = node.attributes ?? {};
    const body = childrenToText(node.children);
    const slugs = body
      .split("\n")
      .map((l) => l.replace(/^-\s*/, "").trim())
      .filter(Boolean);
    return jsxEl("RelatedRemedies", [
      exprAttr("slugs", slugs),
      ...attrsFrom(a, { title: "title" }),
    ]);
  },

  "disclaimer": () => jsxEl("SafetyDisclaimer", []),
};

// ---------------------------------------------------------------------------
// The remark plugin export
// ---------------------------------------------------------------------------
export const remarkDirectivesToComponents: Plugin<[], Root> = function () {
  return (tree) => {
    visit(tree, (node) => {
      const n = node as unknown as DirectiveNode;
      if (
        n.type !== "containerDirective" &&
        n.type !== "leafDirective" &&
        n.type !== "textDirective"
      ) return;

      const handler = DIRECTIVE_MAP[n.name];
      if (!handler) return; // Unknown directive — leave unchanged

      const replacement = handler(n);
      if (replacement) Object.assign(node, replacement);
    });
  };
};
