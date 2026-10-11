import { revalidatePath } from "next/cache";

const SITE_LAYOUT_ROOT = "/";

/**
 * Strona i tak renderuje się dynamicznie, ale czyścimy cache routera Next,
 * żeby zmiany z panelu były widoczne od razu po zapisie.
 */
export function revalidateSite<T>({ doc }: { doc: T }): T {
  try {
    revalidatePath(SITE_LAYOUT_ROOT, "layout");
  } catch {
    // Poza kontekstem requestu Next (np. seed przy starcie) – nic do odświeżenia.
  }
  return doc;
}
