import { CountryPage, countryMetadata } from "@/components/CountryPage";

export const metadata = countryMetadata("new-zealand");

export default function Page() {
  return <CountryPage slug="new-zealand" />;
}
