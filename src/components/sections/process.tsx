import type { SiteSetting } from "@/payload-types";
import { SECTION_ID } from "@/lib/constants";
import { Section } from "./section";

/** Kroki to faktyczna sekwencja, więc numeracja niesie informację. */
export function Process({ settings }: { readonly settings: SiteSetting }) {
  const steps = settings.processSteps ?? [];
  if (steps.length === 0) {
    return null;
  }
  return (
    <Section
      id={SECTION_ID.PROCESS}
      title="Jak wygląda współpraca"
      lead="Tak samo przy rozdzielnicy, jak przy pluginie: najpierw ustalamy zakres, potem robię, na końcu razem sprawdzamy."
    >
      <ol className="grid gap-px overflow-hidden rounded-lg border border-rule bg-rule sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((step, index) => (
          <li key={step.id ?? step.title} className="flex flex-col bg-surface p-6">
            <span className="heading text-[2.4rem] leading-none text-wire-n tabular-nums" aria-hidden="true">
              {index + 1}
            </span>
            <h3 className="heading mt-5 text-lg">
              <span className="sr-only">Krok {index + 1}: </span>
              {step.title}
            </h3>
            {step.description && <p className="mt-2 text-[0.97rem] text-ink-soft">{step.description}</p>}
          </li>
        ))}
      </ol>
    </Section>
  );
}
