import { BRAND, DEFAULT_SITE_URL, FOUNDED, LEGAL_NAME } from "./brand";

export { BRAND, FOUNDED, LEGAL_NAME };

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || DEFAULT_SITE_URL).replace(/\/$/, "");

/**
 * Social profiles shown in the footer, contact page and structured data.
 * Empty for this portfolio build. Add real profile URLs here, e.g. { Instagram: "https://www.instagram.com/your-handle" }.
 */
export const SOCIAL: Partial<Record<"Instagram" | "LinkedIn" | "YouTube" | "Facebook", string>> = {};
export const SOCIAL_LINKS = Object.entries(SOCIAL).filter(([, href]) => !!href) as [string, string][];

/** Absolute URL for a site path. */
export function absoluteUrl(path = "/") {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

/** Sample entries are visible (with a SAMPLE badge) in development and in explicit sample preview builds. */
export const SHOW_SAMPLE_BADGES =
  process.env.NODE_ENV !== "production" || process.env.NEXT_PUBLIC_SAMPLE_BUILD === "1";

export type NavLink = { label: string; href: string; note?: string };
export type NavGroup = { label: string; href: string; links: NavLink[] };

export const NAV: NavGroup[] = [
  {
    label: "Study abroad",
    href: "/study-abroad/",
    links: [
      { label: "USA", href: "/study-in-usa/" },
      { label: "UK", href: "/study-in-uk/" },
      { label: "Canada", href: "/study-in-canada/" },
      { label: "Australia", href: "/study-in-australia/" },
      { label: "Ireland", href: "/study-in-ireland/" },
      { label: "Germany", href: "/study-in-germany/" },
      { label: "New Zealand", href: "/study-in-new-zealand/" },
      { label: "Malta", href: "/study-in-malta/" },
      { label: "Europe", href: "/study-in-europe/" },
      { label: "Dubai", href: "/study-in-dubai/" },
      { label: "Singapore", href: "/study-in-singapore/" },
      { label: "MBBS abroad", href: "/mbbs-abroad/" },
    ],
  },
  {
    label: "Coaching",
    href: "/coaching/",
    links: [
      { label: "IELTS", href: "/coaching/ielts/" },
      { label: "PTE", href: "/coaching/pte/" },
      { label: "TOEFL", href: "/coaching/toefl/" },
      { label: "Duolingo English Test", href: "/coaching/duolingo/" },
      { label: "GRE", href: "/coaching/gre/" },
      { label: "GMAT", href: "/coaching/gmat/" },
      { label: "SAT", href: "/coaching/sat/" },
    ],
  },
  {
    label: "Services",
    href: "/service/",
    links: [
      { label: "Profile evaluation", href: "/profile-evaluation/" },
      { label: "SOP writing", href: "/sop-writing/" },
      { label: "Education loans", href: "/education-loans/" },
      { label: "Scholarships", href: "/scholarships/" },
      { label: "Visa assistance", href: "/visa-assistance/" },
      { label: "Student accommodation", href: "/student-accommodation/" },
    ],
  },
  {
    label: "Visas",
    href: "/visit-visas/",
    links: [
      { label: "Visit visas", href: "/visit-visas/" },
      { label: "Immigration and PR", href: "/immigration/" },
    ],
  },
  {
    label: "Tools",
    href: "/tools/",
    links: [
      { label: "Cost calculator", href: "/tools/cost-calculator/" },
      { label: "Loan EMI calculator", href: "/tools/loan-emi-calculator/" },
      { label: "Eligibility check", href: "/tools/eligibility-check/" },
      { label: "Intake deadlines", href: "/tools/intake-deadlines/" },
    ],
  },
];

export const NAV_SINGLE: NavLink[] = [
  { label: "For parents", href: "/for-parents/" },
  { label: "Branches", href: "/branches/" },
];
