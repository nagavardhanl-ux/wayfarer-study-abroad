"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

/** Branch cities and destination cities (map positions only, used to draw the routes). */
const ORIGIN: [number, number] = [12.9716, 77.5946]; // Bengaluru
const BRANCHES: [number, number][] = [ORIGIN, [13.0827, 80.2707], [18.5204, 73.8567], [9.9312, 76.2673]]; // + Chennai, Pune, Kochi
export const GLOBE_DESTINATIONS: { slug: string; name: string; at: [number, number] }[] = [
  { slug: "usa", name: "USA", at: [40.71, -74.0] },
  { slug: "uk", name: "UK", at: [51.5, -0.13] },
  { slug: "canada", name: "Canada", at: [43.65, -79.38] },
  { slug: "australia", name: "Australia", at: [-33.87, 151.21] },
  { slug: "ireland", name: "Ireland", at: [53.35, -6.26] },
  { slug: "germany", name: "Germany", at: [52.52, 13.4] },
  { slug: "new-zealand", name: "New Zealand", at: [-36.85, 174.76] },
  { slug: "malta", name: "Malta", at: [35.9, 14.51] },
  { slug: "dubai", name: "Dubai", at: [25.2, 55.27] },
  { slug: "singapore", name: "Singapore", at: [1.35, 103.82] },
];

const ORANGE: [number, number, number] = [0.91, 0.5, 0.16];
const ORANGE_HOT: [number, number, number] = [1, 0.72, 0.4];

/** Rotation that faces a lat/long towards the viewer. */
function anglesFor([lat, lng]: [number, number]) {
  return { phi: Math.PI - ((lng * Math.PI) / 180 - Math.PI / 2), theta: (lat * Math.PI) / 180 * 0.6 };
}

/**
 * Night-side globe with orange flight routes from Bengaluru, Chennai, Pune and Kochi to each destination.
 * Loads after the page is interactive, pauses when off screen, and stays still for reduced-motion users.
 * Hover or focus a destination chip to turn the globe towards it.
 */
