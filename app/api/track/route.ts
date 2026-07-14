// POST /api/track
// Receives internal event tracking calls from the browser.
// Rate-limited implicitly by Next.js; for production add explicit rate limiting.

import { NextRequest, NextResponse } from "next/server";
import { appendEvent } from "@/lib/analytics/events";
import type { TrackEventPayload } from "@/lib/analytics/types";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as TrackEventPayload;

    // Basic validation
    if (!body.event) {
      return NextResponse.json({ error: "Missing event" }, { status: 400 });
    }

    appendEvent(body);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
