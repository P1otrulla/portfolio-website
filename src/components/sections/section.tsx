import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionProps {
  readonly id: string;
  readonly title: string;
  readonly lead?: ReactNode;
  readonly className?: string;
  readonly children: ReactNode;
}

/** Wspólny układ sekcji: tytuł po lewej, opis po prawej – na mobile jeden pod drugim. */
export function Section({ id, title, lead, className, children }: SectionProps) {
  const headingId = `${id}-title`;
  return (
    <section id={id} aria-labelledby={headingId} className={cn("mx-auto max-w-[1200px] px-4 py-14 sm:px-6 md:py-20", className)}>
      <header className="mb-10 grid gap-4 border-t border-ink pt-6 md:mb-14 md:grid-cols-[1fr_1fr] md:gap-10">
        <h2 id={headingId} className="heading text-[clamp(1.8rem,3.4vw,2.6rem)]">
          {title}
        </h2>
        {lead && <div className="max-w-[56ch] text-[1.05rem] text-ink-soft md:pt-2">{lead}</div>}
      </header>
      {children}
    </section>
  );
}
