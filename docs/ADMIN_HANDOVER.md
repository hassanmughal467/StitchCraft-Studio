# Admin Handover

Operational guide for whoever runs the Stitchcraft Studio site. Companion documents: `OWNER_INPUTS_REQUIRED.md` (what is still missing), `ASSETS_REQUIRED.md`, `QA_REPORT.md`, `UPGRADE_PLAN.md`.

## 1. Run, build, test

```bash
npm install
npm run dev          # http://localhost:3000
npm run typecheck
npm run lint
npm test             # vitest
npm run build && npm start
```

Local quote testing: add `QUOTE_STORE=file` to `.env.local`. Submissions are written to `.data/quotes/<reference>/record.json` (plus the uploaded artwork file). `.data/` and `.env*` are git-ignored; never commit them.

## 2. Environments and indexing

The site has two modes, decided by environment variables at build time:

| Mode | Condition | Behaviour |
| --- | --- | --- |
| Preview (default) | anything else | `noindex, nofollow` meta + `X-Robots-Tag` header, `robots.txt` disallows all, empty sitemap, no canonical tags, absolute URLs built from the Vercel URL or localhost |
| Production | `NEXT_PUBLIC_SITE_ENV=production` **and** `NEXT_PUBLIC_SITE_URL=https://<confirmed domain>` | indexable, canonicals and sitemap on the confirmed domain, robots allows crawling except `/api/`, `/quote/`, `/account` |

Set these two variables only on the Vercel **Production** environment, only after the domain is confirmed and attached. Preview deployments must keep them unset. Because `NEXT_PUBLIC_*` values are inlined at build time, redeploy after changing them.

All other public details (legal name, email, phone, WhatsApp, hours, address, socials) are read from `NEXT_PUBLIC_*` variables listed in `.env.example`. Unset or placeholder values (e.g. `example.com`, `555` numbers, bare `instagram.com`) are ignored and the corresponding UI is hidden.

## 3. Quote intake

Flow: form (`src/components/quote/QuoteForm.tsx`) → `POST /api/quote` (`src/app/api/quote/route.ts`) → `processQuoteIntake` (`src/lib/server/quote-intake.ts`).

- Availability: `GET /api/quote` returns `{ available: boolean }`. The form is disabled with an honest notice when no store is configured; nothing is simulated.
- Reference format `SC-YYMMDD-XXXX`. Idempotent on the client-generated `submissionId` (a retry never creates a second record).
- Protections: honeypot field `website`, per-IP rate limit (6 requests / 10 minutes, in-memory per server instance), 15 MB upload cap, file type checked by magic bytes, SVG rejected if it contains scripts or event handlers.
- Notifications: if `RESEND_API_KEY`, `RESEND_FROM_EMAIL` and `QUOTE_INBOX_EMAIL` are set, a staff email and a customer confirmation are sent after the record is saved. Delivery results are stored on the record (`notification.staff/customer.status`). A failed email never asks the customer to resubmit.

### Production storage (required before launch)

`QUOTE_STORE=file` needs a persistent disk, which Vercel serverless does not have. Implement a database adapter for the `QuoteStore` interface in `src/lib/server/quote-store.ts` (methods: `referenceExists`, `findBySubmissionId`, `save`, `updateNotification`) and register it in `resolveQuoteStore`. Uploaded artwork should go to object storage (S3-compatible or Vercel Blob). See `OWNER_INPUTS_REQUIRED.md` items 9–11.

### Handling a quote (until an admin UI exists)

1. Open the staff notification email (or the stored record) using the reference.
2. Review artwork and details; ask for missing information by the customer's preferred channel.
3. Send the itemized quote and proof. Record acceptance and payment in your own system; the workflow rules in `src/lib/workflow/index.ts` describe the intended states (quote versions → acceptance → proof approval → payment → production → fulfilment) for when accounts are built.

## 4. Content editing

| What | Where |
| --- | --- |
| Service copy, H1s, meta titles, specs, FAQs, price factors | `src/lib/services.ts` |
| Homepage sections | `src/app/page.tsx` |
| Navigation and footer groups | `src/lib/nav.ts` |
| Guides | `src/lib/services.ts` (`guides`) and pages under `src/app/resources/` |
| Portfolio items | `src/lib/portfolio.ts`. Add objects to `portfolioItems`; an item shows only when `published: true`, it has a `result` image, and (if the client is named) `permission: true`. The Portfolio link, homepage preview and sitemap entries appear automatically once at least one item qualifies. |
| Policies | `src/app/{terms,privacy,refund-policy,cookies,shipping,accessibility}/page.tsx` |
| Illustrations | `src/components/visuals/` (replace with photography when available; keep descriptive `alt`) |
| Brand colours and type | `src/app/globals.css` (`@theme`), `src/app/layout.tsx` (font) |

Rules of the house: no invented prices, turnaround guarantees, client names, testimonials or certifications. If a fact is not confirmed, leave it out rather than approximate.

## 5. Deploying

Branch `cursor/website-build-brief` contains this work. Deploy previews from Vercel as usual; they are automatically non-indexable. To go live:

1. Complete the launch blockers in `OWNER_INPUTS_REQUIRED.md` (store, email, legal name, contact channel, domain).
2. Attach the domain in Vercel; set `NEXT_PUBLIC_SITE_ENV=production` and `NEXT_PUBLIC_SITE_URL` on Production only.
3. Deploy, then confirm on the live domain: `curl -I https://<domain>/` shows no `X-Robots-Tag`, `/robots.txt` allows `/`, `/sitemap.xml` lists pages, page source has `<link rel="canonical">`.
4. Google Search Console: add the domain property (DNS TXT verification), submit `https://<domain>/sitemap.xml`, request indexing for the homepage and the seven service pages. Bing Webmaster Tools: import from Search Console or verify by DNS, submit the same sitemap.
5. Analytics (optional): choose a provider and wire it into `src/lib/analytics.ts`, which already gates events behind the `sc_consent=analytics` cookie. Update `/cookies` and `/privacy` accordingly.

## 6. Security and privacy notes

- Security headers (`X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options`, `Permissions-Policy`) are configured in `next.config.ts`. A Content-Security-Policy is not set yet; add one once the analytics/email providers are known.
- Quote records contain personal data. Store them only in the production database with access limited to staff; set a retention period and document it in `/privacy`.
- IP addresses are stored hashed (`meta.ipHash`) with the optional `QUOTE_IP_SALT`.
- `.env.local` contains secrets (including a Vercel OIDC token). Never commit it; rotate any secret that leaks.

## 7. Known gaps

Customer accounts, order history, proof approval UI and payments are not implemented (blocked on provider decisions). The `/account` route intentionally returns 404 and is excluded from navigation and the sitemap until those exist.
