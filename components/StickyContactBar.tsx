"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { telHref, whatsappHref } from "@/lib/contact";
import { CloseIcon, PhoneIcon, WhatsAppIcon } from "./Icons";

type B = { slug: string; name: string; city: string; phone: string; phoneDisplay: string; whatsapp: string };

/**
 * Mobile-only bar: Call, WhatsApp, Free profile check.
 * Call and WhatsApp open a branch picker so the lead reaches the nearest branch.
 */
export function StickyContactBar({ branches }: { branches: B[] }) {
  const [sheet, setSheet] = useState<null | "call" | "whatsapp">(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!sheet) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setSheet(null);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [sheet]);

  return (
    <>
      <div
        className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-3 border-t border-line bg-paper lg:hidden"
        style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
      >
        <button type="button" onClick={() => setSheet("call")} className="flex h-16 flex-col items-center justify-center gap-0.5 text-sm font-semibold text-ink">
          <PhoneIcon className="h-5 w-5 text-blue" />
          Call
        </button>
        <button type="button" onClick={() => setSheet("whatsapp")} className="flex h-16 flex-col items-center justify-center gap-0.5 border-x border-line text-sm font-semibold text-ink">
          <WhatsAppIcon className="h-5 w-5 text-ok" />
          WhatsApp
        </button>
        <Link href="/free-profile-check/" className="flex h-16 flex-col items-center justify-center bg-orange px-2 text-center text-sm font-semibold leading-tight text-ink">
          Free profile check
        </Link>
      </div>

      {sheet ? (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-labelledby="branch-sheet-title">
          <button type="button" aria-label="Close" className="absolute inset-0 bg-ink/50" onClick={() => setSheet(null)} tabIndex={-1} />
          <div className="absolute inset-x-0 bottom-0 rounded-t-[10px] bg-paper px-4 pt-4" style={{ paddingBottom: "calc(16px + env(safe-area-inset-bottom, 0px))" }}>
            <div className="flex items-center justify-between">
              <h2 id="branch-sheet-title" className="font-display text-xl font-bold">
                {sheet === "call" ? "Call a branch" : "Chat with a branch on WhatsApp"}
              </h2>
              <button ref={closeRef} type="button" onClick={() => setSheet(null)} className="flex min-h-12 items-center gap-1 px-2 font-semibold">
                <CloseIcon className="h-5 w-5" />
                Close
              </button>
            </div>
            <ul className="mt-2 divide-y divide-line">
              {branches.map((b) => (
                <li key={b.slug}>
                  <a
                    href={sheet === "call" ? telHref(b.phone) : whatsappHref(b.whatsapp, "Hello Wayfarer, I would like to talk to a counsellor about studying abroad.")}
                    data-track={sheet}
                    data-branch={b.slug}
                    data-location="sticky-bar"
                    target={sheet === "whatsapp" ? "_blank" : undefined}
                    rel={sheet === "whatsapp" ? "noopener noreferrer" : undefined}
                    className="flex min-h-14 items-center justify-between gap-3 py-2"
                  >
                    <span>
                      <span className="block font-semibold">{b.name}</span>
                      <span className="block text-sm text-muted">{b.city}</span>
                    </span>
                    <span className="tabular font-semibold text-blue">{sheet === "call" ? b.phoneDisplay : "Open chat"}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : null}
    </>
  );
}
