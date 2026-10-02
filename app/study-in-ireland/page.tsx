import { CountryPage, countryMetadata } from "@/components/CountryPage";

export const metadata = countryMetadata("ireland");

export default function Page() {
  return <CountryPage slug="ireland" />;
}
