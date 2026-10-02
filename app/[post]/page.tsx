import type { Metadata } from "next";
import Image from "next/image";
import { JsonLd } from "@/components/JsonLd";
import { MiniPass } from "@/components/MiniPass";
import { Container, PageHeader, formatDate } from "@/components/ui";
import { listMdx, loadMdx } from "@/lib/mdx";
import { articleSchema } from "@/lib/schema";

/** Blog posts keep their original WordPress URLs at the site root, e.g. /uk-study-destination-for-indian-students/ */
export const dynamicParams = false;

export function generateStaticParams() {
  return listMdx("blog").map((post) => ({ post }));
}

export async function generateMetadata({ params }: PageProps<"/[post]">): Promise<Metadata> {
  const { post } = await params;
  const { frontmatter } = await loadMdx(`blog/${post}.mdx`);
  return {
    title: frontmatter.title,
    description: frontmatter.description,
    alternates: { canonical: `/${post}/` },
    openGraph: { type: "article", url: `/${post}/`, images: frontmatter.image ? [frontmatter.image] : undefined },
  };
}

export default async function Page({ params }: PageProps<"/[post]">) {
  const { post } = await params;
  const { content, frontmatter: f } = await loadMdx(`blog/${post}.mdx`);
  return (
    <>
      <PageHeader
        crumbs={[{ name: "Blog", href: "/blog/" }, { name: f.title, href: `/${post}/` }]}
        title={f.title}
        intro={
          <span className="text-base">
            Published {formatDate(f.date!)}
            {f.updated ? ` · Updated ${formatDate(f.updated)}` : ""}
          </span>
        }
      />
      <Container className="py-10 md:py-14">
        {f.image ? <Image src={f.image} alt="" width={1200} height={500} sizes="(min-width: 768px) 720px, 100vw" className="mb-8 aspect-[12/5] w-full max-w-[720px] rounded-sm object-cover" /> : null}
        <article className="prose">{content}</article>
      </Container>
      <MiniPass />
      <JsonLd data={articleSchema({ title: f.title, description: f.description, path: `/${post}/`, published: f.date!, modified: f.updated, image: f.image })} />
    </>
  );
}
