# Wayfarer website

> **Portfolio project.** Wayfarer Overseas Education is a fictional study-abroad consultancy. The brand, branches, addresses and phone numbers (+91 98765 432xx) are placeholders; brand constants live in `lib/brand.ts`. Country facts (costs, intakes, work rights) are real and link to official sources.

Next.js 16 (App Router) + TypeScript + Tailwind CSS 4. Every page is pre-rendered as static HTML. One API route (`/api/lead`) sends profile-check leads to a Google Sheet. Deploys to Vercel.

All editable text, facts, people and photos live in **`/content`**, **`/data`** and **`/public/images`**. You never need to touch `/app` or `/components` to change content.

---

## Quick start

```bash
npm install
cp .env.example .env.local   # then fill in the values
npm run dev                  # http://localhost:3000
```

| Command | What it does |
|---|---|
| `npm run dev` | Local site with live reload |
| `npm run build` | Production build. Runs the content check first and **fails if any `"sample": true` entry remains** |
| `npm run check:content` | Only the content check (samples, em dashes, banned words, old domains) |
| `npm run gaps` | Rewrites `content-gaps.md` with every missing fact and sample entry |
| `npm run check:links` | Crawls a running site and reports broken links (see QA below) |

---

## Where everything lives

| What | File |
|---|---|
| Branches: names, phones, WhatsApp, addresses, map, landmarks, hours | `data/branches.json` |
| Student stories (testimonials) | `data/testimonials.json` + photos in `public/images/students/` |
| Google rating and reviews per branch | `data/reviews.json` |
| Counsellors | `data/team.json` + photos in `public/images/team/` |
| Branch office photos | `public/images/branches/<branch>/` (any .jpg/.png/.webp appears automatically) |
| YouTube videos (empty: video sections stay hidden until you add some) | `data/videos.json` |
| Universities shown on the home and country pages (monogram tiles, no logo files) | `data/universities.json` |
| Exchange rates for rupee conversion | `data/exchange-rates.json` |
| Country pages (costs, intakes, requirements, work rights, FAQ) | `content/countries/<country>.json` |
| MBBS abroad page | `content/mbbs.json` |
| Coaching test pages | `content/coaching/tests.json` |
| Service, immigration and visit visa pages | `content/services/<page>.json` |
| For Parents, About, Privacy, Terms | `content/pages/*.mdx` |
| Blog posts | `content/blog/*.mdx` |

JSON files must stay valid JSON (commas, double quotes). If a field is wrong, the build stops and names the file and field.

### Copy rules (checked automatically)

- No em dashes (—). Rewrite the sentence instead.
- No "100%", no guaranteed visas/admissions/PR, no "unlock", "embark", "seamless", "world-class".
- Experience is only "Since 2011".
- The brand is always "Wayfarer" (never "Wayfarer's" as a noun).
- Headings and buttons in sentence case. Buttons say what happens: "Call Pune branch", "Chat on WhatsApp".

---

## How to…

### Change a branch phone number

Open `data/branches.json`, find the branch, and change **all three** fields:

```json
"phone": "+919876543210",          // +91 then 10 digits, no spaces (used for call links)
"phoneDisplay": "+91 98765 43210", // how it is shown on the page
"whatsapp": "+919876543210",       // number that opens in WhatsApp
```

The number updates everywhere: mobile call bar, footer, branch page, contact page, profile check confirmation and the WhatsApp links.

Add opening hours when you have them:

```json
"hours": [{ "days": "Monday, Tuesday, Wednesday, Thursday, Friday, Saturday", "opens": "10:00", "closes": "19:00" }]
```

### Add a student story

1. Get the student's written permission to use their name, photo and visa.
2. Put the photo in `public/images/students/` (square, at least 400 px). Blur personal details on any visa image.
3. Add an entry to `data/testimonials.json`:

```json
{
  "id": "priya-2026-uk",
  "firstName": "Priya",
  "photo": "/images/students/priya.jpg",
  "university": "University of Essex",
  "country": "uk",
  "course": "MSc Data Science",
  "intake": "Sep 2026",
  "branch": "bengaluru",
  "quote": "In the student's own words.",
  "visaImage": "/images/students/priya-visa.jpg"
}
```

`country` must be a country file name (usa, uk, canada, australia, ireland, germany, new-zealand, malta, europe, dubai, singapore). Delete the sample entries once real ones exist. The first three stories appear on the home page.

### Replace Google ratings

In `data/reviews.json`, for each branch: copy the rating and review count from the branch's Google Business Profile, paste its reviews link into `reviewsUrl`, pick three reviews, and **delete the `"sample": true` line**.

### Add a counsellor

Add to `data/team.json` (photo in `public/images/team/`), and remove the sample entries.

### Add a blog post

Create `content/blog/my-post-slug.mdx`. The file name becomes the URL (`/my-post-slug/`).

```mdx
---
title: "Post title in sentence case"
description: "One or two sentences for Google."
date: "2026-11-01"
image: "/images/blog/my-post.jpg"
---

Write the post in Markdown. Use ## for headings.

<Source href="https://www.gov.uk/graduate-visa" checked="2026-11-01" />
```

Other components you can use inside any `.mdx` file: `<Video id="YOUTUBE_ID" />`, `<Callout>…</Callout>`, `<ButtonLink href="/free-profile-check/">Start free profile check</ButtonLink>`, `<BranchList />`, `<CountryCostTable />`.

### Update a country fact

Every fact in `content/countries/*.json` has a `source` (official URL) and `lastVerified` (date you checked). Change the value, then update both. **Never fill a field with a guess.** If you cannot verify it from a government or university website, leave it `null`; the block hides itself. Run `npm run gaps` to see what is still missing.

Costs use the country's currency. The site converts them to rupees using `data/exchange-rates.json`; update those rates every few weeks.

### Add a YouTube video

Add an entry at the top of `data/videos.json` with its `id`, `title`, `published` date, `tags` (country slugs or topics like `loans`, `mbbs`, `scams`), and `topicPage` (the page it should link to). The three newest `featurable` videos show on the home page; country pages show the newest video tagged with that country.

---

## Lead capture

The profile check posts to `/api/lead`, which validates the answers and forwards them as JSON to `LEAD_WEBHOOK_URL`. Set up the Google Sheet with `docs/lead-sheet-apps-script.gs` (instructions inside the file). Each lead includes all answers, the page URL, UTM tags captured on the first visit of the session, and timestamps.

If the webhook fails, the student sees an error with a button to send the same answers to the branch on WhatsApp, so the lead is not lost.

## Analytics

Set `NEXT_PUBLIC_GA_ID`. Events sent: `profile_check_start`, `profile_check_step`, `lead_submit`, `whatsapp_click` and `call_click` (with `branch`), `tool_used`.

## Deploying to Vercel

1. Import the repository in Vercel (framework: Next.js, no extra settings).
2. Add the environment variables from `.env.example` for **Production**.
3. For a **Preview** deployment while sample entries still exist, add `NEXT_PUBLIC_SAMPLE_BUILD=1` to the Preview environment only.
4. Point your domain at Vercel and set `NEXT_PUBLIC_SITE_URL` to it.

Common WordPress URLs (default pages, feeds, admin) are redirected with 301s in `next.config.ts`.
