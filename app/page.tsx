import type { Metadata } from "next";
import Link from "next/link";
import { RatingRow, StoryCard, VideoItem } from "@/components/cards";
import { HeroVideo } from "@/components/HeroVideo";
import { FlightGlobe } from "@/components/home/FlightGlobe";
import { DepartureBoard } from "@/components/home/DepartureBoard";
import { HomeBento } from "@/components/home/HomeBento";
import { HomeServices } from "@/components/HomeServices";
import { HowItWorks } from "@/components/HowItWorks";
import { HomeUniversities } from "@/components/HomeUniversities";
import { Container, FaqList, Section, SectionHeading, TextLink } from "@/components/ui";
import { getBranches, getCountries, getCountry, getReviews, getTestimonials, getVideoById, getVideos } from "@/lib/content";

export const metadata: Metadata = {
  title: { absolute: "Wayfarer | Study abroad consultants in Bengaluru, Chennai, Pune and Kochi" },
  description:
    "Admission, education loan and visa support for students in South and West India, from four branches in Bengaluru, Chennai, Pune and Kochi. Since 2011. Start a free profile check.",
  alternates: { canonical: "/" },
  openGraph: { url: "/" },
};


const FAQ = [
  {
    q: "What does Wayfarer do?",
    a: "Wayfarer helps students from South and West India study abroad. We check your profile, shortlist universities, and help with applications, SOPs, education loans, the student visa and accommodation. We have done this since 2011.",
  },
  {
    q: "Which services do you offer?",
    a: "Study abroad counselling, university and course shortlisting, applications, SOP writing, scholarship guidance, education loan support, visa assistance, accommodation help, and coaching for IELTS, PTE, TOEFL, Duolingo English Test, GRE, GMAT and SAT.",
  },
  {
    q: "Can Wayfarer help with my visa?",
    a: "Yes. We check your documents against the country's rules, help you complete the forms, and practise the interview with you where one is needed. The decision is always made by the embassy or immigration office, so no consultant can promise a visa.",
  },
  {
    q: "How do I book a consultation?",
    a: "Start the free profile check at the top of this page, or call or WhatsApp your nearest branch. A counsellor will call you back to arrange a meeting at the branch or online.",
  },
  {
    q: "Do you offer coaching for IELTS and other tests?",
    a: "Yes. We coach for IELTS, PTE, TOEFL, Duolingo English Test, GRE, GMAT and SAT, online or at a branch. You can book a demo class before you join a batch.",
  },
  {
    q: "Why choose Wayfarer?",
    a: "We have worked with students since 2011, and you can meet your counsellor in person at four branches in Bengaluru, Chennai, Pune and Kochi. We give you costs in rupees, and we speak to parents directly.",
  },
];

