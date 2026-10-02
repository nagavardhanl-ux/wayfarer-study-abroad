"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { formatInrRange, toInrPerYear } from "@/lib/money";
import type { CostCountry, IntakeCountry } from "@/lib/tools-data";

/** Bento tile: pick a country and level, see one year's tuition plus living costs in rupees. */
export function BentoCost({ countries, rates }: { countries: CostCountry[]; rates: Record<string, number> }) {
  const [slug, setSlug] = useState(countries[0]?.slug ?? "");
  const c = countries.find((x) => x.slug === slug)!;
  const level: "pg" | "ug" = c?.pg ? "pg" : "ug";
  const total = useMemo(() => {
    if (!c) return null;
    const t = c[level];
    if (!t) return null;
    const tu = toInrPerYear(t, rates);
    const lvMin = Math.min(...c.tiers.map((x) => toInrPerYear(x, rates).min));
    const lvMaxes = c.tiers.map((x) => toInrPerYear(x, rates).max);
    const lvMax = lvMaxes.some((m) => m === null) ? null : Math.max(...(lvMaxes as number[]));
    return formatInrRange({ min: tu.min + lvMin, max: tu.max !== null && lvMax !== null ? tu.max + lvMax : null, kind: tu.max !== null && lvMax !== null ? "range" : "minimum" });
  }, [c, level, rates]);

  if (!c) return null;
  return (
    <div className="flex h-full flex-col">
      <p className="data-label text-orange-light">Cost check</p>
      <h3 className="mt-2 font-display text-xl font-bold text-on-navy">One year of a master&apos;s, in rupees</h3>
      <div className="mt-4 flex flex-wrap gap-1.5" role="radiogroup" aria-label="Country">
        {countries.map((x) => (
          <button
            key={x.slug}
            type="button"
            role="radio"
            aria-checked={x.slug === slug}
            onClick={() => setSlug(x.slug)}
            className={`min-h-9 rounded-full border px-3 text-sm font-semibold ${x.slug === slug ? "border-orange bg-orange text-ink" : "border-white/25 text-on-navy hover:border-orange-light"}`}
          >
            {x.name}
          </button>
        ))}
      </div>
      <p className="mt-auto pt-6 font-display text-3xl font-extrabold leading-tight text-on-navy tabular" aria-live="polite">
        {total ? <Rupees text={total} /> : null}
      </p>
      <p className="mt-1 text-sm text-on-navy-muted">Tuition plus living costs, from official sources.</p>
      <Link href={`/tools/cost-calculator/?country=${slug}`} className="mt-4 inline-flex items-center gap-1.5 font-semibold text-orange-light underline-offset-4 hover:underline">
        Full cost calculator →
      </Link>
    </div>
  );
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** Bento tile: the three nearest intakes across all countries, counted from today's date. */
export function BentoIntakes({ countries }: { countries: IntakeCountry[] }) {
  const [today, setToday] = useState<Date | null>(null);
  useEffect(() => setToday(new Date()), []);
  const list = useMemo(() => {
    if (!today) return [];
    const all = countries.flatMap((c) =>
      c.items.map((i) => {
        let d = new Date(today.getFullYear(), i.startMonth - 1, 1);
        if (d.getTime() - today.getTime() < 30 * 864e5) d = new Date(today.getFullYear() + 1, i.startMonth - 1, 1);
        const months = (d.getFullYear() - today.getFullYear()) * 12 + d.getMonth() - today.getMonth();
        return { key: c.slug + i.id, name: c.name, path: c.path, when: `${MONTHS[d.getMonth()]} ${d.getFullYear()}`, months, d };
      }),
    );
    return all.sort((a, b) => a.d.getTime() - b.d.getTime()).slice(0, 3);
  }, [countries, today]);

  return (
    <div className="flex h-full flex-col">
      <p className="data-label text-ink">Next intakes</p>
      <ul className="mt-3 space-y-2">
        {list.length
          ? list.map((x) => (
              <li key={x.key}>
                <Link href={`${x.path}#intakes`} className="flex items-baseline justify-between gap-3 hover:underline">
                  <span className="font-semibold">
                    {x.name} <span className="font-normal text-ink">{x.when}</span>
                  </span>
                  <span className="pass-value text-2xl tabular">
                    {x.months}
                    <span className="ml-0.5 text-xs font-semibold">mo</span>
                  </span>
                </Link>
              </li>
            ))
          : [0, 1, 2].map((i) => <li key={i} className="h-7 rounded bg-ink/10" />)}
      </ul>
      <Link href="/tools/intake-deadlines/" className="mt-auto pt-3 text-sm font-semibold underline underline-offset-4">
        All intakes and deadlines
      </Link>
    </div>
  );
}

/** Shows "₹" in the system font so the display font's extended character file (86 KB) is never downloaded for it. */
function Rupees({ text }: { text: string }) {
  return (
    <>
      {text.split("₹").map((part, i) => (
        <span key={i}>
          {i > 0 ? <span className="font-[system-ui,sans-serif]">₹</span> : null}
          {part}
        </span>
      ))}
    </>
  );
}