export function FlightGlobe() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<string | null>(null);
  const activeRef = useRef<string | null>(null);
  const [ready, setReady] = useState(false);
  activeRef.current = active;

  useEffect(() => {
    let globe: { update: (s: Record<string, unknown>) => void; destroy: () => void } | null = null;
    let raf = 0;
    let visible = true;
    let cancelled = false;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const start = anglesFor(ORIGIN);
    let phi = start.phi - 0.6;
    let theta = 0.25;
    let lastActive: string | null = null;

    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting), { threshold: 0 });
    if (wrapRef.current) io.observe(wrapRef.current);

    const boot = async () => {
      const { default: createGlobe } = await import("cobe");
      if (cancelled || !canvasRef.current) return;
      const canvas = canvasRef.current;
      const size = canvas.offsetWidth;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      globe = createGlobe(canvas, {
        devicePixelRatio: dpr,
        width: size * dpr,
        height: size * dpr,
        phi,
        theta,
        dark: 1,
        diffuse: 1.2,
        mapSamples: size < 400 ? 7000 : 12000,
        mapBrightness: 5,
        mapBaseBrightness: 0.04,
        baseColor: [0.16, 0.26, 0.42],
        markerColor: ORANGE,
        glowColor: [0.2, 0.34, 0.55],
        scale: 1,
        markers: [
          ...BRANCHES.map((b) => ({ location: b, size: 0.07, color: [1, 1, 1] as [number, number, number] })),
          ...GLOBE_DESTINATIONS.map((d) => ({ location: d.at, size: 0.05 })),
        ],
        arcs: GLOBE_DESTINATIONS.map((d) => ({ from: ORIGIN, to: d.at })),
        arcColor: ORANGE,
        arcWidth: 0.6,
        arcHeight: 0.35,
        markerElevation: 0.01,
      }) as unknown as typeof globe;
      setReady(true);

      const tick = () => {
        if (visible && globe) {
          const target = activeRef.current ? GLOBE_DESTINATIONS.find((d) => d.slug === activeRef.current) : null;
          if (target) {
            const a = anglesFor(target.at);
            // shortest way round
            let dPhi = (a.phi - phi) % (Math.PI * 2);
            if (dPhi > Math.PI) dPhi -= Math.PI * 2;
            if (dPhi < -Math.PI) dPhi += Math.PI * 2;
            phi += dPhi * 0.08;
            theta += (a.theta - theta) * 0.08;
          } else if (!reduce) {
            phi += 0.0025;
            theta += (0.25 - theta) * 0.02;
          }
          // Rebuild arcs only when the highlighted destination changes; otherwise just rotate.
          if (lastActive !== activeRef.current) {
            lastActive = activeRef.current;
            globe.update({
              phi,
              theta,
              arcs: GLOBE_DESTINATIONS.map((d) => ({ from: ORIGIN, to: d.at, color: d.slug === lastActive ? ORANGE_HOT : ORANGE })),
            });
          } else {
            globe.update({ phi, theta });
          }
        }
        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    };

    // Desktop: start once the page is idle. Phones and tablets: start on the first scroll, tap or key press,
    // so the WebGL work never competes with the first paint on a budget phone.
    const kick = () => {
      events.forEach((e) => window.removeEventListener(e, kick));
      void boot();
    };
    const events = ["pointerdown", "touchstart", "scroll", "keydown", "wheel"] as const;
    if (window.matchMedia("(min-width: 1024px)").matches) {
      const idle = (window as unknown as { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number }).requestIdleCallback;
      if (idle) idle(() => void boot(), { timeout: 2500 });
      else setTimeout(() => void boot(), 800);
    } else {
      events.forEach((e) => window.addEventListener(e, kick, { once: true, passive: true }));
    }

    return () => {
      events.forEach((e) => window.removeEventListener(e, kick));
      cancelled = true;
      cancelAnimationFrame(raf);
      io.disconnect();
      globe?.destroy();
    };
  }, []);

  return (
    <div ref={wrapRef} className="relative mx-auto w-full max-w-[520px]">
      <div className="relative aspect-square w-full">
        <div aria-hidden className="absolute inset-[8%] rounded-full bg-[radial-gradient(circle_at_50%_50%,rgba(232,128,41,0.18),transparent_65%)] blur-2xl" />
        {!ready ? (
          <div
            aria-hidden
            className="absolute inset-[6%] rounded-full shadow-[0_0_80px_-10px_rgba(80,140,220,0.45)]"
            style={{
              background:
                "radial-gradient(circle at 35% 30%, rgba(80,130,200,0.35), rgba(10,26,47,0.95) 60%), radial-gradient(rgba(150,190,240,0.35) 1px, transparent 1.4px) 0 0 / 10px 10px",
            }}
          />
        ) : null}
        <canvas
          ref={canvasRef}
          className={`relative h-full w-full transition-opacity duration-700 ${ready ? "opacity-100" : "opacity-0"}`}
          role="img"
          aria-label="Globe showing flight routes from Bengaluru, Chennai, Pune and Kochi to study destinations"
        />
      </div>
      <ul className="mt-2 flex flex-wrap justify-center gap-2" aria-label="Destinations">
        {GLOBE_DESTINATIONS.map((d) => (
          <li key={d.slug}>
            <Link
              href={`/study-in-${d.slug}/`}
              onMouseEnter={() => setActive(d.slug)}
              onMouseLeave={() => setActive(null)}
              onFocus={() => setActive(d.slug)}
              onBlur={() => setActive(null)}
              className={`inline-flex min-h-9 items-center rounded-full border px-3 text-sm font-semibold transition-colors ${
                active === d.slug ? "border-orange bg-orange text-ink" : "border-white/25 text-on-navy hover:border-orange-light"
              }`}
            >
              {d.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
