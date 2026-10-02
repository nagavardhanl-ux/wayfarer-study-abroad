import Image from "next/image";
import Link from "next/link";
import home from "@/content/home.json";
import { getBranches, getCountries } from "@/lib/content";
import { whatsappHref } from "@/lib/contact";
import { costToolData, intakeToolData } from "@/lib/tools-data";
import { WhatsAppIcon } from "../Icons";
import { Container, formatDate } from "../ui";
import { BentoCost, BentoIntakes } from "./BentoLive";

/** Counts the official sources behind the country pages, and the most recent check date. */
function sourceStats() {
  const urls = new Set<string>();
  let latest = "";
  const visit = (n: unknown) => {
    if (Array.isArray(n)) n.forEach(visit);
    else if (n && typeof n === "object") {
      const o = n as Record<string, unknown>;
      if (typeof o.source === "string") urls.add(o.source);
      if (typeof o.lastVerified === "string" && o.lastVerified > latest) latest = o.lastVerified;
      Object.values(o).forEach(visit);
    }
  };
  visit(getCountries());
  return { count: urls.size, latest };
}

/**
 * "About our overseas education" as a bento grid: the about text and photos sit beside live tiles
 * (cost check, next intakes, data freshness, WhatsApp) instead of a plain text-and-image band.
 */
export function HomeBento() {
  const a = home.about;
  const cost = costToolData();
  const intakes = intakeToolData();
  const stats = sourceStats();
  const [grad, students, globe] = a.images;
  const tile = "relative overflow-hidden rounded-[14px] p-5 md:p-6";

  return (
    <section aria-labelledby="about-h" className="cv-auto bg-paper py-12 md:py-[88px]">
      <Container>
        <div className="grid auto-rows-[minmax(170px,auto)] gap-4 md:grid-cols-2 lg:grid-cols-4">
          {/* About text */}
          <div className={`${tile} border border-line bg-ground md:col-span-2 lg:row-span-2`}>
            <p className="data-label text-orange-ink">Since 2011</p>
            <h2 id="about-h" className="t-h2 mt-2">
              {a.heading}
            </h2>
            <div className="mt-4 max-w-[58ch] space-y-3 text-[0.97rem]">
              {a.paragraphs.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
              <Link href="/free-profile-check/" className="btn btn-primary">
                Start free profile check
              </Link>
              <Link href="/about-us/" className="font-semibold text-blue underline-offset-4 hover:underline">
                {a.aboutLinkLabel} →
              </Link>
            </div>
          </div>

          {/* Graduate photo */}
          {grad ? (
            <div className={`${tile} min-h-[320px] !p-0 lg:row-span-2`}>
              <Image src={grad.src} alt={grad.alt} fill sizes="(min-width: 1024px) 300px, (min-width: 768px) 50vw, 100vw" className="object-cover object-[50%_30%]" />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-night/85 to-transparent p-5 pt-16">
                <p className="pass-value text-4xl text-white">2011</p>
                <p className="data-label text-white/80">Helping students since</p>
              </div>
            </div>
          ) : null}

          {/* Live cost check */}
          {cost.countries.length ? (
            <div className={`${tile} night on-navy lg:row-span-2`}>
              <BentoCost countries={cost.countries} rates={cost.rates} />
            </div>
          ) : null}

          {/* Next intakes */}
          <div className={`${tile} bg-orange text-ink`}>
            <BentoIntakes countries={intakes} />
          </div>

          {/* Students photo */}
          {students ? (
            <div className={`${tile} min-h-[170px] !p-0`}>
              <Image src={students.src} alt={students.alt} fill sizes="(min-width: 1024px) 300px, 50vw" className="object-cover" />
            </div>
          ) : null}

          {/* Data freshness */}
          <div className={`${tile} border border-line bg-paper`}>
            <p className="data-label text-muted">Facts checked</p>
            <p className="pass-value mt-2 text-5xl text-navy">{stats.count}</p>
            <p className="mt-1 text-sm">official government and university sources behind our country pages.</p>
            {stats.latest ? <p className="mt-3 text-xs text-muted">Last checked {formatDate(stats.latest)}</p> : null}
            {globe ? (
              <Image src={globe.src} alt="" width={120} height={120} className="pointer-events-none absolute -bottom-6 -right-6 h-28 w-28 rounded-full object-cover opacity-30" />
            ) : null}
          </div>

          {/* WhatsApp */}
          <div className={`${tile} bg-navy text-on-navy on-navy`}>
            <p className="data-label text-on-navy-muted">Talk to a counsellor</p>
            <p className="mt-2 flex items-center gap-2 font-display text-xl font-bold">
              <WhatsAppIcon className="h-6 w-6 text-[#5fd68a]" /> WhatsApp a branch
            </p>
            <ul className="mt-3 grid grid-cols-2 gap-1.5">
              {getBranches().map((b) => (
                <li key={b.slug}>
                  <a
                    href={whatsappHref(b.whatsapp, "Hello Wayfarer, I would like to talk to a counsellor about studying abroad.")}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-track="whatsapp"
                    data-branch={b.slug}
                    data-location="home-bento"
                    className="flex min-h-9 items-center justify-center rounded-md border border-white/25 px-2 text-center text-sm font-semibold hover:border-orange-light"
                  >
                    {b.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </section>
  );
}
