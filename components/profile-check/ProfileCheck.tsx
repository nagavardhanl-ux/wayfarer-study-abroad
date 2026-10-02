"use client";

import Link from "next/link";
import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { readUtm, track } from "@/lib/analytics";
import { normaliseIndianMobile, telHref, whatsappHref } from "@/lib/contact";
import { ArrowLeft, ArrowRight, PhoneIcon, WhatsAppIcon } from "../Icons";
import { PassStub } from "./PassStub";
import {
  BUDGETS,
  EMPTY_ANSWERS,
  ENGLISH_STATUS,
  ENGLISH_TESTS,
  LEVELS,
  NOT_SURE,
  QUALIFICATIONS,
  labelOf,
  type Answers,
  type DestinationOption,
} from "./options";

export type BranchOption = { slug: string; name: string; city: string; cityCode: string; phone: string; phoneDisplay: string; whatsapp: string };

type StepId = "country" | "level" | "qualification" | "english" | "budget" | "branch" | "contact";
const STEPS: StepId[] = ["country", "level", "qualification", "english", "budget", "branch", "contact"];
const STORAGE_KEY = "xv-profile-check";

type Errors = Partial<Record<keyof Answers, string>>;

function validate(step: StepId, a: Answers): Errors {
  const e: Errors = {};
  if (step === "country" && !a.country) e.country = "Choose a destination, or pick Not sure yet.";
  if (step === "level" && !a.level) e.level = "Choose the course level you want to study.";
  if (step === "qualification") {
    if (!a.qualification) e.qualification = "Choose your highest qualification so far.";
    const n = Number(a.score);
    if (a.score.trim() === "") e.score = a.scoreType === "cgpa" ? "Enter your CGPA, for example 7.8." : "Enter your percentage, for example 72.";
    else if (Number.isNaN(n) || n <= 0 || (a.scoreType === "cgpa" ? n > 10 : n > 100))
      e.score = a.scoreType === "cgpa" ? "CGPA should be a number up to 10." : "Percentage should be a number up to 100.";
  }
  if (step === "english") {
    if (!a.englishStatus) e.englishStatus = "Tell us where you are with the English test.";
    if (a.englishStatus === "taken") {
      const t = ENGLISH_TESTS.find((x) => x.id === a.englishTest);
      if (!t) e.englishTest = "Choose which test you took.";
      else {
        const n = Number(a.englishScore);
        const okToeflNew = t.id === "toefl" && n >= 1 && n <= 6;
        if (a.englishScore.trim() === "" || Number.isNaN(n) || ((n < t.min || n > t.max) && !okToeflNew))
          e.englishScore = `Enter your overall ${t.label} score (${t.min} to ${t.max}${t.id === "toefl" ? ", or 1 to 6 on the new scale" : ""}).`;
      }
    }
  }
  if (step === "budget" && !a.budget) e.budget = "Choose a budget range, or pick Not sure yet.";
  if (step === "branch" && !a.branch) e.branch = "Choose the branch nearest to you.";
  if (step === "contact") {
    if (a.name.trim().length < 2) e.name = "Enter your name.";
    if (!normaliseIndianMobile(a.phone)) e.phone = "Enter a 10-digit Indian mobile number starting with 6, 7, 8 or 9.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(a.email.trim())) e.email = "Enter an email address like name@example.com.";
    if (!a.consent) e.consent = "Tick the box so a counsellor can contact you.";
  }
  return e;
}

