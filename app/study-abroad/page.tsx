import type { Metadata } from "next";
import Link from "next/link";
import { DestinationGrid } from "@/components/cards";
import { hasCostData } from "@/components/CountryPage";
import { MiniPass } from "@/components/MiniPass";
import { PageHeader, Section, SectionHeading, TextLink } from "@/components/ui";
import { getCountries } from "@/lib/content";

export const metadata: Metadata = {
  title: "Study abroad destinations for Indian students",
  description: "Compare the USA, UK, Canada, Australia, Ireland, Germany, New Zealand, Malta, Europe, Dubai and Singapore: costs in rupees, intakes and work rights after study, from official sources.",
  alternates: { canonical: "/study-abroad/" },
};

export default function Page() {
  const countries = getCountries();
  const compare = countries.filter((c) => c.workRights.afterStudy);
  return (
    <>
      <PageHeader
        crumbs={[{ name: "Study abroad", href: "/study-abroad/" }]}
        title="Pick a destination by cost, intake and work rights."
        intro="Every figure on these pages comes from a government or university source, with the date we checked it."
      />
      <Section labelledBy="dest-h">
        <SectionHeading id="dest-h">Destinations</SectionHeading>
        <DestinationGrid countries={countries} />
        <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
          <TextLink href="/tools/cost-calculator/">Compare costs ({countries.filter(hasCostData).length} countries)</TextLink>
          <TextLink href="/tools/intake-deadlines/">Upcoming intakes</TextLink>
          <TextLink href="/tools/eligibility-check/">Check your English score</TextLink>
        </div>
      </Section>
      <Section tone="ground" labelledBy="work-h">
        <SectionHeading id="work-h" intro="How long you can stay and work after graduating, by country.">
          Work after study, compared
        </SectionHeading>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[620px] border-collapse text-left">
            <thead>
              <tr className="border-b-2 border-ink">
                <th scope="col" className="pass-label py-2 pr-4 text-muted">Country</th>
                <th scope="col" className="pass-label py-2 text-muted">After you graduate</th>
              </tr>
            </thead>
            <tbody>
              {compare.map((c) => (
                <tr key={c.slug} className="border-b border-line align-top">
                  <th scope="row" className="py-3 pr-4">
                    <Link href={c.path} className="font-semibold text-blue underline underline-offset-4">{c.name}</Link>
                  </th>
                  <td className="py-3">{c.workRights.afterStudy!.text}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>
      <MiniPass />
    </>
  );
}
