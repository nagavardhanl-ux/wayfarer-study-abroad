"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { track } from "@/lib/analytics";
import type { IntakeCountry } from "@/lib/tools-data";
import { ToolCta } from "./ToolCta";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function monthsBetween(a: Date, b: Date) {
  return (b.getFullYear() - a.getFullYear()) * 12 + (b.getMonth() - a.getMonth()) + (b.getDate() >= a.getDate() ? 0 : -1);
}

/** Next start date for an intake month, at least ~1 month away. */
function nextStart(month: number, today: Date) {
  let y = today.getFullYear();
  let d = new Date(y, month - 1, 1);
  if (d.getTime() - today.getTime() < 30 * 864e5) d = new Date(++y, month - 1, 1);
  return d;
}

function applyDate(a: IntakeCountry["applyBy"][number], start: Date): Date | null {
  if (a.date) return new Date(`${a.date}T00:00:00`);
  if (a.monthDay) {
    const [m, d] = a.monthDay.split("-").map(Number);
    let dt = new Date(start.getFullYear(), m - 1, d);
    if (dt > start) dt = new Date(start.getFullYear() - 1, m - 1, d);
    return dt;
  }
  return null;
}

export function IntakeTracker({ countries }: { countries: IntakeCountry[] }) {
  const [today, setToday] = useState<Date | null>(null);
  const [filter, setFilter] = useState("");
  useEffect(() => setToday(new Date()), []);

  const rows = today
    ? countries
        .filter((c) => !filter || c.slug === filter)
        .flatMap((c) =>
          c.items.map((i) => {
            const start = nextStart(i.startMonth, today);
            const ab = c.applyBy.find((a) => a.intakeId === i.id);
            const deadline = ab ? applyDate(ab, start) : null;
            return { c, i, start, months: monthsBetween(today, start), deadline: deadline && deadline > today ? deadline : null, deadlineText: ab?.text };
          }),
        )
        .sort((a, b) => a.start.getTime() - b.start.getTime())
    : [];

  return (
    <div>
      <div className="max-w-xs">
        <label htmlFor="it-country" className="field-label">Country</label>
        <select
          id="it-country"
          className="input"
          value={filter}
          onChange={(e) => {
            setFilter(e.target.value);
            track("tool_used", { tool: "intake_deadlines" });
          }}
        >
          <option value="">All countries</option>
          {countries.map((c) => (
            <option key={c.slug} value={c.slug}>{c.name}</option>
          ))}
        </select>
      </div>

      <div className="mt-6 overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse text-left">
          <thead>
            <tr className="border-b-2 border-ink">
              <th scope="col" className="pass-label py-2 pr-4 text-muted">Country</th>
              <th scope="col" className="pass-label py-2 pr-4 text-muted">Intake</th>
              <th scope="col" className="pass-label py-2 pr-4 text-muted">Starts</th>
              <th scope="col" className="pass-label py-2 pr-4 text-muted">Months left</th>
              <th scope="col" className="pass-label py-2 text-muted">Apply by</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ c, i, start, months, deadline, deadlineText }) => (
              <tr key={c.slug + i.id} className="border-b border-line align-top">
                <th scope="row" className="py-3 pr-4">
                  <Link href={c.path + "#intakes"} className="font-semibold text-blue underline underline-offset-4">{c.name}</Link>
                </th>
                <td className="py-3 pr-4">{i.label}</td>
                <td className="tabular py-3 pr-4">{MONTHS[start.getMonth()]} {start.getFullYear()}</td>
                <td className={`tabular py-3 pr-4 font-display text-xl font-bold ${months <= 4 ? "text-below" : months <= 8 ? "text-close" : "text-ok"}`}>{months}</td>
                <td className="py-3 text-sm">
                  {deadline ? (
                    <>
                      <span className="tabular font-semibold">{deadline.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                      <span className="block text-muted">{deadlineText}</span>
                    </>
                  ) : deadlineText ? (
                    <span className="text-muted">{deadlineText}</span>
                  ) : (
                    <span className="text-muted">Set by each university</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-sm text-muted">Months left counts to the first day of the intake month. Most universities want applications several months earlier, so start as soon as you can.</p>
      <ToolCta text="Plan your applications around these dates." params={{ country: filter || undefined }} />
    </div>
  );
}
