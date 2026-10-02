#!/usr/bin/env node
/**
 * Crawls a running copy of the site and checks every link.
 *   npm run build && npm start            (in one terminal)
 *   npm run check:links -- http://localhost:3000 [--external]
 * Reports: broken internal links, references to bad domains, redirect URLs, and (with --external) broken external links.
 */
const base = (process.argv[2] || "http://localhost:3000").replace(/\/$/, "");
const checkExternal = process.argv.includes("--external");

const LEGACY = [
  "/register-now/", "/hello-world/", "/sample-page/", "/pricing/", "/europe-visit-visa/", "/canada-visit-visa/",
  "/australia-visit-visa/", "/usa-visit-visa/", "/uk-visit-visa/", "/category/uncategorized/", "/author/admin/",
  "/wp-sitemap.xml", "/register-now",
];

const seen = new Map(); // url -> status
const queue = ["/", ...LEGACY];
const broken = [];
const badDomains = [];
const external = new Map(); // url -> [pages]

async function get(url) {
  const res = await fetch(url, { redirect: "follow" });
  const type = res.headers.get("content-type") || "";
  return { status: res.status, finalUrl: res.url, body: type.includes("text/html") ? await res.text() : "" };
}

while (queue.length) {
  const path = queue.shift();
  if (seen.has(path)) continue;
  let r;
  try {
    r = await get(base + path);
  } catch (e) {
    seen.set(path, "ERR");
    broken.push(`${path} (fetch error ${e.message})`);
    continue;
  }
  seen.set(path, r.status);
  if (r.status >= 400) broken.push(`${path} → ${r.status}`);
  if (/hindsofarepair\.shop|wpmet\.com/i.test(r.body)) badDomains.push(path);
  const finalPath = new URL(r.finalUrl).pathname;
  if (!finalPath.startsWith("/_next") && r.body) {
    for (const m of r.body.matchAll(/(?:href|src)="([^"#]+)(#[^"]*)?"/g)) {
      const href = m[1].replace(/&amp;/g, "&");
      if (href.startsWith("http")) {
        if (href.startsWith("https://wayfarer.example")) continue; // canonical URLs on the placeholder domain
        if (!href.startsWith(base)) {
          if (!external.has(href)) external.set(href, new Set());
          external.get(href).add(finalPath);
          continue;
        }
      }
      if (/^(mailto|tel|data|javascript):/.test(href)) continue;
      const u = new URL(href, base + finalPath);
      if (u.origin !== new URL(base).origin) continue;
      if (u.pathname.startsWith("/_next/")) continue;
      const p = u.pathname + (u.pathname.match(/\.(xml|txt|png|jpe?g|webp|svg|ico|mp4|gif)$/) ? "" : "");
      if (!seen.has(p)) queue.push(p);
    }
  }
}

console.log(`Crawled ${seen.size} internal URLs on ${base}`);
console.log(`\nLegacy URLs:`);
for (const l of LEGACY) {
  const res = await fetch(base + l, { redirect: "manual" });
  const loc = res.headers.get("location");
  console.log(`  ${String(res.status).padEnd(4)} ${l}${loc ? `  →  ${loc}` : ""}`);
}

if (checkExternal) {
  console.log(`\nChecking ${external.size} external links…`);
  for (const [href, pages] of external) {
    if (/wa\.me|google\.com\/maps|youtube-nocookie|i\.ytimg\.com/.test(href)) continue;
    try {
      const res = await fetch(href, { method: "GET", redirect: "follow", headers: { "User-Agent": "Mozilla/5.0 Wayfarer link check" } });
      if (res.status >= 400 && ![403, 429].includes(res.status)) broken.push(`EXTERNAL ${href} → ${res.status} (on ${[...pages][0]})`);
      else if ([403, 429].includes(res.status)) console.log(`  ? ${res.status} ${href} (site blocks automated checks; verify by hand)`);
    } catch (e) {
      broken.push(`EXTERNAL ${href} → ${e.message}`);
    }
  }
}

console.log(`\nReferences to hindsofarepair.shop or wpmet.com: ${badDomains.length}${badDomains.length ? `\n  ${badDomains.join("\n  ")}` : ""}`);
console.log(`Broken links: ${broken.length}${broken.length ? `\n  ${broken.join("\n  ")}` : ""}`);
process.exit(broken.length || badDomains.length ? 1 : 0);