export function ProfileCheck({
  destinations,
  branches,
  presetCountry,
  variant = "page",
}: {
  destinations: DestinationOption[];
  branches: BranchOption[];
  presetCountry?: string;
  variant?: "hero" | "page";
}) {
  const [a, setA] = useState<Answers>({ ...EMPTY_ANSWERS, country: presetCountry ?? "" });
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"editing" | "sending" | "done" | "error">("editing");
  const [errorMsg, setErrorMsg] = useState("");
  const [companyTrap, setCompanyTrap] = useState("");
  const started = useRef(false);
  const restored = useRef(false);
  const userNavigated = useRef(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const uid = useId();

  /* Restore saved answers, then apply URL prefill (country, level, score, english, budget, branch). */
  useEffect(() => {
    let next: Answers = { ...EMPTY_ANSWERS, country: presetCountry ?? "" };
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) next = { ...next, ...(JSON.parse(saved) as Partial<Answers>), consent: false };
    } catch {}
    const p = new URLSearchParams(window.location.search);
    const set = (k: keyof Answers, v: string | null) => {
      if (v) (next as Record<string, unknown>)[k] = v.slice(0, 80);
    };
    set("country", p.get("country"));
    set("level", p.get("level"));
    set("qualification", p.get("qualification"));
    set("score", p.get("score"));
    if (p.get("scoreType") === "cgpa") next.scoreType = "cgpa";
    set("englishStatus", p.get("englishStatus"));
    set("englishTest", p.get("englishTest"));
    set("englishScore", p.get("englishScore"));
    set("budget", p.get("budget"));
    set("branch", p.get("branch"));
    if (presetCountry) next.country = presetCountry;
    // Drop values that are not real options
    if (next.country && next.country !== NOT_SURE.slug && !destinations.some((d) => d.slug === next.country)) next.country = "";
    if (next.level && !LEVELS.some((l) => l.id === next.level)) next.level = "";
    if (next.budget && !BUDGETS.some((b) => b.id === next.budget)) next.budget = "";
    if (next.branch && !branches.some((b) => b.slug === next.branch)) next.branch = "";
    setA(next);
    // Start at the first step that still needs an answer (but never skip the contact step)
    const first = STEPS.findIndex((s) => Object.keys(validate(s, next)).length > 0);
    setStep(first === -1 ? STEPS.length - 1 : first);
    restored.current = true;
  }, [presetCountry, destinations, branches]);

  useEffect(() => {
    if (!restored.current) return;
    try {
      const { consent: _c, ...rest } = a;
      void _c;
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(rest));
    } catch {}
  }, [a]);

  /* Move focus to the question when the user changes step (not on first load). */
  useEffect(() => {
    if (userNavigated.current) headingRef.current?.focus();
  }, [step, status]);

  const update = useCallback(<K extends keyof Answers>(k: K, v: Answers[K]) => {
    if (!started.current) {
      started.current = true;
      track("profile_check_start", { location: window.location.pathname });
    }
    setA((prev) => ({ ...prev, [k]: v }));
    setErrors((prev) => ({ ...prev, [k]: undefined }));
  }, []);

  const stepId = STEPS[step];
  const dest = a.country === NOT_SURE.slug ? NOT_SURE : destinations.find((d) => d.slug === a.country);
  const branch = branches.find((b) => b.slug === a.branch);

  const next = () => {
    const e = validate(stepId, a);
    setErrors(e);
    if (Object.keys(e).length) {
      const firstKey = Object.keys(e)[0];
      document.getElementById(`${uid}-${firstKey}`)?.focus();
      return;
    }
    track("profile_check_step", { step: stepId, step_number: step + 1 });
    userNavigated.current = true;
    if (stepId === "contact") void submit();
    else setStep((s) => s + 1);
  };

  const back = () => {
    userNavigated.current = true;
    setErrors({});
    setStep((s) => Math.max(0, s - 1));
  };

  const summary = useMemo(() => buildSummary(a, dest, branch), [a, dest, branch]);

  async function submit() {
    setStatus("sending");
    setErrorMsg("");
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          answers: { ...a, phone: normaliseIndianMobile(a.phone) },
          countryName: dest?.name ?? "",
          branchName: branch?.name ?? "",
          pageUrl: window.location.href,
          utm: readUtm(),
          clientTimestamp: new Date().toISOString(),
          company: companyTrap,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) throw new Error(data.error || "send-failed");
      track("lead_submit", { country: a.country, level: a.level, branch: a.branch });
      setStatus("done");
      try {
        sessionStorage.removeItem(STORAGE_KEY);
      } catch {}
    } catch {
      setStatus("error");
      setErrorMsg("Your details did not reach us. Please try again, or send them to the branch on WhatsApp using the button below.");
    }
  }

  const progress = status === "done" ? 1 : step / STEPS.length;
  const stubFields = [
    { label: "Class", value: labelOf(LEVELS, a.level) ? LEVELS.find((l) => l.id === a.level)!.pass : "" },
    { label: "Profile", value: profileValue(a) },
    { label: "English", value: englishValue(a) },
    { label: "Budget", value: BUDGETS.find((b) => b.id === a.budget)?.pass ?? "" },
    { label: "Passenger", value: status === "done" || stepId === "contact" ? a.name.trim().split(/\s+/)[0] ?? "" : "" },
  ];

  const waMessage = `Hello Wayfarer ${branch?.name ?? ""} branch, I just completed the free profile check on your website.\n\n${summary}\n\nPlease call me to discuss the next steps.`;

  const legendId = `${uid}-legend`;
  const HeadingTag = variant === "hero" ? "h2" : "h2";

  return (
    <div className="@container">
    <div className="pass flex flex-col overflow-hidden @2xl:grid @2xl:grid-cols-[minmax(0,1fr)_minmax(0,300px)]">
      <div className="@container/form order-3 px-5 py-6 @2xl:order-1 @2xl:px-8 @2xl:py-8">
        <p className="sr-only" aria-live="polite">
          {status === "done" ? "Profile check sent." : `Step ${step + 1} of ${STEPS.length}`}
        </p>

        {status === "done" ? (
          <Confirmation name={a.name} branch={branch} waMessage={waMessage} headingRef={headingRef} />
        ) : (
          <form
            noValidate
            onSubmit={(e) => {
              e.preventDefault();
              next();
            }}
          >
            <fieldset aria-describedby={`${uid}-progress`}>
              <legend id={legendId} className="contents">
                <HeadingTag ref={headingRef} tabIndex={-1} className="t-h3 outline-none">
                  {QUESTION[stepId]}
                </HeadingTag>
              </legend>

              <div className="mt-5">
                {stepId === "country" && (
                  <ChipGroup
                    name="country"
                    id={`${uid}-country`}
                    value={a.country}
                    onChange={(v) => update("country", v)}
                    options={[...destinations.map((d) => ({ id: d.slug, label: d.name, code: d.code })), { id: NOT_SURE.slug, label: NOT_SURE.name }]}
                    error={errors.country}
                  />
                )}

                {stepId === "level" && (
                  <ChipGroup name="level" id={`${uid}-level`} value={a.level} onChange={(v) => update("level", v)} options={LEVELS.map((l) => ({ id: l.id, label: l.label }))} error={errors.level} />
                )}

                {stepId === "qualification" && (
                  <div className="space-y-6">
                    <ChipGroup
                      name="qualification"
                      id={`${uid}-qualification`}
                      value={a.qualification}
                      onChange={(v) => update("qualification", v)}
                      options={QUALIFICATIONS.map((q) => ({ id: q.id, label: q.label }))}
                      error={errors.qualification}
                      legend="Highest qualification so far"
                    />
                    <div>
                      <div className="flex flex-wrap items-end gap-3">
                        <div className="w-36">
                          <label htmlFor={`${uid}-score`} className="field-label">
                            Your score
                          </label>
                          <input
                            id={`${uid}-score`}
                            className="input tabular"
                            inputMode="decimal"
                            autoComplete="off"
                            value={a.score}
                            onChange={(e) => update("score", e.target.value.replace(/[^\d.]/g, "").slice(0, 5))}
                            aria-invalid={!!errors.score}
                            aria-describedby={errors.score ? `${uid}-score-err` : `${uid}-score-hint`}
                          />
                        </div>
                        <ChipGroup
                          name="scoreType"
                          id={`${uid}-scoreType`}
                          value={a.scoreType}
                          onChange={(v) => update("scoreType", v as Answers["scoreType"])}
                          options={[
                            { id: "percent", label: "%" },
                            { id: "cgpa", label: "CGPA (out of 10)" },
                          ]}
                          legend="Score type"
                          hideLegend
                          inline
                        />
                      </div>
                      <span id={`${uid}-score-hint`} className="field-hint">
                        Use your final or latest marks.
                      </span>
                      {errors.score ? (
                        <span id={`${uid}-score-err`} className="field-error">
                          {errors.score}
                        </span>
                      ) : null}
                    </div>
                  </div>
                )}

                {stepId === "english" && (
                  <div className="space-y-6">
                    <ChipGroup
                      name="englishStatus"
                      id={`${uid}-englishStatus`}
                      value={a.englishStatus}
                      onChange={(v) => update("englishStatus", v)}
                      options={ENGLISH_STATUS.map((s) => ({ id: s.id, label: s.label }))}
                      error={errors.englishStatus}
                      legend="English test status"
                      hideLegend
                    />
                    {a.englishStatus === "taken" ? (
                      <div className="space-y-4">
                        <ChipGroup
                          name="englishTest"
                          id={`${uid}-englishTest`}
                          value={a.englishTest}
                          onChange={(v) => update("englishTest", v)}
                          options={ENGLISH_TESTS.map((t) => ({ id: t.id, label: t.label }))}
                          error={errors.englishTest}
                          legend="Which test?"
                        />
                        <div className="w-40">
                          <label htmlFor={`${uid}-englishScore`} className="field-label">
                            Overall score
                          </label>
                          <input
                            id={`${uid}-englishScore`}
                            className="input tabular"
                            inputMode="decimal"
                            autoComplete="off"
                            value={a.englishScore}
                            onChange={(e) => update("englishScore", e.target.value.replace(/[^\d.]/g, "").slice(0, 5))}
                            aria-invalid={!!errors.englishScore}
                            aria-describedby={errors.englishScore ? `${uid}-englishScore-err` : undefined}
                          />
                        </div>
                        {errors.englishScore ? (
                          <span id={`${uid}-englishScore-err`} className="field-error">
                            {errors.englishScore}
                          </span>
                        ) : null}
                      </div>
                    ) : null}
                  </div>
                )}

                {stepId === "budget" && (
                  <>
                    <p className="-mt-2 mb-4 text-muted">Total for the whole course, including fees and living costs. An education loan can be part of it.</p>
                    <ChipGroup name="budget" id={`${uid}-budget`} value={a.budget} onChange={(v) => update("budget", v)} options={BUDGETS.map((b) => ({ id: b.id, label: b.label }))} error={errors.budget} />
                  </>
                )}

                {stepId === "branch" && (
                  <ChipGroup
                    name="branch"
                    id={`${uid}-branch`}
                    value={a.branch}
                    onChange={(v) => update("branch", v)}
                    options={branches.map((b) => ({ id: b.slug, label: b.name, code: b.city === b.name ? b.cityCode : b.city }))}
                    error={errors.branch}
                  />
                )}

                {stepId === "contact" && (
                  <div className="grid gap-5 @md/form:grid-cols-2">
                    <TextField id={`${uid}-name`} label="Your name" value={a.name} onChange={(v) => update("name", v.slice(0, 80))} error={errors.name} autoComplete="name" />
                    <div>
                      <label htmlFor={`${uid}-phone`} className="field-label">
                        Mobile number
                      </label>
                      <div className="flex">
                        <span className="tabular flex items-center rounded-l-sm border border-r-0 border-line-strong bg-ground px-3 font-semibold">+91</span>
                        <input
                          id={`${uid}-phone`}
                          className="input tabular !rounded-l-none"
                          type="tel"
                          inputMode="numeric"
                          autoComplete="tel-national"
                          value={a.phone}
                          onChange={(e) => update("phone", e.target.value.replace(/[^\d\s+]/g, "").slice(0, 16))}
                          aria-invalid={!!errors.phone}
                          aria-describedby={errors.phone ? `${uid}-phone-err` : `${uid}-phone-hint`}
                        />
                      </div>
                      <span id={`${uid}-phone-hint`} className="field-hint">
                        10 digits. A counsellor will call this number.
                      </span>
                      {errors.phone ? (
                        <span id={`${uid}-phone-err`} className="field-error">
                          {errors.phone}
                        </span>
                      ) : null}
                    </div>
                    <div className="@md/form:col-span-2">
                      <TextField id={`${uid}-email`} label="Email" type="email" value={a.email} onChange={(v) => update("email", v.slice(0, 120))} error={errors.email} autoComplete="email" />
                    </div>
                    <div className="@md/form:col-span-2">
                      <div className="flex gap-3">
                        <input
                          id={`${uid}-consent`}
                          type="checkbox"
                          className="mt-1 h-6 w-6 shrink-0 accent-[var(--blue)]"
                          checked={a.consent}
                          onChange={(e) => update("consent", e.target.checked)}
                          aria-invalid={!!errors.consent}
                          aria-describedby={errors.consent ? `${uid}-consent-err` : undefined}
                        />
                        <label htmlFor={`${uid}-consent`} className="text-sm">
                          I agree that Wayfarer may use these details to contact me by phone, WhatsApp and email about studying abroad. I have read the{" "}
                          <Link href="/privacy-policy/" className="link" target="_blank">
                            privacy policy
                          </Link>{" "}
                          and can ask for my data to be deleted at any time.
                        </label>
                      </div>
                      {errors.consent ? (
                        <span id={`${uid}-consent-err`} className="field-error">
                          {errors.consent}
                        </span>
                      ) : null}
                    </div>
                    {/* Spam trap: hidden from people, filled by bots */}
                    <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
                      <label htmlFor={`${uid}-company`}>Company</label>
                      <input id={`${uid}-company`} tabIndex={-1} autoComplete="off" value={companyTrap} onChange={(e) => setCompanyTrap(e.target.value)} />
                    </div>
                  </div>
                )}
              </div>
            </fieldset>

            {status === "error" ? (
              <div role="alert" className="mt-6 border-l-4 border-below bg-ground p-4">
                <p className="font-semibold text-below">{errorMsg}</p>
                {branch ? (
                  <a href={whatsappHref(branch.whatsapp, waMessage)} target="_blank" rel="noopener noreferrer" data-track="whatsapp" data-branch={branch.slug} data-location="profile-check-error" className="btn btn-secondary mt-3">
                    <WhatsAppIcon /> Send on WhatsApp to {branch.name} branch
                  </a>
                ) : null}
              </div>
            ) : null}

            <div className="mt-8 flex items-center justify-between gap-3">
              {step > 0 ? (
                <button type="button" onClick={back} className="btn btn-secondary">
                  <ArrowLeft className="h-4 w-4" /> Back
                </button>
              ) : (
                <span id={`${uid}-progress`} className="text-sm text-muted">
                  Step 1 of {STEPS.length} · about 2 minutes
                </span>
              )}
              <button type="submit" className="btn btn-primary" disabled={status === "sending"}>
                {stepId === "contact" ? (status === "sending" ? "Sending…" : "Send my profile") : "Continue"}
                {stepId !== "contact" ? <ArrowRight className="h-4 w-4" /> : null}
              </button>
            </div>
            {step > 0 ? (
              <p id={`${uid}-progress`} className="mt-3 text-sm text-muted">
                Step {step + 1} of {STEPS.length}
              </p>
            ) : null}
          </form>
        )}
      </div>

      <div className="pass-perforation order-2 @2xl:hidden" />
      {/* Stub: on top when the pass is narrow, a side panel when it is wide */}
      <div className="relative order-1 @2xl:order-2 @2xl:border-l-2 @2xl:border-dashed @2xl:border-line">
        <PassStub
          from={branch ? { city: branch.city, code: `${branch.cityCode} · ${branch.name}` } : null}
          to={dest ? { name: dest.slug === NOT_SURE.slug ? "Open" : dest.name, code: dest.code } : null}
          fields={stubFields}
          progress={progress}
        />
      </div>
    </div>
    </div>
  );
}

