# QA Report

Date: 2026-09-12. Branch: `cursor/website-build-brief`. Environment: Windows 11, Node 24.19, Next.js 16.3.4, Chrome 140 (headless) via `playwright-core` and Lighthouse 12. Lab tests ran against a production build (`next build` then `next start -p 3100`) with no owner env vars set, i.e. preview mode.

## Static checks

| Check | Result |
| --- | --- |
| `npm run typecheck` (tsc) | pass |
| `npm run lint` (eslint) | pass, 0 warnings |
| `npm test` (vitest) | 20 / 20 pass: `workflow.test.ts` (9), `quote-intake.test.ts` (8), `env-indexing.test.ts` (3) |
| `npm run build` | pass, 36 static pages, `/quote` and `/api/quote` dynamic |
| Grep for placeholder language (`example.com`, `555`, `CLIENT_SLOT`, `pending owner`, `TODO`, `lorem`) in `src/` | none |

## Customer journeys

| Journey | Method | Result |
| --- | --- | --- |
| Home → service card → `/custom-patches` → "Request a Quote" → `/quote?service=custom-patches` | browser | Service preselected, H1 "Quote for Custom Patches", step 1 shows business fields |
| Step 1 validation (empty submit) | browser | Error summary with anchor links, `aria-invalid` on fields, errors clear as fields are typed |
| Step 1 → step 2 | browser | Patch-specific fields (type, quantity, size, shape, backing, border, delivery, date, budget, description, upload, consents) |
| Valid submission | HTTP POST to `/api/quote` (multipart, same handler the form uses) | `201`, reference `SC-260912-S4HJ`, `duplicate: false`, `notified: false` (no email provider), record written to `.data/quotes/SC-260912-S4HJ/record.json` |
| Replay with the same `submissionId` | HTTP POST | `200`, same reference, `duplicate: true` (no second record) |
| Invalid payload | HTTP POST | `400` with per-field errors |
| Honeypot filled | HTTP POST | `400` "Submission rejected." |
| Intake unavailable (no `QUOTE_STORE`) | unit test | `503`, form renders the unavailable notice; no fake success |
| File checks (PNG/JPG/PDF/AI magic bytes, oversized, scripted SVG) | unit test | accepted/rejected as designed |
| `/account` | HTTP | `404` (route removed) |
| `/services`, `/industries` legacy URLs | HTTP | 308 → `/digitizing-artwork`, `/trade` |
| Unknown URL | HTTP | `404` with branded not-found page |

Note: the final "Send quote request" click was not performed inside the browser tooling (its policy blocked auto-submitting the form); the same server code path was exercised with real multipart requests instead. Client-side XHR upload progress and the success screen are therefore **implemented but not browser-verified**.

## Responsive sweep (production build)

12 routes × 6 widths = 72 renders: `/`, `/embroidery-digitizing`, `/custom-patches`, `/custom-products`, `/trade`, `/about`, `/contact`, `/portfolio`, `/quote?service=custom-patches`, `/resources/vector-vs-digitizing`, `/how-it-works`, `/faq` at 320, 375, 390, 768, 1024, 1440.

| Check | Result |
| --- | --- |
| Horizontal overflow (`scrollWidth > innerWidth`) | none |
| Exactly one `<h1>` | all pages |
| Console errors / page errors | 0 |
| HTTP status | 200 all |

## Keyboard and menus

| Check | Result |
| --- | --- |
| First Tab stop | "Skip to content" |
| Mobile menu (390): open sets `aria-expanded=true`; Escape closes | pass |
| Desktop "Studio" dropdown: Enter opens, Escape closes and returns focus to the trigger | pass |
| Opening a second dropdown closes the first; clicking outside closes all | pass |

## Lighthouse (production build, preview mode)

Mobile preset = Moto G Power emulation, slow 4G throttling. Desktop preset = 1350×940, 10 Mbps, no CPU slowdown.

