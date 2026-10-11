import type { MetadataRoute } from "next";
import { getPublishedProjects } from "@/lib/cms/queries";
import { ROUTES, SITE_URL } from "@/lib/constants";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projects = await getPublishedProjects();
  return [
    { url: SITE_URL, changeFrequency: "weekly", priority: 1 },
    ...projects
      .filter((project) => project.slug)
      .map((project) => ({
        url: `${SITE_URL}${ROUTES.PROJECT(project.slug as string)}`,
        lastModified: project.updatedAt,
        priority: 0.7,
      })),
    { url: `${SITE_URL}${ROUTES.PRIVACY}`, priority: 0.2 },
  ];
}
