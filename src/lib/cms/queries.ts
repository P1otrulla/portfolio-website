import "server-only";
import { cache } from "react";
import type { Project, Review, SiteSetting } from "@/payload-types";
import { COLLECTION, GLOBAL } from "@/lib/constants";
import { getPayloadClient } from "./client";

const PROJECT_LIST_LIMIT = 100;
const REVIEW_LIST_LIMIT = 12;
const PROJECT_DEPTH = 1;

const PUBLISHED = { _status: { equals: "published" } } as const;

export const getSiteSettings = cache(async (): Promise<SiteSetting> => {
  const payload = await getPayloadClient();
  return payload.findGlobal({ slug: GLOBAL.SITE_SETTINGS, depth: 0 });
});

export const getPublishedProjects = cache(async (): Promise<readonly Project[]> => {
  const payload = await getPayloadClient();
  const { docs } = await payload.find({
    collection: COLLECTION.PROJECTS,
    where: PUBLISHED,
    sort: ["-featured", "-completedAt", "-createdAt"],
    limit: PROJECT_LIST_LIMIT,
    depth: PROJECT_DEPTH,
  });
  return docs;
});

export const getProjectBySlug = cache(async (slug: string): Promise<Project | null> => {
  const payload = await getPayloadClient();
  const { docs } = await payload.find({
    collection: COLLECTION.PROJECTS,
    where: { and: [PUBLISHED, { slug: { equals: slug } }] },
    limit: 1,
    depth: PROJECT_DEPTH,
  });
  return docs[0] ?? null;
});

export const getVisibleManualReviews = cache(async (): Promise<readonly Review[]> => {
  const payload = await getPayloadClient();
  const { docs } = await payload.find({
    collection: COLLECTION.REVIEWS,
    where: { visible: { equals: true } },
    sort: "-date",
    limit: REVIEW_LIST_LIMIT,
    depth: 0,
  });
  return docs;
});
