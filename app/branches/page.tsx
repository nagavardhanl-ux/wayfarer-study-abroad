import type { Metadata } from "next";
import { BranchBlock } from "@/components/cards";
import { MiniPass } from "@/components/MiniPass";
import { PageHeader, Section } from "@/components/ui";
import { getBranches } from "@/lib/content";

export const metadata: Metadata = {
  title: "Wayfarer branches in Bengaluru, Chennai, Pune and Kochi",
  description: "Visit Wayfarer at Bengaluru, Chennai, Pune or Kochi. Addresses, phone numbers, WhatsApp and directions.",
  alternates: { canonical: "/branches/" },
};

export default function Page() {
  return (
    <>
      <PageHeader
        crumbs={[{ name: "Branches", href: "/branches/" }]}
        title="Four branches across South and West India."
        intro="Meet your counsellor in person. Bring your marks memos and passport, and bring your parents."
      />
      <Section>
        <div className="grid gap-x-10 gap-y-12 sm:grid-cols-2">
          {getBranches().map((b) => (
            <div key={b.slug} className="border-t-2 border-navy pt-5">
              <BranchBlock b={b} headingLevel={2} />
            </div>
          ))}
        </div>
      </Section>
      <MiniPass />
    </>
  );
}
