import { z } from "zod";

/**
 * POST /api/lead
 * Validates a profile-check submission and forwards it as JSON to LEAD_WEBHOOK_URL
 * (a Google Apps Script web app that appends a row to the leads Google Sheet).
 */

const Body = z.object({
  answers: z.object({
    country: z.string().max(40),
    level: z.string().max(20),
    qualification: z.string().max(20),
    scoreType: z.enum(["percent", "cgpa"]),
    score: z.string().max(6),
    englishStatus: z.string().max(20),
    englishTest: z.string().max(20),
    englishScore: z.string().max(6),
    budget: z.string().max(20),
    branch: z.string().max(30),
    name: z.string().trim().min(2).max(80),
    phone: z.string().regex(/^[6-9]\d{9}$/),
    email: z.string().trim().max(120).regex(/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/),
    consent: z.literal(true),
  }),
  countryName: z.string().max(40).optional(),
  branchName: z.string().max(40).optional(),
  pageUrl: z.string().max(500),
  utm: z.record(z.string(), z.string().max(300)).optional(),
  clientTimestamp: z.string().max(40).optional(),
  company: z.string().max(200).optional(), // honeypot
});

export async function POST(request: Request) {
  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return Response.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = Body.safeParse(json);
  if (!parsed.success) {
    return Response.json({ ok: false, error: "Some answers are missing or invalid." }, { status: 422 });
  }
  const body = parsed.data;

  // Bots fill the hidden "company" field. Pretend success, store nothing.
  if (body.company) return Response.json({ ok: true });

  const lead = {
    timestamp: new Date().toISOString(),
    clientTimestamp: body.clientTimestamp ?? "",
    name: body.answers.name,
    phone: `+91${body.answers.phone}`,
    email: body.answers.email,
    destination: body.answers.country,
    destinationName: body.countryName ?? "",
    courseLevel: body.answers.level,
    qualification: body.answers.qualification,
    score: body.answers.score,
    scoreType: body.answers.scoreType,
    englishStatus: body.answers.englishStatus,
    englishTest: body.answers.englishTest,
    englishScore: body.answers.englishScore,
    budget: body.answers.budget,
    branch: body.answers.branch,
    branchName: body.branchName ?? "",
    consent: true,
    pageUrl: body.pageUrl,
    utm_source: body.utm?.utm_source ?? "",
    utm_medium: body.utm?.utm_medium ?? "",
    utm_campaign: body.utm?.utm_campaign ?? "",
    utm_term: body.utm?.utm_term ?? "",
    utm_content: body.utm?.utm_content ?? "",
    gclid: body.utm?.gclid ?? "",
    fbclid: body.utm?.fbclid ?? "",
    landingPage: body.utm?.landing_page ?? "",
    referrer: body.utm?.referrer ?? "",
  };

  const webhook = process.env.LEAD_WEBHOOK_URL;
  if (!webhook) {
    if (process.env.NODE_ENV !== "production") {
      console.info("[lead] LEAD_WEBHOOK_URL not set; lead not forwarded (dev only):", lead);
      return Response.json({ ok: true, forwarded: false });
    }
    console.error("[lead] LEAD_WEBHOOK_URL is not set in production");
    return Response.json({ ok: false, error: "Lead service is not configured." }, { status: 503 });
  }

  try {
    const res = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(lead),
      redirect: "follow", // Apps Script web apps answer with a redirect
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) throw new Error(`Webhook responded ${res.status}`);
  } catch (err) {
    console.error("[lead] forwarding failed", err);
    return Response.json({ ok: false, error: "Could not save your details." }, { status: 502 });
  }

  return Response.json({ ok: true, forwarded: true });
}
