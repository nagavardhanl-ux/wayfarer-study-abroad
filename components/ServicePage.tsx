import type { Metadata } from "next";
import Link from "next/link";
import { getCountries, getVideoById } from "@/lib/content";
import { getService } from "@/lib/services";
import { SOCIAL } from "@/lib/site";
import { VideoItem } from "./cards";
import { ExternalIcon } from "./Icons";
import { MiniPass } from "./MiniPass";
import { CheckList, FaqList, PageHeader, RouteSteps, Section, SectionHeading, SourceNote, TextLink } from "./ui";

export function serviceMetadata(slug: string): Metadata {
  const s = getService(slug);
  return { title: s.meta.title, description: s.meta.description, alternates: { canonical: s.path }, openGraph: { url: s.path } };
}

export function ServicePage({ slug, parent = { name: "Services", href: "/service/" } }: { slug: string; parent?: { name: string; href: string } | null }) {
  const s = getService(slug);
  const video = s.videoId ? getVideoById(s.videoId) : undefined;
  const crumbs = parent ? [parent, { name: s.name, href: s.path }] : [{ name: s.name, href: s.path }];
  let tone: "paper" | "ground" = "ground";
  const next = () => (tone = tone === "paper" ? "ground" : "paper");

  return (
    <>
      <PageHeader crumbs={crumbs} title={s.h1} intro={s.intro}>
        <Link href="/free-profile-check/" className="btn btn-primary">
          Start free profile check
        </Link>
      </PageHeader>

      <Section tone={next()} labelledBy="covers-h">
        <div className="grid gap-10 md:grid-cols-2">
          <div>
            <h2 id="covers-h" className="t-h2">What this covers</h2>
            <CheckList items={s.covers} className="mt-6" />
          </div>
          <div>
            <h2 className="t-h2">Who it is for</h2>
            <CheckList items={s.whoFor} className="mt-6" />
          </div>
        </div>
      </Section>

      <Section tone={next()} labelledBy="how-h">
        <SectionHeading id="how-h">How it works</SectionHeading>
        <RouteSteps steps={s.steps} />
      </Section>

      {s.sections.map((sec) => (
        <Section key={sec.heading} tone={next()} id={sec.id} labelledBy={`${sec.id ?? slugify(sec.heading)}-h`}>
          <SectionHeading id={`${sec.id ?? slugify(sec.heading)}-h`}>{sec.heading}</SectionHeading>
          <div className="max-w-[66ch] space-y-4">
            {sec.paragraphs?.map((p) => (
              <p key={p}>{p}</p>
            ))}
            {sec.bullets ? <CheckList items={sec.bullets} /> : null}
          </div>
          {sec.facts?.length ? (
            <dl className="mt-2 max-w-[820px] divide-y divide-line border-y border-line">
              {sec.facts.map((f) => (
                <div key={f.label + f.text} className="grid gap-1 py-4 md:grid-cols-[220px_minmax(0,1fr)] md:gap-6">
                  <dt className="font-semibold">{f.label}</dt>
                  <dd>
                    <p>{f.text}</p>
                    <SourceNote source={f.source} lastVerified={f.lastVerified} className="mt-1" />
                  </dd>
                </div>
              ))}
            </dl>
          ) : null}
          {sec.countryScholarships ? <CountryScholarships /> : null}
        </Section>
      ))}

      {s.tools.length || video ? (
        <Section tone={next()} labelledBy="tools-h">
          <div className="grid gap-10 md:grid-cols-2">
            {s.tools.length ? (
              <div>
                <h2 id="tools-h" className="t-h2">Related tools</h2>
                <ul className="mt-6 space-y-3">
                  {s.tools.map((t) => (
                    <li key={t.href}>
                      <TextLink href={t.href}>{t.label}</TextLink>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
            {video ? (
              <div>
                <h2 className="t-h2">Watch</h2>
                <div className="mt-6">
                  <VideoItem v={video} href={SOCIAL.YouTube} linkLabel="More videos on our YouTube channel" />
                </div>
              </div>
            ) : null}
          </div>
        </Section>
      ) : null}

      <FaqList items={s.faq} headingId="faq-h" title={`${s.name}: questions`} tone={next()} />
      <MiniPass />
    </>
  );
}

function CountryScholarships() {
  const rows = getCountries().filter((c) => c.scholarships.length);
  return (
    <div className="mt-2 grid max-w-[900px] gap-8 md:grid-cols-2">
      {rows.map((c) => (
        <div key={c.slug}>
          <h3 className="font-display text-xl font-bold">
            <Link href={c.path} className="hover:text-blue">
              {c.name}
            </Link>
          </h3>
          <ul className="mt-2 space-y-3">
            {c.scholarships.map((s) => (
              <li key={s.name}>
                <a href={s.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-semibold text-blue underline underline-offset-4">
                  {s.name} <ExternalIcon className="h-3.5 w-3.5" />
                </a>
                <p className="text-sm text-muted">{s.text}</p>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}
