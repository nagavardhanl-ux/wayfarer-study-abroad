import type { Metadata } from "next";
import { PageHeader, Section } from "@/components/ui";
import { IntakeTracker } from "@/components/tools/IntakeTracker";
import { intakeToolData } from "@/lib/tools-data";

export const metadata: Metadata = {
  title: "Study abroad intake deadline tracker",
  description: "Upcoming intakes for the UK, USA, Australia, Ireland and Germany, with months left to apply and official application deadlines where published.",
  alternates: { canonical: "/tools/intake-deadlines/" },
};

export default function Page() {
  return (
    <>
      <PageHeader
        crumbs={[{ name: "Tools", href: "/tools/" }, { name: "Intake deadlines", href: "/tools/intake-deadlines/" }]}
        title="How many months do you have before the next intake?"
        intro="Upcoming intakes by country, with official application deadlines where they are published."
      />
      <Section>
        <IntakeTracker countries={intakeToolData()} />
      </Section>
    </>
  );
}
