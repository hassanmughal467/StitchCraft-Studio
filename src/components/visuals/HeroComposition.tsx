import { MerrowEdge, StitchDefs } from "@/components/visuals/StitchPatterns";

/**
 * Original illustrated composition for the homepage hero: an artwork-to-stitch
 * comparison, a cap front with a 3D puff mark, and patch construction swatches.
 * Replace individual tiles with approved photography as it becomes available
 * (see docs/ASSETS_REQUIRED.md). These are illustrations, not product photos.
 */
export function HeroComposition() {
  return (
    <figure className="relative mx-auto w-full max-w-xl lg:max-w-none">
      <div className="grid grid-cols-6 grid-rows-6 gap-3 sm:gap-4" style={{ aspectRatio: "6 / 5.4" }}>
        <div className="col-span-6 row-span-4 overflow-hidden rounded-sm border border-line bg-card shadow-sm">
          <ArtworkToStitch />
        </div>
        <div className="col-span-3 row-span-2 overflow-hidden rounded-sm border border-line bg-card shadow-sm">
          <CapPuff />
        </div>
        <div className="col-span-3 row-span-2 overflow-hidden rounded-sm border border-line bg-card shadow-sm">
          <PatchSwatches />
        </div>
      </div>
      <figcaption className="mt-3 text-center text-[0.72rem] text-stone lg:text-left">
        Illustrated overview of the artwork-to-stitch process, cap embroidery and patch types.
      </figcaption>
    </figure>
  );
}

const badgePath = "M60 12 L104 28 V72 C104 96 82 112 60 120 C38 112 16 96 16 72 V28 Z";
const monogram =
  "M75 44c-4-5-10-8-16-8-9 0-15 5-15 12 0 15 32 10 32 30 0 9-8 16-20 16-8 0-15-3-20-9l5-5c4 5 9 7 15 7 7 0 12-4 12-9 0-13-32-8-32-30 0-10 8-17 21-17 8 0 14 3 18 8Z";

export function ArtworkToStitch({ id = "hero" }: { id?: string }) {
  return (
    <svg viewBox="0 0 520 300" className="h-full w-full" role="img" aria-label="Illustration comparing flat vector artwork with the same badge rendered as satin stitches on twill">
      <StitchDefs id={id} />
      <rect width="520" height="300" fill="#F7F5EF" />
      {/* Left: vector artwork on an artboard */}
      <g transform="translate(34 40)">
        <rect x="-10" y="-10" width="200" height="220" fill="#FFFFFF" stroke="#E7E7E2" />
        <g stroke="#C9D6DE" strokeWidth="0.6">
          {Array.from({ length: 9 }).map((_, i) => (
            <line key={`v${i}`} x1={i * 22.5} y1="-10" x2={i * 22.5} y2="210" />
          ))}
          {Array.from({ length: 10 }).map((_, i) => (
            <line key={`h${i}`} x1="-10" y1={i * 22} x2="190" y2={i * 22} />
          ))}
        </g>
        <g transform="translate(30 30) scale(1.05)">
          <path d={badgePath} fill="#174A66" />
          <path d={badgePath} fill="none" stroke="#C97744" strokeWidth="6" />
          <path d={monogram} fill="#F7F5EF" />
        </g>
        {/* anchor points */}
        {[
          [93, 43],
          [140, 60],
          [140, 106],
          [93, 158],
          [47, 106],
          [47, 60],
        ].map(([x, y]) => (
          <rect key={`${x}-${y}`} x={x - 3} y={y - 3} width="6" height="6" fill="#FFFFFF" stroke="#174A66" strokeWidth="1.2" />
        ))}
        <text x="0" y="234" fontSize="11" fontWeight="600" letterSpacing="1.6" fill="#C97744">
          ARTWORK · VECTOR
        </text>
      </g>
      {/* arrow */}
      <g transform="translate(252 150)" fill="none" stroke="#20252B" strokeWidth="1.6" strokeLinecap="round">
        <path d="M-6 0h30" />
        <path d="M17 -7l8 7-8 7" />
      </g>
      {/* Right: stitched badge on twill */}
      <g transform="translate(292 40)">
        <rect x="-10" y="-10" width="200" height="220" fill={`url(#${id}-twill)`} stroke="#E7E7E2" />
        <g transform="translate(30 30) scale(1.05)">
          <path d={badgePath} fill={`url(#${id}-satin)`} />
          <path d={badgePath} fill="none" stroke="#00000018" strokeWidth="2" />
          <MerrowEdge d={badgePath} id={id} color="copper" />
          <path d={monogram} fill={`url(#${id}-satin-white)`} stroke="#00000022" strokeWidth="0.6" />
        </g>
        <text x="0" y="234" fontSize="11" fontWeight="600" letterSpacing="1.6" fill="#C97744">
          STITCHED · EMBROIDERED PATCH
        </text>
      </g>
    </svg>
  );
}

