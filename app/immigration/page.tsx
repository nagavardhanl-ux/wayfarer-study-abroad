import { ServicePage, serviceMetadata } from "@/components/ServicePage";

export const metadata = serviceMetadata("immigration");

export default function Page() {
  return <ServicePage slug="immigration" parent={null} />;
}
