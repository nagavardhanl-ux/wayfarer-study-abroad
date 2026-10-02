import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader, Section, formatDate } from "@/components/ui";
import { listMdx, readFrontmatter } from "@/lib/mdx";

export const metadata: Metadata = {
  title: "Study abroad blog: visas, costs and work rules",
  description: "Articles from Wayfarer counsellors on studying abroad, visas, work rights and costs for Indian students.",
  alternates: { canonical: "/blog/" },
};

export default function Page() {
  const posts = listMdx("blog")
    .map((s) => readFrontmatter(`blog/${s}.mdx`))
    .filter((p) => !p.draft)
    .sort((a, b) => (b.updated ?? b.date ?? "").localeCompare(a.updated ?? a.date ?? ""));
  return (
    <>
      <PageHeader crumbs={[{ name: "Blog", href: "/blog/" }]} title="Articles on visas, costs and work after study." intro="Written by our counsellors and checked against official sources." />
      <Section>
        <ul className="max-w-[760px] divide-y divide-line border-y border-line">
          {posts.map((p) => (
            <li key={p.slug} className="py-6">
              <p className="text-sm text-muted">{p.updated ? `Updated ${formatDate(p.updated)}` : p.date ? formatDate(p.date) : ""}</p>
              <h2 className="mt-1 font-display text-2xl font-bold">
                <Link href={`/${p.slug}/`} className="hover:text-blue">{p.title}</Link>
              </h2>
              <p className="mt-2 text-muted">{p.description}</p>
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}
