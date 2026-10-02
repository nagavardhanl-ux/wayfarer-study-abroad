const SKIP = new Set(["of", "the", "at", "and", "in", "for"]);

/** Initials from a university name: "University of Maryland, Baltimore County" -> "UMBC". */
export function uniInitials(name: string) {
  const words = name.replace(/[,.]/g, "").split(/\s+/).filter((w) => !SKIP.has(w.toLowerCase()));
  return words.map((w) => w[0]).join("").toUpperCase().slice(0, 4);
}

/** A monogram crest in place of a logo: brand-neutral, no image files, consistent across every tile. */
export function UniCrest({ name, className = "" }: { name: string; className?: string }) {
  const initials = uniInitials(name);
  return (
    <span aria-hidden className={`uni-crest ${className}`} data-len={initials.length}>
      {initials}
    </span>
  );
}
