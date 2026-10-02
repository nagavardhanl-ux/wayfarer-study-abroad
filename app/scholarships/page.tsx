import { ServicePage, serviceMetadata } from "@/components/ServicePage";

export const metadata = serviceMetadata("scholarships");

export default function Page() {
  return <ServicePage slug="scholarships" />;
}
