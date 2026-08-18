// ─────────────────────────────────────────────────────────────────────────────
// lib/newsletter/beehiiv.ts
//
// Server-side beehiiv API client for the newsletter signup form.
// This file must never be imported from a Client Component — it reads the
// secret API key from process.env and is only safe to run on the server
// (Route Handlers, Server Components, Server Actions).
//
// beehiiv API reference: https://developers.beehiiv.com/api-reference/subscriptions/create
//
// Required env vars:
//   BEEHIIV_API_KEY         — from beehiiv → Settings → Integrations → API
//   BEEHIIV_PUBLICATION_ID  — from beehiiv → Settings → Publication (starts with "pub_")
// ─────────────────────────────────────────────────────────────────────────────

const BEEHIIV_API_BASE = "https://api.beehiiv.com/v2";

export type SubscribeResult =
  | { ok: true }
  | { ok: false; reason: "invalid_email" | "config_missing" | "upstream_error" | "network_error"; status?: number };

/**
 * Subscribes an email address to the configured beehiiv publication.
 * Never throws — all failure modes are returned as a typed result so the
 * calling Route Handler can respond without leaking upstream details.
 */
export async function subscribeToBeehiiv(
  email: string,
  meta?: { referringSite?: string }
): Promise<SubscribeResult> {
  const apiKey = process.env.BEEHIIV_API_KEY;
  const publicationId = process.env.BEEHIIV_PUBLICATION_ID;

  if (!apiKey || !publicationId) {
    // Misconfiguration — log for the site owner, but don't expose to the visitor.
    console.error(
      "[newsletter] Missing BEEHIIV_API_KEY or BEEHIIV_PUBLICATION_ID env var."
    );
    return { ok: false, reason: "config_missing" };
  }

  try {
    const res = await fetch(
      `${BEEHIIV_API_BASE}/publications/${publicationId}/subscriptions`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          reactivate_existing: false,
          send_welcome_email: true,
          utm_source: "website",
          utm_medium: "newsletter_signup_form",
          referring_site: meta?.referringSite ?? "rootremedies.com",
        }),
      }
    );

    // beehiiv returns 200/201 on success. A duplicate active subscriber is
    // also treated as success from the visitor's point of view.
    if (res.ok) {
      return { ok: true };
    }

    // 400 from beehiiv on this endpoint is almost always a malformed/invalid
    // email address (we also validate client- and server-side beforehand).
    if (res.status === 400) {
      return { ok: false, reason: "invalid_email", status: 400 };
    }

    const body = await res.text().catch(() => "");
    console.error(`[newsletter] beehiiv API error ${res.status}: ${body}`);
    return { ok: false, reason: "upstream_error", status: res.status };
  } catch (err) {
    console.error("[newsletter] Network error calling beehiiv API:", err);
    return { ok: false, reason: "network_error" };
  }
}
