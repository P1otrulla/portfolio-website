"use client";

import { CheckCircle2, Code2, Zap } from "lucide-react";
import { useActionState, useEffect, useState, type ReactNode } from "react";
import { submitInquiry } from "@/app/(frontend)/actions/contact";
import { PROJECT_CATEGORY, PROJECT_CATEGORY_LABEL, type ProjectCategory } from "@/lib/constants";
import { CONTACT_FIELD, INITIAL_CONTACT_STATE, type ContactFieldErrors } from "@/lib/contact/contact-schema";
import { cn } from "@/lib/utils";
import { buttonClass } from "@/components/ui/button";

const MESSAGE_PLACEHOLDER: Readonly<Record<ProjectCategory, string>> = {
  [PROJECT_CATEGORY.ELECTRICAL]: "Np. dom 120 m² w stanie surowym, potrzebna cała instalacja i rozdzielnica. Start w marcu.",
  [PROJECT_CATEGORY.SOFTWARE]: "Np. potrzebuję pluginu do rynku między serwerami, Paper 1.21, baza MySQL.",
};

const CATEGORY_ICON = {
  [PROJECT_CATEGORY.ELECTRICAL]: Zap,
  [PROJECT_CATEGORY.SOFTWARE]: Code2,
} as const;

const INPUT_CLASS =
  "w-full rounded-md border border-rule bg-paper px-3.5 py-2.5 text-[1rem] text-ink placeholder:text-ink-soft/70 focus:border-wire-n focus:outline-none focus:ring-2 focus:ring-wire-n/25 aria-[invalid=true]:border-danger";

interface FieldProps {
  readonly name: keyof ContactFieldErrors;
  readonly label: string;
  readonly errors?: ContactFieldErrors;
  readonly hint?: string;
  readonly children: (props: { id: string; "aria-invalid": boolean; "aria-describedby"?: string }) => ReactNode;
}

function Field({ name, label, errors, hint, children }: FieldProps) {
  const id = `contact-${name}`;
  const error = errors?.[name];
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined;
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-[0.95rem] font-medium">
        {label}
      </label>
      {children({ id, "aria-invalid": Boolean(error), "aria-describedby": describedBy })}
      {error ? (
        <p id={`${id}-error`} className="mt-1.5 text-sm text-danger">
          {error}
        </p>
      ) : (
        hint && (
          <p id={`${id}-hint`} className="mt-1.5 text-sm text-ink-soft">
            {hint}
          </p>
        )
      )}
    </div>
  );
}

export function ContactForm({ initialCategory }: { readonly initialCategory: ProjectCategory | null }) {
  const [state, formAction, isPending] = useActionState(submitInquiry, INITIAL_CONTACT_STATE);
  const [category, setCategory] = useState<ProjectCategory>(initialCategory ?? PROJECT_CATEGORY.ELECTRICAL);
  const [startedAt, setStartedAt] = useState("");

  useEffect(() => setStartedAt(String(Date.now())), []);
  useEffect(() => {
    if (initialCategory) {
      setCategory(initialCategory);
    }
  }, [initialCategory]);

  if (state.status === "success") {
    return (
      <div role="status" className="flex flex-col items-start gap-4 rounded-lg border border-rule bg-surface p-8">
        <CheckCircle2 size={32} className="text-ok" aria-hidden="true" />
        <p className="heading text-xl">{state.message}</p>
        <p className="text-ink-soft">Jeśli sprawa jest pilna, zadzwoń albo napisz bezpośrednio.</p>
      </div>
    );
  }

  const errors = state.fieldErrors;
  const values = state.values ?? {};

  return (
    <form action={formAction} noValidate className="space-y-5 rounded-lg border border-rule bg-surface p-6 sm:p-8">
      <fieldset>
        <legend className="mb-2 text-[0.95rem] font-medium">Czego dotyczy zapytanie?</legend>
        <div className="grid grid-cols-2 gap-2">
          {[PROJECT_CATEGORY.ELECTRICAL, PROJECT_CATEGORY.SOFTWARE].map((option) => {
            const Icon = CATEGORY_ICON[option];
            const isSelected = category === option;
            return (
              <label
                key={option}
                className={cn(
                  "flex cursor-pointer items-center gap-2.5 rounded-md border px-3 py-3 text-[0.95rem] transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-wire-n",
                  isSelected ? "border-ink bg-paper font-semibold" : "border-rule text-ink-soft hover:border-ink/40",
                )}
              >
                <input
                  type="radio"
                  name={CONTACT_FIELD.CATEGORY}
                  value={option}
                  checked={isSelected}
                  onChange={() => setCategory(option)}
                  className="sr-only"
                />
                <Icon size={18} aria-hidden="true" className={option === PROJECT_CATEGORY.ELECTRICAL ? "text-wire-l" : "text-wire-n"} />
                {PROJECT_CATEGORY_LABEL[option]}
              </label>
            );
          })}
        </div>
      </fieldset>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field name="name" label="Imię" errors={errors}>
          {(props) => <input {...props} name={CONTACT_FIELD.NAME} defaultValue={values.name} autoComplete="given-name" className={INPUT_CLASS} />}
        </Field>
        <Field name="contact" label="Telefon lub e-mail" errors={errors}>
          {(props) => <input {...props} name={CONTACT_FIELD.CONTACT} defaultValue={values.contact} autoComplete="email" className={INPUT_CLASS} />}
        </Field>
      </div>

      {category === PROJECT_CATEGORY.ELECTRICAL && (
        <Field name="location" label="Miejscowość" errors={errors} hint="Wystarczy miejscowość – pomaga oszacować dojazd.">
          {(props) => <input {...props} name={CONTACT_FIELD.LOCATION} defaultValue={values.location} autoComplete="address-level2" className={INPUT_CLASS} />}
        </Field>
      )}

      <Field name="message" label="Co trzeba zrobić?" errors={errors}>
        {(props) => (
          <textarea {...props} name={CONTACT_FIELD.MESSAGE} defaultValue={values.message} rows={5} placeholder={MESSAGE_PLACEHOLDER[category]} className={INPUT_CLASS} />
        )}
      </Field>

      {/* Pułapka na boty – niewidoczna dla ludzi */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Strona www
          <input type="text" name={CONTACT_FIELD.HONEYPOT} tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <input type="hidden" name={CONTACT_FIELD.STARTED_AT} value={startedAt} />

      {state.status === "error" && state.message && (
        <p role="alert" className="rounded-md border border-danger/40 px-3 py-2 text-[0.95rem] text-danger">
          {state.message}
        </p>
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-ink-soft">Dane wykorzystam tylko do odpowiedzi na zapytanie.</p>
        <button type="submit" disabled={isPending} className={buttonClass("solid")}>
          {isPending ? "Wysyłanie…" : "Wyślij zapytanie"}
        </button>
      </div>
    </form>
  );
}
