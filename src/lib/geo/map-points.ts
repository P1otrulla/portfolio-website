import type { Project } from "@/payload-types";
import { PROJECT_CATEGORY, ROUTES } from "@/lib/constants";

export interface MapProjectLink {
  readonly title: string;
  readonly href: string;
}

/** Jedna pinezka = jedna miejscowość; kilka realizacji w tym samym miejscu trafia do jednego dymka. */
export interface MapPoint {
  readonly key: string;
  readonly lat: number;
  readonly lng: number;
  readonly town: string;
  readonly projects: readonly MapProjectLink[];
}

export function buildMapPoints(projects: readonly Project[]): readonly MapPoint[] {
  const byPlace = new Map<string, { lat: number; lng: number; town: string; projects: MapProjectLink[] }>();
  for (const project of projects) {
    const lat = project.geo?.lat;
    const lng = project.geo?.lng;
    if (project.category !== PROJECT_CATEGORY.ELECTRICAL || typeof lat !== "number" || typeof lng !== "number" || !project.slug) {
      continue;
    }
    const key = `${lat},${lng}`;
    const entry = byPlace.get(key) ?? { lat, lng, town: project.location ?? "", projects: [] };
    entry.projects.push({ title: project.title, href: ROUTES.PROJECT(project.slug) });
    byPlace.set(key, entry);
  }
  return [...byPlace.entries()].map(([key, entry]) => ({ key, ...entry, projects: [...entry.projects] }));
}
