#!/usr/bin/env node
/**
 * Static export: writes the whole site as plain HTML/CSS/JS to /dist for any static host
 * (Netlify, GitHub Pages, S3, nginx). Run: npm run build:static
 *
 * A static host has no server, so /api/lead is set aside for the build (and always restored),
 * and the profile check runs in demo mode (shows the confirmation, sends nothing).
 */
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const api = path.join(root, "app", "api");
const hold = path.join(root, ".api-hold");
const nextBin = path.join(root, "node_modules", "next", "dist", "bin", "next");

const check = spawnSync(process.execPath, [path.join(root, "scripts", "check-content.mjs")], { stdio: "inherit" });
if (check.status !== 0) process.exit(check.status ?? 1);
// Route types (PageProps etc.) are generated, not committed; create them before the typecheck.
const typegen = spawnSync(process.execPath, [nextBin, "typegen", root], { stdio: "inherit" });
if (typegen.status !== 0) process.exit(typegen.status ?? 1);
const tsc = spawnSync(process.execPath, [path.join(root, "node_modules", "typescript", "bin", "tsc"), "--noEmit", "-p", root], { stdio: "inherit" });
if (tsc.status !== 0) process.exit(tsc.status ?? 1);

if (fs.existsSync(hold)) {
  console.error("✖ .api-hold exists from an interrupted build. Move it back to app/api, then run again.");
  process.exit(1);
}

fs.rmSync(path.join(root, "dist"), { recursive: true, force: true });
fs.renameSync(api, hold);
let status = 1;
try {
  const r = spawnSync(process.execPath, [nextBin, "build", root], {
    stdio: "inherit",
    env: { ...process.env, STATIC_EXPORT: "1", NEXT_PUBLIC_DEMO_LEADS: "1" },
  });
  status = r.status ?? 1;
} finally {
  fs.renameSync(hold, api);
}

if (status === 0) {
  // Static hosts pick the content type from the file extension. Next writes social cards as
  // extension-less "opengraph-image" files, so copy each to .png and point the meta tags at it.
  const dist = path.join(root, "dist");
  const walk = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)]));
  const files = walk(dist);
  for (const f of files) if (path.basename(f) === "opengraph-image") fs.copyFileSync(f, `${f}.png`);
  for (const f of files.filter((x) => x.endsWith(".html"))) {
    const html = fs.readFileSync(f, "utf8");
    const out = html.replace(/(\/opengraph-image)(\?[0-9a-f]+)?"/g, '$1.png$2"');
    if (out !== html) fs.writeFileSync(f, out);
  }
  const count = (dir) => fs.readdirSync(dir, { withFileTypes: true }).reduce((n, e) => n + (e.isDirectory() ? count(path.join(dir, e.name)) : e.name.endsWith(".html") ? 1 : 0), 0);
  console.log(`\n✔ Static site written to dist/ (${count(path.join(root, "dist"))} HTML pages)`);
}
process.exit(status);
