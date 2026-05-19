import type { SVGProps } from "react";

/**
 * Scalable SVG badge for the Gulf Football Federation (demo).
 * Double-ring (gold outside, green inside), heraldic falcon in gold,
 * "GFF" wordmark in white, Arabic name above, English name below.
 */
export function GFFBadge({ size = 128, ...props }: SVGProps<SVGSVGElement> & { size?: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 200"
      width={size}
      height={size}
      role="img"
      aria-label="Gulf Football Federation"
      {...props}
    >
      <defs>
        <linearGradient id="gff-gold-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#E8C76A" />
          <stop offset="55%" stopColor="#D4AF37" />
          <stop offset="100%" stopColor="#A87E25" />
        </linearGradient>
        <radialGradient id="gff-green-grad" cx="0.5" cy="0.45" r="0.7">
          <stop offset="0%" stopColor="#0E8A66" />
          <stop offset="100%" stopColor="#0A6B4F" />
        </radialGradient>
      </defs>

      {/* Outer gold ring */}
      <circle cx="100" cy="100" r="98" fill="url(#gff-gold-grad)" />
      {/* Inner green disc */}
      <circle cx="100" cy="100" r="86" fill="url(#gff-green-grad)" />
      {/* Decorative thin gold ring */}
      <circle
        cx="100"
        cy="100"
        r="80"
        fill="none"
        stroke="#D4AF37"
        strokeWidth="1.5"
        opacity="0.7"
      />

      {/* Arabic name (top arc) */}
      <path id="gff-arc-top" d="M 30 100 A 70 70 0 0 1 170 100" fill="none" />
      <text fill="#D4AF37" fontFamily="'Amiri', 'Noto Naskh Arabic', serif" fontSize="12">
        <textPath href="#gff-arc-top" startOffset="50%" textAnchor="middle">
          اتحاد كرة القدم الخليجي
        </textPath>
      </text>

      {/* Heraldic falcon — minimalist, gold */}
      <g fill="#D4AF37" transform="translate(100 110)">
        <path d="M0,-30 C-6,-22 -14,-16 -24,-12 C-16,-12 -10,-14 -4,-18 L-6,-6 C-14,-2 -22,2 -28,8 C-18,4 -10,2 -2,4 L-8,18 C-4,12 0,8 4,4 L0,22 L4,4 C8,8 12,12 16,18 L10,4 C18,2 26,4 36,8 C30,2 22,-2 14,-6 L12,-18 C18,-14 24,-12 32,-12 C22,-16 14,-22 8,-30 Z" />
        <circle cx="0" cy="-26" r="2.5" fill="#0A6B4F" />
      </g>

      {/* GFF wordmark */}
      <text
        x="100"
        y="148"
        textAnchor="middle"
        fill="#FFFFFF"
        fontFamily="Georgia, 'Times New Roman', serif"
        fontWeight="700"
        fontSize="26"
        letterSpacing="4"
      >
        GFF
      </text>

      {/* English name (bottom arc) */}
      <path id="gff-arc-bottom" d="M 30 110 A 70 70 0 0 0 170 110" fill="none" />
      <text
        fill="#D4AF37"
        fontFamily="Georgia, 'Times New Roman', serif"
        fontSize="9"
        letterSpacing="2"
      >
        <textPath href="#gff-arc-bottom" startOffset="50%" textAnchor="middle">
          GULF FOOTBALL FEDERATION
        </textPath>
      </text>
    </svg>
  );
}

export default GFFBadge;
