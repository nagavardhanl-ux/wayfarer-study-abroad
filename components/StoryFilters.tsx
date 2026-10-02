"use client";

import { useEffect, useMemo, useState } from "react";

type Item = { id: string; country: string; countryName: string; intake: string };

/**
 * Filters the server-rendered story cards by country and intake.
 * Cards are rendered as children with data-country / data-intake attributes;
 * filter state is kept in the URL (?country=uk&intake=Sep%202026).
 */
export function StoryFilters({ items, children }: { items: Item[]; children: React.ReactNode }) {
  const [country, setCountry] = useState("");
  const [intake, setIntake] = useState("");

  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    setCountry(p.get("country") ?? "");
    setIntake(p.get("intake") ?? "");
  }, []);

  useEffect(() => {
    const p = new URLSearchParams();
    if (country) p.set("country", country);
    if (intake) p.set("intake", intake);
    const qs = p.toString();
    window.history.replaceState(null, "", qs ? `?${qs}` : window.location.pathname);
    document.querySelectorAll<HTMLElement>("[data-story]").forEach((el) => {
      const ok = (!country || el.dataset.country === country) && (!intake || el.dataset.intake === intake);
      el.hidden = !ok;
    });
  }, [country, intake]);

  const countries = useMemo(() => [...new Map(items.map((i) => [i.country, i.countryName])).entries()], [items]);
  const intakes = useMemo(() => [...new Set(items.map((i) => i.intake))], [items]);
  const count = items.filter((i) => (!country || i.country === country) && (!intake || i.intake === intake)).length;

  return (
    <>
      <div className="mb-8 flex flex-wrap items-end gap-4">
        <div>
          <label htmlFor="f-country" className="field-label">Country</label>
          <select id="f-country" className="input min-w-44" value={country} onChange={(e) => setCountry(e.target.value)}>
            <option value="">All countries</option>
            {countries.map(([slug, name]) => (
              <option key={slug} value={slug}>{name}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="f-intake" className="field-label">Intake</label>
          <select id="f-intake" className="input min-w-44" value={intake} onChange={(e) => setIntake(e.target.value)}>
            <option value="">All intakes</option>
            {intakes.map((i) => (
              <option key={i} value={i}>{i}</option>
            ))}
          </select>
        </div>
        <p className="pb-3 text-sm text-muted" aria-live="polite">
          Showing {count} {count === 1 ? "story" : "stories"}
        </p>
      </div>
      {children}
      {count === 0 ? <p className="text-muted">No stories match these filters yet.</p> : null}
    </>
  );
}
