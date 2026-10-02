import { CountryPage, countryMetadata } from "@/components/CountryPage";

export const metadata = countryMetadata("malta");

export default function Page() {
  return <CountryPage slug="malta" />;
}
