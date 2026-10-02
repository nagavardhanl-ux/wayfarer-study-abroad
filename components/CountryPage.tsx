import type { Metadata } from "next";
import Link from "next/link";
import { DestinationGrid, VideoItem } from "@/components/cards";
import { MiniPass } from "@/components/MiniPass";
import { Container, FaqList, PageHeader, Section, SectionHeading, SourceNote, TextLink, formatDate } from "@/components/ui";
import { SOCIAL } from "@/lib/site";
import { UniCrest } from "./UniCrest";
import { EXCHANGE, getCountry, getUniversities, getVideoForTag, type Country, type Fact, type SourcedAmount } from "@/lib/content";
import { formatInrRange, formatLocal, toInrPerYear } from "@/lib/money";
import { ExternalIcon } from "./Icons";
import { RememberCountry } from "./StickyPass";

export function countryMetadata(slug: string): Metadata {
  const c = getCountry(slug);
  return {
    title: c.meta.title,
    description: c.meta.description,
    alternates: { canonical: c.path },
    openGraph: { url: c.path, title: c.meta.title, description: c.meta.description },
  };
}

/** Countries whose cost data is complete enough for the cost calculator. */
export function hasCostData(c: Country) {
  return !!(c.costs.living && (c.costs.tuition.ug || c.costs.tuition.pg));
}

