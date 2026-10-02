import type { Metadata } from "next";
import { loadMdx } from "@/lib/mdx";
import { MiniPass } from "./MiniPass";
import { Container, PageHeader, type Crumb } from "./ui";

export async function mdxMetadata(rel: string, path: string): Promise<Metadata> {
  const { frontmatter } = await loadMdx(rel);
  return {
    title: frontmatter.title,
    description: frontmatter.description,
    alternates: { canonical: path },
    openGraph: { url: path, title: frontmatter.title, description: frontmatter.description },
  };
}

/** A long-form page rendered from an MDX file in /content. */
export async function MdxPage({ rel, crumbs, showCta = true }: { rel: string; crumbs: Crumb[]; showCta?: boolean }) {
  const { content, frontmatter } = await loadMdx(rel);
  return (
    <>
      <PageHeader crumbs={crumbs} title={frontmatter.h1 ?? frontmatter.title} intro={frontmatter.intro} />
      <Container className="py-10 md:py-16">
        <article className="prose">{content}</article>
      </Container>
      {showCta ? <MiniPass /> : null}
    </>
  );
}
