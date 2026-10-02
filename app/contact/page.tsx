import type { Metadata } from "next";
import Link from "next/link";
import { BranchBlock } from "@/components/cards";
import { PageHeader, Section, SectionHeading } from "@/components/ui";
import { getBranches } from "@/lib/content";
import { SOCIAL_LINKS } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact Wayfarer: call, WhatsApp or visit a branch",
  description: "Call or WhatsApp Wayfarer in Bengaluru, Chennai, Pune or Kochi, or start a free profile check online and a counsellor will call you back.",
  alternates: { canonical: "/contact/" },
};

export default function Page() {
  return (
    <>
      <PageHeader
        crumbs={[{ name: "Contact", href: "/contact/" }]}
        title="Call, WhatsApp, or visit your nearest branch."
        intro="The fastest way to get advice is the free profile check. A counsellor from the branch you choose calls you back."
      >
        <Link href="/free-profile-check/" className="btn btn-primary">
          Start free profile check
        </Link>
      </PageHeader>
      <Section labelledBy="branches-h">
        <SectionHeading id="branches-h">Branches</SectionHeading>
        <div className="grid gap-x-10 gap-y-12 sm:grid-cols-2">
          {getBranches().map((b) => (
            <div key={b.slug} className="border-t-2 border-navy pt-5">
              <BranchBlock b={b} />
            </div>
          ))}
        </div>
      </Section>
      {SOCIAL_LINKS.length ? (
        <Section tone="ground" labelledBy="social-h">
          <SectionHeading id="social-h">Follow Wayfarer</SectionHeading>
          <ul className="flex flex-wrap gap-3">
            {SOCIAL_LINKS.map(([name, href]) => (
              <li key={name}>
                <a href={href} target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
                  {name}
                </a>
              </li>
            ))}
          </ul>
        </Section>
      ) : null}
    </>
  );
}
