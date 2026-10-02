import type { Metadata } from "next";
import Link from "next/link";
import { DemoClassButtons } from "@/components/DemoClassButtons";
import { MiniPass } from "@/components/MiniPass";
import { ArrowRight } from "@/components/Icons";
import { CheckList, FaqList, PageHeader, Section, SectionHeading } from "@/components/ui";
import { BATCHES, getTests } from "@/lib/content";

export const metadata: Metadata = {
  title: "IELTS, PTE, TOEFL, GRE, GMAT, SAT coaching in Bengaluru, Chennai, Pune, Kochi",
  description: "Coaching for IELTS, PTE, TOEFL, Duolingo English Test, GRE, GMAT and SAT, online or at Wayfarer branches in Bengaluru, Chennai, Pune and Kochi. Book a demo class.",
  alternates: { canonical: "/coaching/" },
};

export default function Page() {
  const tests = getTests();
  return (
    <>
      <PageHeader
        crumbs={[{ name: "Coaching", href: "/coaching/" }]}
        title="Coaching for the test your university asks for."
        intro="Seven tests, online or at a branch. Start with a demo class before you join a batch."
      >
        <a href="#demo" className="btn btn-primary">
          Book a demo class
        </a>
      </PageHeader>
      <Section labelledBy="tests-h">
        <SectionHeading id="tests-h">Choose a test</SectionHeading>
        <ul className="grid border-l border-t border-line sm:grid-cols-2 lg:grid-cols-4">
          {tests.map((t) => (
            <li key={t.slug} className="border-b border-r border-line">
              <Link href={`/coaching/${t.slug}/`} className="group flex h-full flex-col gap-2 p-5 hover:bg-ground">
                <span className="pass-label text-orange-ink">{t.kind}</span>
                <span className="flex items-center justify-between font-display text-2xl font-bold">
                  {t.name}
                  <ArrowRight className="h-5 w-5 text-blue" />
                </span>
                <span className="text-sm text-muted">{t.format.duration}</span>
              </Link>
            </li>
          ))}
        </ul>
      </Section>
      <Section tone="ground" labelledBy="how-h">
        <SectionHeading id="how-h">How our coaching works</SectionHeading>
        <div className="grid gap-10 md:grid-cols-2">
          <div>
            <h3 className="t-h3">Batch options</h3>
            <ul className="mt-4 space-y-4">
              {BATCHES.options.map((b) => (
                <li key={b.id}>
                  <p className="font-semibold">{b.name}</p>
                  <p className="text-muted">{b.text}</p>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="t-h3">What every batch includes</h3>
            <CheckList
              className="mt-4"
              items={[
                "Study material written for each module",
                "Trainers who teach strategy for each section",
                "Flexible timings, with limited students per batch",
                "Practice sessions with feedback on weak areas",
              ]}
            />
          </div>
        </div>
        <div id="demo" className="mt-10 scroll-mt-24">
          <DemoClassButtons test="coaching" />
        </div>
      </Section>
      <FaqList
        items={[
          { q: "Which test should I take?", a: "It depends on your country and university. Your profile check tells you which tests your shortlist accepts, so you only prepare for one." },
          { q: "Can I join online?", a: "Yes. Online batches follow the same plan as classroom batches at our branches." },
        ]}
      />
      <MiniPass title="Not sure which test you need?" text="The free profile check tells you which test your universities accept and the score to aim for." />
    </>
  );
}
