/**
 * Typed loaders for everything in /content and /data.
 * Each file is validated with Zod at build time; a bad field fails the build with the file name.
 */
import { z } from "zod";

import branchesJson from "@/data/branches.json";
import universitiesJson from "@/data/universities.json";
import testimonialsJson from "@/data/testimonials.json";
import reviewsJson from "@/data/reviews.json";
import teamJson from "@/data/team.json";
import videosJson from "@/data/videos.json";
import ratesJson from "@/data/exchange-rates.json";
import testsJson from "@/content/coaching/tests.json";

import usa from "@/content/countries/usa.json";
import uk from "@/content/countries/uk.json";
import canada from "@/content/countries/canada.json";
import australia from "@/content/countries/australia.json";
import ireland from "@/content/countries/ireland.json";
import germany from "@/content/countries/germany.json";
import newZealand from "@/content/countries/new-zealand.json";
import malta from "@/content/countries/malta.json";
import europe from "@/content/countries/europe.json";
import dubai from "@/content/countries/dubai.json";
import singapore from "@/content/countries/singapore.json";

/* ---------- shared pieces ---------- */

const date = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD");
const url = z.string().regex(/^https?:\/\//, "Must be a full https:// URL");

const Fact = z.object({ text: z.string().min(1), source: url, lastVerified: date });
export type Fact = z.infer<typeof Fact>;

const Currency = z.enum(["GBP", "USD", "CAD", "AUD", "EUR", "NZD", "SGD", "AED", "INR"]);
export type Currency = z.infer<typeof Currency>;

const Amount = z.object({
  min: z.number().nonnegative(),
  max: z.number().nonnegative().nullable(),
  currency: Currency,
  period: z.enum(["year", "month", "semester"]),
  kind: z.enum(["range", "average", "minimum"]),
});
export type Amount = z.infer<typeof Amount>;

const SourcedAmount = Amount.extend({
  note: z.string().optional(),
  source: url,
  lastVerified: date,
});
export type SourcedAmount = z.infer<typeof SourcedAmount>;

const LivingTier = Amount.extend({ id: z.string(), label: z.string() });
export type LivingTier = z.infer<typeof LivingTier>;

const Requirement = z.object({ academics: Fact.nullable(), english: Fact.nullable(), tests: Fact.nullable() });

const Country = z.object({
  slug: z.string(),
  name: z.string(),
  longName: z.string(),
  code: z.string().length(3),
  path: z.string().startsWith("/").endsWith("/"),
  currency: Currency,
  region: z.string(),
  hubOf: z.array(z.string()).optional(),
  /** Short "work after study" label for the home departure board; summarises workRights.afterStudy. */
  boardWork: z.string().nullable().optional(),
  meta: z.object({ title: z.string(), description: z.string() }),
  summary: z.string(),
  whyReasons: z.array(z.object({ text: z.string(), source: url, lastVerified: date })),
  costs: z.object({
    tuition: z.object({ ug: SourcedAmount.nullable(), pg: SourcedAmount.nullable() }),
    living: z
      .object({ tiers: z.array(LivingTier).min(1), note: z.string().optional(), source: url, lastVerified: date })
      .nullable(),
    visaFunds: Fact.nullable(),
  }),
  intakes: z
    .object({
      items: z.array(z.object({ id: z.string(), label: z.string(), startMonth: z.number().min(1).max(12), main: z.boolean() })),
      applyBy: z.array(
        z.object({
          intakeId: z.string(),
          text: z.string(),
          date: date.nullable().optional(),
          monthDay: z.string().regex(/^\d{2}-\d{2}$/).optional(),
          level: z.enum(["ug", "pg", "all"]),
        }),
      ),
      note: z.string().optional(),
      source: url,
      lastVerified: date,
    })
    .nullable(),
  requirements: z.object({ ug: Requirement, pg: Requirement }),
  englishMinimum: z
    .object({
      ielts: z.number().optional(),
      pte: z.number().optional(),
      toefl: z.number().optional(),
      basis: z.string(),
      source: url,
      lastVerified: date,
    })
    .nullable(),
  workRights: z.object({ duringStudy: Fact.nullable(), afterStudy: Fact.nullable() }),
  pr: Fact.nullable(),
  popularCourses: z.array(z.string()),
  scholarships: z.array(z.object({ name: z.string(), text: z.string(), url })),
  faq: z.array(z.object({ q: z.string(), a: z.string() })),
});
export type Country = z.infer<typeof Country>;

function parse<T>(schema: z.ZodType<T>, data: unknown, file: string): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    const issues = result.error.issues.map((i) => `  ${i.path.join(".")}: ${i.message}`).join("\n");
    throw new Error(`Invalid content in ${file}:\n${issues}`);
  }
  return result.data;
}