export function CountryPage({ slug }: { slug: string }) {
  const c = getCountry(slug);
  const unis = getUniversities(slug);
  const video = getVideoForTag(slug);
  const reqs = requirementRows(c);
  const hasCosts = !!(c.costs.tuition.ug || c.costs.tuition.pg || c.costs.living || c.costs.visaFunds);
  const hasWork = !!(c.workRights.duringStudy || c.workRights.afterStudy || c.pr);

  const sections = [
    { id: "why", label: "Why", show: c.whyReasons.length > 0 },
    { id: "destinations", label: "Countries", show: !!c.hubOf?.length },
    { id: "cost", label: "Cost", show: hasCosts },
    { id: "intakes", label: "Intakes", show: !!c.intakes },
    { id: "requirements", label: "Requirements", show: reqs.length > 0 },
    { id: "work", label: "Work and PR", show: hasWork },
    { id: "courses", label: "Courses", show: c.popularCourses.length > 0 },
    { id: "universities", label: "Universities", show: unis.length > 0 },
    { id: "scholarships", label: "Scholarships", show: c.scholarships.length > 0 },
    { id: "video", label: "Video", show: !!video },
    { id: "faq", label: "Questions", show: c.faq.length > 0 },
  ].filter((s) => s.show);

  const intakeLine = c.intakes ? `${c.code} · Starts: ${c.intakes.items.map((i) => i.label.split(" (")[0]).join(", ")}` : c.code;

  let tone: "paper" | "ground" = "ground";
  const nextTone = () => (tone = tone === "paper" ? "ground" : "paper");

  return (
    <>
      <PageHeader
        crumbs={[{ name: "Study abroad", href: "/study-abroad/" }, { name: c.name, href: c.path }]}
        title={`Study in ${c.longName}`}
        eyebrowCode={intakeLine}
        intro={c.summary}
      >
        <Link href={`/free-profile-check/?country=${c.slug}`} className="btn btn-primary">
          Check my profile for {c.longName}
        </Link>
        {hasCostData(c) ? (
          <Link href={`/tools/cost-calculator/?country=${c.slug}`} className="btn btn-secondary">
            Estimate the cost
          </Link>
        ) : null}
      </PageHeader>

      {sections.length > 2 ? (
        <nav aria-label="On this page" className="sticky z-20 border-b border-line bg-paper" style={{ top: "calc(64px + env(safe-area-inset-top, 0px))" }}>
          <Container>
            <ul className="scroll-row -mx-4 flex gap-1 overflow-x-auto px-4 py-2 text-sm">
              {sections.map((s) => (
                <li key={s.id} className="shrink-0">
                  <a href={`#${s.id}`} className="inline-flex min-h-10 items-center rounded-sm px-3 font-semibold text-blue hover:bg-ground">
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </Container>
        </nav>
      ) : null}

      {c.whyReasons.length ? (
        <Section tone={nextTone()} id="why" labelledBy="why-h">
          <SectionHeading id="why-h">Why students from India choose {c.longName}</SectionHeading>
          <ol className="grid max-w-[66ch] gap-6">
            {c.whyReasons.map((r) => (
              <li key={r.text} className="border-l-2 border-orange pl-4">
                <p>{r.text}</p>
                <SourceNote source={r.source} lastVerified={r.lastVerified} className="mt-1" />
              </li>
            ))}
          </ol>
        </Section>
      ) : null}

      {c.hubOf?.length ? (
        <Section tone={nextTone()} id="destinations" labelledBy="dest-h">
          <SectionHeading id="dest-h" intro="Each country page has costs, intakes and work rules from official sources.">
            Countries in Europe we cover in detail
          </SectionHeading>
          <DestinationGrid countries={c.hubOf.map((s) => getCountry(s))} includeMbbs={false} />
        </Section>
      ) : null}

      {hasCosts ? (
        <Section tone={nextTone()} id="cost" labelledBy="cost-h">
          <SectionHeading id="cost-h" intro={`Converted to rupees at the exchange rate on ${formatDate(EXCHANGE.date)}. Tuition and living costs are shown separately.`}>
            What it costs to study in {c.longName}
          </SectionHeading>
          <div className="max-w-[820px] overflow-x-auto">
            <table className="w-full min-w-[520px] border-collapse text-left">
              <thead>
                <tr className="border-b-2 border-ink">
                  <th scope="col" className="pass-label py-2 pr-4 text-muted">Cost</th>
                  <th scope="col" className="pass-label py-2 pr-4 text-muted">In rupees, per year</th>
                  <th scope="col" className="pass-label py-2 text-muted">In {c.currency}</th>
                </tr>
              </thead>
              <tbody>
                {c.costs.tuition.ug ? <CostRow label="Tuition, bachelor's" a={c.costs.tuition.ug} /> : null}
                {c.costs.tuition.pg ? <CostRow label="Tuition, master's" a={c.costs.tuition.pg} /> : null}
                {c.costs.living?.tiers.map((t) => (
                  <CostRow key={t.id} label={c.costs.living!.tiers.length > 1 ? `Living, ${t.label}` : "Living costs"} a={t} />
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 max-w-[66ch] space-y-3 text-sm">
            {c.costs.tuition.ug?.note ? <p className="text-muted">Bachelor's: {c.costs.tuition.ug.note}</p> : null}
            {c.costs.tuition.pg?.note ? <p className="text-muted">Master's: {c.costs.tuition.pg.note}</p> : null}
            {c.costs.living?.note ? <p className="text-muted">Living costs: {c.costs.living.note}</p> : null}
            <Sources
              items={[c.costs.tuition.ug, c.costs.tuition.pg, c.costs.living].filter(Boolean).map((x) => ({ source: x!.source, lastVerified: x!.lastVerified }))}
            />
          </div>
          {c.costs.visaFunds ? (
            <div className="mt-8 max-w-[66ch] border-l-2 border-navy pl-4">
              <h3 className="font-display text-lg font-bold">Money to show for the visa</h3>
              <p className="mt-1">{c.costs.visaFunds.text}</p>
              <SourceNote source={c.costs.visaFunds.source} lastVerified={c.costs.visaFunds.lastVerified} className="mt-1" />
            </div>
          ) : null}
          <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
            {hasCostData(c) ? <TextLink href={`/tools/cost-calculator/?country=${c.slug}`}>Estimate your total cost</TextLink> : null}
            <TextLink href="/education-loans/">How education loans work</TextLink>
          </div>
        </Section>
      ) : null}

      {c.intakes ? (
        <Section tone={nextTone()} id="intakes" labelledBy="intakes-h">
          <SectionHeading id="intakes-h">Intakes and application deadlines</SectionHeading>
          <ul className="grid max-w-[820px] gap-4 sm:grid-cols-2">
            {c.intakes.items.map((i) => (
              <li key={i.id} className="border-t-2 border-navy pt-3">
                <p className="pass-label text-muted">{i.main ? "Main intake" : "Also available"}</p>
                <p className="font-display text-xl font-bold">{i.label}</p>
                {c.intakes!.applyBy
                  .filter((d) => d.intakeId === i.id)
                  .map((d) => (
                    <p key={d.text} className="mt-2">
                      {d.text}
                    </p>
                  ))}
              </li>
            ))}
          </ul>
          {c.intakes.note ? <p className="mt-4 max-w-[66ch] text-muted">{c.intakes.note}</p> : null}
          <SourceNote source={c.intakes.source} lastVerified={c.intakes.lastVerified} className="mt-2" />
          <div className="mt-6">
            <TextLink href="/tools/intake-deadlines/">See how many months you have left</TextLink>
          </div>
        </Section>
      ) : null}

      {reqs.length ? (
        <Section tone={nextTone()} id="requirements" labelledBy="req-h">
          <SectionHeading id="req-h" intro="Each university sets its own entry rules. These are the official minimums we could verify; your counsellor checks the exact rules for every course on your shortlist.">
            Entry requirements
          </SectionHeading>
          <dl className="max-w-[820px] divide-y divide-line border-y border-line">
            {reqs.map((r) => (
              <div key={r.label} className="grid gap-1 py-4 md:grid-cols-[200px_minmax(0,1fr)] md:gap-6">
                <dt className="font-semibold">{r.label}</dt>
                <dd>
                  <p>{r.fact.text}</p>
                  <SourceNote source={r.fact.source} lastVerified={r.fact.lastVerified} className="mt-1" />
                </dd>
              </div>
            ))}
          </dl>
          {c.englishMinimum ? (
            <div className="mt-6">
              <TextLink href={`/tools/eligibility-check/?country=${c.slug}`}>Check your English score against this</TextLink>
            </div>
          ) : null}
        </Section>
      ) : null}

      {hasWork ? (
        <Section tone={nextTone()} id="work" labelledBy="work-h">
          <SectionHeading id="work-h">Work during and after study</SectionHeading>
          <dl className="max-w-[820px] divide-y divide-line border-y border-line">
            {(
              [
                ["While you study", c.workRights.duringStudy],
                ["After you graduate", c.workRights.afterStudy],
                ["Permanent residence", c.pr],
              ] as [string, Fact | null][]
            )
              .filter(([, f]) => f)
              .map(([label, f]) => (
                <div key={label} className="grid gap-1 py-4 md:grid-cols-[200px_minmax(0,1fr)] md:gap-6">
                  <dt className="font-semibold">{label}</dt>
                  <dd>
                    <p>{f!.text}</p>
                    <SourceNote source={f!.source} lastVerified={f!.lastVerified} className="mt-1" />
                  </dd>
                </div>
              ))}
          </dl>
          <p className="mt-4 max-w-[66ch] text-sm text-muted">Work and residence rules change often. Your counsellor confirms the current rules before you apply.</p>
        </Section>
      ) : null}

      {c.popularCourses.length ? (
        <Section tone={nextTone()} id="courses" labelledBy="courses-h">
          <SectionHeading id="courses-h">Courses our students choose in {c.longName}</SectionHeading>
          <ul className="grid max-w-[820px] grid-cols-1 gap-x-8 sm:grid-cols-2">
            {c.popularCourses.map((p) => (
              <li key={p} className="border-b border-line py-3 font-semibold">
                {p}
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      {unis.length ? (
        <Section tone={nextTone()} id="universities" labelledBy="unis-h">
          <SectionHeading id="unis-h">Popular universities in {c.longName}</SectionHeading>
          <ul className="grid grid-cols-2 border-l border-t border-line sm:grid-cols-3 lg:grid-cols-4">
            {unis.map((u) => (
              <li key={u.name} className="flex flex-col items-center justify-center gap-2 border-b border-r border-line bg-paper p-4 text-center">
                <UniCrest name={u.name} />
                <span className="text-sm font-semibold">{u.name}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm text-muted">We also apply to universities outside this list when they suit your profile.</p>
        </Section>
      ) : null}

      {c.scholarships.length ? (
        <Section tone={nextTone()} id="scholarships" labelledBy="sch-h">
          <SectionHeading id="sch-h">Scholarships for students from India</SectionHeading>
          <ul className="max-w-[66ch] space-y-5">
            {c.scholarships.map((s) => (
              <li key={s.name}>
                <a href={s.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 font-display text-lg font-bold text-blue underline-offset-4 hover:underline">
                  {s.name} <ExternalIcon className="h-4 w-4" />
                </a>
                <p className="mt-1">{s.text}</p>
              </li>
            ))}
          </ul>
          <div className="mt-6">
            <TextLink href="/scholarships/">How we help with scholarship applications</TextLink>
          </div>
        </Section>
      ) : null}

      {video ? (
        <Section tone={nextTone()} id="video" labelledBy="video-h">
          <SectionHeading id="video-h">A video from our counsellors on {c.longName}</SectionHeading>
          <div className="max-w-[720px]">
            <VideoItem v={video} href={SOCIAL.YouTube} linkLabel="More videos on our YouTube channel" />
          </div>
        </Section>
      ) : null}

      <div id="faq">
        <FaqList items={c.faq} headingId="faq-h" title={`${c.name} questions`} tone={nextTone()} />
      </div>

      <MiniPass to={c.name} code={c.code} query={{ country: c.slug }} title={`Check your profile for ${c.longName}`} />
      <RememberCountry slug={c.slug} />
    </>
  );
}

function CostRow({ label, a }: { label: string; a: SourcedAmount | (Omit<SourcedAmount, "source" | "lastVerified" | "note"> & { id?: string }) }) {
  const inr = toInrPerYear(a, EXCHANGE.rates);
  return (
    <tr className="border-b border-line align-top">
      <th scope="row" className="py-3 pr-4 font-semibold">
        {label}
      </th>
      <td className="tabular py-3 pr-4 font-display text-lg font-bold">{formatInrRange(inr)}</td>
      <td className="tabular py-3 text-muted">{formatLocal(a)}</td>
    </tr>
  );
}

function Sources({ items }: { items: { source: string; lastVerified: string }[] }) {
  const seen = new Set<string>();
  const unique = items.filter((i) => (seen.has(i.source) ? false : (seen.add(i.source), true)));
  return (
    <div className="space-y-0.5">
      {unique.map((i) => (
        <SourceNote key={i.source} source={i.source} lastVerified={i.lastVerified} />
      ))}
    </div>
  );
}

function requirementRows(c: Country): { label: string; fact: Fact }[] {
  const rows: { label: string; fact: Fact }[] = [];
  const keys = [
    ["academics", "Academics"],
    ["english", "English"],
    ["tests", "Entrance tests"],
  ] as const;
  for (const [k, label] of keys) {
    const ug = c.requirements.ug[k];
    const pg = c.requirements.pg[k];
    if (ug && pg && ug.text === pg.text) rows.push({ label: `${label}, bachelor's and master's`, fact: ug });
    else {
      if (ug) rows.push({ label: `${label}, bachelor's`, fact: ug });
      if (pg) rows.push({ label: `${label}, master's`, fact: pg });
    }
  }
  return rows;
}
