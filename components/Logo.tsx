import Link from "next/link";
import { BRAND_FULL } from "@/lib/brand";

/** Wayfarer logo: the orange paper plane on a dashed route, plus the wordmark. Pure SVG, sharp at any size. */
export function LogoMark({ variant = "color", className = "h-10 w-auto" }: { variant?: "color" | "white"; className?: string }) {
  const ink = variant === "white" ? "#ffffff" : "#124477";
  const sub = variant === "white" ? "#c9d6e6" : "#4e5d70";
  return (
    <svg viewBox="0 0 210 52" className={className} role="img" aria-label={BRAND_FULL}>
      <title>{BRAND_FULL}</title>
      {/* route + plane */}
      <circle cx="26" cy="26" r="22" fill={variant === "white" ? "rgba(255,255,255,0.08)" : "#eef2f6"} />
      <path d="M8 34c6-1 10-4 14-8" fill="none" stroke="#e88029" strokeWidth="2" strokeDasharray="2 3" strokeLinecap="round" />
      <path d="M12 25 40 13l-8.5 24-6-9.2z" fill="#e88029" />
      <path d="M25.5 27.8 40 13 22.6 25.6l1.6 8.9z" fill="#a9500f" />
      {/* wordmark */}
      <text x="56" y="28" fontFamily="var(--font-archivo), Arial Narrow, sans-serif" fontWeight="800" fontSize="25" letterSpacing="-0.5" fill={ink} style={{ fontStretch: "80%" }}>
        Wayfarer
      </text>
      <text x="57" y="44" fontFamily="var(--font-noto), system-ui, sans-serif" fontWeight="600" fontSize="9.5" letterSpacing="1.6" fill={sub}>
        OVERSEAS EDUCATION
      </text>
    </svg>
  );
}

export function Logo({ variant = "color", className }: { variant?: "color" | "white"; className?: string }) {
  return (
    <Link href="/" className={`inline-flex shrink-0 items-center ${className ?? ""}`} aria-label={`${BRAND_FULL} home`}>
      <LogoMark variant={variant} className="h-10 w-auto md:h-11" />
    </Link>
  );
}
