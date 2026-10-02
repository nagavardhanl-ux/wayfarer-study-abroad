import { MdxPage, mdxMetadata } from "@/components/MdxPage";

export const generateMetadata = () => mdxMetadata("pages/terms.mdx", "/terms/");

export default function Page() {
  return <MdxPage rel="pages/terms.mdx" crumbs={[{ name: "Terms", href: "/terms/" }]} showCta={false} />;
}
