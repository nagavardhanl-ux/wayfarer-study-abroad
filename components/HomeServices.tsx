import Link from "next/link";
import home from "@/content/home.json";
import { ArrowRight } from "./Icons";
import { Container, SectionHeading } from "./ui";

/** 24px stroke icons for the card fronts, keyed by `icon` in content/home.json. */
const ICONS: Record<string, React.ReactNode> = {
  test: <><path d="M9 3h6v4H9z" /><path d="M7 5H5v16h14V5h-2" /><path d="m9 13 2 2 4-4" /></>,
  chat: <><path d="M4 5h16v11H9l-5 4z" /><path d="M8 9h8M8 12h5" /></>,
  award: <><circle cx="12" cy="9" r="5" /><path d="m9 13.5-1.5 7.5 4.5-2.5 4.5 2.5-1.5-7.5" /></>,
  stamp: <><path d="M9 3h6l-1 8h-4z" /><path d="M5 14h14v3H5z" /><path d="M7 21h10" /></>,
  doc: <><path d="M6 3h8l4 4v14H6z" /><path d="M14 3v4h4M9 12h6M9 16h6" /></>,
  campus: <><path d="M3 9 12 4l9 5" /><path d="M5 10v8M9 10v8M15 10v8M19 10v8M3 20h18" /></>,
  book: <><path d="M4 5c3-1 6-1 8 1 2-2 5-2 8-1v14c-3-1-6-1-8 1-2-2-5-2-8-1z" /><path d="M12 6v14" /></>,
  loan: <><rect x="3" y="6" width="18" height="12" rx="2" /><circle cx="12" cy="12" r="2.5" /><path d="M6 9v.01M18 15v.01" /></>,
};

/**
 * "One-stop destination" flip cards: a line icon, index and title on a night-grid front,
 * description on a blue or orange back. Each card opens its service page.
 * Phones and touch screens (no hover) show the description under the title instead of flipping.
 */
export function HomeServices() {
  const s = home.services;
  return (
    <section aria-labelledby="services-h" className="cv-auto bg-ground py-12 md:py-[88px]">
      <Container>
        <SectionHeading id="services-h" intro={s.intro}>
          {s.heading}
        </SectionHeading>
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          {s.items.map((it, i) => {
            const back = i % 2 === 0 ? "flip-back-navy" : "flip-back-orange";
            return (
              <li key={it.title}>
                <Link href={it.href} className="flip-card group block aspect-square w-full rounded-[10px]">
                  <span className="flip-inner">
                    <span className="flip-face flip-front">
                      <span className="data-label absolute left-5 top-5 text-orange-light">{String(i + 1).padStart(2, "0")}</span>
                      <svg aria-hidden viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" className="flip-icon">
                        {ICONS[it.icon]}
                      </svg>
                      <span className="absolute inset-x-0 bottom-0 p-5">
                        <span className="block font-display text-2xl font-bold leading-tight text-white">{it.title}</span>
                        <span aria-hidden className="flip-touch-text mt-2 text-sm leading-snug text-white/90">{it.text}</span>
                      </span>
                    </span>
                    <span className={`flip-face flip-back ${back}`} aria-hidden>
                      <span className="block font-display text-2xl font-bold leading-tight">{it.title}</span>
                      <span className="mt-3 block leading-snug">{it.text}</span>
                      <span className="mt-5 inline-flex items-center gap-1.5 font-semibold underline underline-offset-4">
                        Learn more <ArrowRight className="h-4 w-4" />
                      </span>
                    </span>
                  </span>
                  <span className="sr-only">. {it.text}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
