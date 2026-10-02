"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export type BoardRow = {
  slug: string;
  code: string;
  name: string;
  path: string;
  intakes: { label: string; startMonth: number }[];
  work: string | null;
};

const MONTHS = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

function nextIntake(row: BoardRow, today: Date) {
  let best: { date: Date } | null = null;
  for (const i of row.intakes) {
    let d = new Date(today.getFullYear(), i.startMonth - 1, 1);
    if (d.getTime() - today.getTime() < 30 * 864e5) d = new Date(today.getFullYear() + 1, i.startMonth - 1, 1);
    if (!best || d < best.date) best = { date: d };
  }
  if (!best) return null;
  const months = (best.date.getFullYear() - today.getFullYear()) * 12 + best.date.getMonth() - today.getMonth();
  return { text: `${MONTHS[best.date.getMonth()]} ${best.date.getFullYear()}`, months };
}

/** One row of split-flap characters that clatter into place when `go` turns true. */
function Flap({ text, go, delay = 0, width }: { text: string; go: boolean; delay?: number; width?: number }) {
  const target = text.toUpperCase().padEnd(width ?? text.length, " ");
  const [shown, setShown] = useState(target);
  const done = useRef(false);

  useEffect(() => {
    if (!go || done.current) return;
    done.current = true;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame = 0;
    const settleAt = target.split("").map((_, i) => 6 + i * 1.5 + Math.random() * 4);
    let timer: ReturnType<typeof setInterval>;
    const startT = setTimeout(() => {
      timer = setInterval(() => {
        frame++;
        setShown(
          target
            .split("")
            .map((ch, i) => (frame >= settleAt[i] || ch === " " ? ch : GLYPHS[Math.floor(Math.random() * GLYPHS.length)]))
            .join(""),
        );
        if (settleAt.every((s) => frame >= s)) clearInterval(timer);
      }, 45);
    }, delay);
    return () => {
      clearTimeout(startT);
      clearInterval(timer);
    };
  }, [go, delay, target]);

  return (
    <span className="flap" aria-hidden>
      {shown.split("").map((ch, i) => (
        <span key={i} className="flap-cell">
          {ch === " " ? " " : ch}
        </span>
      ))}
    </span>
  );
}

/**
 * Airport-style departure board for "Where students go": next intake, months left (live from today's date)
 * and work rights after study, all from verified country data. Rows link to each country page.
 */
export function DepartureBoard({ rows }: { rows: BoardRow[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [go, setGo] = useState(false);
  const [today, setToday] = useState<Date | null>(null);

  useEffect(() => {
    setToday(new Date());
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setGo(true), { threshold: 0.2 });
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className="board">
      <div className="board-head hidden md:grid" aria-hidden>
        <span>Code</span>
        <span>Destination</span>
        <span>Next intake</span>
        <span>Months left</span>
        <span>Work after study</span>
      </div>
      <ul>
        {rows.map((r, idx) => {
          const n = today ? nextIntake(r, today) : null;
          const intake = n ? n.text : r.intakes.length ? "" : "ASK US";
          const months = n ? String(n.months).padStart(2, "0") : "--";
          const work = r.work ?? "ASK US";
          const label = `${r.name}. Next intake: ${n ? n.text : "ask a counsellor"}. ${n ? `${n.months} months left.` : ""} Work after study: ${r.work ?? "ask a counsellor"}.`;
          return (
            <li key={r.slug}>
              <Link href={r.path} className="board-row group">
                <span className="sr-only">{label}</span>
                <span className="board-code">
                  <Flap text={r.code} go={go} delay={idx * 70} width={3} />
                </span>
                <span className="board-dest">
                  <Flap text={r.name} go={go} delay={idx * 70 + 40}  />
                </span>
                <span className="board-intake">
                  <Flap text={intake} go={go && !!today} delay={idx * 70 + 80}  />
                </span>
                <span className={`board-months ${n && n.months <= 6 ? "board-soon" : ""}`}>
                  <Flap text={months} go={go && !!today} delay={idx * 70 + 120} width={2} />
                </span>
                <span className="board-work">
                  <Flap text={work} go={go} delay={idx * 70 + 160}  />
                </span>
                <span className="board-arrow" aria-hidden>
                  →
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