/* ---------- countries ---------- */

const countryFiles: Record<string, unknown> = {
  usa, uk, canada, australia, ireland, germany, "new-zealand": newZealand, malta, europe, dubai, singapore,
};

export const COUNTRY_ORDER = ["usa", "uk", "canada", "australia", "ireland", "germany", "new-zealand", "malta", "europe", "dubai", "singapore"] as const;
export type CountrySlug = (typeof COUNTRY_ORDER)[number];

const countries: Record<string, Country> = Object.fromEntries(
  Object.entries(countryFiles).map(([slug, data]) => [slug, parse(Country, data, `content/countries/${slug}.json`)]),
);

export function getCountry(slug: string): Country {
  const c = countries[slug];
  if (!c) throw new Error(`Unknown country: ${slug}`);
  return c;
}
export function getCountries(): Country[] {
  return COUNTRY_ORDER.map((s) => countries[s]);
}

/* ---------- branches ---------- */

const Branch = z.object({
  slug: z.string(),
  name: z.string(),
  fullName: z.string(),
  city: z.string(),
  cityCode: z.string(),
  state: z.string(),
  phone: z.string().regex(/^\+91[6-9]\d{9}$/, "Use +91 followed by 10 digits"),
  phoneDisplay: z.string(),
  whatsapp: z.string().regex(/^\+91[6-9]\d{9}$/),
  addressLines: z.array(z.string()),
  streetAddress: z.string(),
  locality: z.string(),
  postalCode: z.string(),
  geo: z.object({ lat: z.number(), lng: z.number() }),
  mapEmbed: url,
  mapLink: url,
  landmarks: z.array(z.string()),
  hours: z.array(z.object({ days: z.string(), opens: z.string(), closes: z.string() })),
  googleBusinessUrl: z.string(),
});
export type Branch = z.infer<typeof Branch>;

const branches = parse(z.object({ branches: z.array(Branch) }), branchesJson, "data/branches.json").branches;
export function getBranches(): Branch[] {
  return branches;
}
export function getBranch(slug: string): Branch {
  const b = branches.find((x) => x.slug === slug);
  if (!b) throw new Error(`Unknown branch: ${slug}`);
  return b;
}

/* ---------- universities ---------- */

const University = z.object({ name: z.string(), country: z.string(), confirmed: z.boolean() });
export type University = z.infer<typeof University>;
const universities = parse(z.object({ universities: z.array(University) }), universitiesJson, "data/universities.json").universities;
export function getUniversities(country?: string): University[] {
  return country ? universities.filter((u) => u.country === country) : universities;
}

/* ---------- testimonials, reviews, team ---------- */

const Testimonial = z.object({
  id: z.string(),
  sample: z.boolean().optional(),
  firstName: z.string(),
  photo: z.string(),
  university: z.string(),
  country: z.string(),
  course: z.string(),
  intake: z.string(),
  branch: z.string().optional(),
  quote: z.string(),
  visaImage: z.string(),
});
export type Testimonial = z.infer<typeof Testimonial>;
const testimonials = parse(z.object({ testimonials: z.array(Testimonial) }), testimonialsJson, "data/testimonials.json").testimonials;
export function getTestimonials(): Testimonial[] {
  return testimonials;
}

