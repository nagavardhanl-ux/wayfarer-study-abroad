import { PlaneIcon } from "../Icons";

export type StubField = { label: string; value: string };

/** Empty field marker: a short rule, read as "not answered" by screen readers. */
function Blank({ wide = false }: { wide?: boolean }) {
  return (
    <>
      <span aria-hidden className={`inline-block border-b-2 border-on-navy-muted/60 align-middle ${wide ? "w-20" : "w-8"}`} />
      <span className="sr-only">Not answered yet</span>
    </>
  );
}

/**
 * The navy stub of the boarding pass: FROM (branch city) to TO (destination),
 * a route line with the logo's paper plane as the progress marker, and the answer fields.
 */
export function PassStub({
  from,
  to,
  fields,
  progress,
  compact = false,
}: {
  from: { city: string; code: string } | null;
  to: { name: string; code: string } | null;
  fields: StubField[];
  progress: number; // 0 to 1
  compact?: boolean;
}) {
  const pct = Math.max(0, Math.min(1, progress)) * 100;
  return (
    <div className="@container/stub on-navy relative h-full bg-navy px-5 py-5 text-on-navy @md/stub:px-6" aria-label="Your answers so far" role="group">
      <div className="flex items-start justify-between gap-3">
        <Endpoint label="From" value={from?.city} code={from?.code} />
        <Endpoint label="To" value={to?.name} code={to?.code} align="right" />
      </div>

      <div className="relative mx-1 my-4 h-7" aria-hidden>
        <div className="absolute inset-x-0 top-1/2 border-t-2 border-dashed border-on-navy-muted/60" />
        <div className="absolute left-0 top-1/2 border-t-2 border-orange" style={{ width: `${pct}%` }} />
        <span className="absolute left-0 top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full bg-on-navy" />
        <span className="absolute right-0 top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full border-2 border-on-navy bg-navy" />
        <span className="route-plane absolute top-1/2 -translate-x-1/2 -translate-y-1/2" style={{ left: `${Math.max(4, Math.min(96, pct))}%` }}>
          <PlaneIcon className="h-7 w-7" />
        </span>
      </div>

      {!compact ? (
        <dl className="grid grid-cols-2 gap-x-4 gap-y-3 @md/stub:grid-cols-3 @xl/stub:grid-cols-5">
          {fields.map((f) => (
            <div key={f.label} className="min-w-0">
              <dt className="pass-label text-on-navy-muted">{f.label}</dt>
              <dd className="pass-value mt-1 truncate text-[1.05rem]">{f.value ? f.value : <Blank />}</dd>
            </div>
          ))}
        </dl>
      ) : null}
    </div>
  );
}

function Endpoint({ label, value, code, align = "left" }: { label: string; value?: string; code?: string; align?: "left" | "right" }) {
  return (
    <div className={`min-w-0 ${align === "right" ? "text-right" : ""}`}>
      <div className="pass-label text-on-navy-muted">{label}</div>
      <div className="pass-value mt-1 truncate text-[1.75rem] text-on-navy md:text-[2.1rem]">{value ? value : <Blank wide />}</div>
      <div className="pass-label mt-1 text-orange-light">{code || " "}</div>
    </div>
  );
}
