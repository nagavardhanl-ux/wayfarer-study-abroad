import { ServicePage, serviceMetadata } from "@/components/ServicePage";

export const metadata = serviceMetadata("visit-visas");

export default function Page() {
  return <ServicePage slug="visit-visas" parent={null} />;
}