export default function HomePage() {
  const countries = getCountries();
  const branches = getBranches();
  const reviews = getReviews();
  const stories = getTestimonials().slice(0, 3);
  const latest = getVideos().slice(0, 3);
  const scam = getVideoById("ob_KiWaj-WA");

  return (
    <>
      {/* 1. Hero: night flight. Tinted video, headline, globe with routes */}
      <section className="night on-navy relative isolate overflow-hidden">
        <HeroVideo />
        <div aria-hidden className="hero-night-wash absolute inset-0" />
        <Container className="relative grid items-center gap-10 py-14 md:py-20 lg:grid-cols-[minmax(0,6fr)_minmax(0,6fr)] lg:gap-8 lg:py-24">
          <div>
            <p className="data-label text-orange-light">BLR · MAA · PNQ · COK &nbsp;→&nbsp; 11 destinations</p>
            <h1 className="t-h1 mt-4 max-w-[15ch] text-on-navy md:!text-[3.6rem] lg:!text-[4.1rem]">Study abroad, planned close to home.</h1>
            <p className="t-lead mt-5 max-w-[44ch] text-on-navy-muted">Admission, education loan and visa support from four branches in Bengaluru, Chennai, Pune and Kochi. Since 2011.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/free-profile-check/" className="btn btn-primary">
                Start free profile check
              </Link>
              <Link href="/branches/" className="btn btn-ghost-light">
                Call or visit a branch
              </Link>
            </div>
            <dl className="mt-10 grid max-w-[460px] grid-cols-3 gap-4 border-t border-white/15 pt-5">
              {[
                ["Since", "2011"],
                ["Branches", "4"],
                ["Destinations", "11"],
              ].map(([k, v]) => (
                <div key={k}>
                  <dt className="data-label text-on-navy-muted">{k}</dt>
                  <dd className="pass-value mt-1 text-3xl text-on-navy">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
          <FlightGlobe />
        </Container>
      </section>

      {/* About our overseas education */}
      <HomeBento />

      {/* One-stop destination (service flip cards) */}
      <HomeServices />

      {/* Destination picker */}
      <section aria-labelledby="where" className="night on-navy py-14 md:py-[88px]">
        <Container>
          <div className="mb-8 flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-[60ch]">
              <p className="data-label text-orange-light">Departures from BLR · MAA · PNQ · COK</p>
              <h2 id="where" className="t-h2 mt-2 text-on-navy">Where students go</h2>
              <p className="mt-3 text-on-navy-muted">Next intake, months left to apply and work rights after study, from official sources. Months left updates every day.</p>
            </div>
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              <Link href="/tools/cost-calculator/" className="font-semibold text-on-navy underline underline-offset-4 hover:text-orange-light">Compare costs in rupees</Link>
              <Link href="/mbbs-abroad/" className="font-semibold text-on-navy underline underline-offset-4 hover:text-orange-light">MBBS abroad</Link>
            </div>
          </div>
          <DepartureBoard
            rows={countries.map((c) => ({
              slug: c.slug,
              code: c.code,
              name: c.name,
              path: c.path,
              intakes: c.intakes?.items.map((i) => ({ label: i.label, startMonth: i.startMonth })) ?? [],
              work: c.boardWork ?? null,
            }))}
          />
        </Container>
      </section>

      {/* 3. How Wayfarer works */}
      {/* Discover top universities */}
      <HomeUniversities />

      <HowItWorks />

      {/* 4 + 5. Proof: student stories and branch ratings (home page only) */}
      <Section tone="ground" labelledBy="stories">
        <SectionHeading id="stories" intro="Real students, their universities and the intake they joined.">
          Visas approved for our students
        </SectionHeading>
        <ul className="scroll-row -mx-4 flex gap-4 overflow-x-auto px-4 pb-2 md:mx-0 md:grid md:grid-cols-3 md:overflow-visible md:px-0">
          {stories.map((t) => (
            <li key={t.id} className="w-[85%] shrink-0 border border-line md:w-auto">
              <StoryCard t={t} countryName={safeCountryName(t.country)} />
            </li>
          ))}
        </ul>
        <div className="mt-6">
          <TextLink href="/student-stories/">See all student stories</TextLink>
        </div>

        <div className="mt-14 max-w-[720px]">
          <h3 className="t-h3">Google rating for each branch</h3>
          <ul className="mt-3 divide-y divide-line border-y border-line">
            {branches.map((b) => (
              <RatingRow key={b.slug} branch={b} r={reviews.find((r) => r.branch === b.slug)} />
            ))}
          </ul>
        </div>
      </Section>

      {/* 6. Videos */}
      {latest.length ? (
        <Section labelledBy="videos">
          <SectionHeading id="videos" intro="From the Wayfarer YouTube channel.">
            Latest videos
          </SectionHeading>
          <div className="grid gap-8 md:grid-cols-3">
            {latest.map((v) => (
              <VideoItem key={v.id} v={v} />
            ))}
          </div>
        </Section>
      ) : null}

      {/* 7. Parents band */}
      <Section tone="navy" labelledBy="parents">
        <div className="grid gap-8 md:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] md:items-center">
          <div>
            <h2 id="parents" className="t-h2 text-on-navy">
              Parents decide and pay. This guide is for you.
            </h2>
            <p className="mt-4 max-w-[56ch] text-on-navy-muted">
              What a degree abroad costs in rupees and when you pay it, how education loans work even with a low CIBIL score, how students stay safe, and how to spot a fake agent. In plain words.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/for-parents/" className="btn btn-primary">
                Read the guide for parents
              </Link>
              <Link href="/branches/" className="btn btn-ghost-light">
                Visit a branch with your child
              </Link>
            </div>
          </div>
          {scam ? (
            <p className="border-l-2 border-orange pl-4 text-on-navy-muted">
              No genuine consultant can guarantee a visa or a work permit. Our video on work permit scams shows the warning signs.{" "}
              <Link href="/for-parents/#how-to-spot-a-fake-agent" className="font-semibold text-on-navy underline underline-offset-4">
                Watch it in the parents&apos; guide
              </Link>
            </p>
          ) : null}
        </div>
      </Section>


      {/* 9. FAQ */}
      <FaqList items={FAQ} tone="ground" />
    </>
  );
}

function safeCountryName(slug: string) {
  try {
    return getCountry(slug).name;
  } catch {
    return slug;
  }
}
