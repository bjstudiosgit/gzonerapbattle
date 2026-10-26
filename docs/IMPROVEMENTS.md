# Site improvements

This document records the audit and the changes applied to the GZone Rap Battle site.

## Audit summary

- **Framework:** Vite 6 + React 18 single-page app (not Next.js). Routing is handled by `react-router-dom`.
- **API:** `/api/apply` is implemented three ways (`api/apply.ts` for Vercel, `server.ts` for the Express server, and Vite dev middleware in `vite.config.ts`).
- **Main hotspots:** `src/pages/BattleDetail.tsx` was 5,965 lines / ~700 KB in the built bundle, and Firebase/Supabase plus summary components were imported eagerly.
- **No test suite** existed and `npm run lint` only runs `tsc --noEmit`.

## Security

- Application submissions are now validated and sanitised in `src/lib/applicationPayload.ts` before leaving the server:
  - 16 KB maximum payload and per-field length limits.
  - Required name/email with email format validation.
  - Control characters stripped from single-line fields; line breaks normalised in the message.
  - Subject-line CR/LF injection removed.
- Added `src/lib/applyGuard.ts`:
  - Origin allow-list by request host, production domains, `VERCEL_URL`, and `APPLY_ALLOWED_ORIGINS`.
  - JSON content-type check, client IP extraction, and a shared limiter (5 requests / 10 minutes per IP).
- Hardened all three `/api/apply` entry points:
  - POST-only (405), JSON-only (415), size limits (413), origin checks (403), rate limits (429), and generic upstream failures (502).
  - `Cache-Control: no-store` on API responses.
  - Expression body limit reduced to 16 KB.
- `vercel.json` now adds HSTS, `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, and `Permissions-Policy`. SPA rewrites exclude `/api/*`.
- Express server uses Helmet and central JSON/error handling.
- `testConnection()` in `src/lib/voteFirebase.ts` only runs during development.

## Firebase / voting

- Vote list queries now use `limit(100)`, matching the Firestore rule.
- Updated `firestore.rules` so the list rule allows a missing `limit` or any limit up to 100.
- Vote creation and counter increments now commit in a single `writeBatch`. The battle update rule uses `getAfter()` and requires the matching vote document to have the same `request.time`, preventing repeated increments from a stale vote document.
- Extracted duplicated vote auth/data/location logic into:
  - `src/hooks/useVoteAuth.ts`
  - `src/hooks/useVoteData.ts`
  - `src/hooks/useArenaLocation.ts`
  - `src/lib/voteAuth.ts`
  - `src/lib/voteTypes.ts`
- Fixed the `VotePage` auth effect dependency bug that could create duplicate subscriptions.
- Admin forms and voting view controls now have labels, `aria-pressed`, close-button labels, and keyboard support.

## Performance

- Named Rollup chunks for Firebase, Supabase, Motion, React, and icons. Firebase is no longer pulled into the initial voting-copy chunk.
- Battle summary/result/highlight components are lazy-loaded with `Suspense` instead of being bundled into `BattleDetail`.
- The featured YouTube iframe is now a click-to-play thumbnail facade, so the embed only loads after interaction.
- Added image dimensions for map, logo, gallery, and video thumbnails.
- Extracted the 310-character result limiter into `src/lib/text.ts`.

## Accessibility

- Added a skip link and `#main-content` target.
- Added global `:focus-visible` styling and `prefers-reduced-motion` overrides.
- Navbar menu now exposes `aria-expanded`/`aria-controls`, closes on Escape and route changes, and marks current links with `aria-current`.
- Map markers are focusable with Enter/Space activation; zoom/reset and close controls have labels; inline `<style>` moved to `index.css`.
- Photo lightbox now uses `role="dialog"`, `aria-modal`, Escape-to-close, focus restoration, body scroll lock, and click propagation protection.
- Fixed external link `rel` attributes to include `noopener`.
- Added `theme-color` and `color-scheme`, plus preconnect/dns-prefetch hints.

## Tests and commands

```bash
npm run lint      # TypeScript
npm test          # node:test via tsx
npm run build     # production build
```

Tests cover application validation and proxying, rate limiting, origin/content-type guards, YouTube parsing, result copy limits, arena geofencing, view parsing, rankings, usernames, image helpers, and voting copy.

## Deployment notes

- Deploy the updated `firestore.rules` together with the vote batching change. Older rules expect separate vote/counter writes and will reject the new batch.
- Set `APPLY_EMAIL` (recipient) and, if needed, `APPLY_ALLOWED_ORIGINS` in the deployment environment.

## Remaining recommendations

1. **Split `BattleDetail` further.** It is still ~600 KB. Move battle-specific sections into per-slug lazy modules or data files.
2. **Compress media.** `public/streetpromo.mp4` is ~21 MB; re-encode to WebM/MP4 at a lower bitrate and add poster images. Downscale large portraits/flyers.
3. **Add a Content-Security-Policy.** Helmet CSP is disabled because the current app needs inline styles, YouTube, Firebase, Supabase, Google Fonts, and GTM. Build a nonce/hash-based policy before enabling it.
4. **Persist rate limits.** The in-memory limiter resets on cold starts and is per-instance. Use Vercel KV, Upstash, or Firestore for multi-instance enforcement.
5. **Sanitise/validate on the client too.** The server is authoritative, but showing field-level errors improves UX.
6. **Add component tests.** `jsdom` + Testing Library would cover the navbar, lightbox, and vote flows; the current suite focuses on pure logic.
7. **Consider a shared auth/data provider.** The hooks still mount one listener per consumer; a provider would deduplicate Firestore subscriptions across pages.
8. **Review `firestore.rules` end-to-end.** Vote writes and admin operations should be tested against the emulator.
