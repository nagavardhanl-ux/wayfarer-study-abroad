import Link from "next/link";
import { getBranches } from "@/lib/content";
import { telHref, whatsappHref } from "@/lib/contact";
import { NAV, SOCIAL_LINKS } from "@/lib/site";
import { CurrentYear } from "./CurrentYear";
import { PinIcon } from "./Icons";
import { Logo } from "./Logo";

const COMPANY = [
  { label: "About us", href: "/about-us/" },
  { label: "Student stories", href: "/student-stories/" },
  { label: "For parents", href: "/for-parents/" },
  { label: "Branches", href: "/branches/" },
  { label: "Blog", href: "/blog/" },
  { label: "Contact", href: "/contact/" },
  { label: "Privacy policy", href: "/privacy-policy/" },
  { label: "Terms", href: "/terms/" },
];

export function SiteFooter() {
  const branches = getBranches();
  const study = NAV.find((n) => n.label === "Study abroad")!;
  const services = NAV.find((n) => n.label === "Services")!;
  const coaching = NAV.find((n) => n.label === "Coaching")!;
  const tools = NAV.find((n) => n.label === "Tools")!;

  return (
    <footer className="on-navy bg-navy text-on-navy">
      <div className="mx-auto max-w-[1200px] px-4 py-12 md:px-6 xl:px-8">
        <div className="flex flex-col gap-6 border-b border-white/20 pb-10 md:flex-row md:items-end md:justify-between">
          <div className="max-w-md">
            <Logo variant="white" />
            <p className="mt-4 text-on-navy-muted">
              Overseas education and visa consultants with branches in Bengaluru, Chennai, Pune and Kochi. Since 2011.
            </p>
          </div>
          <Link href="/free-profile-check/" className="btn btn-primary self-start md:self-auto">
            Start free profile check
          </Link>
        </div>

        <div className="grid gap-8 py-10 sm:grid-cols-2 lg:grid-cols-4">
          <FooterCol title="Study abroad" links={study.links} />
          <FooterCol title="Services" links={[...services.links, { label: "Visit visas", href: "/visit-visas/" }, { label: "Immigration and PR", href: "/immigration/" }]} />
          <FooterCol title="Coaching and tools" links={[...coaching.links.slice(0, 4), ...tools.links]} />
          <FooterCol title="Wayfarer" links={COMPANY} />
        </div>

        <h2 className="pass-label text-on-navy-muted">Branches</h2>
        <ul className="mt-3 grid gap-6 border-b border-white/20 pb-10 sm:grid-cols-2 lg:grid-cols-4">
          {branches.map((b) => (
            <li key={b.slug} className="flex flex-col text-sm">
              <Link href={`/branches/${b.slug}/`} className="inline-block py-1 font-display text-lg font-bold text-on-navy hover:underline">
                {b.name}
              </Link>
              <address className="mt-1 flex gap-2 not-italic text-on-navy-muted">
                <PinIcon className="mt-0.5 h-4 w-4 shrink-0 text-orange-light" />
                <span>{b.addressLines.join(", ")}</span>
              </address>
              <div className="mb-3 mt-2 flex flex-wrap gap-x-4 gap-y-1">
                <a href={telHref(b.phone)} data-track="call" data-branch={b.slug} data-location="footer" className="tabular font-semibold text-on-navy underline underline-offset-4">
                  {b.phoneDisplay}
                </a>
                <a href={whatsappHref(b.whatsapp)} data-track="whatsapp" data-branch={b.slug} data-location="footer" className="font-semibold text-on-navy underline underline-offset-4" target="_blank" rel="noopener noreferrer">
                  WhatsApp
                </a>
              </div>
              <a
                href={b.mapLink}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-auto inline-flex min-h-9 items-center gap-1.5 self-start rounded-sm border border-white/30 px-3 text-sm font-semibold text-on-navy hover:border-orange-light"
              >
                <PinIcon className="h-4 w-4 text-orange-light" />
                Get directions
              </a>
            </li>
          ))}
        </ul>

        <div className="flex flex-col gap-4 pt-8 text-sm text-on-navy-muted md:flex-row md:items-center md:justify-between">
          <p>
            © <CurrentYear /> Wayfarer. Since 2011. No consultant can guarantee a visa or admission; decisions are made by universities and governments.
            <br />
            Wayfarer is a fictional company built as a portfolio project. Names, branches, phone numbers and reviews are placeholders; country facts link to official sources.
          </p>
          {SOCIAL_LINKS.length ? (
            <ul className="flex gap-4">
              {SOCIAL_LINKS.map(([name, href]) => (
                <li key={name}><a href={href} className="underline underline-offset-4 hover:text-on-navy" target="_blank" rel="noopener noreferrer">{name}</a></li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <h2 className="pass-label text-on-navy-muted">{title}</h2>
      <ul className="mt-3 space-y-1.5">
        {links.map((l) => (
          <li key={l.href + l.label}>
            <Link href={l.href} className="text-on-navy hover:underline">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
