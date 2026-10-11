import path from "path";
import type { CollectionConfig } from "payload";
import { anyone } from "@/cms/access";
import { COLLECTION } from "@/lib/constants";

const MEDIA_DIR = process.env.MEDIA_DIR ?? path.resolve(process.cwd(), "media");

export const IMAGE_SIZE = {
  CARD: "card",
  WIDE: "wide",
} as const;

export const Media: CollectionConfig = {
  slug: COLLECTION.MEDIA,
  labels: { singular: "Plik", plural: "Media" },
  admin: { group: "Treści" },
  access: { read: anyone },
  upload: {
    staticDir: MEDIA_DIR,
    mimeTypes: ["image/*"],
    focalPoint: true,
    imageSizes: [
      { name: IMAGE_SIZE.CARD, width: 900, height: 600, position: "centre" },
      { name: IMAGE_SIZE.WIDE, width: 1920, withoutEnlargement: true },
    ],
    adminThumbnail: IMAGE_SIZE.CARD,
  },
  fields: [
    {
      name: "alt",
      type: "text",
      label: "Opis zdjęcia",
      required: true,
      admin: { description: "Krótko, co widać na zdjęciu (dla czytników ekranu i Google)." },
    },
  ],
};
