import { hasCostData } from "@/components/CountryPage";
import { EXCHANGE, getCountries } from "./content";
import type { AmountLike } from "./money";

/** Plain, serialisable data for the client-side tools. Only verified fields are included. */

export type CostCountry = {
  slug: string;
  name: string;
  currency: string;
  ug: (AmountLike & { source: string }) | null;
  pg: (AmountLike & { source: string }) | null;
  tiers: (AmountLike & { id: string; label: string })[];
  livingSource: string;
  path: string;
};

export function costToolData(): { countries: CostCountry[]; rates: Record<string, number>; rateDate: string } {
  const countries = getCountries()
    .filter(hasCostData)
    .map((c) => ({
      slug: c.slug,
      name: c.name,
      currency: c.currency,
      ug: c.costs.tuition.ug ? { ...pick(c.costs.tuition.ug), source: c.costs.tuition.ug.source } : null,
      pg: c.costs.tuition.pg ? { ...pick(c.costs.tuition.pg), source: c.costs.tuition.pg.source } : null,
      tiers: c.costs.living!.tiers.map((t) => ({ ...pick(t), id: t.id, label: t.label })),
      livingSource: c.costs.living!.source,
      path: c.path,
    }));
  return { countries, rates: EXCHANGE.rates, rateDate: EXCHANGE.date };
}

function pick(a: AmountLike): AmountLike {
  return { min: a.min, max: a.max, currency: a.currency, period: a.period, kind: a.kind };
}

export type EligibilityCountry = {
  slug: string;
  name: string;
  path: string;
  min: { ielts?: number; pte?: number; toefl?: number };
  basis: string;
  source: string;
};

export function eligibilityToolData(): EligibilityCountry[] {
  return getCountries()
    .filter((c) => c.englishMinimum)
    .map((c) => ({
      slug: c.slug,
      name: c.name,
      path: c.path,
      min: { ielts: c.englishMinimum!.ielts, pte: c.englishMinimum!.pte, toefl: c.englishMinimum!.toefl },
      basis: c.englishMinimum!.basis,
      source: c.englishMinimum!.source,
    }));
}

export type IntakeCountry = {
  slug: string;
  name: string;
  path: string;
  items: { id: string; label: string; startMonth: number; main: boolean }[];
  applyBy: { intakeId: string; text: string; date?: string | null; monthDay?: string; level: string }[];
  source: string;
};

export function intakeToolData(): IntakeCountry[] {
  return getCountries()
    .filter((c) => c.intakes)
    .map((c) => ({ slug: c.slug, name: c.name, path: c.path, items: c.intakes!.items, applyBy: c.intakes!.applyBy, source: c.intakes!.source }));
}
