import { z } from "zod";
import profileEvaluation from "@/content/services/profile-evaluation.json";
import sopWriting from "@/content/services/sop-writing.json";
import educationLoans from "@/content/services/education-loans.json";
import studentAccommodation from "@/content/services/student-accommodation.json";
import scholarships from "@/content/services/scholarships.json";
import visaAssistance from "@/content/services/visa-assistance.json";
import immigration from "@/content/services/immigration.json";
import visitVisas from "@/content/services/visit-visas.json";

const url = z.string().regex(/^https?:\/\//);
const date = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);

const Service = z.object({
  slug: z.string(),
  path: z.string().startsWith("/").endsWith("/"),
  name: z.string(),
  short: z.string(),
  meta: z.object({ title: z.string(), description: z.string() }),
  h1: z.string(),
  intro: z.string(),
  covers: z.array(z.string()),
  whoFor: z.array(z.string()),
  steps: z.array(z.object({ title: z.string(), text: z.string() })),
  sections: z.array(
    z.object({
      id: z.string().optional(),
      heading: z.string(),
      paragraphs: z.array(z.string()).optional(),
      bullets: z.array(z.string()).optional(),
      facts: z.array(z.object({ label: z.string(), text: z.string(), source: url, lastVerified: date })).optional(),
      countryScholarships: z.boolean().optional(),
    }),
  ),
  tools: z.array(z.object({ label: z.string(), href: z.string() })),
  videoId: z.string(),
  faq: z.array(z.object({ q: z.string(), a: z.string() })),
});
export type Service = z.infer<typeof Service>;

const files: Record<string, unknown> = {
  "profile-evaluation": profileEvaluation,
  "sop-writing": sopWriting,
  "education-loans": educationLoans,
  "student-accommodation": studentAccommodation,
  scholarships,
  "visa-assistance": visaAssistance,
  immigration,
  "visit-visas": visitVisas,
};

const services: Record<string, Service> = Object.fromEntries(
  Object.entries(files).map(([k, v]) => {
    const r = Service.safeParse(v);
    if (!r.success) throw new Error(`Invalid content/services/${k}.json: ${r.error.issues.map((i) => `${i.path.join(".")} ${i.message}`).join("; ")}`);
    return [k, r.data];
  }),
);

export const STUDENT_SERVICES = ["profile-evaluation", "sop-writing", "education-loans", "scholarships", "visa-assistance", "student-accommodation"];

export function getService(slug: string): Service {
  const s = services[slug];
  if (!s) throw new Error(`Unknown service ${slug}`);
  return s;
}
