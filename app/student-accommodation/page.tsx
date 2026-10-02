import { ServicePage, serviceMetadata } from "@/components/ServicePage";

export const metadata = serviceMetadata("student-accommodation");

export default function Page() {
  return <ServicePage slug="student-accommodation" />;
}
