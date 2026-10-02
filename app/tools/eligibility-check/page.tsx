import type { Metadata } from "next";
import { PageHeader, Section } from "@/components/ui";
import { EligibilityCheck } from "@/components/tools/EligibilityCheck";
import { eligibilityToolData } from "@/lib/tools-data";

export const metadata: Metadata = {
  title: "Study abroad eligibility check: English score",
  description: "Compare your IELTS, PTE or TOEFL score with the official student visa minimum. Results show meets, close or below typical requirements; a counsellor confirms.",
  alternates: { canonical: "/tools/eligibility-check/" },
};

export default function Page() {
  const countries = eligibilityToolData();
  return (
    <>
      <PageHeader
        crumbs={[{ name: "Tools", href: "/tools/" }, { name: "Eligibility check", href: "/tools/eligibility-check/" }]}
        title="Is your English score enough?"
        intro={`Compares your score with the official minimum for ${countries.map((c) => c.name).join(" and ")}. More countries appear here as official requirement data is added.`}
      />
      <Section>
        <EligibilityCheck countries={countries} />
      </Section>
    </>
  );
}
