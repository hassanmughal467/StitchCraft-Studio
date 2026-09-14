# QA report (2026-09-14)

Automated checks from this pass. Manual browser/device cells are marked only when actually exercised.

## Commands

```
npm run typecheck
npm run lint
npm test
npm run build
npm run test:e2e
```

## Results

| Check | Result |
| --- | --- |
| Typecheck | Pass |
| Lint | Pass |
| Vitest | 50/50 pass |
| Playwright (Chromium) | 15/15 pass against `next start` |
| Production build | Pass (36 routes). `metadataBase` warning on preview is expected: no confirmed production URL |
| Quote API (local, `QUOTE_STORE=file`) | POST 201 → `SC-260914-XVYP`; repeat POST 200 `duplicate: true` |
| GET `/api/quote` | `{ online: true }` when a store is configured |
| Preview robots | `X-Robots-Tag: noindex, nofollow, noarchive`; empty sitemap |
| Custom 404 | HTTP 404 + “Page not found” |
| CSP / nosniff / frame / referrer / permissions | Present on responses |
| HSTS | Not sent on preview (correct) |

## Playwright

`e2e/quote.spec.ts` covers seven-service preselection, trade customer, step-one errors, back-navigation, digitizing submit, double-click, 404, mobile menu, portfolio query. Run after `npx playwright install chromium`. Chromium-only in this environment.

## Responsive overflow (Chromium, this session)

| Width | Home | Quote | Service (digitizing) |
| --- | --- | --- | --- |
| 320 | no overflow | no overflow | no overflow |
| 390 | — | no overflow | — |
| 768 | — | no overflow | — |
| 815 (default tab) | — | — | no overflow (portfolio empty) |
| 1440 | — | no overflow | — |
| 360, 375, 430, 1024, 1280 | not re-measured in this pass | | |

Cards stack; one H1 per checked page; Portfolio hidden from primary nav while empty.

## Accessibility (this pass)

Implemented: skip link, landmarks, visible labels, required announced, error `role="alert"`, `aria-describedby`, step heading focus, live regions, menu Escape + focus return, reduced motion, lightbox dialog pattern.

**Not claimed as WCAG 2.2 AA.** Remaining manual tests: `docs/ACCESSIBILITY.md`.

## Browsers / devices

| Target | Status |
| --- | --- |
| Chromium (Cursor browser + Playwright) | Exercised locally |
| Firefox desktop | Not tested |
| Microsoft Edge | Not tested |
| Safari desktop | Not tested |
| iPhone Safari | Not tested |
| Android Chrome | Not tested |

## Security notes

- Secrets stay server-side. Artwork is private; staff links are HMAC + expiry when `QUOTE_ARTWORK_LINK_SECRET` is set.
- Rate limit 6 / 10 min; honeypot; Turnstile optional.
- CSP is static (`unsafe-inline` required without per-request nonces). Trade-off: no nonce CSP, so every page stays static.
- `npm audit` reported 2 moderate issues at install time; re-run before launch.

## Lighthouse

Not re-run in this pass. Previous production-build scores (2026-09-12) were performance 97–100, accessibility 100, CLS 0. Treat as historical, not proof.

## Known limitations

- Live Vercel form stays offline until `QUOTE_STORE=vercel-blob` (or another durable store) and mail env are set.
- No published portfolio projects (honest empty state).
- Offer banners prepared, all `enabled: false`.
- Commercial price/minimum/turnaround numbers remain hidden until owner values exist.
- Email notifications unverified without Resend credentials (`notified: false` after local save).
