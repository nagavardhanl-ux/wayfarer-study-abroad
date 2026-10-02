import Image from "next/image";
import Link from "next/link";
import type { Branch, BranchReviews, Country, Testimonial, Video } from "@/lib/content";
import { cleanVideoTitle } from "@/lib/content";
import { telHref, whatsappHref } from "@/lib/contact";
import { ArrowRight, ExternalIcon, PhoneIcon, StarIcon, WhatsAppIcon } from "./Icons";
import { WavingFlag } from "./Flag";
import { LiteYouTube } from "./LiteYouTube";
import { SampleBadge } from "./ui";

/* ---------- destinations ---------- */

export function DestinationGrid({ countries, includeMbbs = true }: { countries: Country[]; includeMbbs?: boolean }) {
  const tiles = [
    ...countries.map((c) => ({ slug: c.slug, href: c.path, code: c.code, name: c.name, line: destinationLine(c) })),
    ...(includeMbbs ? [{ slug: "mbbs", href: "/mbbs-abroad/", code: "MBBS", name: "MBBS abroad", line: "NMC rules explained" }] : []),
  ];
  return (
    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-4 lg:gap-5">
      {tiles.map((t, i) => (
        <li key={t.slug}>
          <Link
            href={t.href}
            className="dest-tile group flex h-full min-h-36 flex-col justify-between gap-4 rounded-[10px] border border-line bg-paper p-4 md:p-5"
          >
            <span className="flex items-start justify-between gap-3">
              <span className="min-w-0">
                <span className="pass-label block text-orange-ink">{t.code}</span>
                <span className="mt-1 block font-display text-xl font-bold leading-tight md:text-2xl">{t.name}</span>
              </span>
              <WavingFlag slug={t.slug} delay={(i % 4) * 180} />
            </span>
            <span className="flex items-end justify-between gap-2 text-sm text-muted">
              <span className="line-clamp-2">{t.line}</span>
              <ArrowRight className="h-4 w-4 shrink-0 text-blue transition-transform group-hover:translate-x-0.5" />
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

/** One short, factual line per destination, taken from verified data. */
function destinationLine(c: Country): string {
  if (c.intakes?.items.length) return `Starts: ${c.intakes.items.map((i) => i.label.split(" (")[0]).join(", ")}`;
  if (c.workRights.afterStudy) return "Work visa after study";
  return c.region;
}

/* ---------- student stories ---------- */

export function StoryCard({ t, countryName }: { t: Testimonial; countryName: string }) {
  const initials = t.firstName
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  return (
    <article className="flex h-full flex-col border-t-4 border-navy bg-paper p-5">
      <div className="flex items-start gap-4">
        {t.photo ? (
          <Image src={t.photo} alt={`${t.firstName}, Wayfarer student`} width={64} height={64} className="h-16 w-16 rounded-full object-cover" />
        ) : (
          <span aria-hidden className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-ground font-display text-xl font-bold text-navy">
            {initials}
          </span>
        )}
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-display text-lg font-bold">{t.firstName}</h3>
            <SampleBadge show={t.sample} />
          </div>
          <p className="text-sm text-muted">{t.course}</p>
        </div>
      </div>
      <dl className="mt-4 grid grid-cols-2 gap-3 border-y border-line py-3 text-sm">
        <div className="col-span-2">
          <dt className="pass-label text-muted">University</dt>
          <dd className="font-semibold">{t.university}</dd>
        </div>
        <div>
          <dt className="pass-label text-muted">Country</dt>
          <dd className="font-semibold">{countryName}</dd>
        </div>
        <div>
          <dt className="pass-label text-muted">Intake</dt>
          <dd className="tabular font-semibold">{t.intake}</dd>
        </div>
      </dl>
      <blockquote className="mt-4 flex-1 text-ink">
        <p>{t.quote}</p>
      </blockquote>
      {t.visaImage ? (
        <Image src={t.visaImage} alt={`Visa approval for ${t.firstName}, personal details hidden`} width={480} height={300} className="mt-4 w-full rounded-sm border border-line object-cover" />
      ) : null}
    </article>
  );
}

/* ---------- ratings ---------- */

export function RatingRow({ branch, r }: { branch: Branch; r?: BranchReviews }) {
  const has = r && r.rating > 0;
  return (
    <li className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 py-3">
      <span className="flex items-center gap-2">
        <Link href={`/branches/${branch.slug}/`} className="font-semibold hover:text-blue">
          {branch.name}
        </Link>
        <SampleBadge show={r?.sample} />
      </span>
      <span className="flex items-center gap-4">
        {has ? (
          <>
            <span className="tabular flex items-center gap-1 font-display text-xl font-bold">
              {r!.rating.toFixed(1)}
              <StarIcon className="h-4 w-4 text-orange" />
            </span>
            <span className="tabular text-sm text-muted">{r!.reviewCount} reviews</span>
          </>
        ) : (
          <span className="text-sm text-muted">Rating to be added</span>
        )}
        {r?.reviewsUrl ? (
          <a href={r.reviewsUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm font-semibold text-blue underline underline-offset-4">
            Read Google reviews <ExternalIcon className="h-3.5 w-3.5" />
          </a>
        ) : null}
      </span>
    </li>
  );
}

/* ---------- branches ---------- */

export function BranchBlock({ b, headingLevel = 3 }: { b: Branch; headingLevel?: 2 | 3 }) {
  const H = headingLevel === 2 ? "h2" : "h3";
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-baseline justify-between gap-3">
        <H className="font-display text-xl font-bold md:text-2xl">
          <Link href={`/branches/${b.slug}/`} className="inline-block py-1 hover:text-blue">
            {b.name}
          </Link>
        </H>
        <span className="pass-label text-orange-ink">{b.cityCode}</span>
      </div>
      <p className="text-sm text-muted">{b.city}, {b.state}</p>
      <address className="mt-3 not-italic">{b.addressLines.join(", ")}</address>
      {b.hours.length ? (
        <p className="mt-2 text-sm text-muted">{b.hours.map((h) => `${h.days}: ${h.opens} to ${h.closes}`).join(" · ")}</p>
      ) : null}
      <div className="mt-4 flex flex-wrap gap-2">
        <a href={telHref(b.phone)} data-track="call" data-branch={b.slug} className="btn btn-secondary !min-h-11 !px-3 text-sm">
          <PhoneIcon className="h-4 w-4" /> Call {b.name} branch
        </a>
        <a href={whatsappHref(b.whatsapp, "Hello Wayfarer, I would like to talk to a counsellor about studying abroad.")} data-track="whatsapp" data-branch={b.slug} target="_blank" rel="noopener noreferrer" className="btn btn-secondary !min-h-11 !px-3 text-sm">
          <WhatsAppIcon className="h-4 w-4" /> WhatsApp
        </a>
      </div>
      <p className="tabular mt-2 text-sm font-semibold">{b.phoneDisplay}</p>
      <a href={b.mapLink} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-blue underline underline-offset-4">
        Directions in Google Maps <ExternalIcon className="h-3.5 w-3.5" />
      </a>
    </div>
  );
}

/* ---------- videos ---------- */

export function VideoItem({ v, linkLabel = "Read more on this topic", href }: { v: Video; linkLabel?: string; href?: string }) {
  const title = cleanVideoTitle(v.title);
  return (
    <article className="flex flex-col gap-3">
      <LiteYouTube id={v.id} title={title} />
      <h3 className="font-display text-lg font-bold leading-snug">{title}</h3>
      {href ? (
        <a href={href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue underline-offset-4 hover:underline">
          {linkLabel} <ExternalIcon className="h-4 w-4" />
        </a>
      ) : (
        <Link href={v.topicPage} className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue underline-offset-4 hover:underline">
          {linkLabel} <ArrowRight className="h-4 w-4" />
        </Link>
      )}
    </article>
  );
}
