import type { Field, GlobalConfig } from "payload";
import { anyone, isAuthenticated } from "@/cms/access";
import { revalidateSite } from "@/cms/hooks/revalidate";
import { GLOBAL } from "@/lib/constants";

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
