import { ArtworkToStitch, CapPuff, PatchSwatches } from "@/components/visuals/HeroComposition";
import { StitchDefs } from "@/components/visuals/StitchPatterns";
import type { ServiceVisual as VisualKind } from "@/lib/services";

/** Picks the illustrated hero visual for a service page. */
export function ServiceVisual({ kind }: { kind: VisualKind }) {
  switch (kind) {
    case "digitizing":
      return <ArtworkToStitch id="svc-dig" />;
    case "vector":
      return <RasterVsVector />;
    case "logo":
      return <LogoConcepts />;
    case "patches":
      return <PatchSwatches id="svc-patch" />;
    case "apparel":
      return <PlacementDiagram />;
    case "printing":
      return <PrintLocations />;
    case "caps":
      return <CapPuff id="svc-cap" />;
  }
}

export function RasterVsVector() {
  const px = 9;
  const blocky: [number, number][] = [];
  // A blocky, low-resolution "S" shape
  const rows = ["..####..", ".#....#.", ".#......", "..###...", ".....#..", "......#.", ".#....#.", "..####.."];
  rows.forEach((row, y) => row.split("").forEach((c, x) => c === "#" && blocky.push([x, y])));
  return (
    <svg viewBox="0 0 520 300" className="h-full w-full" role="img" aria-label="Illustration comparing a pixelated raster logo with the same logo redrawn as smooth vector paths">
      <rect width="520" height="300" fill="#F7F5EF" />
      <g transform="translate(40 40)">
        <rect x="-10" y="-10" width="200" height="220" fill="#FFFFFF" stroke="#E7E7E2" />
        <g transform="translate(54 44)" shapeRendering="crispEdges">
          {blocky.map(([x, y]) => (
            <rect key={`${x}-${y}`} x={x * px} y={y * px} width={px} height={px} fill="#174A66" opacity={0.75 + ((x + y) % 3) * 0.08} />
          ))}
          {blocky.map(([x, y]) => (
            <rect key={`b${x}-${y}`} x={x * px - 2} y={y * px + 2} width={px} height={px} fill="#6E93A8" opacity="0.35" />
          ))}
        </g>
        <text x="0" y="234" fontSize="11" fontWeight="600" letterSpacing="1.6" fill="#B42318">
          BEFORE · JPG, BLURRED EDGES
        </text>
      </g>
      <g transform="translate(252 150)" fill="none" stroke="#20252B" strokeWidth="1.6" strokeLinecap="round">
        <path d="M-6 0h30" />
        <path d="M17 -7l8 7-8 7" />
      </g>
      <g transform="translate(300 40)">
        <rect x="-10" y="-10" width="200" height="220" fill="#FFFFFF" stroke="#E7E7E2" />
        <path
          transform="translate(38 30) scale(1.1)"
          d="M75 44c-4-5-10-8-16-8-9 0-15 5-15 12 0 15 32 10 32 30 0 9-8 16-20 16-8 0-15-3-20-9l5-5c4 5 9 7 15 7 7 0 12-4 12-9 0-13-32-8-32-30 0-10 8-17 21-17 8 0 14 3 18 8Z"
          fill="#174A66"
        />
        <g fill="#FFFFFF" stroke="#C97744" strokeWidth="1.2">
          <rect x="60" y="72" width="6" height="6" />
          <rect x="120" y="60" width="6" height="6" />
          <rect x="116" y="126" width="6" height="6" />
          <rect x="66" y="140" width="6" height="6" />
        </g>
        <text x="0" y="234" fontSize="11" fontWeight="600" letterSpacing="1.6" fill="#217A4B">
          AFTER · VECTOR PATHS, ANY SIZE
        </text>
      </g>
    </svg>
  );
}

export function LogoConcepts() {
  return (
    <svg viewBox="0 0 520 300" className="h-full w-full" role="img" aria-label="Illustration of three logo concept directions: wordmark, badge and icon with type">
      <rect width="520" height="300" fill="#F7F5EF" />
      {[0, 1, 2].map((i) => (
        <g key={i} transform={`translate(${30 + i * 160} 40)`}>
          <rect width="140" height="200" fill="#FFFFFF" stroke="#E7E7E2" />
          <text x="12" y="22" fontSize="10" fontWeight="600" letterSpacing="1.4" fill="#C97744">
            {["CONCEPT A", "CONCEPT B", "CONCEPT C"][i]}
          </text>
          {i === 0 ? (
            <g transform="translate(20 84)">
              <rect width="100" height="16" rx="2" fill="#20252B" />
              <rect y="24" width="64" height="8" rx="2" fill="#C97744" />
            </g>
          ) : i === 1 ? (
            <g transform="translate(70 100)">
              <path d="M0 -44 L38 -30 V8 C38 28 18 42 0 50 C-18 42 -38 28 -38 8 V-30 Z" fill="#174A66" />
              <path d="M0 -44 L38 -30 V8 C38 28 18 42 0 50 C-18 42 -38 28 -38 8 V-30 Z" fill="none" stroke="#C97744" strokeWidth="4" />
              <circle r="10" fill="#F7F5EF" />
            </g>
          ) : (
            <g transform="translate(24 78)">
              <circle cx="20" cy="20" r="20" fill="#174A66" />
              <path d="M12 26c4-1 6-6 8-10 2 4 4 9 8 10" stroke="#F7F5EF" strokeWidth="2.4" fill="none" strokeLinecap="round" />
              <rect x="50" y="10" width="44" height="10" rx="2" fill="#20252B" />
              <rect x="50" y="26" width="30" height="6" rx="2" fill="#C97744" />
            </g>
          )}
          <g transform="translate(12 160)">
            {["#174A66", "#20252B", "#C97744", "#F7F5EF"].map((c, j) => (
              <rect key={c} x={j * 22} width="16" height="16" fill={c} stroke="#E7E7E2" />
            ))}
          </g>
        </g>
      ))}
    </svg>
  );
}

