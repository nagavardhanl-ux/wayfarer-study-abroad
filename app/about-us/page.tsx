import Image from "next/image";
import { BranchBlock } from "@/components/cards";
import { mdxMetadata } from "@/components/MdxPage";
import { MiniPass } from "@/components/MiniPass";
import { Container, PageHeader, SampleBadge, Section, SectionHeading, TextLink } from "@/components/ui";
import { getBranch, getBranches, getCountry, getTeam } from "@/lib/content";
import { loadMdx } from "@/lib/mdx";

export const generateMetadata = () => mdxMetadata("pages/about-us.mdx", "/about-us/");

export default async function Page() {
  const { content, frontmatter } = await loadMdx("pages/about-us.mdx");
  const team = getTeam();
  return (
    <>
      <PageHeader crumbs={[{ name: "About us", href: "/about-us/" }]} title={frontmatter.h1!} intro={frontmatter.intro} />
      <Container className="py-10 md:py-16">
        <article className="prose">{content}</article>
        <div className="mt-8">
          <TextLink href="/student-stories/">Read student stories</TextLink>
        </div>
      </Container>

      <Section tone="ground" labelledBy="team-h">
        <SectionHeading id="team-h">Our counsellors</SectionHeading>
        <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {team.map((m) => (
            <li key={m.id}>
              {m.photo ? (
                <Image src={m.photo} alt={m.name} width={400} height={400} className="aspect-square w-full rounded-sm object-cover" />
              ) : (
                <div aria-hidden className="flex aspect-square w-full items-center justify-center rounded-sm bg-paper font-display text-5xl font-bold text-navy/40">
                  {m.name.slice(0, 1)}
                </div>
              )}
              <p className="mt-3 flex items-center gap-2 font-display text-lg font-bold">
                {m.name} <SampleBadge show={m.sample} />
              </p>
              <p className="text-muted">
                {m.role}, {getBranch(m.branch).name}
              </p>
              {m.countries.length ? <p className="text-sm">Countries: {m.countries.map((c) => getCountry(c).name).join(", ")}</p> : null}
              {m.yearsWithWayfarer > 0 ? <p className="text-sm text-muted">{m.yearsWithWayfarer} years with Wayfarer</p> : null}
            </li>
          ))}
        </ul>
      </Section>

      <Section labelledBy="branches-h">
        <SectionHeading id="branches-h">Our branches</SectionHeading>
        <div className="grid gap-x-8 gap-y-10 border-t border-line pt-8 sm:grid-cols-2 lg:grid-cols-4">
          {getBranches().map((b) => (
            <BranchBlock key={b.slug} b={b} />
          ))}
        </div>
      </Section>
      <MiniPass />
    </>
  );
}
