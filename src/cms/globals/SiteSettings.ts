import type { Field, GlobalConfig } from "payload";
import { anyone, isAuthenticated } from "@/cms/access";
import { revalidateSite } from "@/cms/hooks/revalidate";
import { GLOBAL } from "@/lib/constants";
import {
  CIRCUIT_LABEL_MAX_LENGTH,
  LOAD_KINDS,
  LOAD_KIND_LABEL,
  MAX_CIRCUITS,
} from "@/components/sections/schematic/circuit-model";

const serviceListField = (name: string, label: string): Field => ({
  name,
  type: "array",
  label,
  labels: { singular: "Usługa", plural: "Usługi" },
  fields: [
    { name: "title", type: "text", label: "Nazwa", required: true },
    { name: "description", type: "textarea", label: "Opis" },
  ],
});

export const SiteSettings: GlobalConfig = {
  slug: GLOBAL.SITE_SETTINGS,
  label: "Ustawienia strony",
  admin: { group: "Treści" },
  access: { read: anyone, update: isAuthenticated },
  hooks: { afterChange: [revalidateSite] },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "Start",
          fields: [
            { name: "heroTitle", type: "text", label: "Nagłówek", required: true },
            { name: "heroLead", type: "textarea", label: "Tekst pod nagłówkiem", required: true },
            {
              name: "availability",
              type: "text",
              label: "Dostępność",
              admin: {
                description: "Krótka informacja przy przycisku kontaktu, np. „Wolne terminy od listopada”. Puste = ukryte.",
              },
            },
            { name: "about", type: "textarea", label: "O mnie" },
          ],
        },
        {
          label: "Schemat",
          description:
            "Obwody na interaktywnym schemacie rozdzielnicy w nagłówku strony. Puste = domyślne: gniazda, oświetlenie, indukcja, serwer.",
          fields: [
            {
              name: "schematicCircuits",
              type: "array",
              label: "Obwody",
              labels: { singular: "Obwód", plural: "Obwody" },
              maxRows: MAX_CIRCUITS,
              admin: { description: `Maksymalnie ${MAX_CIRCUITS}. Kolejność jak na schemacie, od lewej.` },
              fields: [
                {
                  type: "row",
                  fields: [
                    {
                      name: "kind",
                      type: "select",
                      label: "Odbiornik",
                      required: true,
                      options: LOAD_KINDS.map((kind) => ({ value: kind, label: LOAD_KIND_LABEL[kind] })),
                    },
                    {
                      name: "label",
                      type: "text",
                      label: "Podpis",
                      required: true,
                      maxLength: CIRCUIT_LABEL_MAX_LENGTH,
                    },
                    {
                      name: "breaker",
                      type: "text",
                      label: "Zabezpieczenie",
                      required: true,
                      admin: { placeholder: "np. B16 albo C20 3P" },
                    },
                  ],
                },
                {
                  name: "description",
                  type: "textarea",
                  label: "Opis po najechaniu",
                  admin: { description: "Puste = domyślny opis dla tego rodzaju odbiornika." },
                },
              ],
            },
          ],
        },
        {
          label: "Usługi",
          fields: [
            serviceListField("electricalServices", "Instalacje elektryczne"),
            serviceListField("softwareServices", "Programowanie"),
          ],
        },
        {
          label: "Jak pracuję",
          fields: [
            {
              name: "processSteps",
              type: "array",
              label: "Kroki współpracy",
              labels: { singular: "Krok", plural: "Kroki" },
              admin: { description: "Wyświetlane w tej kolejności, numerowane automatycznie." },
              fields: [
                { name: "title", type: "text", label: "Nazwa", required: true },
                { name: "description", type: "textarea", label: "Opis" },
              ],
            },
          ],
        },
        {
          label: "Paszport instalacji",
          description: "Sekcja o naklejce z kodem QR w rozdzielnicy.",
          fields: [
            { name: "passportEnabled", type: "checkbox", label: "Pokazuj sekcję", defaultValue: true },
            { name: "passportTitle", type: "text", label: "Nagłówek" },
            { name: "passportText", type: "textarea", label: "Opis" },
            { name: "passportUrl", type: "text", label: "Link (np. przykładowy paszport)" },
          ],
        },
        {
          label: "Kontakt",
          fields: [
            {
              type: "row",
              fields: [
                { name: "email", type: "email", label: "E-mail", required: true },
                { name: "phone", type: "text", label: "Telefon" },
              ],
            },
            {
              name: "serviceArea",
              type: "text",
              label: "Obszar działania (elektryka)",
              admin: { description: "Np. „Warszawa i okolice”. Puste = ukryte." },
            },
            {
              type: "row",
              fields: [
                { name: "githubUrl", type: "text", label: "GitHub" },
                { name: "linkedinUrl", type: "text", label: "LinkedIn" },
                { name: "discordUrl", type: "text", label: "Discord" },
              ],
            },
          ],
        },
        {
          label: "Opinie Google",
          fields: [
            {
              name: "googlePlaceId",
              type: "text",
              label: "Google Place ID",
              admin: {
                description:
                  "ID wizytówki Google (zaczyna się zwykle od „ChIJ”). Klucz API ustawiasz w zmiennej GOOGLE_PLACES_API_KEY.",
              },
            },
          ],
        },
        {
          label: "SEO",
          fields: [
            { name: "seoTitle", type: "text", label: "Tytuł strony", required: true },
            { name: "seoDescription", type: "textarea", label: "Opis w Google", required: true },
          ],
        },
      ],
    },
  ],
};
