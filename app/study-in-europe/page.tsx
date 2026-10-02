import { CountryPage, countryMetadata } from "@/components/CountryPage";

export const metadata = countryMetadata("europe");

export default function Page() {
  return <CountryPage slug="europe" />;
}
