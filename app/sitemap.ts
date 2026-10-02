import type { MetadataRoute } from "next";
import { getBranches, getCountries, getTests } from "@/lib/content";
import { listMdx, readFrontmatter } from "@/lib/mdx";
import { absoluteUrl } from "@/lib/site";

const STATIC = [
  "/", "/study-abroad/", "/mbbs-abroad/", "/coaching/", "/immigration/", "/visit-visas/", "/service/",
  "/profile-evaluation/", "/sop-writing/", "/education-loans/", "/student-accommodation/", "/scholarships/", "/visa-assistance/",
  "/student-stories/", "/for-parents/", "/about-us/", "/branches/", "/tools/",
  "/tools/cost-calculator/", "/tools/loan-emi-calculator/", "/tools/eligibility-check/", "/tools/intake-deadlines/",
  "/free-profile-check/", "/blog/", "/contact/", "/privacy-policy/", "/terms/",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const urls = [
    ...STATIC,
    ...getCountries().map((c) => c.path),
    ...getTests().map((t) => `/coaching/${t.slug}/`),
    ...getBranches().map((b) => `/branches/${b.slug}/`),
  ].map((p) => ({ url: absoluteUrl(p), lastModified: now }));
  const posts = listMdx("blog")
    .map((s) => readFrontmatter(`blog/${s}.mdx`))
    .filter((p) => !p.draft)
    .map((p) => ({ url: absoluteUrl(`/${p.slug}/`), lastModified: new Date(p.updated ?? p.date ?? now) }));
  return [...urls, ...posts];
}

export const dynamic = "force-static";
