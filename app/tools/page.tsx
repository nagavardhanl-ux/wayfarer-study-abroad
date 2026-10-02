import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "@/components/Icons";
import { PageHeader, Section } from "@/components/ui";

export const metadata: Metadata = {
  title: "Study abroad tools: cost, loan EMI, eligibility, intakes",
  description: "Free calculators for students and parents: study abroad costs in rupees, education loan EMI, English score eligibility and intake deadlines.",
  alternates: { canonical: "/tools/" },
};

const TOOLS = [
  { href: "/tools/cost-calculator/", name: "Cost calculator", text: "Tuition and living costs in rupees, per year and in total." },
  { href: "/tools/loan-emi-calculator/", name: "Loan EMI calculator", text: "Monthly EMI and total repayment, including the moratorium." },
  { href: "/tools/eligibility-check/", name: "Eligibility check", text: "Your English score against the official visa minimum." },
  { href: "/tools/intake-deadlines/", name: "Intake deadlines", text: "Upcoming intakes and months left to apply." },
];

export default function Page() {
  return (
    <>
      <PageHeader crumbs={[{ name: "Tools", href: "/tools/" }]} title="Four tools to plan the cost and the timeline." intro="They work on your phone, and your answers carry into the free profile check." />
      <Section>
        <ul className="grid border-l border-t border-line sm:grid-cols-2">
          {TOOLS.map((t) => (
            <li key={t.href} className="border-b border-r border-line">
              <Link href={t.href} className="group flex h-full flex-col gap-2 p-6 hover:bg-ground">
                <span className="flex items-center justify-between font-display text-2xl font-bold">
                  {t.name} <ArrowRight className="h-5 w-5 text-blue" />
                </span>
                <span className="text-muted">{t.text}</span>
              </Link>
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}
