import { CountryPage, countryMetadata } from "@/components/CountryPage";

export const metadata = countryMetadata("usa");

export default function Page() {
  return <CountryPage slug="usa" />;
}
