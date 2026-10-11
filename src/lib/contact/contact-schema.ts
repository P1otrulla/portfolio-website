import { z } from "zod";
import { PROJECT_CATEGORY } from "@/lib/constants";

export const CONTACT_FIELD = {
  CATEGORY: "category",
  NAME: "name",
  CONTACT: "contact",
  LOCATION: "location",
  MESSAGE: "message",
  HONEYPOT: "website",
  STARTED_AT: "startedAt",
} as const;

const LIMIT = {
  NAME_MAX: 80,
  CONTACT_MAX: 120,
  LOCATION_MAX: 80,
  MESSAGE_MIN: 10,
  MESSAGE_MAX: 3000,
} as const;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^\+?[\d\s-]{9,15}$/;

export const contactSchema = z.object({
  [CONTACT_FIELD.CATEGORY]: z.enum([PROJECT_CATEGORY.ELECTRICAL, PROJECT_CATEGORY.SOFTWARE], {
    errorMap: () => ({ message: "Wybierz, czego dotyczy zapytanie." }),
  }),
  [CONTACT_FIELD.NAME]: z.string().trim().min(2, "Podaj imię.").max(LIMIT.NAME_MAX),
  [CONTACT_FIELD.CONTACT]: z
    .string()
    .trim()
    .max(LIMIT.CONTACT_MAX)
    .refine((value) => EMAIL_PATTERN.test(value) || PHONE_PATTERN.test(value), {
      message: "Podaj poprawny e-mail albo numer telefonu.",
    }),
  [CONTACT_FIELD.LOCATION]: z.string().trim().max(LIMIT.LOCATION_MAX).optional(),
  [CONTACT_FIELD.MESSAGE]: z
    .string()
    .trim()
    .min(LIMIT.MESSAGE_MIN, "Napisz kilka słów więcej – co trzeba zrobić?")
    .max(LIMIT.MESSAGE_MAX, "Wiadomość jest za długa."),
});

export type ContactInput = z.infer<typeof contactSchema>;

export type ContactFieldErrors = Partial<Record<keyof ContactInput, string>>;

export interface ContactFormState {
  readonly status: "idle" | "success" | "error";
  readonly message?: string;
  readonly fieldErrors?: ContactFieldErrors;
  /** Odsyłamy wpisane wartości, bo React czyści formularz po każdej akcji. */
  readonly values?: Partial<Record<keyof ContactInput, string>>;
}

export const INITIAL_CONTACT_STATE: ContactFormState = Object.freeze({ status: "idle" });
