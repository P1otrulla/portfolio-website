import type { CollectionConfig, Condition } from "payload";
import { isAuthenticated, publishedOrAuthenticated } from "@/cms/access";
import { slugField } from "@/cms/fields/slug";
import {
  COLLECTION,
  PROJECT_CATEGORIES,
  PROJECT_CATEGORY,
  PROJECT_CATEGORY_LABEL,
  ROUTES,
  type ProjectCategory,
} from "@/lib/constants";
import { revalidateSite } from "@/cms/hooks/revalidate";

const SUMMARY_MAX_LENGTH = 240;

const whenCategory =
  (category: ProjectCategory): Condition =>
  (data) =>
    data?.category === category;

export const Projects: CollectionConfig = {
  slug: COLLECTION.PROJECTS,
  labels: { singular: "Realizacja", plural: "Realizacje" },
  admin: {
    useAsTitle: "title",
    group: "Treści",
    defaultColumns: ["title", "category", "featured", "completedAt", "_status"],
    description: "Projekty z programowania i instalacje elektryczne pokazywane na stronie.",
    listSearchableFields: ["title", "summary", "location"],
    preview: (doc) => (typeof doc?.slug === "string" ? ROUTES.PROJECT(doc.slug) : null),
  },
  defaultSort: "-completedAt",
  versions: { drafts: true, maxPerDoc: 20 },
  access: {
    read: publishedOrAuthenticated,
    create: isAuthenticated,
    update: isAuthenticated,
    delete: isAuthenticated,
  },
  hooks: {
    afterChange: [revalidateSite],
    afterDelete: [revalidateSite],
  },
  fields: [
    {
      type: "row",
      fields: [
        { name: "title", type: "text", label: "Tytuł", required: true, admin: { width: "65%" } },
        {
          name: "category",
          type: "select",
          label: "Kategoria",
          required: true,
          defaultValue: PROJECT_CATEGORY.ELECTRICAL,
          options: PROJECT_CATEGORIES.map((category) => ({
            value: category,
            label: PROJECT_CATEGORY_LABEL[category],
          })),
          admin: { width: "35%" },
        },
      ],
    },
    {
      name: "summary",
      type: "textarea",
      label: "Krótki opis (na kafelku)",
      required: true,
      maxLength: SUMMARY_MAX_LENGTH,
    },
    {
      type: "tabs",
      tabs: [
        {
          label: "Treść",
          fields: [
            { name: "cover", type: "upload", relationTo: COLLECTION.MEDIA, label: "Zdjęcie główne" },
            { name: "body", type: "richText", label: "Opis realizacji" },
            {
              name: "gallery",
              type: "array",
              label: "Galeria",
              labels: { singular: "Zdjęcie", plural: "Zdjęcia" },
              fields: [
                { name: "image", type: "upload", relationTo: COLLECTION.MEDIA, required: true, label: "Zdjęcie" },
                { name: "caption", type: "text", label: "Podpis" },
              ],
            },
            {
              name: "beforeAfter",
              type: "group",
              label: "Przed / po",
              admin: {
                condition: whenCategory(PROJECT_CATEGORY.ELECTRICAL),
                description: "Dwa zdjęcia z tego samego kadru, np. stara i nowa rozdzielnica. Na stronie pojawi się suwak.",
              },
              fields: [
                {
                  type: "row",
                  fields: [
                    { name: "before", type: "upload", relationTo: COLLECTION.MEDIA, label: "Przed" },
                    { name: "after", type: "upload", relationTo: COLLECTION.MEDIA, label: "Po" },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: "Szczegóły",
          fields: [
            {
              name: "facts",
              type: "array",
              label: "Parametry",
              labels: { singular: "Parametr", plural: "Parametry" },
              admin: {
                description: "Konkrety w formie tabelki, np. „Obwody: 24”, „Moc PV: 9,8 kWp”, „Graczy online: 300”.",
              },
              fields: [
                {
                  type: "row",
                  fields: [
                    { name: "label", type: "text", label: "Nazwa", required: true },
                    { name: "value", type: "text", label: "Wartość", required: true },
                  ],
                },
              ],
            },
            {
              name: "tags",
              type: "text",
              hasMany: true,
              label: "Technologie / materiały",
              admin: { description: "Np. Java, PostgreSQL albo Hager, YDY 3×2,5. Enter dodaje kolejny." },
            },
            {
              name: "location",
              type: "text",
              label: "Miejscowość",
              admin: {
                condition: whenCategory(PROJECT_CATEGORY.ELECTRICAL),
                description: "Sama miejscowość, bez adresu klienta.",
              },
            },
            {
              name: "links",
              type: "group",
              label: "Linki",
              admin: { condition: whenCategory(PROJECT_CATEGORY.SOFTWARE) },
              fields: [
                {
                  type: "row",
                  fields: [
                    { name: "repository", type: "text", label: "Repozytorium (GitHub)" },
                    { name: "demo", type: "text", label: "Prezentacja / strona" },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    slugField("title"),
    {
      name: "featured",
      type: "checkbox",
      label: "Wyróżniona",
      defaultValue: false,
      admin: { position: "sidebar", description: "Większy kafelek na początku listy." },
    },
    {
      name: "completedAt",
      type: "date",
      label: "Data realizacji",
      admin: { position: "sidebar", date: { pickerAppearance: "monthOnly", displayFormat: "MM.yyyy" } },
    },
  ],
};
