"use client";

import { useEffect, useState } from "react";

/** Renders the current year in the visitor's browser, so static pages never show a stale year. */
export function CurrentYear() {
  const [year, setYear] = useState(() => new Date().getFullYear());
  useEffect(() => setYear(new Date().getFullYear()), []);
  return <span suppressHydrationWarning>{year}</span>;
}
