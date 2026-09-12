# Assets Required

The site currently uses original SVG illustrations (labelled "Illustrated overview") because no photography or client work has been approved. Everything below is optional for a truthful launch but will materially improve conversion. Nothing is published until supplied with rights confirmed.

## Photography (owner-produced or licensed with proof)

| Asset | Spec | Used on |
| --- | --- | --- |
| Hero: finished embroidered cap and patch, styled on warm neutral background | 2400×1600 JPG/WebP, landscape, product sharp, room for text on left | Homepage hero (replaces illustration) |
| Artwork-to-stitch pairs: source logo screenshot + sewn result, same logo | 2 images per pair, 1600×1200 | Homepage "What changes between your logo and the sew-out", digitizing page |
| Patch types: embroidered, woven, PVC, chenille, printed, leather, each on plain background | 1200×1200 each, consistent lighting | Custom patches page, patch guide |
| Backing and border close-ups: iron-on, sew-on, hook-and-loop, merrowed, hot-cut | 1200×1200 | Custom patches specs |
| Cap embroidery: flat, 3D puff, side/back placements | 1600×1200 | Custom hats page |
| Apparel: left-chest, full-back, sleeve, jacket back examples | 1600×1200 | Embroidered apparel page |
| Screen printing: plastisol/water-based swatches, print shots | 1600×1200 | Screen printing page |
| Studio/process: digitizing on screen, machine running, QC check, packing | 1600×1200, no identifiable customer artwork without permission | About, How it works |

Rights: owner-shot photos or licensed stock with the licence saved in the repo owner's records. Stock imagery of other people's embroidery must not be presented as studio work.

## Portfolio items

For each item to publish in `src/lib/portfolio.ts`:

- Result image (required), optional source-artwork image, optional detail image.
- Service, product/placement, stitch count or size (if known), materials.
- Whether the client can be named. If yes, written permission on file (`permission: true`); otherwise the item is shown anonymously ("Regional sports club").

## Brand

| Asset | Notes |
| --- | --- |
| Logo master files (SVG + PNG) | The current wordmark/icon is a code-drawn placeholder in `src/components/brand/Logo.tsx` |
| Favicon set | Generated from `src/app/icon.tsx`; replace once the real logo exists |
| Open Graph image | Generated at `src/app/opengraph-image.tsx`; swap for a photographic version if desired |

## Documents

| Asset | Used on |
| --- | --- |
| Artwork spec sheet PDF (accepted formats, sizes, colour guidance) | `/artwork-guidelines` download |
| Trade terms PDF (if trade pricing is by agreement) | `/trade` |
| Sample proof (redacted) showing what a stitch preview looks like | `/resources/embroidery-proofs`, quote page |

## Copy to confirm

- Founder/staff names and roles for About (optional; currently not named).
- Machine types, thread brands, software (e.g. Wilcom/Pulse/Hatch) if the owner wants them stated.
- Any certifications or memberships (only if real and current).
