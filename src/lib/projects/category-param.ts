import { PROJECT_CATEGORIES, PROJECT_CATEGORY_SLUG, type ProjectCategory } from "@/lib/constants";

/** Zamienia ?kategoria=elektryka na wartość z CMS. Nieznane wartości są ignorowane. */
export function parseCategoryParam(value: string | string[] | undefined): ProjectCategory | null {
  const raw = Array.isArray(value) ? value[0] : value;
  if (!raw) {
    return null;
  }
  return PROJECT_CATEGORIES.find((category) => PROJECT_CATEGORY_SLUG[category] === raw) ?? null;
}