export function CapPuff({ id = "cap" }: { id?: string }) {
  return (
    <svg viewBox="0 0 260 150" className="h-full w-full" role="img" aria-label="Illustration of a structured cap with raised 3D puff lettering on the front panel">
      <StitchDefs id={id} />
      <rect width="260" height="150" fill="#F7F5EF" />
      {/* crown */}
      <path d="M50 96 C50 44 210 44 210 96 Z" fill="#20252B" />
      <path d="M130 47 C100 47 74 62 62 96 H130 Z" fill="#2A3038" />
      <path d="M130 47 V96" stroke="#171B20" strokeWidth="1.5" />
      <path d="M96 52 C90 66 84 80 82 96" stroke="#171B20" strokeWidth="1.2" fill="none" />
      <path d="M164 52 C170 66 176 80 178 96" stroke="#171B20" strokeWidth="1.2" fill="none" />
      {/* button */}
      <circle cx="130" cy="46" r="4" fill="#31383F" />
      {/* peak */}
      <path d="M40 96 H220 C232 96 236 108 226 114 C190 128 70 128 34 114 C24 108 28 96 40 96 Z" fill="#171B20" />
      <path d="M50 100 H210" stroke="#2A3038" strokeWidth="1" />
      {/* puff letters */}
      <g transform="translate(96 62)">
        <rect x="0" y="0" width="68" height="26" rx="3" fill="#00000055" transform="translate(2 3)" />
        <rect x="0" y="0" width="14" height="26" rx="2" fill={`url(#${id}-satin-copper)`} />
        <rect x="18" y="0" width="14" height="26" rx="2" fill={`url(#${id}-satin-copper)`} />
        <rect x="36" y="0" width="14" height="26" rx="2" fill={`url(#${id}-satin-copper)`} />
        <rect x="54" y="0" width="14" height="26" rx="2" fill={`url(#${id}-satin-copper)`} />
        <rect x="0" y="0" width="68" height="26" rx="3" fill="none" stroke="#FFFFFF33" />
      </g>
      <text x="14" y="140" fontSize="10" fontWeight="600" letterSpacing="1.4" fill="#C97744">
        CAP FRONT · 3D PUFF
      </text>
    </svg>
  );
}

export function PatchSwatches({ id = "sw" }: { id?: string }) {
  const swatches: { label: string; fill: string; stroke?: string }[] = [
    { label: "Embroidered", fill: `url(#${id}-satin)`, stroke: `url(#${id}-satin-copper)` },
    { label: "Woven", fill: `url(#${id}-woven)`, stroke: "#F7F5EF" },
    { label: "PVC", fill: `url(#${id}-pvc)`, stroke: "#0F3446" },
    { label: "Chenille", fill: `url(#${id}-chenille)`, stroke: "#F7F5EF" },
  ];
  return (
    <svg viewBox="0 0 260 150" className="h-full w-full" role="img" aria-label="Illustration of four patch constructions: embroidered, woven, PVC and chenille">
      <StitchDefs id={id} />
      <rect width="260" height="150" fill="#F7F5EF" />
      {swatches.map((s, i) => {
        const x = 34 + i * 60;
        return (
          <g key={s.label} transform={`translate(${x} 58)`}>
            <circle r="22" fill={s.fill} />
            <circle r="22" fill="none" stroke={s.stroke} strokeWidth="5" />
            <circle r="22" fill="none" stroke="#00000022" strokeWidth="5" strokeDasharray="1.2 2.2" />
            <text y="42" textAnchor="middle" fontSize="9.5" fontWeight="600" fill="#20252B">
              {s.label}
            </text>
          </g>
        );
      })}
      <text x="14" y="140" fontSize="10" fontWeight="600" letterSpacing="1.4" fill="#C97744">
        PATCH TYPES
      </text>
    </svg>
  );
}
