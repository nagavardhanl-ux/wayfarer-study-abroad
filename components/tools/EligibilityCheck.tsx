"use client";

import { useEffect, useRef, useState } from "react";
import { track } from "@/lib/analytics";
import type { EligibilityCountry } from "@/lib/tools-data";
import { ToolCta } from "./ToolCta";

const TESTS = [
  { id: "ielts", label: "IELTS", closeBy: 0.5 },
  { id: "pte", label: "PTE", closeBy: 5 },
  { id: "toefl", label: "TOEFL iBT (0 to 120)", closeBy: 5 },
] as const;

type Verdict = "meets" | "close" | "below" | "unknown";

export function EligibilityCheck({ countries }: { countries: EligibilityCountry[] }) {
  const [slug, setSlug] = useState(countries[0]?.slug ?? "");
  const [level, setLevel] = useState("pg");
  const [scoreType, setScoreType] = useState<"percent" | "cgpa">("percent");
  const [score, setScore] = useState("");
  const [test, setTest] = useState<(typeof TESTS)[number]["id"]>("ielts");
  const [eng, setEng] = useState("");
  const [shown, setShown] = useState(false);
  const used = useRef(false);

  useEffect(() => {
    const c = new URLSearchParams(window.location.search).get("country");
    if (c && countries.some((x) => x.slug === c)) setSlug(c);
  }, [countries]);

  const c = countries.find((x) => x.slug === slug)!;
  const t = TESTS.find((x) => x.id === test)!;
  const min = c?.min[test];
  const value = Number(eng);
  let verdict: Verdict = "unknown";
  if (min !== undefined && eng !== "" && !Number.isNaN(value)) {
    verdict = value >= min ? "meets" : value >= min - t.closeBy ? "close" : "below";
  }

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setShown(true);
    if (!used.current) {
      used.current = true;
      track("tool_used", { tool: "eligibility_check" });
    }
  };

  if (!c) return <p>No country has verified requirement data yet.</p>;

  return (
    <form onSubmit={submit} noValidate>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <label htmlFor="el-country" className="field-label">Country</label>
          <select id="el-country" className="input" value={slug} onChange={(e) => setSlug(e.target.value)}>
            {countries.map((x) => (
              <option key={x.slug} value={x.slug}>{x.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="el-level" className="field-label">Course level</label>
          <select id="el-level" className="input" value={level} onChange={(e) => setLevel(e.target.value)}>
            <option value="ug">Bachelor's</option>
            <option value="pg">Master's</option>
          </select>
        </div>
        <div>
          <label htmlFor="el-score" className="field-label">Your marks</label>
          <div className="flex gap-2">
            <input id="el-score" className="input tabular" inputMode="decimal" value={score} onChange={(e) => setScore(e.target.value.replace(/[^\d.]/g, "").slice(0, 5))} />
            <select aria-label="Marks type" className="input !w-auto" value={scoreType} onChange={(e) => setScoreType(e.target.value as "percent" | "cgpa")}>
              <option value="percent">%</option>
              <option value="cgpa">CGPA</option>
            </select>
          </div>
        </div>
        <div>
          <label htmlFor="el-test" className="field-label">English test</label>
          <select id="el-test" className="input" value={test} onChange={(e) => setTest(e.target.value as typeof test)}>
            {TESTS.map((x) => (
              <option key={x.id} value={x.id}>{x.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="el-eng" className="field-label">Overall score</label>
          <input id="el-eng" className="input tabular" inputMode="decimal" value={eng} onChange={(e) => setEng(e.target.value.replace(/[^\d.]/g, "").slice(0, 5))} />
        </div>
        <div className="flex items-end">
          <button type="submit" className="btn btn-primary w-full">Check my score</button>
        </div>
      </div>

      {shown ? (
        <div className="mt-8" aria-live="polite">
          <Result verdict={verdict} min={min} testLabel={t.label} country={c} hasScore={eng !== ""} />
          <p className="mt-4 max-w-[66ch] text-sm text-muted">
            This compares your English score with the official minimum ({c.basis}). Universities set their own academic and English requirements, often higher. A counsellor will confirm your eligibility for each course.
          </p>
          <ToolCta
            text="Get a counsellor to check your full profile."
            params={{
              country: c.slug,
              level,
              score: score || undefined,
              scoreType: scoreType === "cgpa" ? "cgpa" : undefined,
              englishStatus: eng ? "taken" : undefined,
              englishTest: eng ? test : undefined,
              englishScore: eng || undefined,
            }}
          />
        </div>
      ) : null}
    </form>
  );
}

function Result({ verdict, min, testLabel, country, hasScore }: { verdict: Verdict; min?: number; testLabel: string; country: EligibilityCountry; hasScore: boolean }) {
  if (!hasScore) return <p className="field-error">Enter your overall English score to compare it.</p>;
  if (min === undefined)
    return (
      <div className="border-l-4 border-line-strong bg-ground p-4">
        <p className="font-semibold">We do not have an official {testLabel} minimum for {country.name}.</p>
        <p className="mt-1">A counsellor will check which tests your universities accept.</p>
      </div>
    );
  const map = {
    meets: { cls: "border-ok", color: "text-ok", title: "Meets typical requirements" },
    close: { cls: "border-close", color: "text-close", title: "Close" },
    below: { cls: "border-below", color: "text-below", title: "Below typical requirements" },
    unknown: { cls: "border-line", color: "text-ink", title: "" },
  }[verdict];
  return (
    <div className={`border-l-4 ${map.cls} bg-ground p-4`}>
      <p className={`font-display text-2xl font-bold ${map.color}`}>{map.title}</p>
      <p className="mt-1">
        The official minimum for {country.name} is {testLabel} {min}.{" "}
        <a href={country.source} target="_blank" rel="noopener noreferrer" className="link">Source</a>
      </p>
    </div>
  );
}
