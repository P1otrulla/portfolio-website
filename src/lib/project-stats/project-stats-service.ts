import "server-only";
import { z } from "zod";
import type { Project } from "@/payload-types";
import { TtlCache } from "@/lib/cache/ttl-cache";
import { PROJECT_CATEGORY } from "@/lib/constants";
import { parseGithubRepo, parseModrinthSlug, type GithubRepoRef } from "./source-urls";
import type { GithubStats, ModrinthStats, ProjectStats } from "./types";

const STATS_CACHE_TTL_MS = 60 * 60 * 1000;
const REQUEST_TIMEOUT_MS = 3_000;
const GITHUB_API = "https://api.github.com/repos";
const MODRINTH_API = "https://api.modrinth.com/v2/project";
/** Modrinth wymaga identyfikującego User-Agenta. */
const USER_AGENT = "piotrulla-portfolio/1.0 (+https://piotrulla.dev)";

const githubRepoSchema = z.object({
  stargazers_count: z.number(),
  forks_count: z.number(),
  pushed_at: z.string().nullable().optional(),
  html_url: z.string(),
});

const modrinthProjectSchema = z.object({
  downloads: z.number(),
  followers: z.number(),
  updated: z.string().optional(),
  slug: z.string(),
});

const githubCache = new TtlCache<string, GithubStats | null>(STATS_CACHE_TTL_MS);
const modrinthCache = new TtlCache<string, ModrinthStats | null>(STATS_CACHE_TTL_MS);

async function fetchJson(url: string, headers: Record<string, string>): Promise<unknown> {
  const response = await fetch(url, {
    headers: { "User-Agent": USER_AGENT, Accept: "application/json", ...headers },
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    cache: "no-store",
  });
  if (!response.ok) {
    throw new Error(`HTTP ${response.status} dla ${url}`);
  }
  return response.json();
}

/** Błąd zewnętrznego API nie może wywrócić strony – zapisujemy null i próbujemy po wygaśnięciu cache. */
async function safely<T>(label: string, load: () => Promise<T>): Promise<T | null> {
  try {
    return await load();
  } catch (error) {
    console.warn(`[stats] ${label}: ${(error as Error).message}`);
    return null;
  }
}

function loadGithubStats(ref: GithubRepoRef): Promise<GithubStats | null> {
  const key = `${ref.owner}/${ref.repo}`.toLowerCase();
  const token = process.env.GITHUB_TOKEN;
  const headers: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {};
  return githubCache.getOrLoad(key, () =>
    safely(`GitHub ${key}`, async () => {
      const repo = githubRepoSchema.parse(await fetchJson(`${GITHUB_API}/${ref.owner}/${ref.repo}`, headers));
      return { stars: repo.stargazers_count, forks: repo.forks_count, pushedAt: repo.pushed_at ?? null, url: repo.html_url };
    }),
  );
}

function loadModrinthStats(slug: string): Promise<ModrinthStats | null> {
  const key = slug.toLowerCase();
  return modrinthCache.getOrLoad(key, () =>
    safely(`Modrinth ${key}`, async () => {
      const project = modrinthProjectSchema.parse(await fetchJson(`${MODRINTH_API}/${encodeURIComponent(slug)}`, {}));
      return {
        downloads: project.downloads,
        followers: project.followers,
        updatedAt: project.updated ?? null,
        url: `https://modrinth.com/project/${project.slug}`,
      };
    }),
  );
}

/** Statystyki tylko dla projektów programistycznych z linkiem do GitHuba albo Modrinth. */
export async function getProjectStats(project: Project): Promise<ProjectStats | null> {
  if (project.category !== PROJECT_CATEGORY.SOFTWARE) {
    return null;
  }
  const githubRef = parseGithubRepo(project.links?.repository);
  const modrinthSlug = parseModrinthSlug(project.links?.demo);
  if (!githubRef && !modrinthSlug) {
    return null;
  }
  const [github, modrinth] = await Promise.all([
    githubRef ? loadGithubStats(githubRef) : Promise.resolve(null),
    modrinthSlug ? loadModrinthStats(modrinthSlug) : Promise.resolve(null),
  ]);
  return github || modrinth ? { github, modrinth } : null;
}

export async function getStatsForProjects(projects: readonly Project[]): Promise<ReadonlyMap<number, ProjectStats>> {
  const entries = await Promise.all(
    projects.map(async (project) => [project.id, await getProjectStats(project)] as const),
  );
  return new Map(entries.filter((entry): entry is readonly [number, ProjectStats] => entry[1] !== null));
}
