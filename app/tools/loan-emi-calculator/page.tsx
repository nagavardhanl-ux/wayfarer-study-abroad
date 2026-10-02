import type { Metadata } from "next";
import { PageHeader, Section, TextLink } from "@/components/ui";
import { EmiCalculator } from "@/components/tools/EmiCalculator";

export const metadata: Metadata = {
  title: "Education loan EMI calculator with moratorium",
  description: "Work out the monthly EMI, total repayment and interest on a study abroad education loan, including interest during the moratorium period.",
  alternates: { canonical: "/tools/loan-emi-calculator/" },
};

export default function Page() {
  return (
    <>
      <PageHeader
        crumbs={[{ name: "Tools", href: "/tools/" }, { name: "Loan EMI calculator", href: "/tools/loan-emi-calculator/" }]}
        title="See the monthly EMI before you take the loan."
        intro="Enter the loan amount, interest rate, repayment period and moratorium. The calculator shows the EMI, total repayment and total interest."
      />
      <Section>
        <EmiCalculator />
        <div className="mt-8">
          <TextLink href="/education-loans/">How education loans work, including low CIBIL cases</TextLink>
        </div>
      </Section>
    </>
  );
}
