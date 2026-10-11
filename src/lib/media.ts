import type { Media } from "@/payload-types";

export type ImageSizeName = keyof NonNullable<Media["sizes"]>;

export interface ResolvedImage {
  readonly url: string;
  readonly alt: string;
  readonly width?: number;
  readonly height?: number;
  readonly focalX?: number;
  readonly focalY?: number;
}

/** Relacja upload może przyjść jako id (depth 0) albo obiekt – tu zawsze dostajemy gotowy obrazek albo null. */
export function resolveImage(media: number | Media | null | undefined, size?: ImageSizeName): ResolvedImage | null {
  if (!media || typeof media === "number" || !media.url) {
    return null;
  }
  const variant = size ? media.sizes?.[size] : undefined;
  const url = variant?.url ?? media.url;
  return {
    url,
    alt: media.alt,
    width: variant?.width ?? media.width ?? undefined,
    height: variant?.height ?? media.height ?? undefined,
    focalX: media.focalX ?? undefined,
    focalY: media.focalY ?? undefined,
  };
}

export function objectPosition(image: ResolvedImage): string | undefined {
  if (image.focalX === undefined || image.focalY === undefined) {
    return undefined;
  }
  return `${image.focalX}% ${image.focalY}%`;
}
