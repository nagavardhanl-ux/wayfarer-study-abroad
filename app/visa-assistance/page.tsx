import { ServicePage, serviceMetadata } from "@/components/ServicePage";

export const metadata = serviceMetadata("visa-assistance");

export default function Page() {
  return <ServicePage slug="visa-assistance" />;
}
