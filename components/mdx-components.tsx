import Link from "next/link";
import { BranchBlock, VideoItem } from "./cards";
import { SOCIAL } from "@/lib/site";
import { EXCHANGE, getBranches, getCountries, getVideoById } from "@/lib/content";
import { formatInrRange, toInrPerYear } from "@/lib/money";
import { SourceNote, formatDate } from "./ui";

/** Components available inside MDX files in /content. See README for how to use them. */

function slugify(children: React.ReactNode) {
  return String(Array.isArray(children) ? children.join("") : children)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function A({ href = "", children }: { href?: string; children?: React.ReactNode }) {
  if (href.startsWith("/")) return <Link href={href}>{children}</Link>;
  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
}

/** <Video id="ob_KiWaj-WA" /> */
function Video({ id }: { id: string }) {
  const v = getVideoById(id);
  if (!v) return null;
  return (
    <div className="not-prose my-6 max-w-[640px]">
      <VideoItem v={v} href={SOCIAL.YouTube} linkLabel="More videos on our YouTube channel" />
    </div>
  );
}

/** <Callout>Short important note</Callout> */
function Callout({ children }: { children: React.ReactNode }) {
  return <div className="my-6 border-l-4 border-orange bg-ground px-5 py-4 [&>p]:m-0">{children}</div>;
}

/** <ButtonLink href="/free-profile-check/">Start free profile check</ButtonLink> */
function ButtonLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <p>
      <Link href={href} className="btn btn-primary !no-underline">
        {children}
      </Link>
    </p>
  );
}

/** <BranchList /> : all four branches with call and WhatsApp buttons */
function BranchList() {
  return (
    <div className="not-prose my-8 grid gap-8 sm:grid-cols-2">
      {getBranches().map((b) => (
        <BranchBlock key={b.slug} b={b} />
      ))}
    </div>
  );
}

/** <CountryCostTable /> : yearly costs in rupees for every country with verified data */
function CountryCostTable() {
  const rows = getCountries().filter((c) => c.costs.living || c.costs.tuition.pg || c.costs.tuition.ug);
  return (
    <div className="not-prose my-6 overflow-x-auto">
      <table className="w-full min-w-[560px] border-collapse text-left text-[0.95rem]">
        <thead>
          <tr className="border-b-2 border-ink">
            <th scope="col" className="pass-label py-2 pr-3 text-muted">Country</th>
            <th scope="col" className="pass-label py-2 pr-3 text-muted">Master's fees, per year</th>
            <th scope="col" className="pass-label py-2 text-muted">Living costs, per year</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((c) => {
            const pg = c.costs.tuition.pg ? formatInrRange(toInrPerYear(c.costs.tuition.pg, EXCHANGE.rates)) : "Ask your counsellor";
            const tiers = c.costs.living?.tiers ?? [];
            const living = tiers.length
              ? formatInrRange({
                  min: Math.min(...tiers.map((t) => toInrPerYear(t, EXCHANGE.rates).min)),
                  max: tiers.some((t) => t.max === null) ? null : Math.max(...tiers.map((t) => toInrPerYear(t, EXCHANGE.rates).max ?? 0)),
                  kind: tiers.some((t) => t.kind === "minimum") ? "minimum" : "range",
                })
              : "Ask your counsellor";
            return (
              <tr key={c.slug} className="border-b border-line align-top">
                <th scope="row" className="py-3 pr-3">
                  <Link href={c.path} className="font-semibold text-blue underline underline-offset-4">
                    {c.name}
                  </Link>
                </th>
                <td className="tabular py-3 pr-3">{pg}</td>
                <td className="tabular py-3">{living}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <p className="mt-2 text-xs text-muted">
        Converted at the exchange rate on {formatDate(EXCHANGE.date)}. Each country page shows the official source for every figure.
      </p>
    </div>
  );
}

/** <Source href="https://..." checked="2026-10-01" /> */
function Source({ href, checked }: { href: string; checked: string }) {
  return <SourceNote source={href} lastVerified={checked} className="-mt-2" />;
}

export const mdxComponents = {
  a: A,
  h2: ({ children }: { children: React.ReactNode }) => <h2 id={slugify(children)}>{children}</h2>,
  h3: ({ children }: { children: React.ReactNode }) => <h3 id={slugify(children)}>{children}</h3>,
  Video,
  Callout,
  ButtonLink,
  BranchList,
  CountryCostTable,
  Source,
};