export function PlacementDiagram() {
  return (
    <svg viewBox="0 0 520 300" className="h-full w-full" role="img" aria-label="Illustration of a polo shirt with embroidery placement zones: left chest, right chest, sleeve and full back">
      <StitchDefs id="pl" />
      <rect width="520" height="300" fill="#F7F5EF" />
      {/* front */}
      <g transform="translate(40 30)">
        <path d="M60 20 L100 6 C110 26 130 26 140 6 L180 20 L200 80 L170 92 L170 230 H70 V92 L40 80 Z" fill="#20252B" />
        <path d="M100 6 L120 40 L140 6" fill="none" stroke="#31383F" strokeWidth="2" />
        <rect x="128" y="76" width="30" height="18" rx="2" fill="none" stroke="#C97744" strokeWidth="1.5" strokeDasharray="3 2" />
        <rect x="132" y="80" width="22" height="10" fill="url(#pl-satin-copper)" />
        <rect x="80" y="76" width="30" height="12" rx="2" fill="none" stroke="#C97744" strokeWidth="1.5" strokeDasharray="3 2" />
        <rect x="176" y="36" width="18" height="12" rx="2" fill="none" stroke="#C97744" strokeWidth="1.5" strokeDasharray="3 2" />
        <text x="60" y="256" fontSize="10.5" fontWeight="600" letterSpacing="1.4" fill="#C97744">
          FRONT · LEFT CHEST, NAME, SLEEVE
        </text>
      </g>
      {/* back */}
      <g transform="translate(280 30)">
        <path d="M60 20 L100 6 C110 20 130 20 140 6 L180 20 L200 80 L170 92 L170 230 H70 V92 L40 80 Z" fill="#20252B" />
        <rect x="80" y="100" width="80" height="70" rx="2" fill="none" stroke="#C97744" strokeWidth="1.5" strokeDasharray="3 2" />
        <rect x="90" y="112" width="60" height="46" fill="url(#pl-satin)" />
        <rect x="108" y="40" width="24" height="10" rx="2" fill="none" stroke="#C97744" strokeWidth="1.5" strokeDasharray="3 2" />
        <text x="60" y="256" fontSize="10.5" fontWeight="600" letterSpacing="1.4" fill="#C97744">
          BACK · FULL BACK, NAPE
        </text>
      </g>
    </svg>
  );
}

export function PrintLocations() {
  return (
    <svg viewBox="0 0 520 300" className="h-full w-full" role="img" aria-label="Illustration of a t-shirt with screen print locations and a three-color ink separation">
      <rect width="520" height="300" fill="#F7F5EF" />
      <g transform="translate(40 30)">
        <path d="M60 20 L100 6 C110 20 130 20 140 6 L180 20 L200 80 L170 92 L170 230 H70 V92 L40 80 Z" fill="#F7F5EF" stroke="#20252B" strokeWidth="2" />
        <rect x="80" y="96" width="80" height="96" rx="2" fill="none" stroke="#C97744" strokeWidth="1.5" strokeDasharray="3 2" />
        <g transform="translate(92 112)">
          <rect width="56" height="56" fill="#174A66" />
          <circle cx="28" cy="28" r="18" fill="#C97744" />
          <circle cx="28" cy="28" r="8" fill="#20252B" />
        </g>
        <text x="60" y="256" fontSize="10.5" fontWeight="600" letterSpacing="1.4" fill="#C97744">
          FULL FRONT · 3 SPOT COLORS
        </text>
      </g>
      <g transform="translate(300 40)">
        {["#174A66", "#C97744", "#20252B"].map((c, i) => (
          <g key={c} transform={`translate(0 ${i * 66})`}>
            <rect width="150" height="54" fill="#FFFFFF" stroke="#E7E7E2" />
            <rect x="12" y="10" width="34" height="34" fill={c} />
            <text x="58" y="26" fontSize="11" fontWeight="600" fill="#20252B">
              Screen {i + 1}
            </text>
            <text x="58" y="41" fontSize="10" fill="#5C636B">
              {["Base shape", "Ring", "Centre"][i]}
            </text>
          </g>
        ))}
        <text x="0" y="230" fontSize="10.5" fontWeight="600" letterSpacing="1.4" fill="#C97744">
          ONE SCREEN PER INK COLOR
        </text>
      </g>
    </svg>
  );
}
