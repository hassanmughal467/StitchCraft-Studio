# Security and privacy

## In place now

- No secrets in the repository; credentials use environment variables
- Quote uploads validated for type and size in the browser and API
- Form consent checkbox for quote handling
- Draft privacy, terms, cookies, and refund pages
- Public pages only; account and future checkout must be `noindex`

## Required before live file handling

- Private object storage with randomized keys
- Signed or session-checked downloads
- Malware scanning on upload
- CSRF on mutating routes (Next.js Server Actions / token)
- Rate limiting and spam protection on `/api/quote`
- Accessible CAPTCHA only if abuse requires it
- Role-based staff access; designers do not see unrelated payment data
- Audit log for proof approval, quote edits, payment state, staff access
- Configurable retention and inactive-account deletion
- Automated backups and a documented restore test

## Analytics rule

Track funnel events without sending artwork, names, emails, or extra personal data. Preserve UTM on the quote record. Consent-aware configuration only.
