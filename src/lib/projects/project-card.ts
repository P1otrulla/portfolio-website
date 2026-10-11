import type { Project } from "@/payload-types";
import type { ProjectCategory } from "@/lib/constants";
import { resolveImage, type ResolvedImage } from "@/lib/media";
import { formatMonthYear } from "@/lib/utils";

/** Lekki, serializowalny widok realizacji dla komponentów klienckich. */
export interface ProjectCardData {
  readonly id: number;
  readonly slug: string;
  readonly title: string;
  readonly category: ProjectCategory;
  readonly summary: string;
  readonly image: ResolvedImage | null;
  readonly tags: readonly string[];
  readonly location: string | null;
  readonly dateLabel: string | null;
  readonly featured: boolean;
}

export function toProjectCard(project: Project): ProjectCardData | null {
  if (!project.slug) {
    return null;
  }
  return {
    id: project.id,
    slug: project.slug,
    title: project.title,
    category: project.category,
    summary: project.summary,
    image: resolveImage(project.cover, "card"),
    tags: [...(project.tags ?? [])],
    location: project.location ?? null,
    dateLabel: formatMonthYear(project.completedAt),
    featured: Boolean(project.featured),
  };
}

export function toProjectCards(projects: readonly Project[]): ProjectCardData[] {
  return projects.map(toProjectCard).filter((card): card is ProjectCardData => card !== null);
}
