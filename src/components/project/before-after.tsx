"use client";

import { useId, useState } from "react";
import type { ResolvedImage } from "@/lib/media";

const INITIAL_POSITION_PERCENT = 50;

interface BeforeAfterProps {
  readonly before: ResolvedImage;
  readonly after: ResolvedImage;
}

/** Suwak porównania „przed / po”. Sterowany natywnym inputem range – działa myszką, dotykiem i klawiaturą. */
export function BeforeAfter({ before, after }: BeforeAfterProps) {
  const [position, setPosition] = useState(INITIAL_POSITION_PERCENT);
  const sliderId = useId();

  return (
    <figure>
      <div className="relative aspect-[4/3] select-none overflow-hidden rounded-lg border border-rule bg-surface sm:aspect-[16/10]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={after.url} alt={after.alt} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={before.url} alt={before.alt} className="absolute inset-0 h-full w-full object-cover" />
        </div>
        <div className="pointer-events-none absolute inset-y-0 w-0.5 bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.25)]" style={{ left: `${position}%` }}>
          <span className="absolute left-1/2 top-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-sm font-bold text-[#16202c] shadow-md">
            ⇆
          </span>
        </div>
        <span className="pointer-events-none absolute left-3 top-3 rounded bg-black/65 px-2 py-1 text-sm font-medium text-white">Przed</span>
        <span className="pointer-events-none absolute right-3 top-3 rounded bg-black/65 px-2 py-1 text-sm font-medium text-white">Po</span>
        <label htmlFor={sliderId} className="sr-only">
          Przesuń, aby porównać zdjęcia przed i po
        </label>
        <input
          id={sliderId}
          type="range"
          min={0}
          max={100}
          value={position}
          onChange={(event) => setPosition(Number(event.target.value))}
          className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0"
        />
      </div>
      <figcaption className="mt-2 text-sm text-ink-soft">Przeciągnij suwak, żeby porównać stan przed i po.</figcaption>
    </figure>
  );
}
