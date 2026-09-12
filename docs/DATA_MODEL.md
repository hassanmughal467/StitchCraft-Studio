# Data model

Logical records for Phase 2. Not persisted in a database in this pass.

## Quote

- `id` / public reference (e.g. `SS-1042`)
- `status`: New · Needs Information · Quoted · Awaiting Payment · Artwork in Progress · Awaiting Approval · In Production · Quality Check · Dispatched / File Delivered · Delivered / Completed · On Hold · Cancelled
- customer type, name, business name, email, phone, country, contact method
- service, project description, intended use, required date, budget range
- digital or physical field set
- artwork / reference file keys (private)
- rights confirmation, privacy consent, optional marketing consent
- source channel / UTM
- versioned commercial quote: scope, exclusions, price, tax, shipping, terms, expiry

## Proof

- quote/order id, version number, file key, notes
- customer action: approve | request revision
- actor, timestamp, IP/audit field when legally appropriate
- approved version cannot be silently replaced

## Order

- created from an accepted quote without re-entry
- payment state from verified gateway events only
- tracking or secure digital delivery
- approved specification snapshot for reorder

## Customer

- profile, addresses, quotes, orders, proofs, saved artwork, messages
- isolation: a customer sees only their own records

## PortfolioProject

- title, anonymized customer type, services, industry
- original artwork, proof, close-up, finished result
- challenge, process, result
- publication allowed flag
- related service slugs

## File object

- private key, owner customer id, mime, size, scan result, retention date
- never served from a public `/uploads` URL
