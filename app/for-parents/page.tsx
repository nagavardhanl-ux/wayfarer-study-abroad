import { MdxPage, mdxMetadata } from "@/components/MdxPage";

export const generateMetadata = () => mdxMetadata("pages/for-parents.mdx", "/for-parents/");

export default function Page() {
  return <MdxPage rel="pages/for-parents.mdx" crumbs={[{ name: "For parents", href: "/for-parents/" }]} showCta={false} />;
}
