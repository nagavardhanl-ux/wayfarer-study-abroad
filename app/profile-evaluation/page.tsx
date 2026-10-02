import { ServicePage, serviceMetadata } from "@/components/ServicePage";

export const metadata = serviceMetadata("profile-evaluation");

export default function Page() {
  return <ServicePage slug="profile-evaluation" />;
}
