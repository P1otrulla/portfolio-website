"use server";

import { getPayloadClient } from "@/lib/cms/client";
import { COLLECTION, INQUIRY_STATUS } from "@/lib/constants";
import {
  CONTACT_FIELD,
  contactSchema,
  type ContactFieldErrors,
  type ContactFormState,
} from "@/lib/contact/contact-schema";

/** Boty wypełniają formularz w ułamku sekundy – człowiek potrzebuje więcej. */
const MIN_FILL_TIME_MS = 2_500;

const SUCCESS_STATE: ContactFormState = Object.freeze({
  status: "success",
  message: "Zapytanie wysłane. Odezwę się na podany kontakt.",
});

function readText(formData: FormData, field: string): string {
  const value = formData.get(field);
  return typeof value === "string" ? value : "";
}

function looksLikeBot(formData: FormData): boolean {
  const honeypotFilled = readText(formData, CONTACT_FIELD.HONEYPOT).length > 0;
  const startedAt = Number(readText(formData, CONTACT_FIELD.STARTED_AT));
  const filledTooFast = !Number.isFinite(startedAt) || Date.now() - startedAt < MIN_FILL_TIME_MS;
  return honeypotFilled || filledTooFast;
}

export async function submitInquiry(_previous: ContactFormState, formData: FormData): Promise<ContactFormState> {
  if (looksLikeBot(formData)) {
    // Udajemy sukces, żeby bot nie dostał informacji zwrotnej.
    return SUCCESS_STATE;
  }

  const values = {
    category: readText(formData, CONTACT_FIELD.CATEGORY),
    name: readText(formData, CONTACT_FIELD.NAME),
    contact: readText(formData, CONTACT_FIELD.CONTACT),
    location: readText(formData, CONTACT_FIELD.LOCATION),
    message: readText(formData, CONTACT_FIELD.MESSAGE),
  };
  const parsed = contactSchema.safeParse({ ...values, location: values.location || undefined });

  if (!parsed.success) {
    const fieldErrors: ContactFieldErrors = {};
    for (const issue of parsed.error.issues) {
      const field = issue.path[0] as keyof ContactFieldErrors;
      fieldErrors[field] ??= issue.message;
    }
    return { status: "error", message: "Popraw zaznaczone pola.", fieldErrors, values };
  }

  try {
    const payload = await getPayloadClient();
    await payload.create({
      collection: COLLECTION.INQUIRIES,
      overrideAccess: true,
      data: { ...parsed.data, status: INQUIRY_STATUS.NEW },
    });
    return SUCCESS_STATE;
  } catch (error) {
    console.error("[contact] Nie udało się zapisać zapytania:", error);
    return {
      status: "error",
      message: "Nie udało się wysłać formularza. Napisz bezpośrednio na e-mail podany obok.",
      values,
    };
  }
}
