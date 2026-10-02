/** Pure helpers for converting and formatting costs. Safe to import in client components. */

export type Period = "year" | "month" | "semester";
export type AmountLike = {
  min: number;
  max: number | null;
  currency: string;
  period: Period;
  kind: "range" | "average" | "minimum";
};

export type InrRange = { min: number; max: number | null; kind: AmountLike["kind"] };

const PER_YEAR: Record<Period, number> = { year: 1, month: 12, semester: 2 };

/** Converts an amount to rupees per year. */
export function toInrPerYear(a: AmountLike, rates: Record<string, number>): InrRange {
  const rate = a.currency === "INR" ? 1 : rates[a.currency];
  if (!rate) throw new Error(`No exchange rate for ${a.currency}`);
  const f = rate * PER_YEAR[a.period];
  return { min: a.min * f, max: a.max === null ? null : a.max * f, kind: a.kind };
}

/** "₹18.4 lakh", "₹1.2 crore", or "₹85,000" for amounts under one lakh. */
export function formatInr(n: number): string {
  if (n >= 1e7) return `₹${trim(n / 1e7)} crore`;
  if (n >= 1e5) return `₹${trim(n / 1e5)} lakh`;
  return `₹${Math.round(n).toLocaleString("en-IN")}`;
}

function trim(x: number): string {
  return (Math.round(x * 10) / 10).toFixed(1).replace(/\.0$/, "");
}

/** Formats an INR range in words, using "to" (never a dash). */
export function formatInrRange(r: InrRange): string {
  if (r.kind === "average") return `about ${formatInr(r.min)}`;
  if (r.max === null || r.kind === "minimum") return `at least ${formatInr(r.min)}`;
  if (Math.abs(r.max - r.min) < 1) return formatInr(r.min);
  // Share the unit when both ends are in lakh: "₹14.5 to 48.4 lakh"
  if (r.min >= 1e5 && r.max >= 1e5 && r.max < 1e7) return `₹${trim(r.min / 1e5)} to ${trim(r.max / 1e5)} lakh`;
  return `${formatInr(r.min)} to ${formatInr(r.max)}`;
}

/** Formats the original currency amount, e.g. "£11,400 to £38,000 a year". */
export function formatLocal(a: AmountLike): string {
  const sym = CURRENCY_SYMBOL[a.currency] ?? `${a.currency} `;
  const n = (x: number) => `${sym}${x.toLocaleString("en-IN")}`;
  const per = a.period === "year" ? "a year" : a.period === "month" ? "a month" : "a semester";
  if (a.kind === "average") return `${n(a.min)} ${per} on average`;
  if (a.max === null || a.kind === "minimum") return `at least ${n(a.min)} ${per}`;
  return `${n(a.min)} to ${n(a.max)} ${per}`;
}

export const CURRENCY_SYMBOL: Record<string, string> = {
  GBP: "£",
  USD: "US$",
  CAD: "CAD ",
  AUD: "AUD ",
  EUR: "€",
  NZD: "NZ$",
  SGD: "S$",
  AED: "AED ",
  INR: "₹",
};

/** Monthly EMI for a reducing-balance loan. rateAnnual is a percentage, e.g. 10.5. */
export function emi(principal: number, rateAnnual: number, months: number): number {
  if (months <= 0) return 0;
  const r = rateAnnual / 12 / 100;
  if (r === 0) return principal / months;
  const p = Math.pow(1 + r, months);
  return (principal * r * p) / (p - 1);
}
