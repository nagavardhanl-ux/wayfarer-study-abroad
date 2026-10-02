import { MdxPage, mdxMetadata } from "@/components/MdxPage";

export const generateMetadata = () => mdxMetadata("pages/privacy-policy.mdx", "/privacy-policy/");

export default function Page() {
  return <MdxPage rel="pages/privacy-policy.mdx" crumbs={[{ name: "Privacy policy", href: "/privacy-policy/" }]} showCta={false} />;
}
