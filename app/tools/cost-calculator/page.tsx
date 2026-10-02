import type { Metadata } from "next";
import { PageHeader, Section } from "@/components/ui";
import { CostCalculator } from "@/components/tools/CostCalculator";
import { costToolData } from "@/lib/tools-data";

export const metadata: Metadata = {
  title: "Study abroad cost calculator in rupees",
  description: "Estimate tuition and living costs in rupees per year and in total for the UK, Canada, Ireland, New Zealand and Germany, using official figures.",
  alternates: { canonical: "/tools/cost-calculator/" },
};

export default function Page() {
  const d = costToolData();
  return (
    <>
      <PageHeader
        crumbs={[{ name: "Tools", href: "/tools/" }, { name: "Cost calculator", href: "/tools/cost-calculator/" }]}
        title="What will the degree cost in rupees?"
        intro={`Tuition and living costs per year and in total, from official sources. Only countries with verified figures are listed (${d.countries.map((c) => c.name).join(", ")}).`}
      />
      <Section>
        <CostCalculator countries={d.countries} rates={d.rates} rateDate={d.rateDate} />
      </Section>
    </>
  );
}
