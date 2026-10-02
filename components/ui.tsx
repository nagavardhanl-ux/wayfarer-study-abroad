import Link from "next/link";
import { faqSchema, breadcrumbSchema } from "@/lib/schema";
import { SHOW_SAMPLE_BADGES } from "@/lib/site";
import { JsonLd } from "./JsonLd";
import { ArrowRight, PlusIcon } from "./Icons";

export function Container({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-[1200px] px-4 md:px-6 xl:px-8 ${className}`}>{children}</div>;
}

type Tone = "paper" | "ground" | "navy";
const TONE: Record<Tone, string> = {
  paper: "bg-paper",
  ground: "bg-ground",
  navy: "on-navy bg-navy text-on-navy",
};

/** A page band. Sections are separated by tone, not boxes. */
export function Section({
  tone = "paper",
  id,
  labelledBy,
  className = "",
  children,
}: {
  tone?: Tone;
  id?: string;
  labelledBy?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} aria-labelledby={labelledBy} className={`${TONE[tone]} ${tone === "navy" ? "" : "cv-auto"} py-12 md:py-[88px] ${className}`} style={tone === "ground" ? ({ "--notch-bg": "var(--ground)" } as React.CSSProperties) : undefined}>
      <Container>{children}</Container>
    </section>
  );
}

export function SectionHeading({ id, children, intro, tone = "paper" }: { id?: string; children: React.ReactNode; intro?: React.ReactNode; tone?: Tone }) {
  return (
    <div className="mb-8 max-w-[66ch]">
      <h2 id={id} className={`t-h2 ${tone === "navy" ? "text-on-navy" : ""}`}>
        {children}
      </h2>
      {intro ? <p className={`mt-3 ${tone === "navy" ? "text-on-navy-muted" : "text-muted"}`}>{intro}</p> : null}
    </div>
  );
}

export type Crumb = { name: string; href: string };

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  const all = [{ name: "Home", href: "/" }, ...items];
  return (
    <>
      <nav aria-label="Breadcrumb" className="text-sm text-muted">
        <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
          {all.map((c, i) => (
            <li key={c.href} className="flex items-center gap-2">
              {i > 0 ? <span aria-hidden>›</span> : null}
              {i === all.length - 1 ? (
                <span aria-current="page">{c.name}</span>
              ) : (
                <Link href={c.href} className="underline underline-offset-4 hover:text-blue">
                  {c.name}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
      <JsonLd data={breadcrumbSchema(all)} />
    </>
  );
}

/** Standard top of an inner page: breadcrumb, h1, intro, optional actions. */
export function PageHeader({
  crumbs,
  title,
  intro,
  eyebrowCode,
  children,
}: {
  crumbs: Crumb[];
  title: React.ReactNode;
  intro?: React.ReactNode;
  eyebrowCode?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="border-b border-line bg-paper">
      <Container className="py-8 md:py-14">
        <Breadcrumbs items={crumbs} />
        <h1 className="t-h1 mt-5 max-w-[22ch]">{title}</h1>
        {eyebrowCode ? <p className="pass-label mt-3 text-orange-ink">{eyebrowCode}</p> : null}
        {intro ? <div className="t-lead mt-4 max-w-[60ch] text-muted">{intro}</div> : null}
        {children ? <div className="mt-6 flex flex-wrap gap-3">{children}</div> : null}
      </Container>
    </div>
  );
}

export function FaqList({ items, headingId = "faq", title = "Questions students ask", tone = "paper" }: { items: { q: string; a: string }[]; headingId?: string; title?: string; tone?: Tone }) {
  if (!items.length) return null;
  return (
    <Section tone={tone} labelledBy={headingId}>
      <SectionHeading id={headingId}>{title}</SectionHeading>
      <div className="max-w-[66ch] divide-y divide-line border-y border-line">
        {items.map((f) => (
          <details key={f.q} className="faq group">
            <summary className="flex min-h-14 items-center justify-between gap-4 py-3 font-semibold">
              <span>{f.q}</span>
              <PlusIcon className="faq-icon h-5 w-5 shrink-0 text-blue" />
            </summary>
            <p className="pb-5 text-ink">{f.a}</p>
          </details>
        ))}
      </div>
      <JsonLd data={faqSchema(items)} />
    </Section>
  );
}

/** "Source: gov.uk, checked 1 Oct 2026" with a real link. */
export function SourceNote({ source, lastVerified, className = "" }: { source: string; lastVerified: string; className?: string }) {
  let host = source;
  try {
    host = new URL(source).hostname.replace(/^www\d?\./, "");
  } catch {}
  return (
    <p className={`text-xs text-muted ${className}`}>
      Source:{" "}
      <a href={source} className="underline underline-offset-2 hover:text-blue" target="_blank" rel="noopener noreferrer">
        {host}
      </a>
      , checked {formatDate(lastVerified)}
    </p>
  );
}

export function formatDate(iso: string) {
  const d = new Date(`${iso}T00:00:00Z`);
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
}

/** Visible only in development / sample preview builds. Production builds fail while samples exist. */
export function SampleBadge({ show }: { show?: boolean }) {
  if (!show || !SHOW_SAMPLE_BADGES) return null;
  return (
    <span className="pass-label inline-block rounded-sm border-2 border-orange-ink px-1.5 py-0.5 text-orange-ink" title="Sample entry. Replace before launch.">
      Sample
    </span>
  );
}

export function TextLink({ href, children, className = "" }: { href: string; children: React.ReactNode; className?: string }) {
  return (
    <Link href={href} className={`inline-flex items-center gap-1.5 font-semibold text-blue underline-offset-4 hover:underline ${className}`}>
      {children}
      <ArrowRight className="h-4 w-4" />
    </Link>
  );
}

/** Numbered route: a real sequence, drawn as a line with stops. */
export function RouteSteps({ steps }: { steps: { title: string; text: string }[] }) {
  return (
    <ol className="relative max-w-[66ch]">
      {steps.map((s, i) => (
        <li key={s.title} className="relative flex gap-5 pb-8 last:pb-0">
          {i < steps.length - 1 ? <span aria-hidden className="absolute left-[19px] top-10 bottom-0 border-l-2 border-dashed border-line-strong" /> : null}
          <span className="tabular z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-orange bg-paper font-display text-lg font-bold text-ink">
            {i + 1}
          </span>
          <div className="pt-1.5">
            <h3 className="t-h3 !text-[1.15rem] md:!text-[1.25rem]">{s.title}</h3>
            <p className="mt-1 text-muted">{s.text}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

/** Plain checklist without boxes. */
export function CheckList({ items, className = "" }: { items: React.ReactNode[]; className?: string }) {
  return (
    <ul className={`space-y-3 ${className}`}>
      {items.map((it, i) => (
        <li key={i} className="flex gap-3">
          <span aria-hidden className="mt-2.5 h-2 w-2 shrink-0 rotate-45 bg-orange" />
          <span>{it}</span>
        </li>
      ))}
    </ul>
  );
}
