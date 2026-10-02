import fs from "node:fs";
import path from "node:path";
import { cache } from "react";
import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { mdxComponents } from "@/components/mdx-components";

export type PageFrontmatter = {
  title: string;
  description: string;
  h1?: string;
  intro?: string;
  date?: string;
  updated?: string;
  image?: string;
  draft?: boolean;
};

const ROOT = path.join(process.cwd(), "content");

/** Compiles one MDX file from /content. Frontmatter is validated for title and description. */
export const loadMdx = cache(async (rel: string) => {
  const file = path.join(ROOT, rel);
  const source = fs.readFileSync(file, "utf8");
  const { content, frontmatter } = await compileMDX<PageFrontmatter>({
    source,
    components: mdxComponents,
    options: { parseFrontmatter: true, mdxOptions: { remarkPlugins: [remarkGfm] } },
  });
  if (!frontmatter.title || !frontmatter.description) throw new Error(`content/${rel} needs a title and description in its frontmatter`);
  return { content, frontmatter };
});

/** Lists MDX files in a /content subfolder (without extension). */
export function listMdx(dir: string): string[] {
  const full = path.join(ROOT, dir);
  if (!fs.existsSync(full)) return [];
  return fs
    .readdirSync(full)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(/\.mdx$/, ""));
}

/** Reads only the frontmatter (cheap, for index pages and the sitemap). */
export function readFrontmatter(rel: string): PageFrontmatter & { slug: string } {
  const source = fs.readFileSync(path.join(ROOT, rel), "utf8");
  const m = source.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  const data: Record<string, string> = {};
  if (m) {
    for (const line of m[1].split(/\r?\n/)) {
      const i = line.indexOf(":");
      if (i > 0) data[line.slice(0, i).trim()] = line.slice(i + 1).trim().replace(/^["']|["']$/g, "");
    }
  }
  return { ...(data as unknown as PageFrontmatter), draft: data.draft === "true", slug: path.basename(rel, ".mdx") };
}