const QUESTION: Record<StepId, string> = {
  country: "Where do you want to study?",
  level: "What do you want to study?",
  qualification: "What is your highest qualification so far?",
  english: "Have you taken an English test?",
  budget: "What is your total budget?",
  branch: "Which branch is nearest to you?",
  contact: "Where should a counsellor reach you?",
};

function profileValue(a: Answers) {
  const q = QUALIFICATIONS.find((x) => x.id === a.qualification)?.pass;
  if (!q) return "";
  if (!a.score) return q;
  return `${q} ${a.scoreType === "cgpa" ? `${a.score} CGPA` : `${a.score}%`}`;
}

function englishValue(a: Answers) {
  if (a.englishStatus === "not-taken") return "Not taken";
  if (a.englishStatus === "booked") return "Booked";
  if (a.englishStatus === "taken") {
    const t = ENGLISH_TESTS.find((x) => x.id === a.englishTest)?.label ?? "";
    return `${t} ${a.englishScore}`.trim();
  }
  return "";
}

function buildSummary(a: Answers, dest?: DestinationOption, branch?: BranchOption) {
  const lines = [
    `Name: ${a.name.trim()}`,
    `Destination: ${dest?.name ?? ""}`,
    `Course level: ${labelOf(LEVELS, a.level)}`,
    `Qualification: ${labelOf(QUALIFICATIONS, a.qualification)}${a.score ? `, ${a.scoreType === "cgpa" ? `${a.score} CGPA` : `${a.score}%`}` : ""}`,
    `English test: ${a.englishStatus === "taken" ? englishValue(a) : labelOf(ENGLISH_STATUS, a.englishStatus)}`,
    `Budget: ${labelOf(BUDGETS, a.budget)}`,
    `Nearest branch: ${branch?.name ?? ""}`,
  ];
  return lines.join("\n");
}

