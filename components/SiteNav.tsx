"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { NAV, NAV_SINGLE } from "@/lib/site";
import { ChevronDown, CloseIcon, MenuIcon } from "./Icons";

/** Desktop dropdown navigation (from 1024px). */
export function DesktopNav() {
  const [open, setOpen] = useState<string | null>(null);
  const ref = useRef<HTMLElement>(null);
  const pathname = usePathname();

  useEffect(() => setOpen(null), [pathname]);
  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(null);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(null);
    document.addEventListener("click", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("click", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <nav ref={ref} aria-label="Main" className="hidden xl:block">
      <ul className="flex items-center gap-1">
        {NAV.map((g) => {
          const id = `nav-${g.label.replace(/\s+/g, "-").toLowerCase()}`;
          const isOpen = open === g.label;
          return (
            <li key={g.label} className="relative">
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={id}
                onClick={() => setOpen(isOpen ? null : g.label)}
                className="flex min-h-12 items-center gap-1 whitespace-nowrap rounded-sm px-2.5 font-semibold text-ink hover:text-blue"
              >
                {g.label}
                <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
              </button>
              <div
                id={id}
                hidden={!isOpen}
                className="absolute left-0 top-full z-40 mt-1 w-72 rounded-sm border border-line bg-paper p-2 shadow-lg"
              >
                <ul className={g.links.length > 7 ? "grid grid-cols-2 gap-x-2" : ""}>
                  {g.links.map((l) => (
                    <li key={l.href}>
                      <Link href={l.href} className="block rounded-sm px-3 py-2 text-ink hover:bg-ground hover:text-blue">
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
                <Link href={g.href} className="mt-1 block border-t border-line px-3 pb-1 pt-2 text-sm font-semibold text-blue">
                  All {g.label.toLowerCase()}
                </Link>
              </div>
            </li>
          );
        })}
        {NAV_SINGLE.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="flex min-h-12 items-center whitespace-nowrap rounded-sm px-2.5 font-semibold text-ink hover:text-blue">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/** Mobile full-screen menu (below 1024px). */
export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const closeRef = useRef<HTMLButtonElement>(null);
  const openRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
      if (e.key === "Tab" && panelRef.current) {
        const f = panelRef.current.querySelectorAll<HTMLElement>("a, button");
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    const opener = openRef.current;
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
      opener?.focus();
    };
  }, [open]);

  return (
    <div className="xl:hidden">
      <button
        ref={openRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-expanded={open}
        aria-controls="mobile-menu"
        className="flex min-h-12 items-center gap-2 rounded-sm px-2 font-semibold text-ink"
      >
        <MenuIcon className="h-6 w-6" />
        Menu
      </button>
      {open ? (
        <div
          id="mobile-menu"
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
          className="fixed inset-0 z-50 overflow-y-auto bg-paper px-4 pb-24"
          style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}
        >
          <div className="flex h-16 items-center justify-between">
            <span className="font-display text-lg font-bold">Menu</span>
            <button ref={closeRef} type="button" onClick={() => setOpen(false)} className="flex min-h-12 items-center gap-2 rounded-sm px-2 font-semibold">
              <CloseIcon className="h-6 w-6" />
              Close
            </button>
          </div>
          <Link href="/free-profile-check/" className="btn btn-primary mb-6 w-full">
            Start free profile check
          </Link>
          <nav aria-label="Main">
            {NAV.map((g) => (
              <section key={g.label} className="border-t border-line py-4">
                <h2 className="mb-2">
                  <Link href={g.href} className="font-display text-xl font-bold text-ink">
                    {g.label}
                  </Link>
                </h2>
                <ul className="grid grid-cols-2 gap-x-3">
                  {g.links.map((l) => (
                    <li key={l.href}>
                      <Link href={l.href} className="flex min-h-11 items-center text-ink">
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
            <ul className="border-t border-line py-4">
              {[...NAV_SINGLE, { label: "Student stories", href: "/student-stories/" }, { label: "About us", href: "/about-us/" }, { label: "Blog", href: "/blog/" }, { label: "Contact", href: "/contact/" }].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="flex min-h-12 items-center font-display text-lg font-bold text-ink">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      ) : null}
    </div>
  );
}
