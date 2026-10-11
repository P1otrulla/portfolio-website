import type { CollectionConfig } from "payload";
import { isAuthenticated } from "@/cms/access";
import { revalidateSite } from "@/cms/hooks/revalidate";
import {
  COLLECTION,
  PROJECT_CATEGORIES,
  PROJECT_CATEGORY_LABEL,
  RATING,
  REVIEW_SOURCE,
} from "@/lib/constants";

export const Reviews: CollectionConfig = {
  slug: COLLECTION.REVIEWS,
  labels: { singular: "Opinia", plural: "Opinie (ręczne)" },
  admin: {
    useAsTitle: "author",
    group: "Treści",
    defaultColumns: ["author", "rating", "source", "visible", "date"],
    description:
      "Opinie spoza Google – np. z Discorda, Facebooka albo przekazane osobiście. Opinie z Google pobierają się same.",
  },
  defaultSort: "-date",
  access: {
    read: ({ req }) => (req.user ? true : { visible: { equals: true } }),
    create: isAuthenticated,
    update: isAuthenticated,
    delete: isAuthenticated,
  },
  hooks: { afterChange: [revalidateSite], afterDelete: [revalidateSite] },
  fields: [
    {
      type: "row",
      fields: [
        { name: "author", type: "text", label: "Autor", required: true },
        {
          name: "rating",
          type: "number",
          label: "Ocena",
          required: true,
          min: RATING.MIN,
          max: RATING.MAX,
          defaultValue: RATING.MAX,
        },
      ],
    },
    { name: "text", type: "textarea", label: "Treść", required: true },
    {
      type: "row",
      fields: [
        {
          name: "source",
          type: "select",
          label: "Źródło",
          defaultValue: REVIEW_SOURCE.DIRECT,
          options: [
            { value: REVIEW_SOURCE.GOOGLE, label: "Google (przepisana)" },
            { value: REVIEW_SOURCE.FACEBOOK, label: "Facebook" },
            { value: REVIEW_SOURCE.DISCORD, label: "Discord" },
            { value: REVIEW_SOURCE.DIRECT, label: "Bezpośrednio" },
          ],
        },
        {
          name: "category",
          type: "select",
          label: "Dotyczy",
          options: PROJECT_CATEGORIES.map((category) => ({
            value: category,
            label: PROJECT_CATEGORY_LABEL[category],
          })),
        },
        { name: "date", type: "date", label: "Data", defaultValue: () => new Date().toISOString() },
      ],
    },
    {
      name: "visible",
      type: "checkbox",
      label: "Pokazuj na stronie",
      defaultValue: true,
      admin: { position: "sidebar" },
    },
  ],
};
