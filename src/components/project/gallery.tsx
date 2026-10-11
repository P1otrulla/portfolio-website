"use client";

import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { ResolvedImage } from "@/lib/media";

export interface GalleryItem {
  readonly key: string;
  readonly thumb: ResolvedImage;
  readonly full: ResolvedImage;
  readonly caption?: string;
}

const KEY = { LEFT: "ArrowLeft", RIGHT: "ArrowRight" } as const;

export function Gallery({ items }: { readonly items: readonly GalleryItem[] }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const step = useCallback(
    (delta: number) => setActiveIndex((index) => (index === null ? null : (index + delta + items.length) % items.length)),
    [items.length],
  );

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) {
      return;
    }
    if (activeIndex !== null && !dialog.open) {
      dialog.showModal();
    } else if (activeIndex === null && dialog.open) {
      dialog.close();
    }
  }, [activeIndex]);

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === KEY.LEFT) step(-1);
    if (event.key === KEY.RIGHT) step(1);
  };

  const active = activeIndex === null ? null : items[activeIndex];

  return (
    <>
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {items.map((item, index) => (
          <li key={item.key}>
            <button
              type="button"
              onClick={() => setActiveIndex(index)}
              className="group block w-full overflow-hidden rounded-md border border-rule"
              aria-label={`Powiększ zdjęcie: ${item.caption ?? item.thumb.alt}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.thumb.url}
                alt={item.thumb.alt}
                loading="lazy"
                className="aspect-[3/2] w-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
              />
            </button>
          </li>
        ))}
      </ul>

      <dialog
        ref={dialogRef}
        onClose={() => setActiveIndex(null)}
        onKeyDown={onKeyDown}
        onClick={(event) => event.target === dialogRef.current && setActiveIndex(null)}
        className="m-auto max-h-[92dvh] w-[min(1200px,94vw)] bg-transparent p-0 backdrop:bg-black/85"
        aria-label="Podgląd zdjęcia"
      >
        {active && (
          <figure className="relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={active.full.url} alt={active.full.alt} className="mx-auto max-h-[82dvh] w-auto rounded-md object-contain" />
            <figcaption className="mt-3 flex items-center justify-between gap-4 text-sm text-white/85">
              <span>{active.caption ?? active.full.alt}</span>
              <span className="tabular-nums">
                {(activeIndex ?? 0) + 1} / {items.length}
              </span>
            </figcaption>
            <div className="absolute right-2 top-2 flex gap-2">
              {items.length > 1 && (
                <>
                  <button type="button" onClick={() => step(-1)} className="rounded-full bg-black/60 p-2 text-white hover:bg-black/80" aria-label="Poprzednie zdjęcie">
                    <ChevronLeft size={20} />
                  </button>
                  <button type="button" onClick={() => step(1)} className="rounded-full bg-black/60 p-2 text-white hover:bg-black/80" aria-label="Następne zdjęcie">
                    <ChevronRight size={20} />
                  </button>
                </>
              )}
              <button type="button" onClick={() => setActiveIndex(null)} className="rounded-full bg-black/60 p-2 text-white hover:bg-black/80" aria-label="Zamknij podgląd">
                <X size={20} />
              </button>
            </div>
          </figure>
        )}
      </dialog>
    </>
  );
}
