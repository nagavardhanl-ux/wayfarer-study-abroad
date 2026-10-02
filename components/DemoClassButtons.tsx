import { getBranches } from "@/lib/content";
import { whatsappHref } from "@/lib/contact";
import { WhatsAppIcon } from "./Icons";

/** "Book a demo class" via WhatsApp to the branch the student chooses, with the test name prefilled. */
export function DemoClassButtons({ test }: { test: string }) {
  return (
    <div>
      <p className="font-semibold">Book a demo class on WhatsApp with your nearest branch:</p>
      <ul className="mt-3 flex flex-wrap gap-2">
        {getBranches().map((b) => (
          <li key={b.slug}>
            <a
              href={whatsappHref(b.whatsapp, `Hello Wayfarer ${b.name}, I would like to book a ${test} demo class. Please share the next batch timings.`)}
              target="_blank"
              rel="noopener noreferrer"
              data-track="whatsapp"
              data-branch={b.slug}
              data-location={`demo-${test}`}
              className="btn btn-secondary !min-h-11 text-sm"
            >
              <WhatsAppIcon className="h-4 w-4" /> {b.name}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
