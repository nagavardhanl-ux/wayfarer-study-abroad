"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { track } from "@/lib/analytics";
import { formatInrRange, formatLocal, toInrPerYear, type InrRange } from "@/lib/money";
import type { CostCountry } from "@/lib/tools-data";
import { ToolCta, budgetBand } from "./ToolCta";

export function CostCalculator({ countries, rates, rateDate }: { countries: CostCountry[]; rates: Record<string, number>; rateDate: string }) {
  const [slug, setSlug] = useState(countries[0]?.slug ?? "");
  const [level, setLevel] = useState<"ug" | "pg">("pg");
  const [tier, setTier] = useState("");
  const [years, setYears] = useState(1);
  const used = useRef(false);

  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const c = p.get("country");
    if (c && countries.some((x) => x.slug === c)) setSlug(c);
  }, [countries]);

  const c = countries.find((x) => x.slug === slug)!;
  const levelOk = level === "ug" ? !!c?.ug : !!c?.pg;

  useEffect(() => {
    if (!c) return;
    if (!levelOk) setLevel(c.pg ? "pg" : "ug");
    if (!c.tiers.some((t) => t.id === tier)) setTier(c.tiers[0].id);
  }, [c, levelOk, tier]);

  useEffect(() => {
    setYears(level === "ug" ? 3 : slug === "uk" || slug === "ireland" ? 1 : 2);
  }, [level, slug]);

  const result = useMemo(() => {
    if (!c) return null;
    const tuitionA = level === "ug" ? c.ug : c.pg;
    const tierA = c.tiers.find((t) => t.id === tier) ?? c.tiers[0];
    if (!tuitionA) return null;
    const tuition = toInrPerYear(tuitionA, rates);
    const living = toInrPerYear(tierA, rates);
    const perYearMin = tuition.min + living.min;
    const perYearMax = tuition.max !== null && living.max !== null ? tuition.max + living.max : null;
    const total: InrRange = {
      min: perYearMin * years,
      max: perYearMax === null ? null : perYearMax * years,
      kind: perYearMax === null ? "minimum" : "range",
    };
    return { tuition, living, tuitionA, tierA, total, perYear: { min: perYearMin, max: perYearMax, kind: total.kind } as InrRange };
  }, [c, level, tier, rates, years]);

  const markUsed = () => {
    if (used.current) return;
    used.current = true;
    track("tool_used", { tool: "cost_calculator" });
  };

  if (!c) return <p>No country has complete verified cost data yet.</p>;

  return (
    <div onChange={markUsed}>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <label htmlFor="cc-country" className="field-label">Country</label>
          <select id="cc-country" className="input" value={slug} onChange={(e) => setSlug(e.target.value)}>
            {countries.map((x) => (
              <option key={x.slug} value={x.slug}>{x.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="cc-level" className="field-label">Course level</label>
          <select id="cc-level" className="input" value={level} onChange={(e) => setLevel(e.target.value as "ug" | "pg")}>
            {c.ug ? <option value="ug">Bachelor's</option> : null}
            {c.pg ? <option value="pg">Master's</option> : null}
          </select>
        </div>
        <div>
          <label htmlFor="cc-tier" className="field-label">City</label>
          <select id="cc-tier" className="input" value={tier} onChange={(e) => setTier(e.target.value)} disabled={c.tiers.length < 2}>
            {c.tiers.map((t) => (
              <option key={t.id} value={t.id}>{t.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="cc-years" className="field-label">Course length</label>
          <select id="cc-years" className="input" value={years} onChange={(e) => setYears(Number(e.target.value))}>
            {[1, 2, 3, 4].map((y) => (
              <option key={y} value={y}>{y} {y === 1 ? "year" : "years"}</option>
            ))}
          </select>
        </div>
      </div>

      {result ? (
        <div className="mt-8" aria-live="polite">
          <dl className="grid gap-px overflow-hidden rounded-sm border border-line bg-line sm:grid-cols-3">
            <Stat label="Tuition, per year" value={formatInrRange(result.tuition)} sub={formatLocal(result.tuitionA)} />
            <Stat label="Living costs, per year" value={formatInrRange(result.living)} sub={formatLocal(result.tierA)} />
            <Stat label={`Total for ${years} ${years === 1 ? "year" : "years"}`} value={formatInrRange(result.total)} sub={`${formatInrRange(result.perYear)} a year`} strong />
          </dl>
          <p className="mt-3 text-sm text-muted">
            Converted at the exchange rate on {new Date(`${rateDate}T00:00:00Z`).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" })}. Figures come from official sources listed on the{" "}
            <a href={c.path + "#cost"} className="link">{c.name} page</a>. Travel, visa fees and health cover are extra. {result.total.kind === "minimum" ? "Where only a minimum is published, the total is a starting point." : ""}
          </p>
          <ToolCta
            text={`Your estimate: ${formatInrRange(result.total)} for ${c.name}. Talk it through with a counsellor.`}
            params={{ country: c.slug, level, budget: budgetBand(result.total.max ?? result.total.min) }}
          />
        </div>
      ) : null}
    </div>
  );
}

function Stat({ label, value, sub, strong }: { label: string; value: string; sub: string; strong?: boolean }) {
  return (
    <div className={`p-4 md:p-5 ${strong ? "bg-navy text-on-navy" : "bg-paper"}`}>
      <dt className={`pass-label ${strong ? "text-on-navy-muted" : "text-muted"}`}>{label}</dt>
      <dd className="tabular mt-2 font-display text-2xl font-bold leading-tight">{value}</dd>
      <dd className={`mt-1 text-sm ${strong ? "text-on-navy-muted" : "text-muted"}`}>{sub}</dd>
    </div>
  );
}

