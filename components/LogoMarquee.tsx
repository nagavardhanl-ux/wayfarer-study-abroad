import { UniCrest } from "./UniCrest";

type Logo = { name: string; countryName: string };

/**
 * University name tiles (monogram crest, name, country) sliding in rows (opposite directions), like the old site's carousel but continuous.
 * Pauses on hover and focus, and becomes a still grid for reduced-motion users.
 */
export function LogoMarquee({ logos, rows = 2 }: { logos: Logo[]; rows?: number }) {
  const perRow = Math.ceil(logos.length / rows);
  const groups = Array.from({ length: rows }, (_, i) => logos.slice(i * perRow, (i + 1) * perRow)).filter((g) => g.length);

  return (
    <div className="marquee">

      <div className="space-y-4">
        {groups.map((g, r) => (
          <div key={r} className="marquee-row" style={{ "--marquee-duration": `${Math.max(30, g.length * 4)}s` } as React.CSSProperties}>
            <ul className={`marquee-track ${r % 2 ? "marquee-reverse" : ""}`}>
              {[...g, ...g].map((l, i) => (
                <li key={`${l.name}-${i}`} aria-hidden={i >= g.length ? true : undefined} className="marquee-item">
                  <UniCrest name={l.name} />
                  <span className="mt-2 block text-center text-xs font-semibold leading-snug">{l.name}</span>
                  <span className="block text-center text-[11px] text-muted">{l.countryName}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Reduced motion: a plain grid with every logo, no movement */}
      <ul className="marquee-static mx-auto max-w-[1200px] grid-cols-2 gap-3 px-4 sm:grid-cols-3 md:px-6 lg:grid-cols-4 xl:px-8">
        {logos.map((l) => (
          <li key={l.name} className="marquee-item !w-auto">
            <UniCrest name={l.name} />
            <span className="mt-2 block text-center text-xs font-semibold leading-snug">{l.name}</span>
            <span className="block text-center text-[11px] text-muted">{l.countryName}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
