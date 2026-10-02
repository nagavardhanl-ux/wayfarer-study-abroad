import US from "country-flag-icons/react/3x2/US";
import GB from "country-flag-icons/react/3x2/GB";
import CA from "country-flag-icons/react/3x2/CA";
import AU from "country-flag-icons/react/3x2/AU";
import IE from "country-flag-icons/react/3x2/IE";
import DE from "country-flag-icons/react/3x2/DE";
import NZ from "country-flag-icons/react/3x2/NZ";
import MT from "country-flag-icons/react/3x2/MT";
import EU from "country-flag-icons/react/3x2/EU";
import AE from "country-flag-icons/react/3x2/AE";
import SG from "country-flag-icons/react/3x2/SG";

/** Country slug → flag (SVG, rendered on the server). Europe uses the EU flag, Dubai the UAE flag. */
const FLAGS: Record<string, typeof US> = {
  usa: US,
  uk: GB,
  canada: CA,
  australia: AU,
  ireland: IE,
  germany: DE,
  "new-zealand": NZ,
  malta: MT,
  europe: EU,
  dubai: AE,
  singapore: SG,
};

/** A small flag on a pole that waves gently. Motion stops for visitors who prefer reduced motion. */
export function WavingFlag({ slug, delay = 0 }: { slug: string; delay?: number }) {
  if (slug === "mbbs") return <StethoscopeBadge />;
  const F = FLAGS[slug];
  if (!F) return null;
  return (
    <span className="flag-pole" aria-hidden>
      <span className="flag-wave" style={{ animationDelay: `${delay}ms` }}>
        <F className="block h-full w-full" />
      </span>
    </span>
  );
}

/** MBBS is a course, not a country: a stethoscope badge instead of a flag. */
function StethoscopeBadge() {
  return (
    <span className="mbbs-badge" aria-hidden>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-[60%] w-[60%]">
        <path d="M11 2v2" />
        <path d="M5 2v2" />
        <path d="M5 3H4a2 2 0 0 0-2 2v4a6 6 0 0 0 12 0V5a2 2 0 0 0-2-2h-1" />
        <path d="M8 15a6 6 0 0 0 12 0v-3" />
        <circle cx="20" cy="10" r="2" />
      </svg>
    </span>
  );
}
