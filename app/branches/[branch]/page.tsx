import fs from "node:fs";
import path from "node:path";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { RatingRow } from "@/components/cards";
import { ExternalIcon, PhoneIcon, StarIcon, WhatsAppIcon } from "@/components/Icons";
import { JsonLd } from "@/components/JsonLd";
import { MapEmbed } from "@/components/MapEmbed";
import { MiniPass } from "@/components/MiniPass";
import { CheckList, PageHeader, SampleBadge, Section, SectionHeading } from "@/components/ui";
import { getBranch, getBranchReviews, getBranches, getCountry, getTeam } from "@/lib/content";
import { telHref, whatsappHref } from "@/lib/contact";
import { localBusinessSchema } from "@/lib/schema";

export const dynamicParams = false;

export function generateStaticParams() {
  return getBranches().map((b) => ({ branch: b.slug }));
}

export async function generateMetadata({ params }: PageProps<"/branches/[branch]">): Promise<Metadata> {
  const { branch } = await params;
  const b = getBranch(branch);
  const place = b.city;
  return {
    title: { absolute: `Study Abroad Consultants in ${place} | Wayfarer` },
    description: `Wayfarer ${b.name}: ${b.addressLines.join(", ")}. Call ${b.phoneDisplay} or WhatsApp. Study abroad counselling, applications, education loans and visas since 2011.`,
    alternates: { canonical: `/branches/${b.slug}/` },
  };
}

export default async function Page({ params }: PageProps<"/branches/[branch]">) {
  const { branch } = await params;
  const b = getBranch(branch);
  const r = getBranchReviews(b.slug);
  const team = getTeam(b.slug);
  const officePhotos = branchPhotos(b.slug);
  const waMsg = `Hello Wayfarer ${b.name}, I would like to visit the branch and talk to a counsellor about studying abroad.`;

  return (
    <>
      <PageHeader
        crumbs={[{ name: "Branches", href: "/branches/" }, { name: b.name, href: `/branches/${b.slug}/` }]}
        title={`Study abroad consultants in ${b.city}`}
        eyebrowCode={`${b.cityCode} · Wayfarer ${b.name} branch`}
        intro="Counselling, applications, education loans and visas, face to face. Since 2011."
      >
        <a href={telHref(b.phone)} data-track="call" data-branch={b.slug} data-location="branch-header" className="btn btn-primary">
          <PhoneIcon className="h-4 w-4" /> Call {b.name} branch
        </a>
        <a href={whatsappHref(b.whatsapp, waMsg)} target="_blank" rel="noopener noreferrer" data-track="whatsapp" data-branch={b.slug} data-location="branch-header" className="btn btn-secondary">
          <WhatsAppIcon className="h-4 w-4" /> Chat on WhatsApp
        </a>
      </PageHeader>

      <Section labelledBy="visit-h">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
          <div>
            <h2 id="visit-h" className="t-h2">Visit the branch</h2>
            <address className="mt-5 not-italic leading-relaxed">
              {b.addressLines.map((l) => (
                <span key={l} className="block">
                  {l}
                </span>
              ))}
            </address>
            <dl className="mt-6 space-y-3">
              <div>
                <dt className="pass-label text-muted">Phone and WhatsApp</dt>
                <dd>
                  <a href={telHref(b.phone)} data-track="call" data-branch={b.slug} className="tabular font-display text-2xl font-bold text-blue underline underline-offset-4">
                    {b.phoneDisplay}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="pass-label text-muted">Timings</dt>
                <dd>{b.hours.length ? b.hours.map((h) => `${h.days}: ${h.opens} to ${h.closes}`).join(", ") : "Call before you visit to confirm timings."}</dd>
              </div>
            </dl>
            <h3 className="t-h3 mt-8">Finding us</h3>
            <CheckList items={b.landmarks} className="mt-3" />
            <a href={b.mapLink} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex items-center gap-1 font-semibold text-blue underline underline-offset-4">
              Directions in Google Maps <ExternalIcon className="h-4 w-4" />
            </a>
          </div>
          <MapEmbed src={b.mapEmbed} title={`Map of Wayfarer ${b.name}`} mapLink={b.mapLink} />
        </div>
      </Section>

      {officePhotos.length ? (
        <Section tone="ground" labelledBy="photos-h">
          <SectionHeading id="photos-h">Inside the {b.name} branch</SectionHeading>
          <div className="grid gap-4 sm:grid-cols-3">
            {officePhotos.map((src) => (
              <Image key={src} src={src} alt={`Wayfarer ${b.name} office`} width={600} height={400} className="w-full rounded-sm object-cover" />
            ))}
          </div>
        </Section>
      ) : null}

      <Section tone="ground" labelledBy="team-h">
        <SectionHeading id="team-h">Counsellors at {b.name}</SectionHeading>
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {team.map((m) => (
            <li key={m.id} className="flex gap-4">
              {m.photo ? (
                <Image src={m.photo} alt={m.name} width={80} height={80} className="h-20 w-20 rounded-full object-cover" />
              ) : (
                <span aria-hidden className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-paper font-display text-xl font-bold text-navy">
                  {m.name.slice(0, 1)}
                </span>
              )}
              <div>
                <p className="flex items-center gap-2 font-display text-lg font-bold">
                  {m.name} <SampleBadge show={m.sample} />
                </p>
                <p className="text-muted">{m.role}</p>
                {m.countries.length ? <p className="mt-1 text-sm">Countries: {m.countries.map((c) => safeName(c)).join(", ")}</p> : null}
                {m.yearsWithWayfarer > 0 ? <p className="text-sm text-muted">{m.yearsWithWayfarer} years with Wayfarer</p> : null}
              </div>
            </li>
          ))}
        </ul>
      </Section>

      <Section labelledBy="rating-h">
        <SectionHeading id="rating-h">Google reviews</SectionHeading>
        <ul className="max-w-[720px] divide-y divide-line border-y border-line">
          <RatingRow branch={b} r={r} />
        </ul>
        {r && r.rating > 0 ? (
          <ul className="mt-6 grid max-w-[900px] gap-6 md:grid-cols-3">
            {r.reviews.map((rv) => (
              <li key={rv.author + rv.text}>
                <p className="flex gap-0.5 text-orange" aria-label={`${rv.rating} out of 5 stars`}>
                  {Array.from({ length: rv.rating }).map((_, i) => (
                    <StarIcon key={i} className="h-4 w-4" />
                  ))}
                </p>
                <blockquote className="mt-2">{rv.text}</blockquote>
                <p className="mt-1 text-sm text-muted">{rv.author}</p>
              </li>
            ))}
          </ul>
        ) : null}
        <p className="mt-6">
          <Link href="/student-stories/" className="link">
            Read student stories
          </Link>
        </p>
      </Section>

      <MiniPass title={`Check your profile with the ${b.name} branch`} query={{ branch: b.slug }} />
      <JsonLd data={localBusinessSchema(b, r && !r.sample && r.reviewsUrl ? r : undefined)} />
    </>
  );
}

function safeName(slug: string) {
  try {
    return getCountry(slug).name;
  } catch {
    return slug;
  }
}

/** Office photos: any .jpg/.png/.webp files placed in /public/images/branches/<slug>/ */
function branchPhotos(slug: string): string[] {
  const dir = path.join(process.cwd(), "public", "images", "branches", slug);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => /\.(jpe?g|png|webp|avif)$/i.test(f))
    .sort()
    .map((f) => `/images/branches/${slug}/${f}`);
}
