#!/usr/bin/env node
/** Writes content-gaps.md: every empty country fact, unconfirmed data and sample entry still to replace. Run: npm run gaps */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (p) => JSON.parse(fs.readFileSync(path.join(root, p), "utf8"));
const out = [];
const today = new Date().toISOString().slice(0, 10);

out.push("# Content gaps", "");
out.push(`Generated ${today} by \`npm run gaps\`. Empty fields are hidden on the site; nothing is guessed. Fill a field only from an official government or university source, and add its \`source\` URL and \`lastVerified\` date.`, "");

/* Countries */
out.push("## 1. Country facts with no verified source yet", "");
out.push("File: `content/countries/<country>.json`. The block is hidden on the page until the field is filled.", "");
const LABELS = {
  "costs.tuition.ug": "Tuition, bachelor's (cost calculator needs tuition and living costs)",
  "costs.tuition.pg": "Tuition, master's",
  "costs.living": "Living costs",
  "costs.visaFunds": "Money to show for the visa",
  intakes: "Intakes and deadlines (also used by the intake tracker)",
  "requirements.ug.academics": "Entry requirement: academics, bachelor's",
  "requirements.ug.english": "Entry requirement: English, bachelor's",
  "requirements.ug.tests": "Entry requirement: standardised tests (SAT etc.), bachelor's",
  "requirements.pg.academics": "Entry requirement: academics, master's",
  "requirements.pg.english": "Entry requirement: English, master's",
  "requirements.pg.tests": "Entry requirement: standardised tests (GRE/GMAT), master's",
  englishMinimum: "Numeric English minimum (used by the eligibility check)",
  "workRights.duringStudy": "Work rights while studying",
  "workRights.afterStudy": "Post-study work rights",
  pr: "PR pathway",
};
const get = (o, k) => k.split(".").reduce((a, x) => (a == null ? a : a[x]), o);
const countryDir = path.join(root, "content/countries");
for (const f of fs.readdirSync(countryDir).filter((x) => x.endsWith(".json")).sort()) {
  const c = read(`content/countries/${f}`);
  const missing = Object.keys(LABELS).filter((k) => get(c, k) == null);
  const extra = [];
  if (!c.scholarships?.length) extra.push("Scholarships list is empty");
  if (!c.whyReasons?.length) extra.push("No sourced 'why students choose' reasons");
  if (missing.length || extra.length) {
    out.push(`### ${c.name} (\`${f}\`)`, "");
    for (const k of missing) out.push(`- [ ] ${LABELS[k]} (\`${k}\`)`);
    for (const e of extra) out.push(`- [ ] ${e}`);
    out.push("");
  }
}

/* Sample entries */
out.push("## 2. Sample entries to replace", "");
out.push("The production build fails while any of these remain. Each shows a SAMPLE badge in development.", "");
for (const [file, key, label] of [
  ["data/testimonials.json", "testimonials", (x) => `${x.id}: student story (${x.country}, ${x.intake})`],
  ["data/reviews.json", "branches", (x) => `${x.branch}: Google rating, review count, reviews link, 3 reviews`],
  ["data/team.json", "team", (x) => `${x.id}: counsellor for ${x.branch}`],
]) {
  const rows = read(file)[key].filter((x) => x.sample);
  if (rows.length) {
    out.push(`**\`${file}\`**`, "");
    rows.forEach((x) => out.push(`- [ ] ${label(x)}`));
    out.push("");
  }
}

/* Universities */
const unis = read("data/universities.json").universities.filter((u) => !u.confirmed);
if (unis.length) {
  out.push("## 3. University relationships to confirm", "");
  out.push("Set `confirmed: true` in `data/universities.json` once a relationship is checked in writing.", "");
  unis.forEach((u) => out.push(`- [ ] ${u.name} (${u.country})`));
  out.push("");
}

/* Branches */
const branches = read("data/branches.json").branches;
const bGaps = branches.flatMap((b) => [
  ...(b.hours.length ? [] : [`${b.name}: opening hours (\`hours\`)`]),
  ...(b.googleBusinessUrl ? [] : [`${b.name}: Google Business Profile link (\`googleBusinessUrl\`)`]),
]);
const photoDir = path.join(root, "public/images/branches");
for (const b of branches) {
  const d = path.join(photoDir, b.slug);
  const n = fs.existsSync(d) ? fs.readdirSync(d).filter((x) => /\.(jpe?g|png|webp|avif)$/i.test(x)).length : 0;
  if (!n) bGaps.push(`${b.name}: office photos in \`public/images/branches/${b.slug}/\``);
}
if (bGaps.length) {
  out.push("## 4. Branch details", "");
  bGaps.forEach((g) => out.push(`- [ ] ${g}`));
  out.push("");
}

/* Coaching */
const tests = read("content/coaching/tests.json");
out.push("## 5. Other items for the Wayfarer team", "");
if (!tests.batches.confirmed) out.push("- [ ] Coaching batch options (online and branch): confirm which branches run classroom batches, then set `batches.confirmed` to true in `content/coaching/tests.json`.");
for (const t of tests.tests.filter((x) => !x.scoreBands.length)) out.push(`- [ ] ${t.name}: no official score bands added yet (universities set their own).`);
out.push(
  "- [ ] Replace the fictional brand, phone numbers (+91 98765 432xx) and addresses in `lib/brand.ts` and `data/branches.json` before any real use.",
  "- [ ] Add YouTube videos to `data/videos.json` and social profile URLs to `SOCIAL` in `lib/site.ts`; those sections stay hidden until then.",
  "- [ ] Have a lawyer review `content/pages/privacy-policy.mdx` and `content/pages/terms.mdx` (DPDP Act, retention period, grievance contact).",
  "- [ ] Add a grievance officer name and email to the privacy policy.",
  "- [ ] Add `LEAD_WEBHOOK_URL` and `NEXT_PUBLIC_GA_ID` in Vercel (see README).",
  "",
);

fs.writeFileSync(path.join(root, "content-gaps.md"), out.join("\n"));
console.log(`Wrote content-gaps.md`);
