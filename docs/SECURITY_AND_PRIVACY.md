# Security and privacy

## In place

- No secrets in the repository; credentials use environment variables
- Client and server validation; file signature + extension + size checks
- Private quote storage (`file` / `memory` / `vercel-blob`); public URLs are not used for artwork
- HMAC-signed, expiring staff artwork links when `QUOTE_ARTWORK_LINK_SECRET` is set
- Same-origin POST check; honeypot; in-memory rate limit (6 / 10 min)
- Optional Cloudflare Turnstile (off by default)
- Structured logs with IP hashing; no artwork, email, phone or address in analytics
- Security headers: CSP, `X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options`, `Permissions-Policy`; HSTS when production is confirmed
- Consent checkbox; draft privacy, terms, cookies, refund, shipping, accessibility pages

## Still required before treating the site as a production intake host

- Durable store + Blob token + Resend on Vercel (see `docs/LAUNCH_CHECKLIST.md`)
- Malware scanning on upload
- Role-based staff UI (inbox + stored records is the current path)
- Configurable retention and deletion process (owner confirmation)
- Automated backups and a restore test
- Re-run `npm audit` before launch

## Analytics rule

Funnel events only. Never send names, emails, phones, addresses, artwork filenames/URLs, project descriptions, client names or previous-order references.