/* ---------- small pieces ---------- */

type ChipOption = { id: string; label: string; code?: string };

function ChipGroup({
  name,
  id,
  value,
  onChange,
  options,
  error,
  legend,
  hideLegend,
  inline = false,
}: {
  name: string;
  id: string;
  value: string;
  onChange: (v: string) => void;
  options: ChipOption[];
  error?: string;
  legend?: string;
  hideLegend?: boolean;
  inline?: boolean;
}) {
  const errId = `${id}-err`;
  const inner = (
    <>
      <div
        className={inline ? "flex flex-wrap gap-2.5" : "grid grid-cols-2 gap-2.5 @md/form:grid-cols-3"}
        role="radiogroup"
        aria-invalid={!!error}
        aria-describedby={error ? errId : undefined}
        aria-label={legend}
      >
        {options.map((o, i) => {
          const inputId = i === 0 ? id : `${id}-${o.id}`;
          return (
            <span key={o.id} className="relative flex">
              <input type="radio" className="chip-input" id={inputId} name={name} value={o.id} checked={value === o.id} onChange={() => onChange(o.id)} />
              <label htmlFor={inputId} className={`chip ${inline ? "" : "w-full justify-between text-left"}`}>
                {o.label}
                {o.code ? <span className="chip-code">{o.code}</span> : null}
              </label>
            </span>
          );
        })}
      </div>
      {error ? (
        <span id={errId} className="field-error">
          {error}
        </span>
      ) : null}
    </>
  );
  if (!legend || hideLegend) return inner;
  return (
    <div>
      <p className="field-label">{legend}</p>
      {inner}
    </div>
  );
}

