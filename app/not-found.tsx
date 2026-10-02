import Link from "next/link";
import { BranchBlock } from "@/components/cards";
import { Container, Section, SectionHeading } from "@/components/ui";
import { getBranches } from "@/lib/content";

export const metadata = { title: "Page not found", robots: { index: false } };

export default function NotFound() {
  return (
    <>
      <div className="bg-ground">
        <Container className="py-12 md:py-20">
          <p className="pass-label text-orange-ink">Error 404 · Gate changed</p>
          <h1 className="t-h1 mt-3 max-w-[20ch]">This page has moved or no longer exists.</h1>
          <p className="t-lead mt-4 max-w-[52ch] text-muted">Start a free profile check, or contact a branch and a counsellor will help you directly.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/free-profile-check/" className="btn btn-primary">Start free profile check</Link>
            <Link href="/" className="btn btn-secondary">Go to the home page</Link>
          </div>
        </Container>
      </div>
      <Section labelledBy="b-h">
        <SectionHeading id="b-h">Our branches</SectionHeading>
        <div className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {getBranches().map((b) => (
            <BranchBlock key={b.slug} b={b} />
          ))}
        </div>
      </Section>
    </>
  );
}
