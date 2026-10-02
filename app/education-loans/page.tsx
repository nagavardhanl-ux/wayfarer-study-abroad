import { ServicePage, serviceMetadata } from "@/components/ServicePage";

export const metadata = serviceMetadata("education-loans");

export default function Page() {
  return <ServicePage slug="education-loans" />;
}
