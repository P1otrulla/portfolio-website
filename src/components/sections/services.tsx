import { Code2, Zap } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import type { SiteSetting } from "@/payload-types";
import {
  CATEGORY_QUERY_PARAM,
  PROJECT_CATEGORY,
  PROJECT_CATEGORY_LABEL,
  PROJECT_CATEGORY_SLUG,
  SECTION_ID,
  type ProjectCategory,
} from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Section } from "./section";

type ServiceList = NonNullable<SiteSetting["electricalServices"]>;

interface ServiceColumnProps {
  readonly category: ProjectCategory;
  readonly icon: LucideIcon;
  readonly services: ServiceList;
  readonly footnote?: string | null;
}

const WIRE_BORDER: Readonly<Record<ProjectCategory, string>> = {
  [PROJECT_CATEGORY.ELECTRICAL]: "border-t-wire-l",
  [PROJECT_CATEGORY.SOFTWARE]: "border-t-wire-n",
};

function ServiceColumn({ category, icon: Icon, services, footnote }: ServiceColumnProps) {
  return (
    <div className={cn("flex flex-col rounded-lg border border-rule border-t-4 bg-surface p-6 sm:p-8", WIRE_BORDER[category])}>
      <div className="flex items-center gap-3">
        <Icon size={22} aria-hidden="true" />
        <h3 className="heading text-xl">{PROJECT_CATEGORY_LABEL[category]}</h3>
      </div>
      <ul className="mt-6 divide-y divide-rule">
        {services.map((service) => (
          <li key={service.id ?? service.title} className="py-4 first:pt-0">
            <p className="font-semibold">{service.title}</p>
            {service.description && <p className="mt-1 text-[0.97rem] text-ink-soft">{service.description}</p>}
          </li>
        ))}
      </ul>
      <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-6 text-[0.95rem]">
        {footnote ? <span className="text-ink-soft">{footnote}</span> : <span />}
        <Link
          className="link font-medium"
          href={`/?${CATEGORY_QUERY_PARAM}=${PROJECT_CATEGORY_SLUG[category]}#${SECTION_ID.PROJECTS}`}
        >
          Zobacz realizacje
        </Link>
      </div>
    </div>
  );
}

export function Services({ settings }: { readonly settings: SiteSetting }) {
  return (
    <Section id={SECTION_ID.SERVICES} title="Czym się zajmuję" lead={settings.about}>
      <div className="grid gap-6 md:grid-cols-2">
        <ServiceColumn
          category={PROJECT_CATEGORY.ELECTRICAL}
          icon={Zap}
          services={settings.electricalServices ?? []}
          footnote={settings.serviceArea ? `Obszar: ${settings.serviceArea}` : null}
        />
        <ServiceColumn
          category={PROJECT_CATEGORY.SOFTWARE}
          icon={Code2}
          services={settings.softwareServices ?? []}
        />
      </div>
    </Section>
  );
}
