import type { Metadata } from "next";
import Link from "next/link";
import { MiniPass } from "@/components/MiniPass";
import { PageHeader, RouteSteps, Section, SectionHeading } from "@/components/ui";
import { ArrowRight } from "@/components/Icons";
import { STUDENT_SERVICES, getService } from "@/lib/services";

export const metadata: Metadata = {
  title: "Wayfarer services for students going abroad",
  description: "Profile evaluation, SOP writing, education loans, scholarships, visa assistance and student accommodation, plus test coaching, visit visas and immigration. From four branches since 2011.",
  alternates: { canonical: "/service/" },
};

const OTHER = [
  { name: "Test coaching", href: "/coaching/", short: "IELTS, PTE, TOEFL, Duolingo English Test, GRE, GMAT and SAT, online or at a branch." },
  { name: "Visit visas", href: "/visit-visas/", short: "Tourist, family visit and business visit visas." },
  { name: "Immigration and PR", href: "/immigration/", short: "Permanent residence and job-search routes for Canada, Australia and Germany." },
];

export default function Page() {
  const services = STUDENT_SERVICES.map(getService);
  return (
    <>
      <PageHeader
        crumbs={[{ name: "Services", href: "/service/" }]}
        title="Every step from shortlist to departure, handled with you."
        intro="Use one service, or let one counsellor take you through all of them."
      />
      <Section labelledBy="list-h">
        <h2 id="list-h" className="sr-only">Services</h2>
        <ul className="grid border-l border-t border-line md:grid-cols-2 lg:grid-cols-3">
          {[...services.map((s) => ({ name: s.name, href: s.path, short: s.short })), ...OTHER].map((s) => (
            <li key={s.href} className="border-b border-r border-line">
              <Link href={s.href} className="group flex h-full flex-col gap-2 p-5 hover:bg-ground md:p-6">
                <span className="flex items-center justify-between gap-3 font-display text-xl font-bold">
                  {s.name}
                  <ArrowRight className="h-5 w-5 text-blue transition-transform group-hover:translate-x-0.5" />
                </span>
                <span className="text-muted">{s.short}</span>
              </Link>
            </li>
          ))}
        </ul>
      </Section>
      <Section tone="ground" labelledBy="order-h">
        <SectionHeading id="order-h">The order things usually happen in</SectionHeading>
        <RouteSteps
          steps={[
            { title: "Profile evaluation", text: "Find the countries and universities that fit." },
            { title: "Test coaching", text: "Only if your shortlist needs a score." },
            { title: "Applications and SOP", text: "Applications prepared with you, with an SOP in your own words." },
            { title: "Scholarships and education loan", text: "Lower the cost, then plan the rest." },
            { title: "Visa", text: "A complete visa file and interview practice." },
            { title: "Accommodation and pre-departure", text: "A place to live and a briefing before you fly." },
          ]}
        />
      </Section>
      <MiniPass />
    </>
  );
}