| Page | Mode | Performance | Accessibility | Best practices | SEO | LCP | CLS | TBT |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `/` | mobile | 97 | 100 | 100 | 63* | 2.5 s | 0 | 60 ms |
| `/custom-patches` | mobile | 98 | 100 | 100 | 63* | 2.5 s | 0 | 40 ms |
| `/embroidery-digitizing` | mobile | 98 | 100 | 100 | 63* | 2.5 s | 0 | 30 ms |
| `/quote?service=custom-patches` | mobile | 98 | 100 | 100 | 63* | 2.4 s | 0 | 30 ms |
| `/trade` | mobile | 98 | 100 | 100 | 63* | 2.4 s | 0 | 40 ms |
| `/` | desktop | 100 | 100 | 100 | 63* | 0.6 s | 0 | 0 ms |
| `/custom-patches` | desktop | 100 | 100 | 100 | 63* | 0.6 s | 0 | 0 ms |
| `/embroidery-digitizing` | desktop | 100 | 100 | 100 | 63* | 0.6 s | 0 | 0 ms |
| `/quote?service=custom-patches` | desktop | 100 | 100 | 100 | 63* | 0.5 s | 0 | 0 ms |
| `/trade` | desktop | 100 | 100 | 100 | 63* | 0.5 s | 0 | 0 ms |

\* The only failing SEO audit is `is-crawlable`, which is the intended `noindex` for non-production builds. With `NEXT_PUBLIC_SITE_ENV=production` and `NEXT_PUBLIC_SITE_URL` set, the page-level robots directive becomes `index, follow` (verified by unit test); the remaining SEO audits pass.

Issues found by Lighthouse during this run and fixed before the final pass:

- Copper eyebrow text (`#C97744`, 12px) had 3.1–3.4:1 contrast on warm/white. Text now uses `#A45E32` (≥ 4.6:1) on light backgrounds and `#E6B896` (≥ 5:1) on blue/charcoal. Numbered step badges use the darker copper.
- Header logo link's `aria-label` did not contain its visible text. The logo now exposes a visually hidden "Stitchcraft Studio" and the visual text is `aria-hidden`.
- Intermittent CLS ≈ 0.5 on the dynamic `/quote` route on mobile, caused by the root `loading.tsx` streaming a placeholder shell that was then replaced. The file was removed; CLS is 0 on repeated runs.

## Preview indexing controls (verified on the running server)

| Control | Observed |
| --- | --- |
| Response header | `X-Robots-Tag: noindex, nofollow, noarchive` |
| Meta | `<meta name="robots" content="noindex, nofollow, nocache">` |
| Canonical | absent |
| `/robots.txt` | `User-Agent: *` / `Disallow: /` |
| `/sitemap.xml` | empty URL set |
| `og:image` | absolute URL built from the runtime origin |

## Known limitations / not verified

- Email delivery (Resend) not tested with a live key.
- Production database/object storage adapters do not exist yet; the file store is for a single persistent server or local use.
- Real-device testing (iOS Safari, Android Chrome) was not performed; only Chrome emulation.
- Manual screen reader pass (NVDA/VoiceOver) not performed; axe-core rules pass.
- No automated E2E test is committed; the sweep scripts were run from outside the repository.

## Screenshots

`docs/screenshots/before/` (baseline, dev server, viewport captures): `home-1440.png`, `home-390.png`, `digitizing-1440.png`, `quote-1440.png`.

`docs/screenshots/after/` (production build): full-page captures `home-{320,375,390,768,1024,1440}.jpg`, `custom-patches-{390,1440}.jpg`, `embroidery-digitizing-1440.jpg`, `trade-1440.jpg`, `quote-{390,1440}.jpg`, `portfolio-1440.jpg`, `contact-1440.jpg`; viewport captures `*-fold-*.jpg`; menus `home-390-menu.jpg`, `home-1440-studio-menu.jpg`.
