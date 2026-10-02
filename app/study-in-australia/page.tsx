import { CountryPage, countryMetadata } from "@/components/CountryPage";

export const metadata = countryMetadata("australia");

export default function Page() {
  return <CountryPage slug="australia" />;
}
