import { CountryPage, countryMetadata } from "@/components/CountryPage";

export const metadata = countryMetadata("uk");

export default function Page() {
  return <CountryPage slug="uk" />;
}
