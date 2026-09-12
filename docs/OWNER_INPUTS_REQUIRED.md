# Owner Inputs Required (private checklist)

Nothing on this list is published until it is supplied and confirmed. Items marked **launch blocker** must be resolved before the site is indexed or promoted.

## Business identity

| # | Item | Why it matters | Where it goes | Blocker |
| --- | --- | --- | --- | --- |
| 1 | Registered legal business name and trading name | Terms, privacy policy, invoices, Organization JSON-LD | `NEXT_PUBLIC_LEGAL_NAME`; `/terms`, `/privacy` | yes |
| 2 | Business address (or a statement that the studio does not publish a street address) | Privacy policy, customs paperwork, trust | `NEXT_PUBLIC_ADDRESS_LINE1`, `NEXT_PUBLIC_ADDRESS_CITY` (optional) | for legal pages |
| 3 | Confirmed production domain (e.g. `https://www.stitchcraft…`) | Canonicals, sitemap, Open Graph, indexing switch | `NEXT_PUBLIC_SITE_URL` + `NEXT_PUBLIC_SITE_ENV=production` | yes |
| 4 | Business hours and time zone | Reply expectations, Organization JSON-LD | `NEXT_PUBLIC_SUPPORT_HOURS` (optional) | no |

## Contact channels

| # | Item | Notes | Env |
| --- | --- | --- | --- |
| 5 | Monitored quote inbox | Receives staff notifications (`QUOTE_INBOX_EMAIL`); appears publicly only if `NEXT_PUBLIC_CONTACT_EMAIL` is set | `QUOTE_INBOX_EMAIL`, `NEXT_PUBLIC_CONTACT_EMAIL` |
| 6 | Phone number with country code | Shown only if set and not a placeholder | `NEXT_PUBLIC_PHONE` |
| 7 | WhatsApp Business number | Floating button and contact page render only if set | `NEXT_PUBLIC_WHATSAPP` |
| 8 | Social profile URLs (Instagram, LinkedIn, Facebook) | Bare platform homepages are ignored | `NEXT_PUBLIC_INSTAGRAM_URL`, `NEXT_PUBLIC_LINKEDIN_URL`, `NEXT_PUBLIC_FACEBOOK_URL` |

## Quote intake infrastructure (launch blockers)

| # | Item | Decision needed |
| --- | --- | --- |
| 9 | Durable quote store for production | The file store (`QUOTE_STORE=file`) works on a single server with a persistent disk. Vercel serverless has no persistent disk, so choose one: managed Postgres (recommended, e.g. Neon/Supabase/Vercel Postgres), or a hosted form backend. A `QuoteStore` interface exists; a database adapter is ~1 file. |
| 10 | Artwork storage | Uploaded files must live in object storage (S3-compatible or Vercel Blob) in production. Needed alongside item 9. |
| 11 | Transactional email provider | Resend integration is written. Supply `RESEND_API_KEY`, a verified sending domain and `RESEND_FROM_EMAIL`. |
| 12 | Spam protection beyond honeypot + rate limit | Optional: Cloudflare Turnstile keys if spam becomes a problem. |

## Commercial facts (not published until confirmed)

| # | Item | Currently |
| --- | --- | --- |
| 13 | Starting prices or price ranges per service | Not shown; pages list price factors only |
| 14 | Minimum order quantities per product | Not shown |
| 15 | Standard and rush turnaround times | Described as "quoted per job" only |
| 16 | Revision policy per service (number of free revisions) | Described generically; confirm |
| 17 | Payment methods, deposit percentage, currencies | Not shown; payments not implemented |
| 18 | Shipping carriers, typical transit times, who pays duties | Shipping page describes process generically |
| 19 | Refund and remake policy wording | Draft exists at `/refund-policy`; needs legal review |
| 20 | Sample policy (paid/free, pre-production samples) | Not shown |

## Accounts and orders (blocked features)

| # | Item | Decision needed |
| --- | --- | --- |
| 21 | Customer accounts | Requires an auth provider (e.g. Auth.js with email magic links or Clerk) and a database. Domain rules for quotes, versions, proofs, payments and reorders are implemented and unit-tested in `src/lib/workflow`. |
| 22 | Payments | Requires a payment provider account (Stripe recommended for US/UK/AU). Webhook verification and idempotent payment events are modelled in the workflow module. |
| 23 | Staff/admin tooling | Decide whether staff work from the inbox + stored records, or need an admin UI. |

## Approvals

| # | Item |
| --- | --- |
| 24 | Written permission per client for any portfolio item that names a client or shows their logo |
| 25 | Approval of all policy pages (`/terms`, `/privacy`, `/refund-policy`, `/cookies`, `/shipping`) by the owner or counsel |
| 26 | Confirmation of the "based in Pakistan" statement and target markets wording |
| 27 | Analytics decision (provider, consent approach). A consent-gated no-op sink exists in `src/lib/analytics.ts` |
