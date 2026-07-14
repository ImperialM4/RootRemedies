// ─────────────────────────────────────────────────────────────────────────────
// next.config.ts
//
// TWO MDX SYSTEMS, ONE PIPELINE
// ─────────────────────────────────────────────────────────────────────────────
// @next/mdx   — handles .mdx files used as Next.js page routes directly.
//               Activated via createMDX() below. Uses lib/mdx-plugins.ts.
//
// next-mdx-remote — handles content/conditions/*.mdx loaded from the
//               filesystem by lib/content.ts, rendered in [slug]/page.tsx.
//               Also uses lib/mdx-plugins.ts so the pipeline is identical.
//
// The plugin pipeline lives in lib/mdx-plugins.ts — never duplicated here.
// ─────────────────────────────────────────────────────────────────────────────

import type { NextConfig } from "next";
import createMDX from "@next/mdx";
import { remarkPlugins, rehypePlugins } from "./lib/mdx-plugins";

const nextConfig: NextConfig = {
  // "md" and "mdx" required by @next/mdx so Next treats them as page candidates
  pageExtensions: ["js", "jsx", "ts", "tsx", "md", "mdx"],

  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
    ],
  },

  // ESM-only packages must not be bundled by webpack on the server.
  // All remark/unified ecosystem packages are ESM-only in v3+.
  serverExternalPackages: [
    "gray-matter",
    "reading-time",
    "remark-directive",
    "mdast-util-directive",
    "unist-util-visit",
    "unified",
  ],
};

// Wrap config with createMDX — enables .mdx files as Next.js pages/layouts.
// Uses the same shared plugin pipeline as next-mdx-remote.
const withMDX = createMDX({
  options: {
    remarkPlugins: [...remarkPlugins],
    rehypePlugins: [...rehypePlugins],
  },
});

export default withMDX(nextConfig);
