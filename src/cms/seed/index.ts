import type { Payload } from "payload";
import { COLLECTION, GLOBAL } from "@/lib/constants";
import { SEED_PROJECTS, SEED_SETTINGS, type SeedProject } from "./data";
import { paragraphsToLexical } from "./lexical";

const IMAGE_FETCH_TIMEOUT_MS = 10_000;
const FALLBACK_IMAGE_EXTENSION = "png";

async function isDatabaseEmpty(payload: Payload): Promise<boolean> {
  const { totalDocs } = await payload.count({ collection: COLLECTION.PROJECTS, overrideAccess: true });
  return totalDocs === 0;
}

/** Pobiera obrazek z sieci do biblioteki mediów. Brak sieci nie blokuje startu – projekt zostaje bez okładki. */
async function importRemoteImage(payload: Payload, url: string, alt: string): Promise<number | undefined> {
  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(IMAGE_FETCH_TIMEOUT_MS) });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    const mimetype = response.headers.get("content-type")?.split(";")[0] ?? `image/${FALLBACK_IMAGE_EXTENSION}`;
    const extension = mimetype.split("/")[1] ?? FALLBACK_IMAGE_EXTENSION;
    const data = Buffer.from(await response.arrayBuffer());
    const media = await payload.create({
      collection: COLLECTION.MEDIA,
      data: { alt },
      file: { data, mimetype, name: `${alt.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.${extension}`, size: data.length },
      overrideAccess: true,
    });
    return media.id;
  } catch (error) {
    payload.logger.warn(`[seed] Nie udało się pobrać obrazka ${url}: ${(error as Error).message}`);
    return undefined;
  }
}

async function createProject(payload: Payload, project: SeedProject): Promise<void> {
  const coverId = project.coverUrl ? await importRemoteImage(payload, project.coverUrl, project.title) : undefined;
  await payload.create({
    collection: COLLECTION.PROJECTS,
    overrideAccess: true,
    data: {
      title: project.title,
      category: project.category,
      summary: project.summary,
      body: paragraphsToLexical(project.body),
      cover: coverId,
      tags: [...project.tags],
      featured: project.featured ?? false,
      location: project.location,
      facts: project.facts?.map((fact) => ({ ...fact })),
      links: project.links ? { ...project.links } : undefined,
      _status: "published",
    },
  });
}

export async function seedIfEmpty(payload: Payload): Promise<void> {
  if (!(await isDatabaseEmpty(payload))) {
    return;
  }
  payload.logger.info("[seed] Pusta baza – wgrywam dane startowe…");

  await payload.updateGlobal({
    slug: GLOBAL.SITE_SETTINGS,
    overrideAccess: true,
    data: structuredClone(SEED_SETTINGS),
  });

  for (const project of SEED_PROJECTS) {
    await createProject(payload, project);
  }
  payload.logger.info(`[seed] Gotowe: ${SEED_PROJECTS.length} realizacji.`);
}
