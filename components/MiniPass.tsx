import Link from "next/link";
import { PlaneIcon } from "./Icons";
import { Container } from "./ui";

/**
 * Compact boarding-pass strip used as the call to action at the bottom of inner pages.
 * Links to the profile check with the destination already printed on the pass.
 */
export function MiniPass({
  to,
  code,
  query,
  title = "Check your profile with a counsellor",
  text = "Seven short questions, about two minutes. A counsellor from your nearest branch calls you back.",
}: {
  to?: string;
  code?: string;
  query?: Record<string, string>;
  title?: string;
  text?: string;
}) {
  const qs = query ? `?${new URLSearchParams(query).toString()}` : "";
  return (
    <section className="on-navy bg-navy py-12 md:py-16" aria-labelledby="minipass-title">
      <Container>
        <div className="grid items-center gap-8 md:grid-cols-[minmax(0,1fr)_minmax(0,420px)]">
          <div>
            <h2 id="minipass-title" className="t-h2 text-on-navy">
              {title}
            </h2>
            <p className="mt-3 max-w-[52ch] text-on-navy-muted">{text}</p>
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <Link href={`/free-profile-check/${qs}`} className="btn btn-primary">
                Start free profile check
              </Link>
              <Link href="/student-stories/" className="font-semibold text-on-navy underline underline-offset-4">
                Read student stories
              </Link>
            </div>
          </div>
          <div aria-hidden className="rounded-[10px] border border-white/25 px-5 py-4">
            <div className="flex items-end justify-between gap-4">
              <div>
                <div className="pass-label text-on-navy-muted">From</div>
                <div className="pass-value mt-1 text-2xl text-on-navy">Your branch</div>
              </div>
              <div className="text-right">
                <div className="pass-label text-on-navy-muted">To</div>
                <div className="pass-value mt-1 text-2xl text-on-navy">{to ?? "Your choice"}</div>
                {code ? <div className="pass-label mt-1 text-orange-light">{code}</div> : null}
              </div>
            </div>
            <div className="relative mt-4 h-6">
              <div className="absolute inset-x-0 top-1/2 border-t-2 border-dashed border-on-navy-muted/60" />
              <span className="absolute left-[12%] top-1/2 -translate-y-1/2">
                <PlaneIcon className="h-6 w-6" />
              </span>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