function TextField({
  id,
  label,
  value,
  onChange,
  error,
  type = "text",
  autoComplete,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  type?: string;
  autoComplete?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="field-label">
        {label}
      </label>
      <input id={id} type={type} className="input" value={value} onChange={(e) => onChange(e.target.value)} autoComplete={autoComplete} aria-invalid={!!error} aria-describedby={error ? `${id}-err` : undefined} />
      {error ? (
        <span id={`${id}-err`} className="field-error">
          {error}
        </span>
      ) : null}
    </div>
  );
}

function Confirmation({ name, branch, waMessage, headingRef }: { name: string; branch?: BranchOption; waMessage: string; headingRef: React.RefObject<HTMLHeadingElement | null> }) {
  const today = new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }).toUpperCase();
  const first = name.trim().split(/\s+/)[0];
  return (
    <div>
      <div className="flex items-start justify-between gap-4">
        <h2 ref={headingRef} tabIndex={-1} className="t-h3 outline-none">
          Thank you, {first}. Your profile has reached the {branch?.name} branch.
        </h2>
        <div className="stamp shrink-0 rounded-sm border-[3px] border-orange-ink px-3 py-1.5 text-center text-orange-ink" aria-hidden>
          <div className="pass-value text-xl">Received</div>
          <div className="pass-label tabular">{today}</div>
        </div>
      </div>
      <p className="mt-4">
        A counsellor will call you to go through your profile. If you want to start now, send your answers to the branch on WhatsApp.
      </p>
      {branch ? (
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <a href={whatsappHref(branch.whatsapp, waMessage)} target="_blank" rel="noopener noreferrer" data-track="whatsapp" data-branch={branch.slug} data-location="profile-check-confirmation" className="btn btn-primary">
            <WhatsAppIcon /> Chat on WhatsApp with {branch.name}
          </a>
          <a href={telHref(branch.phone)} data-track="call" data-branch={branch.slug} data-location="profile-check-confirmation" className="btn btn-secondary">
            <PhoneIcon /> Call {branch.name} branch: <span className="tabular">{branch.phoneDisplay}</span>
          </a>
        </div>
      ) : null}
      <p className="mt-6 text-sm text-muted">
        While you wait: <Link href="/tools/cost-calculator/" className="link">estimate your costs</Link> or read <Link href="/for-parents/" className="link">the guide for parents</Link>.
      </p>
    </div>
  );
}
