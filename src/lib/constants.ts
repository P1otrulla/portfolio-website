export const COLLECTION = {
  USERS: "users",
  MEDIA: "media",
  PROJECTS: "projects",
  REVIEWS: "reviews",
  INQUIRIES: "inquiries",
} as const;

export const GLOBAL = {
  SITE_SETTINGS: "site-settings",
} as const;

export const PROJECT_CATEGORY = {
  ELECTRICAL: "electrical",
  SOFTWARE: "software",
} as const;

export type ProjectCategory = (typeof PROJECT_CATEGORY)[keyof typeof PROJECT_CATEGORY];

export const PROJECT_CATEGORY_LABEL: Readonly<Record<ProjectCategory, string>> = {
  [PROJECT_CATEGORY.ELECTRICAL]: "Instalacje elektryczne",
  [PROJECT_CATEGORY.SOFTWARE]: "Programowanie",
};

/** Krótkie, przyjazne nazwy w URL (?kategoria=elektryka). */
export const PROJECT_CATEGORY_SLUG: Readonly<Record<ProjectCategory, string>> = {
  [PROJECT_CATEGORY.ELECTRICAL]: "elektryka",
  [PROJECT_CATEGORY.SOFTWARE]: "programowanie",
};

export const CATEGORY_QUERY_PARAM = "kategoria";

export const PROJECT_CATEGORIES: readonly ProjectCategory[] = Object.freeze([
  PROJECT_CATEGORY.ELECTRICAL,
  PROJECT_CATEGORY.SOFTWARE,
]);

export const INQUIRY_STATUS = {
  NEW: "new",
  IN_PROGRESS: "in-progress",
  DONE: "done",
} as const;

export const REVIEW_SOURCE = {
  GOOGLE: "google",
  FACEBOOK: "facebook",
  DISCORD: "discord",
  DIRECT: "direct",
} as const;

export const ROUTES = {
  HOME: "/",
  PROJECT: (slug: string) => `/realizacje/${encodeURIComponent(slug)}`,
  PRIVACY: "/polityka-prywatnosci",
  ADMIN: "/admin",
} as const;

export const SECTION_ID = {
  SERVICES: "uslugi",
  PROJECTS: "realizacje",
  PROCESS: "jak-pracuje",
  REVIEWS: "opinie",
  CONTACT: "kontakt",
} as const;

export const RATING = { MIN: 1, MAX: 5 } as const;

export const SITE_URL = process.env.SITE_URL ?? "http://localhost:3000";

/** Nazwy zdarzeń Umami (atrybut data-umami-event) – jedno miejsce, żeby raporty miały spójne nazwy. */
export const ANALYTICS_EVENT = {
  HERO_ELECTRICAL: "Hero: instalacje",
  HERO_SOFTWARE: "Hero: programowanie",
  HEADER_QUOTE: "Nagłówek: zapytaj o wycenę",
  CONTACT_SUBMIT: "Formularz: wyślij",
  SCHEMATIC_SHORT_CIRCUIT: "Schemat: zwarcie",
  PROJECT_REPOSITORY: "Projekt: kod źródłowy",
  PROJECT_DEMO: "Projekt: prezentacja",
  PROJECT_QUOTE: "Projekt: zapytaj o wycenę",
} as const;
