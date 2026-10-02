import { ogContentType, ogSize, passOgImage } from "@/lib/og";

export const size = ogSize;
export const contentType = ogContentType;
export const alt = "Wayfarer: study abroad from Bengaluru, Chennai, Pune and Kochi";

export default function Image() {
  return passOgImage({ to: "Abroad", code: "ANY", line: "Admission, education loan and visa. Since 2011." });
}
