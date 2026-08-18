// POST /api/newsletter
// Subscribes a visitor's email to the beehiiv publication.
// Credentials (BEEHIIV_API_KEY, BEEHIIV_PUBLICATION_ID) stay server-side —
// see lib/newsletter/beehiiv.ts. Never expose them in client code.
//
// Best-effort in-memory rate limiting per IP. Note: this resets whenever the
// serverless function cold-starts, so it's a light deterrent against a single
// abusive client, not a hard guarantee — for stronger protection, put this
// route behind Vercel's Web Application Firewall / rate limiting rules.

import { NextRequest, NextResponse } from "next/server";
import { subscribeToBeehiiv } from "@/lib/newsletter/beehiiv";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const RATE_LIMIT_MAX = 5;
const attempts = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = attempts.get(ip);

  if (!entry || now > entry.resetAt) {
    attempts.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  entry.count += 1;
  return entry.count > RATE_LIMIT_MAX;
}

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "We couldn't read that request. Please try again." },
      { status: 400 }
    );
  }

  const email = typeof body === "object" && body !== null && "email" in body
    ? String((body as Record<string, unknown>).email ?? "").trim()
    : "";

  if (!email || !EMAIL_RE.test(email)) {
    return NextResponse.json(
      { error: "Please enter a valid email address." },
      { status: 400 }
    );
  }

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many attempts. Please try again in a few minutes." },
      { status: 429 }
    );
  }

  const referringSite = req.headers.get("origin") ?? undefined;
  const result = await subscribeToBeehiiv(email, { referringSite });

  if (result.ok) {
    return NextResponse.json({ ok: true }, { status: 200 });
  }

  if (result.reason === "invalid_email") {
    return NextResponse.json(
      { error: "Please enter a valid email address." },
      { status: 400 }
    );
  }

  // config_missing, upstream_error, network_error — don't leak details.
  return NextResponse.json(
    { error: "Something went wrong. Please try again in a moment." },
    { status: 502 }
  );
}
