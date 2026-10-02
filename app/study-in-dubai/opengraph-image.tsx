import { getCountry } from "@/lib/content";
import { ogContentType, ogSize, passOgImage } from "@/lib/og";

export const size = ogSize;
export const contentType = ogContentType;
export const alt = "Study in Dubai with Wayfarer: costs, intakes and visa rules";

export default function Image() {
  const c = getCountry("dubai");
  return passOgImage({ to: c.name, code: c.code, line: "Costs, intakes and visa rules in rupees" });
}

export const dynamic = "force-static";
