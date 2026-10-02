#!/usr/bin/env node
/**
 * Runs before every `npm run build`.
 * 1. Fails if any "sample": true entry remains in /data (production only, see below).
 * 2. Fails if site copy contains an em dash, banned marketing words, "100%", or links to the old broken domains.
 *
 * Sample entries are allowed only for preview builds: set NEXT_PUBLIC_SAMPLE_BUILD=1 (never on the production deployment).
 */
import fs from "node:fs";
import path from "node:path";

import { fileURLToPath } from "node:url";
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const errors = [];
const warnings = [];

function walk(dir, exts, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name === "node_modules" || e.name.startsWith(".")) continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, exts, out);
    else if (exts.some((x) => e.name.endsWith(x))) out.push(p);
  }
  return out;
}

/* 1. Sample entries */
const samples = [];
for (const f of walk(path.join(root, "data"), [".json"])) {
  const json = JSON.parse(fs.readFileSync(f, "utf8"));
  const visit = (node, trail) => {
    if (Array.isArray(node)) node.forEach((n, i) => visit(n, `${trail}[${i}]`));
    else if (node && typeof node === "object") {
      if (node.sample === true) samples.push(`${path.relative(root, f)} ${trail} ${node.id ?? node.branch ?? node.firstName ?? ""}`.trim());
      for (const [k, v] of Object.entries(node)) visit(v, `${trail}.${k}`);
    }
  };
  visit(json, "");
}
const sampleAllowed = process.env.NEXT_PUBLIC_SAMPLE_BUILD === "1" && process.env.VERCEL_ENV !== "production";
if (samples.length) {
  const msg = `${samples.length} sample entries still in /data:\n  ${samples.join("\n  ")}`;
  if (sampleAllowed) warnings.push(`${msg}\n  (allowed because NEXT_PUBLIC_SAMPLE_BUILD=1; this build must not go to production)`);
  else errors.push(`${msg}\n  Replace them with real entries before a production build. See README.md.`);
}

/* 2. Copy rules */
const RULES = [
  { re: /—/, why: "em dash (rewrite the sentence)" },
  { re: /\b(unlock|embark|seamless(ly)?|world-class|dream (destination|awaits))\b/i, why: "banned marketing word" },
  { re: /100\s?%(?!["'])/, why: '"100%" claim' }, // ignores CSS values like width: "100%"
  { re: /guaranteed (visa|admission|pr)\b/i, why: "guarantee wording" },
  { re: /hindsofarepair\.shop|wpmet\.com/i, why: "link to an old broken domain" },
  { re: /Wayfarer['’]s\b/, why: '"Wayfarer\'s" (brand is always "Wayfarer")' },
  { re: /\b(decades of experience|over 10 years|20\+ years|since 2010|since 2015)\b/i, why: 'experience claim other than "Since 2011"' },
];
const files = [
  ...walk(path.join(root, "content"), [".json", ".mdx", ".md"]),
  ...walk(path.join(root, "data"), [".json"]).filter((f) => !f.endsWith("videos.json")), // video titles are YouTube's, filtered at render
  ...walk(path.join(root, "app"), [".tsx", ".ts"]),
  ...walk(path.join(root, "components"), [".tsx", ".ts"]),
];
for (const f of files) {
  const lines = fs.readFileSync(f, "utf8").split(/\r?\n/);
  lines.forEach((line, i) => {
    if (line.includes("check-content: ignore")) return;
    for (const r of RULES) if (r.re.test(line)) errors.push(`${path.relative(root, f)}:${i + 1}  ${r.why}\n    ${line.trim().slice(0, 140)}`);
  });
}

for (const w of warnings) console.warn(`⚠ ${w}\n`);
if (errors.length) {
  console.error(`✖ Content check failed (${errors.length}):\n\n${errors.join("\n\n")}\n`);
  process.exit(1);
}
console.log("✔ Content check passed");
