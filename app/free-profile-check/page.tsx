import type { Metadata } from "next";
import { ProfileCheck } from "@/components/profile-check/ProfileCheck";
import { CheckList, Container, Breadcrumbs } from "@/components/ui";
import { profileCheckProps } from "@/lib/profile-check-data";

export const metadata: Metadata = {
  title: "Free profile check for studying abroad",
  description: "Seven short questions, about two minutes. Tell us your destination, course, marks, English test and budget, and a counsellor from your nearest Wayfarer branch calls you back.",
  alternates: { canonical: "/free-profile-check/" },
};

export default function Page() {
  const pc = profileCheckProps();
  return (
    <div className="bg-ground" style={{ "--notch-bg": "var(--ground)" } as React.CSSProperties}>
      <Container className="py-8 md:py-14">
        <Breadcrumbs items={[{ name: "Free profile check", href: "/free-profile-check/" }]} />
        <div className="mt-5 grid gap-8 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:gap-12">
          <div>
            <h1 className="t-h1">Free profile check</h1>
            <p className="t-lead mt-4 text-muted">Seven short questions, about two minutes. A counsellor from your nearest branch calls you back.</p>
            <h2 className="mt-8 font-display text-lg font-bold">What happens next</h2>
            <CheckList
              className="mt-3"
              items={[
                "A counsellor calls you to go through your answers.",
                "You get a shortlist of countries and universities that fit.",
                "You decide the next step. There is no charge for this.",
              ]}
            />
          </div>
          <ProfileCheck destinations={pc.destinations} branches={pc.branches} />
        </div>
      </Container>
    </div>
  );
}
