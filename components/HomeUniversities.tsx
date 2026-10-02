import { getCountry, getUniversities } from "@/lib/content";
import { LogoMarquee } from "./LogoMarquee";
import { Container, SectionHeading } from "./ui";

/** "Popular universities": every entry in data/universities.json, sliding in rows. */
export function HomeUniversities() {
  const all = getUniversities();
  const countries: string[] = [];
  for (const u of all) if (!countries.includes(u.country)) countries.push(u.country);
  // Mix countries so each row shows a spread of destinations
  const byCountry = countries.map((c) => all.filter((u) => u.country === c));
  const mixed: typeof all = [];
  for (let i = 0; mixed.length < all.length; i++) for (const list of byCountry) if (list[i]) mixed.push(list[i]);

  return (
    <section aria-labelledby="unis-h" className="cv-auto bg-ground py-12 md:py-[88px]">
      <Container>
        <SectionHeading id="unis-h">
          Popular universities with Indian students
        </SectionHeading>
      </Container>
      <LogoMarquee logos={mixed.map((u) => ({ name: u.name, countryName: getCountry(u.country).name }))} rows={all.length > 30 ? 3 : 2} />
    </section>
  );
}
