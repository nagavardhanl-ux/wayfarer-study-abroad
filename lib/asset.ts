/**
 * Sub-path the site is served from, e.g. "/wayfarer-study-abroad" on GitHub Pages project sites.
 * Empty everywhere else. Set NEXT_PUBLIC_BASE_PATH at build time (the Pages workflow does this).
 */
export const BASE_PATH = (process.env.NEXT_PUBLIC_BASE_PATH ?? "").replace(/\/$/, "");

/** Prefixes a /public file path with the base path. next/link and next/image handle this themselves. */
export function asset(path: string) {
  return path.startsWith("/") ? `${BASE_PATH}${path}` : path;
}
