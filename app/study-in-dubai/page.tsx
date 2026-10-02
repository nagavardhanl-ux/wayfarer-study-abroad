import { CountryPage, countryMetadata } from "@/components/CountryPage";

export const metadata = countryMetadata("dubai");

export default function Page() {
  return <CountryPage slug="dubai" />;
}
