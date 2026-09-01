import type { Metadata } from "next";
import { MDXRemote } from "next-mdx-remote/rsc";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { getMDXComponents } from "@/components/mdx/MDXComponents";
import { remarkPlugins, rehypePlugins } from "@/lib/mdx-plugins";
import { canonicalUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "About",
  description: "Why Maanav Kakkad started RootRemedies — the mission behind the project.",
  alternates: { canonical: canonicalUrl("/about") },
};

export default function AboutPage() {
  // Reads directly from content/pages/ so the About page always reflects
  // exactly what's written in the MDX file. Edit the MDX, the page updates.
  // This file lives in content/pages/ (not content/conditions/) so it never
  // appears in the conditions listing or category pages.
  const filePath = path.join(
    process.cwd(),
    "content",
    "pages",
    "why-i-started-rootremedies.mdx"
  );
  const raw = fs.readFileSync(filePath, "utf-8");
  const { content } = matter(raw);

  return (
    <div className="site-container py-10">
      <div className="max-w-2xl mx-auto">
        <MDXRemote
          source={content}
          components={getMDXComponents({})}
          options={{
            mdxOptions: {
              remarkPlugins: [...remarkPlugins],
              rehypePlugins: [...rehypePlugins],
            },
          }}
        />
      </div>
    </div>
  );
}
