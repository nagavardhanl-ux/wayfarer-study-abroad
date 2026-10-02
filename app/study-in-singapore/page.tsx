import { CountryPage, countryMetadata } from "@/components/CountryPage";

export const metadata = countryMetadata("singapore");

export default function Page() {
  return <CountryPage slug="singapore" />;
}
