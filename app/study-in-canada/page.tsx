import { CountryPage, countryMetadata } from "@/components/CountryPage";

export const metadata = countryMetadata("canada");

export default function Page() {
  return <CountryPage slug="canada" />;
}
