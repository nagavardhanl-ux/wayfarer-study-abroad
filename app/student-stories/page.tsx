import type { Metadata } from "next";
import { StoryCard } from "@/components/cards";
import { MiniPass } from "@/components/MiniPass";
import { StoryFilters } from "@/components/StoryFilters";
import { PageHeader, Section } from "@/components/ui";
import { getCountry, getTestimonials } from "@/lib/content";

export const metadata: Metadata = {
  title: "Student stories: visas approved for Wayfarer students",
  description: "Students from Bengaluru, Chennai, Pune and Kochi who got their visas with Wayfarer: their university, country, course and intake. Filter by country and intake.",
  alternates: { canonical: "/student-stories/" },
};

function countryName(slug: string) {
  try {
    return getCountry(slug).name;
  } catch {
    return slug;
  }
}

export default function Page() {
  const stories = getTestimonials();
  return (
    <>
      <PageHeader
        crumbs={[{ name: "Student stories", href: "/student-stories/" }]}
        title="Visas approved for students from our four branches."
        intro="Every story is shared with the student's written permission."
      />
      <Section>
        <StoryFilters items={stories.map((s) => ({ id: s.id, country: s.country, countryName: countryName(s.country), intake: s.intake }))}>
          <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {stories.map((t) => (
              <li key={t.id} data-story data-country={t.country} data-intake={t.intake} className="border border-line">
                <StoryCard t={t} countryName={countryName(t.country)} />
              </li>
            ))}
          </ul>
        </StoryFilters>
      </Section>
      <MiniPass />
    </>
  );
}
