import Link from "next/link";

/** Ends every tool: carries the user's inputs into the profile check. */
export function ToolCta({ params, text }: { params: Record<string, string | undefined>; text: string }) {
  const qs = new URLSearchParams(Object.entries(params).filter((e): e is [string, string] => !!e[1])).toString();
  return (
    <div className="on-navy mt-8 rounded-sm bg-navy p-5 text-on-navy md:p-6">
      <p className="font-display text-xl font-bold">{text}</p>
      <p className="mt-1 text-on-navy-muted">Your answers here are carried into the profile check, so you only type them once.</p>
      <Link href={`/free-profile-check/${qs ? `?${qs}` : ""}`} className="btn btn-primary mt-4">
        Start free profile check
      </Link>
    </div>
  );
}

/** Maps a total cost in rupees to the profile check's budget bands. */
export function budgetBand(totalInr: number): string {
  const l = totalInr / 1e5;
  if (l < 15) return "under-15";
  if (l < 25) return "15-25";
  if (l < 40) return "25-40";
  if (l < 60) return "40-60";
  return "over-60";
}
