import Link from "next/link";
import type { SiteSetting } from "@/payload-types";
import { CATEGORY_QUERY_PARAM, PROJECT_CATEGORY, PROJECT_CATEGORY_SLUG, SECTION_ID } from "@/lib/constants";
import { buttonClass } from "@/components/ui/button";
import { Schematic } from "./schematic/schematic";

const projectsHref = (slug: string) => `/?${CATEGORY_QUERY_PARAM}=${slug}#${SECTION_ID.PROJECTS}`;

export function Hero({ settings }: { readonly settings: SiteSetting }) {
  return (
    <section className="mx-auto grid max-w-[1200px] items-center gap-10 px-4 pb-8 pt-10 sm:px-6 md:pt-14 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12 lg:pb-12">
      <div>
        <h1 className="display max-w-[16ch] text-[clamp(2.3rem,5.2vw,4.1rem)] text-balance">{settings.heroTitle}</h1>
        <p className="mt-6 max-w-[58ch] text-[1.12rem] leading-relaxed text-ink-soft">{settings.heroLead}</p>

        <div className="mt-9 flex flex-col gap-3 sm:flex-row">
          <Link href={projectsHref(PROJECT_CATEGORY_SLUG[PROJECT_CATEGORY.ELECTRICAL])} className={buttonClass("solid")}>
            <span className="wire wire-electrical" aria-hidden="true" />
            Instalacje elektryczne
          </Link>
          <Link href={projectsHref(PROJECT_CATEGORY_SLUG[PROJECT_CATEGORY.SOFTWARE])} className={buttonClass("outline")}>
            <span className="wire wire-software" aria-hidden="true" />
            Projekty programistyczne
          </Link>
        </div>

        {settings.availability && (
          <p className="mt-6 flex items-center gap-2 text-[0.95rem] text-ink-soft">
            <span className="relative flex h-2.5 w-2.5" aria-hidden="true">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ok opacity-50" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-ok" />
            </span>
            {settings.availability}
          </p>
        )}
      </div>

      <div className="relative mx-auto w-full max-w-[540px] rounded-xl border border-rule bg-surface p-3 sm:p-5">
        <Schematic className="w-full" />
      </div>
    </section>
  );
}
