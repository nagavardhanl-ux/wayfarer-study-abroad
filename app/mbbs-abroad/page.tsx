import type { Metadata } from "next";
import Link from "next/link";
import { VideoItem } from "@/components/cards";
import { MiniPass } from "@/components/MiniPass";
import { CheckList, FaqList, PageHeader, Section, SectionHeading, SourceNote } from "@/components/ui";
import mbbs from "@/content/mbbs.json";
import { getVideoById } from "@/lib/content";
import { SOCIAL } from "@/lib/site";

export const metadata: Metadata = {
  title: mbbs.meta.title,
  description: mbbs.meta.description,
  alternates: { canonical: "/mbbs-abroad/" },
};

export default function Page() {
  const video = getVideoById("xbvWKsia2xA");
  return (
    <>
      <PageHeader crumbs={[{ name: "Study abroad", href: "/study-abroad/" }, { name: "MBBS abroad", href: "/mbbs-abroad/" }]} title={mbbs.h1} eyebrowCode="MBBS · NMC rules" intro={mbbs.intro}>
        <Link href="/free-profile-check/?level=mbbs" className="btn btn-primary">
          Check my profile for MBBS abroad
        </Link>
      </PageHeader>

      <Section labelledBy="rules-h">
        <SectionHeading id="rules-h" intro={mbbs.rulesNote}>
          The NMC rules
        </SectionHeading>
        <dl className="max-w-[880px] divide-y divide-line border-y border-line">
          {mbbs.rules.map((r) => (
            <div key={r.label} className="grid gap-1 py-4 md:grid-cols-[200px_minmax(0,1fr)] md:gap-6">
              <dt className="font-semibold">{r.label}</dt>
              <dd>
                <p>{r.text}</p>
                <SourceNote source={r.source} lastVerified={r.lastVerified} className="mt-1" />
              </dd>
            </div>
          ))}
        </dl>
      </Section>

      <Section tone="ground" labelledBy="check-h">
        <SectionHeading id="check-h" intro="Ask these questions about every university before you pay a deposit.">
          Six questions before you choose a university
        </SectionHeading>
        <CheckList items={mbbs.checklist} className="max-w-[66ch]" />
      </Section>

      {video ? (
        <Section labelledBy="video-h">
          <SectionHeading id="video-h">Watch: MBBS abroad in 2026</SectionHeading>
          <div className="max-w-[720px]">
            <VideoItem v={video} href={SOCIAL.YouTube} linkLabel="More videos on our YouTube channel" />
          </div>
        </Section>
      ) : null}

      <FaqList items={mbbs.faq} tone="ground" title="MBBS abroad questions" />
      <MiniPass to="MBBS" code="MBBS" query={{ level: "mbbs" }} title="Check your profile for MBBS abroad" />
    </>
  );
}
