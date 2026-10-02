"use client";

import { useMemo, useRef, useState } from "react";
import { track } from "@/lib/analytics";
import { emi, formatInr } from "@/lib/money";
import { ToolCta, budgetBand } from "./ToolCta";

export function EmiCalculator() {
  const [lakh, setLakh] = useState("30");
  const [rate, setRate] = useState("10.5");
  const [years, setYears] = useState("10");
  const [moratorium, setMoratorium] = useState("24");
  const [mode, setMode] = useState<"add" | "pay">("add");
  const used = useRef(false);

  const r = useMemo(() => {
    const P = Number(lakh) * 1e5;
    const R = Number(rate);
    const n = Number(years) * 12;
    const m = Number(moratorium);
    if (!(P > 0) || !(R >= 0) || !(n > 0) || !(m >= 0)) return null;
    const moratoriumInterest = (P * (R / 100) * m) / 12; // simple interest while studying
    const principalAtStart = mode === "add" ? P + moratoriumInterest : P;
    const monthly = emi(principalAtStart, R, n);
    const paidDuring = mode === "pay" ? moratoriumInterest : 0;
    const total = monthly * n + paidDuring;
    return { monthly, total, interest: total - P, moratoriumInterest, principalAtStart, P };
  }, [lakh, rate, years, moratorium, mode]);

  const onChange = () => {
    if (!used.current) {
      used.current = true;
      track("tool_used", { tool: "loan_emi_calculator" });
    }
  };

  return (
    <div onChange={onChange}>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <Num id="emi-amount" label="Loan amount (₹ lakh)" value={lakh} set={setLakh} hint="For example 30 for ₹30 lakh" />
        <Num id="emi-rate" label="Interest rate (% a year)" value={rate} set={setRate} hint="Ask the lender for your rate" />
        <Num id="emi-years" label="Repayment period (years)" value={years} set={setYears} hint="After the moratorium ends" />
        <Num id="emi-mor" label="Moratorium (months)" value={moratorium} set={setMoratorium} hint="Course length plus grace period" />
      </div>
      <fieldset className="mt-5">
        <legend className="field-label">Interest during the moratorium</legend>
        <div className="flex flex-wrap gap-2.5">
          {(
            [
              ["add", "Add it to the loan"],
              ["pay", "Pay it every month while studying"],
            ] as const
          ).map(([v, l]) => (
            <span key={v} className="relative">
              <input type="radio" id={`emi-mode-${v}`} name="emi-mode" className="chip-input" checked={mode === v} onChange={() => setMode(v)} />
              <label htmlFor={`emi-mode-${v}`} className="chip">{l}</label>
            </span>
          ))}
        </div>
      </fieldset>

      {r ? (
        <div className="mt-8" aria-live="polite">
          <dl className="grid gap-px overflow-hidden rounded-sm border border-line bg-line sm:grid-cols-3">
            <div className="bg-navy p-5 text-on-navy">
              <dt className="pass-label text-on-navy-muted">Monthly EMI</dt>
              <dd className="tabular mt-2 font-display text-3xl font-bold">{formatInr(r.monthly)}</dd>
            </div>
            <div className="bg-paper p-5">
              <dt className="pass-label text-muted">Total repayment</dt>
              <dd className="tabular mt-2 font-display text-2xl font-bold">{formatInr(r.total)}</dd>
            </div>
            <div className="bg-paper p-5">
              <dt className="pass-label text-muted">Total interest</dt>
              <dd className="tabular mt-2 font-display text-2xl font-bold">{formatInr(r.interest)}</dd>
            </div>
          </dl>
          <p className="mt-3 text-sm text-muted">
            {mode === "add"
              ? `Interest of about ${formatInr(r.moratoriumInterest)} builds up during the moratorium and is added to the loan, so EMIs are worked out on ${formatInr(r.principalAtStart)}.`
              : `You pay about ${formatInr(r.moratoriumInterest / Math.max(1, Number(moratorium)) )} a month in interest while studying, so EMIs are worked out on the original ${formatInr(r.P)}.`}{" "}
            This is an estimate. Lenders calculate moratorium interest in different ways; the sanction letter has the exact terms.
          </p>
          <ToolCta text="Plan the loan with a counsellor who knows the lenders." params={{ budget: budgetBand(r.P) }} />
        </div>
      ) : (
        <p className="mt-6 field-error">Enter numbers in every box to see the EMI.</p>
      )}
    </div>
  );
}

function Num({ id, label, value, set, hint }: { id: string; label: string; value: string; set: (v: string) => void; hint: string }) {
  return (
    <div>
      <label htmlFor={id} className="field-label">{label}</label>
      <input id={id} className="input tabular" inputMode="decimal" value={value} onChange={(e) => set(e.target.value.replace(/[^\d.]/g, "").slice(0, 6))} aria-describedby={`${id}-hint`} />
      <span id={`${id}-hint`} className="field-hint">{hint}</span>
    </div>
  );
}