const BranchReviews = z.object({
  branch: z.string(),
  sample: z.boolean().optional(),
  rating: z.number().min(0).max(5),
  reviewCount: z.number().int().nonnegative(),
  reviewsUrl: z.string(),
  reviews: z.array(z.object({ author: z.string(), rating: z.number().min(1).max(5), text: z.string() })),
});
export type BranchReviews = z.infer<typeof BranchReviews>;
const reviews = parse(z.object({ branches: z.array(BranchReviews) }), reviewsJson, "data/reviews.json").branches;
export function getReviews(): BranchReviews[] {
  return reviews;
}
export function getBranchReviews(slug: string): BranchReviews | undefined {
  return reviews.find((r) => r.branch === slug);
}

const TeamMember = z.object({
  id: z.string(),
  sample: z.boolean().optional(),
  name: z.string(),
  role: z.string(),
  branch: z.string(),
  photo: z.string(),
  yearsWithWayfarer: z.number().int().nonnegative(),
  countries: z.array(z.string()),
});
export type TeamMember = z.infer<typeof TeamMember>;
const team = parse(z.object({ team: z.array(TeamMember) }), teamJson, "data/team.json").team;
export function getTeam(branch?: string): TeamMember[] {
  return branch ? team.filter((t) => t.branch === branch) : team;
}

/* ---------- videos ---------- */

const Video = z.object({
  id: z.string(),
  title: z.string(),
  published: z.string(),
  tags: z.array(z.string()),
  topicPage: z.string(),
  language: z.string(),
  featurable: z.boolean(),
  url,
  thumbnail: url,
});
export type Video = z.infer<typeof Video>;
const videos = parse(z.object({ videos: z.array(Video) }), videosJson, "data/videos.json").videos;
export function getVideos(): Video[] {
  return videos.filter((v) => v.featurable);
}
export function getVideoById(id: string): Video | undefined {
  return videos.find((v) => v.id === id);
}
export function getVideoForTag(tag: string): Video | undefined {
  return getVideos().find((v) => v.tags.includes(tag));
}

/** Cleans a YouTube title for display: drops hashtags, emoji and channel-name suffixes. */
export function cleanVideoTitle(title: string): string {
  return title
    .replace(/#\w+/g, "")
    .replace(/[\u{1F000}-\u{1FFFF}\u{2600}-\u{27BF}\u{FE0F}]/gu, "")
    .split("|")[0]
    .replace(/\s+-\s*Wayfarer.*$/i, "")
    .replace(/\s+/g, " ")
    .trim();
}

/* ---------- exchange rates ---------- */

const Rates = z.object({ source: url, date, rates: z.record(z.string(), z.number().positive()) });
export const EXCHANGE = parse(Rates, ratesJson, "data/exchange-rates.json");

/* ---------- coaching ---------- */

const Test = z.object({
  slug: z.string(),
  name: z.string(),
  fullName: z.string(),
  kind: z.string(),
  owner: z.string(),
  whoFor: z.string(),
  format: z.object({
    duration: z.string(),
    sections: z.array(z.object({ name: z.string(), detail: z.string() })),
    scoring: z.string(),
    source: url,
    lastVerified: date,
  }),
  scoreBands: z.array(z.object({ label: z.string(), value: z.string(), source: url, lastVerified: date })),
  faq: z.array(z.object({ q: z.string(), a: z.string() })),
});
export type Test = z.infer<typeof Test>;
const testsData = parse(
  z.object({
    batches: z.object({
      confirmed: z.boolean(),
      options: z.array(z.object({ id: z.string(), name: z.string(), text: z.string() })),
    }),
    tests: z.array(Test),
  }),
  testsJson,
  "content/coaching/tests.json",
);
export function getTests(): Test[] {
  return testsData.tests;
}
export function getTest(slug: string): Test {
  const t = testsData.tests.find((x) => x.slug === slug);
  if (!t) throw new Error(`Unknown test: ${slug}`);
  return t;
}
export const BATCHES = testsData.batches;
