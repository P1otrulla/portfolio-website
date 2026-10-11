import type { CollectionConfig } from "payload";
import { isAuthenticated } from "@/cms/access";
import {
  COLLECTION,
  INQUIRY_STATUS,
  PROJECT_CATEGORIES,
  PROJECT_CATEGORY_LABEL,
} from "@/lib/constants";

/**
 * Zapytania z formularza kontaktowego. Tworzone wyłącznie przez server action
 * (local API z overrideAccess) – publiczne REST API nie może ich zakładać ani czytać.
 */
export const Inquiries: CollectionConfig = {
  slug: COLLECTION.INQUIRIES,
  labels: { singular: "Zapytanie", plural: "Zapytania" },
  admin: {
    useAsTitle: "name",
    group: "Kontakt",
    defaultColumns: ["name", "category", "contact", "status", "createdAt"],
    description: "Wiadomości wysłane przez formularz na stronie.",
  },
  defaultSort: "-createdAt",
  access: {
    read: isAuthenticated,
    create: () => false,
    update: isAuthenticated,
    delete: isAuthenticated,
  },
  fields: [
    {
      type: "row",
      fields: [
        { name: "name", type: "text", label: "Imię", required: true, admin: { readOnly: true } },
        { name: "contact", type: "text", label: "Telefon / e-mail", required: true, admin: { readOnly: true } },
      ],
    },
    {
      type: "row",
      fields: [
        {
          name: "category",
          type: "select",
          label: "Temat",
          required: true,
          options: PROJECT_CATEGORIES.map((category) => ({
            value: category,
            label: PROJECT_CATEGORY_LABEL[category],
          })),
          admin: { readOnly: true },
        },
        { name: "location", type: "text", label: "Miejscowość", admin: { readOnly: true } },
      ],
    },
    { name: "message", type: "textarea", label: "Wiadomość", required: true, admin: { readOnly: true } },
    {
      name: "status",
      type: "select",
      label: "Status",
      defaultValue: INQUIRY_STATUS.NEW,
      options: [
        { value: INQUIRY_STATUS.NEW, label: "Nowe" },
        { value: INQUIRY_STATUS.IN_PROGRESS, label: "W trakcie" },
        { value: INQUIRY_STATUS.DONE, label: "Zamknięte" },
      ],
      admin: { position: "sidebar" },
    },
    { name: "notes", type: "textarea", label: "Notatki", admin: { position: "sidebar" } },
  ],
};
