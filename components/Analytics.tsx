"use client";

import Script from "next/script";
import { useEffect } from "react";
import { captureUtm, track } from "@/lib/analytics";

/**
 * Loads GA4 (only if NEXT_PUBLIC_GA_ID is set), captures UTM parameters on the first visit,
 * and reports clicks on any element carrying data-track="call" or data-track="whatsapp".
 */
export function Analytics() {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  useEffect(() => {
    captureUtm();
    const onClick = (e: MouseEvent) => {
      const el = (e.target as HTMLElement | null)?.closest<HTMLElement>("[data-track]");
      if (!el) return;
      const kind = el.dataset.track;
      const branch = el.dataset.branch || "unknown";
      const location = el.dataset.location || window.location.pathname;
      if (kind === "call") track("call_click", { branch, location });
      if (kind === "whatsapp") track("whatsapp_click", { branch, location });
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  if (!gaId) return null;
  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="lazyOnload" />
      <Script id="ga4" strategy="lazyOnload">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;gtag('js',new Date());gtag('config','${gaId}');`}
      </Script>
    </>
  );
}
