# Newsletter Signup — Files to Merge

This zip contains only the new/changed files for the Beehiiv newsletter
signup feature, in the same folder structure as your project. Copy them
into your repo at matching paths (overwrite `app/layout.tsx` and
`components/shared/index.ts` — the rest are brand new files).

## Files

- `lib/newsletter/beehiiv.ts` — new — server-side Beehiiv API client
- `app/api/newsletter/route.ts` — new — API route the signup form calls
- `components/shared/NewsletterSignup.tsx` — new — the signup component
- `components/shared/index.ts` — changed — added the NewsletterSignup export
- `app/layout.tsx` — changed — renders `<NewsletterSignup />` above the footer
- `.env.local.example` — new — reference list of all env vars (local dev only, not used by Vercel)
- `.gitignore` — new — your repo didn't have one; this keeps `.env.local` etc. out of git

## After copying the files in

1. `git add -A && git commit -m "Add Beehiiv newsletter signup" && git push`
2. In Vercel: **Project → Settings → Environment Variables**, add:
   - `BEEHIIV_API_KEY` — from Beehiiv → Settings → Workspace → API Keys (scope: `subscriptions:write`)
   - `BEEHIIV_PUBLICATION_ID` — from Beehiiv → Settings → Publication (starts with `pub_`)
   - Add both to Production, Preview, and Development
3. Redeploy (env var changes need a fresh deploy to take effect)
4. Test on the live site — submit a real email and confirm it shows up in Beehiiv → Subscribers
