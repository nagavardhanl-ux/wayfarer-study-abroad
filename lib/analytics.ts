"use client";

/**
 * GA4 events listed in the brief. All calls are no-ops when NEXT_PUBLIC_GA_ID is not set.
 * profile_check_start, profile_check_step, lead_submit, whatsapp_click, call_click, tool_used
 */
type EventName = "profile_check_start" | "profile_check_step" | "lead_submit" | "whatsapp_click" | "call_click" | "tool_used";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export function track(name: EventName, params: Record<string, string | number | boolean | undefined> = {}) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag("event", name, params);
}

/* ---------- UTM capture: first visit in the session wins ---------- */

const UTM_KEY = "xv-utm";
const UTM_FIELDS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "gclid", "fbclid"] as const;
export type Utm = Partial<Record<(typeof UTM_FIELDS)[number] | "landing_page" | "referrer", string>>;

export function captureUtm() {
  try {
    if (sessionStorage.getItem(UTM_KEY)) return;
    const params = new URLSearchParams(window.location.search);
    const utm: Utm = {};
    for (const f of UTM_FIELDS) {
      const v = params.get(f);
      if (v) utm[f] = v.slice(0, 200);
    }
    utm.landing_page = window.location.pathname;
    if (document.referrer && !document.referrer.startsWith(window.location.origin)) utm.referrer = document.referrer.slice(0, 300);
    sessionStorage.setItem(UTM_KEY, JSON.stringify(utm));
  } catch {
    /* storage blocked: skip */
  }
}

export function readUtm(): Utm {
  try {
    return JSON.parse(sessionStorage.getItem(UTM_KEY) || "{}") as Utm;
  } catch {
    return {};
  }
}
