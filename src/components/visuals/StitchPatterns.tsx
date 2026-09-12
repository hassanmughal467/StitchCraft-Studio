/**
 * Shared SVG pattern definitions used by the illustrated product visuals.
 * These are original vector illustrations, not photographs of production work.
 */
export function StitchDefs({ id = "sc" }: { id?: string }) {
  return (
    <defs>
      {/* Satin stitch: tight diagonal columns with a light sheen line */}
      <pattern id={`${id}-satin`} width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(38)">
        <rect width="6" height="6" fill="#174A66" />
        <rect width="2" height="6" fill="#1F5C7E" />
        <rect x="2" width="0.8" height="6" fill="#0F3446" />
      </pattern>
      <pattern id={`${id}-satin-copper`} width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(38)">
        <rect width="6" height="6" fill="#C97744" />
        <rect width="2" height="6" fill="#DA8C58" />
        <rect x="2" width="0.8" height="6" fill="#9E5A31" />
      </pattern>
      <pattern id={`${id}-satin-white`} width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(38)">
        <rect width="6" height="6" fill="#F7F5EF" />
        <rect width="2" height="6" fill="#FFFFFF" />
        <rect x="2" width="0.8" height="6" fill="#D9D6CC" />
      </pattern>
      {/* Tatami fill: offset horizontal rows */}
      <pattern id={`${id}-fill`} width="8" height="4" patternUnits="userSpaceOnUse">
        <rect width="8" height="4" fill="#20252B" />
        <rect width="8" height="1" fill="#31383F" />
        <rect y="2" x="4" width="4" height="1" fill="#31383F" />
      </pattern>
      {/* Twill ground */}
      <pattern id={`${id}-twill`} width="4" height="4" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
        <rect width="4" height="4" fill="#EDEAE1" />
        <rect width="4" height="1.2" fill="#E2DED3" />
      </pattern>
      {/* Woven: fine grid */}
      <pattern id={`${id}-woven`} width="3" height="3" patternUnits="userSpaceOnUse">
        <rect width="3" height="3" fill="#174A66" />
        <rect width="1.5" height="1.5" fill="#20597A" />
        <rect x="1.5" y="1.5" width="1.5" height="1.5" fill="#20597A" />
      </pattern>
      {/* Chenille: soft loops */}
      <pattern id={`${id}-chenille`} width="7" height="7" patternUnits="userSpaceOnUse">
        <rect width="7" height="7" fill="#C97744" />
        <circle cx="3.5" cy="3.5" r="2.4" fill="#D98B5A" />
        <circle cx="3.5" cy="3.5" r="1" fill="#B2643A" />
      </pattern>
      <linearGradient id={`${id}-pvc`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#2A6C90" />
        <stop offset="0.5" stopColor="#174A66" />
        <stop offset="1" stopColor="#0F3446" />
      </linearGradient>
      <linearGradient id={`${id}-leather`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#8A5A3C" />
        <stop offset="1" stopColor="#5C3A25" />
      </linearGradient>
    </defs>
  );
}

/** Merrow (overlock) border drawn as a thick dashed ring. */
export function MerrowEdge({ d, id = "sc", color = "copper" }: { d: string; id?: string; color?: "copper" | "blue" | "white" }) {
  const fill = color === "copper" ? `url(#${id}-satin-copper)` : color === "blue" ? `url(#${id}-satin)` : `url(#${id}-satin-white)`;
  return (
    <>
      <path d={d} fill="none" stroke={fill} strokeWidth="9" strokeLinejoin="round" />
      <path d={d} fill="none" stroke="#00000022" strokeWidth="9" strokeDasharray="1.2 2.2" strokeLinejoin="round" />
    </>
  );
}
