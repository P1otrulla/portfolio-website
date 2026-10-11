"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CATEGORY_QUERY_PARAM,
  PROJECT_CATEGORIES,
  PROJECT_CATEGORY_LABEL,
  PROJECT_CATEGORY_SLUG,
  type ProjectCategory,
} from "@/lib/constants";
import type { ProjectCardData } from "@/lib/projects/project-card";
import { cn, pluralizePl } from "@/lib/utils";
import { ProjectCard } from "./project-card";

const ALL = "all" as const;
type Filter = ProjectCategory | typeof ALL;

const FILTERS: readonly Filter[] = Object.freeze([ALL, ...PROJECT_CATEGORIES]);

const FILTER_LABEL: Readonly<Record<Filter, string>> = {
  [ALL]: "Wszystkie",
  ...PROJECT_CATEGORY_LABEL,
};

function syncUrl(filter: Filter): void {
  const url = new URL(window.location.href);
  if (filter === ALL) {
    url.searchParams.delete(CATEGORY_QUERY_PARAM);
  } else {
    url.searchParams.set(CATEGORY_QUERY_PARAM, PROJECT_CATEGORY_SLUG[filter]);
  }
  window.history.replaceState(window.history.state, "", url);
}

interface ProjectsExplorerProps {
  readonly projects: readonly ProjectCardData[];
  readonly initialCategory: ProjectCategory | null;
}

export function ProjectsExplorer({ projects, initialCategory }: ProjectsExplorerProps) {
  const [filter, setFilter] = useState<Filter>(initialCategory ?? ALL);

  useEffect(() => setFilter(initialCategory ?? ALL), [initialCategory]);

  const counts = useMemo(() => {
    const result: Record<Filter, number> = { [ALL]: projects.length } as Record<Filter, number>;
    for (const category of PROJECT_CATEGORIES) {
      result[category] = projects.filter((project) => project.category === category).length;
    }
    return result;
  }, [projects]);

  const visible = useMemo(
    () => (filter === ALL ? projects : projects.filter((project) => project.category === filter)),
    [filter, projects],
  );

  const selectFilter = (next: Filter) => {
    setFilter(next);
    syncUrl(next);
  };

  return (
    <div>
      <div role="group" aria-label="Filtruj realizacje" className="mb-8 flex gap-x-1 overflow-x-auto whitespace-nowrap border-b border-rule [scrollbar-width:none]">
        {FILTERS.map((option) => {
          const isActive = option === filter;
          return (
            <button
              key={option}
              type="button"
              aria-pressed={isActive}
              onClick={() => selectFilter(option)}
              className={cn(
                "relative -mb-px px-3 pb-3 pt-1 text-[0.98rem] transition-colors sm:px-4",
                isActive ? "font-semibold text-ink" : "text-ink-soft hover:text-ink",
              )}
            >
              {FILTER_LABEL[option]}
              <span className="ml-1.5 text-sm tabular-nums text-ink-soft">{counts[option]}</span>
              {isActive && <span className="pe-stripe absolute inset-x-0 bottom-0 h-1 rounded-sm" aria-hidden="true" />}
            </button>
          );
        })}
      </div>

      <p className="sr-only" aria-live="polite">
        {`Pokazano ${visible.length} ${pluralizePl(visible.length, "realizację", "realizacje", "realizacji")}`}
      </p>

      {visible.length === 0 ? (
        <p className="rounded-lg border border-dashed border-rule p-10 text-center text-ink-soft">
          Tu wkrótce pojawią się realizacje z tej kategorii.
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((project, index) => (
            <ProjectCard key={project.id} project={project} wide={project.featured && index === 0} />
          ))}
        </div>
      )}
    </div>
  );
}
