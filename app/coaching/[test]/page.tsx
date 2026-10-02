import type { Metadata } from "next";
import { DemoClassButtons } from "@/components/DemoClassButtons";
import { JsonLd } from "@/components/JsonLd";
import { MiniPass } from "@/components/MiniPass";
import { FaqList, PageHeader, Section, SectionHeading, SourceNote, TextLink } from "@/components/ui";
import { BATCHES, getTest, getTests } from "@/lib/content";
import { courseSchema } from "@/lib/schema";

export const dynamicParams = false;

export function generateStaticParams() {
  return getTests().map((t) => ({ test: t.slug }));
}

export async function generateMetadata({ params }: PageProps<"/coaching/[test]">): Promise<Metadata> {
  const { test } = await params;
  const t = getTest(test);
  return {
    title: `${t.name} coaching in Bengaluru, Chennai, Pune and Kochi`,
    description: `${t.fullName}: test format, timing, score scale and the scores visas ask for. ${t.name} coaching online or at Wayfarer branches. Book a demo class.`,
    alternates: { canonical: `/coaching/${t.slug}/` },
  };
}

export default async function Page({ params }: PageProps<"/coaching/[test]">) {
  const { test } = await params;
  const t = getTest(test);
  return (
    <>
      <PageHeader
        crumbs={[{ name: "Coaching", href: "/coaching/" }, { name: t.name, href: `/coaching/${t.slug}/` }]}
        title={`${t.name} coaching, online or at your nearest branch`}
        eyebrowCode={`${t.kind} · ${t.owner}`}
        intro={t.whoFor}
      >
        <a href="#demo" className="btn btn-primary">
          Book a demo class
        </a>
      </PageHeader>

      <Section labelledBy="format-h">
        <SectionHeading id="format-h" intro={`Total time: ${t.format.duration}.`}>
          The {t.name} format
        </SectionHeading>
        <dl className="max-w-[820px] divide-y divide-line border-y border-line">
          {t.format.sections.map((s) => (
            <div key={s.name} className="grid gap-1 py-3 sm:grid-cols-[220px_minmax(0,1fr)]">
              <dt className="font-semibold">{s.name}</dt>
              <dd>{s.detail}</dd>
            </div>
          ))}
          <div className="grid gap-1 py-3 sm:grid-cols-[220px_minmax(0,1fr)]">
            <dt className="font-semibold">Scoring</dt>
            <dd>{t.format.scoring}</dd>
          </div>
        </dl>
        <SourceNote source={t.format.source} lastVerified={t.format.lastVerified} className="mt-2" />
      </Section>

      <Section tone="ground" labelledBy="scores-h">
        <SectionHeading id="scores-h" intro="Universities set their own scores, often higher than these. Your counsellor checks the score for each course on your shortlist.">
          Scores that visas and universities ask for
        </SectionHeading>
        {t.scoreBands.length ? (
          <dl className="max-w-[820px] divide-y divide-line border-y border-line">
            {t.scoreBands.map((b) => (
              <div key={b.label} className="grid gap-1 py-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:gap-6">
                <dt className="font-semibold">{b.label}</dt>
                <dd>
                  <p className="font-display text-lg font-bold">{b.value}</p>
                  <SourceNote source={b.source} lastVerified={b.lastVerified} />
                </dd>
              </div>
            ))}
          </dl>
        ) : (
          <p className="max-w-[66ch]">There is no government minimum for the {t.name}. Each university sets its own score, and we check it for every course on your list.</p>
        )}
        <div className="mt-6">
          <TextLink href="/tools/eligibility-check/">Check your score</TextLink>
        </div>
      </Section>

      <Section labelledBy="batch-h">
        <SectionHeading id="batch-h">Batch options</SectionHeading>
        <ul className="grid max-w-[820px] gap-6 sm:grid-cols-2">
          {BATCHES.options.map((b) => (
            <li key={b.id} className="border-t-2 border-navy pt-3">
              <p className="font-display text-xl font-bold">{b.name}</p>
              <p className="mt-1 text-muted">{b.text}</p>
            </li>
          ))}
        </ul>
        <div id="demo" className="mt-8 scroll-mt-24">
          <DemoClassButtons test={t.name} />
        </div>
      </Section>

      <FaqList items={t.faq} tone="ground" title={`${t.name} questions`} />
      <MiniPass />
      <JsonLd data={courseSchema({ name: `${t.name} coaching`, description: `Preparation for the ${t.fullName}, online or at Wayfarer branches.`, path: `/coaching/${t.slug}/` })} />
    </>
  );
}
