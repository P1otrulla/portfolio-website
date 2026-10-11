import { Code2, MapPin, Zap } from "lucide-react";
import Link from "next/link";
import { PROJECT_CATEGORY, PROJECT_CATEGORY_LABEL, ROUTES, type ProjectCategory } from "@/lib/constants";
import { objectPosition } from "@/lib/media";
import type { ProjectCardData } from "@/lib/projects/project-card";
import { cn } from "@/lib/utils";

const MAX_VISIBLE_TAGS = 4;

const WIRE_CLASS: Readonly<Record<ProjectCategory, string>> = {
  [PROJECT_CATEGORY.ELECTRICAL]: "wire-electrical",
  [PROJECT_CATEGORY.SOFTWARE]: "wire-software",
};

export function CategoryMark({ category, className }: { readonly category: ProjectCategory; readonly className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2 text-sm text-ink-soft", className)}>
      <span className={cn("wire", WIRE_CLASS[category])} aria-hidden="true" />
      {PROJECT_CATEGORY_LABEL[category]}
    </span>
  );
}

/** Gdy realizacja nie ma zdjęcia – spokojna plansza w kolorze kategorii zamiast pustej dziury. */
function CoverPlaceholder({ category }: { readonly category: ProjectCategory }) {
  const isElectrical = category === PROJECT_CATEGORY.ELECTRICAL;
  const Icon = isElectrical ? Zap : Code2;
  return (
    <div
      className="flex h-full w-full items-center justify-center bg-paper"
      style={{
        backgroundImage: `repeating-linear-gradient(90deg, transparent 0 27px, color-mix(in srgb, var(--rule) 60%, transparent) 27px 28px), repeating-linear-gradient(0deg, transparent 0 27px, color-mix(in srgb, var(--rule) 60%, transparent) 27px 28px)`,
      }}
      aria-hidden="true"
    >
      <span className={cn("rounded-full border-2 bg-surface p-4", isElectrical ? "border-wire-l text-wire-l" : "border-wire-n text-wire-n")}>
        <Icon size={28} />
      </span>
    </div>
  );
}

export function ProjectCard({ project, wide = false }: { readonly project: ProjectCardData; readonly wide?: boolean }) {
  const visibleTags = project.tags.slice(0, MAX_VISIBLE_TAGS);
  return (
    <article className={cn("group relative flex h-full flex-col overflow-hidden rounded-lg border border-rule bg-surface", wide && "lg:col-span-2")}>
      <div className="h-52 overflow-hidden border-b border-rule sm:h-56">
        {project.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={project.image.url}
            alt={project.image.alt}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            style={{ objectPosition: objectPosition(project.image) }}
          />
        ) : (
          <CoverPlaceholder category={project.category} />
        )}
      </div>
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
          <CategoryMark category={project.category} />
          {(project.location || project.dateLabel) && (
            <span className="inline-flex items-center gap-1.5 text-sm text-ink-soft">
              {project.location && <MapPin size={14} aria-hidden="true" />}
              {[project.location, project.dateLabel].filter(Boolean).join(", ")}
            </span>
          )}
        </div>
        <h3 className="heading mt-3 text-[1.3rem]">
          <Link href={ROUTES.PROJECT(project.slug)} className="after:absolute after:inset-0 focus-visible:outline-none">
            {project.title}
          </Link>
        </h3>
        <p className="mt-2 text-[0.97rem] text-ink-soft">{project.summary}</p>
        {visibleTags.length > 0 && (
          <ul className="mt-auto flex flex-wrap gap-1.5 pt-5" aria-label="Technologie i materiały">
            {visibleTags.map((tag) => (
              <li key={tag} className="rounded border border-rule px-2 py-0.5 text-[0.8rem] text-ink-soft">
                {tag}
              </li>
            ))}
          </ul>
        )}
      </div>
      <span className="pointer-events-none absolute inset-0 rounded-lg ring-2 ring-transparent transition group-has-[:focus-visible]:ring-wire-n" />
    </article>
  );
}
