import { CountryPage, countryMetadata } from "@/components/CountryPage";

export const metadata = countryMetadata("germany");

export default function Page() {
  return <CountryPage slug="germany" />;
}
