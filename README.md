# Newsletter: switched to Beehiiv's embedded form

## What changed

- `components/shared/NewsletterSignup.tsx` — **replaced.** The custom
  fetch-based form (email input, button, loading/success/error states) is
  gone. It now renders beehiiv's own embedded subscribe form via
  `next/script`, inside the same section wrapper (icon, heading, description,
  spacing, colors, responsive layout all unchanged).
- `.env.local.example` — **updated.** Removed `BEEHIIV_API_KEY` and
  `BEEHIIV_PUBLICATION_ID` — the embed is entirely client-side and needs no
  credentials.

## Deleted (no longer needed)

- `app/api/newsletter/route.ts` — the old API route
- `lib/newsletter/beehiiv.ts` — the old server-side Beehiiv API client

Delete these two files/folders from your repo if you're merging by hand.

## Nothing else changed

- `app/layout.tsx` and `components/shared/index.ts` are untouched — they
  already import and render `<NewsletterSignup />` in the same place, so the
  section still appears sitewide, once, right above the footer.
- No new environment variables are needed. Nothing to add in Vercel for this.

## To apply this in your repo

1. Replace `components/shared/NewsletterSignup.tsx` with the version here.
2. Delete `app/api/newsletter/route.ts` (and the now-empty `app/api/newsletter/` folder).
3. Delete `lib/newsletter/beehiiv.ts` (and the now-empty `lib/newsletter/` folder).
4. Replace `.env.local.example` with the version here (or just delete the
   `BEEHIIV_API_KEY` / `BEEHIIV_PUBLICATION_ID` lines from your existing one).
5. If you previously added `BEEHIIV_API_KEY` / `BEEHIIV_PUBLICATION_ID` in
   Vercel's environment variables, you can remove them — they're unused now.
6. Commit, push, redeploy.

## Verified locally

- `tsc --noEmit` — passes
- `npm run build` — succeeds; `/api/newsletter` no longer appears in the route list
- Dev server render — the beehiiv loader script and attribution script both
  appear in the page HTML with the correct form ID, the section renders
  identically to before, and no hydration warnings/errors were logged
