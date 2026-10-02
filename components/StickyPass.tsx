"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { CloseIcon, PlaneIcon } from "./Icons";

type Dest = { slug: string; name: string; code: string };
type Branch = { slug: string; city: string; cityCode: string; name: string };

export const LAST_COUNTRY_KEY = "xv-last-country";
const DISMISS_KEY = "xv-pass-dismissed";

function read<T>(key: string): T | null {
  try {
    const v = sessionStorage.getItem(key);
    return v ? (JSON.parse(v) as T) : null;
  } catch {
    return null;
  }
}

/**
 * Desktop-only boarding pass docked bottom-right. It fills in from what the visitor has done:
 * the last country page visited and any profile-check answers. One click continues the profile check.
 */
export function StickyPass({ destinations, branches }: { destinations: Dest[]; branches: Branch[] }) {
  const pathname = usePathname();
  const [show, setShow] = useState(false);
  const [dismissed, setDismissed] = useState(true);
  const [to, setTo] = useState<Dest | null>(null);
  const [from, setFrom] = useState<Branch | null>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    setDismissed(!!read<boolean>(DISMISS_KEY));
    const answers = read<{ country?: string; branch?: string }>("xv-profile-check");
    const last = read<string>(LAST_COUNTRY_KEY);
    const slug = answers?.country || last;
    setTo(destinations.find((d) => d.slug === slug) ?? null);
    setFrom(branches.find((b) => b.slug === answers?.branch) ?? null);
    setStarted(!!answers && Object.values(answers).some(Boolean));
  }, [pathname, destinations, branches]);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (dismissed || pathname?.startsWith("/free-profile-check")) return null;

  const href = `/free-profile-check/${to ? `?country=${to.slug}` : ""}`;
  return (
    <aside
      aria-label="Your boarding pass"
      className={`on-navy fixed bottom-5 right-5 z-40 hidden w-[360px] overflow-hidden rounded-[14px] border border-white/15 bg-night text-on-navy shadow-[0_24px_60px_-20px_rgba(0,0,0,0.6)] transition-[opacity,transform] duration-300 lg:block ${
        show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-6 opacity-0"
      }`}
    >
      <button
        type="button"
        onClick={() => {
          setDismissed(true);
          try {
            sessionStorage.setItem(DISMISS_KEY, "true");
          } catch {}
        }}
        className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full text-on-navy-muted hover:text-on-navy"
        aria-label="Hide boarding pass"
      >
        <CloseIcon className="h-4 w-4" />
      </button>
      <div className="px-4 pb-3 pt-3">
        <p className="data-label text-orange-light">Boarding pass</p>
        <div className="mt-2 flex items-end justify-between gap-2">
          <div className="min-w-0">
            <p className="data-label text-on-navy-muted">From</p>
            <p className="pass-value truncate text-xl">{from ? from.city : "Your city"}</p>
          </div>
          <div className="relative mx-2 mb-2 h-5 flex-1" aria-hidden>
            <div className="absolute inset-x-0 top-1/2 border-t-2 border-dashed border-white/30" />
            <span className="absolute top-1/2 -translate-y-1/2" style={{ left: to ? (started ? "70%" : "40%") : "8%" }}>
              <PlaneIcon className="h-5 w-5" />
            </span>
          </div>
          <div className="min-w-0 text-right">
            <p className="data-label text-on-navy-muted">To</p>
            <p className="pass-value truncate text-xl">{to ? to.name : "Anywhere"}</p>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between gap-3 border-t-2 border-dashed border-white/15 bg-white/5 px-4 py-3">
        <p className="text-xs text-on-navy-muted">{started ? "Your answers are saved for this visit." : "Seven questions, about two minutes."}</p>
        <Link href={href} className="btn btn-primary !min-h-10 shrink-0 !px-3 text-sm">
          {started ? "Continue check" : "Start free check"}
        </Link>
      </div>
    </aside>
  );
}

/** Drop on a country page to remember it for the boarding pass. */
export function RememberCountry({ slug }: { slug: string }) {
  useEffect(() => {
    try {
      sessionStorage.setItem(LAST_COUNTRY_KEY, JSON.stringify(slug));
    } catch {}
  }, [slug]);
  return null;
}
