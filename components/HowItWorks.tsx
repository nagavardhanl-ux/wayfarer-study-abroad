import home from "@/content/home.json";
import { PlaneIcon } from "./Icons";
import { Container, SectionHeading } from "./ui";

/**
 * "How Wayfarer works" as a three-leg journey (Plan, Apply, Fly) instead of a long numbered list.
 * Desktop: a route line with the plane runs across the three legs. Phones: legs stack.
 */
export function HowItWorks() {
  const h = home.how;
  return (
    <section aria-labelledby="how-h" className="night on-navy py-14 md:py-[88px]">
      <Container>
        <SectionHeading id="how-h" intro={h.intro} tone="navy">
          {h.heading}
        </SectionHeading>

        {/* Route across the three legs (desktop) */}
        <div className="journey-route relative mb-6 hidden h-10 lg:block" aria-hidden>
          <div className="absolute inset-x-[6%] top-1/2 border-t-2 border-dashed border-white/25" />
          <div className="journey-fill absolute left-[6%] top-1/2 border-t-2 border-orange" />
          {h.legs.map((leg, i) => (
            <span
              key={leg.name}
              className="absolute top-1/2 flex h-4 w-4 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-orange-light bg-night"
              style={{ left: `${(100 / h.legs.length) * i + 100 / h.legs.length / 2}%` }}
            />
          ))}
          <span className="absolute left-[6%] top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 rounded-sm bg-orange px-2 py-0.5 font-display text-xs font-bold tracking-[0.08em] text-ink">BLR · MAA · PNQ · COK</span>
          <span className="journey-plane absolute top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-1">
            <PlaneIcon className="h-8 w-8" />
          </span>
        </div>

        <ol className="grid gap-5 lg:grid-cols-3">
          {h.legs.map((leg, i) => (
            <li key={leg.name} className="journey-leg flex flex-col overflow-hidden rounded-[12px] border border-white/10 bg-paper text-ink shadow-[0_24px_50px_-28px_rgba(0,0,0,0.7)]">
              <div className={`px-5 py-4 ${i === 1 ? "bg-orange text-ink" : "on-navy bg-navy text-on-navy"}`}>
                <p className={`pass-label ${i === 1 ? "text-ink" : "text-on-navy-muted"}`}>Leg {i + 1} of {h.legs.length}</p>
                <h3 className={`mt-1 font-display text-3xl font-extrabold ${i === 1 ? "text-ink" : "text-on-navy"}`}>{leg.name}</h3>
                <p className={`mt-1 text-sm ${i === 1 ? "text-ink" : "text-on-navy-muted"}`}>{leg.text}</p>
              </div>
              <div className="pass-perforation" />
              <ul className="flex flex-1 flex-col gap-5 px-5 py-5">
                {leg.steps.map((s) => (
                  <li key={s.title} className="flex gap-4">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-ground text-blue" aria-hidden>
                      <StepIcon name={s.icon} />
                    </span>
                    <div>
                      <h4 className="font-display text-lg font-bold leading-tight text-ink">{s.title}</h4>
                      <p className="mt-1 text-sm text-muted">{s.text}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}

/** Small line icons for each step. */
function StepIcon({ name }: { name: string }) {
  const p = { fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  const paths: Record<string, React.ReactNode> = {
    check: (
      <>
        <rect x="5" y="4" width="14" height="17" rx="2" {...p} />
        <path d="M9 4V3h6v1" {...p} />
        <path d="m9 13 2 2 4-4" {...p} />
      </>
    ),
    list: (
      <>
        <path d="M9 6h11M9 12h11M9 18h11" {...p} />
        <circle cx="4.5" cy="6" r="1" fill="currentColor" />
        <circle cx="4.5" cy="12" r="1" fill="currentColor" />
        <circle cx="4.5" cy="18" r="1" fill="currentColor" />
      </>
    ),
    book: (
      <>
        <path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z" {...p} />
        <path d="M4 21V5M8 7h7" {...p} />
      </>
    ),
    send: (
      <>
        <path d="M22 2 11 13" {...p} />
        <path d="M22 2 15 22l-4-9-9-4z" {...p} />
      </>
    ),
    wallet: (
      <>
        <rect x="3" y="6" width="18" height="14" rx="2" {...p} />
        <path d="M3 10h18M16 15h2" {...p} />
        <path d="M6 6V4h11v2" {...p} />
      </>
    ),
    passport: (
      <>
        <rect x="5" y="2.5" width="14" height="19" rx="2" {...p} />
        <circle cx="12" cy="10" r="3.2" {...p} />
        <path d="M9 17h6" {...p} />
      </>
    ),
    home: (
      <>
        <path d="M3 11 12 4l9 7" {...p} />
        <path d="M5 10v10h14V10" {...p} />
        <path d="M10 20v-5h4v5" {...p} />
      </>
    ),
    plane: <path d="M10.5 13.5 3 11l1.5-1.5 8 1 4-4.5a2 2 0 0 1 3 3l-4.5 4 1 8L14.5 22 12 14.5 8.5 18v2.5L7 22l-1-4-4-1 1.5-1.5H6z" {...p} />,
  };
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5">
      {paths[name] ?? paths.check}
    </svg>
  );
}
