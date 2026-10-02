"use client";

import { useState } from "react";
import { PinIcon } from "./Icons";

/** Google Map that loads only when the visitor asks for it. */
export function MapEmbed({ src, title, mapLink }: { src: string; title: string; mapLink: string }) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative aspect-[4/3] w-full max-w-full overflow-hidden rounded-sm border border-line bg-ground md:aspect-[16/10]">
      {show ? (
        <iframe src={src} title={title} className="absolute inset-0 h-full w-full" loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center">
          <PinIcon className="h-8 w-8 text-blue" />
          <button type="button" className="btn btn-secondary" onClick={() => setShow(true)}>
            Show map
          </button>
          <a href={mapLink} target="_blank" rel="noopener noreferrer" className="link text-sm">
            Open in Google Maps
          </a>
        </div>
      )}
    </div>
  );
}
