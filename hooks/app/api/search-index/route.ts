// app/api/search-index/route.ts
// Serves the MiniSearch serialized index.
// Called once by the client, then cached.

import { NextResponse } from "next/server";
import { buildSearchIndex } from "@/lib/content";
import { createSearchIndex } from "@/lib/search";

export const dynamic = "force-static";
export const revalidate = 3600; // Re-build index at most once per hour

export function GET() {
  try {
    const documents = buildSearchIndex();
    const serialized = createSearchIndex(documents);

    return new NextResponse(serialized, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch (error) {
    console.error("[search-index] Failed to build search index:", error);
    return NextResponse.json({ error: "Failed to build search index" }, { status: 500 });
  }
}
