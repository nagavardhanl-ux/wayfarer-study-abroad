"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Muted, looping background video for the home hero.
 * It starts loading only after the page is idle, so text and buttons load first.
 * Plays on screens 768 px and wider only; phones keep the static night background (lighter on data and battery).
 * Skipped on Data Saver and slow (2G/3G) connections, and for reduced-motion users.
 */
export function HeroVideo() {
  const ref = useRef<HTMLVideoElement>(null);
  const [src, setSrc] = useState<string | null>(null);

  useEffect(() => {
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
    if (conn?.saveData || (conn?.effectiveType && /(^|-)(2g|3g)$/.test(conn.effectiveType))) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(min-width: 768px)").matches) return;
    const pick = () => setSrc("/video/hero-1280.mp4");
    const idle = (window as unknown as { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number }).requestIdleCallback;
    const start = () => (idle ? idle(pick, { timeout: 3000 }) : setTimeout(pick, 1500));
    if (document.readyState === "complete") start();
    else window.addEventListener("load", start, { once: true });
  }, []);

  useEffect(() => {
    if (src) ref.current?.play().catch(() => {});
  }, [src]);

  if (!src) return null;
  return (
    <video
      ref={ref}
      className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-1000"
      onPlaying={(e) => e.currentTarget.classList.replace("opacity-0", "opacity-100")}
      src={src}
      autoPlay
      muted
      loop
      playsInline
      aria-hidden
      tabIndex={-1}
    />
  );
}
