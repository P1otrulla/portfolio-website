export interface GithubRepoRef {
  readonly owner: string;
  readonly repo: string;
}

const GITHUB_HOSTS: ReadonlySet<string> = new Set(["github.com", "www.github.com"]);
const MODRINTH_HOSTS: ReadonlySet<string> = new Set(["modrinth.com", "www.modrinth.com"]);
const MODRINTH_PROJECT_TYPES: ReadonlySet<string> = new Set([
  "plugin",
  "mod",
  "project",
  "datapack",
  "resourcepack",
  "modpack",
  "shader",
]);

function parseUrl(value: string | null | undefined): URL | null {
  if (!value) {
    return null;
  }
  try {
    return new URL(value.trim());
  } catch {
    return null;
  }
}

function pathSegments(url: URL): string[] {
  return url.pathname.split("/").filter((segment) => segment.length > 0);
}

/** https://github.com/owner/repo(/...) → { owner, repo } */
export function parseGithubRepo(value: string | null | undefined): GithubRepoRef | null {
  const url = parseUrl(value);
  if (!url || !GITHUB_HOSTS.has(url.hostname)) {
    return null;
  }
  const [owner, repo] = pathSegments(url);
  if (!owner || !repo) {
    return null;
  }
  return { owner, repo: repo.replace(/\.git$/, "") };
}

/** https://modrinth.com/plugin/slug(/...) → slug */
export function parseModrinthSlug(value: string | null | undefined): string | null {
  const url = parseUrl(value);
  if (!url || !MODRINTH_HOSTS.has(url.hostname)) {
    return null;
  }
  const [type, slug] = pathSegments(url);
  return type && slug && MODRINTH_PROJECT_TYPES.has(type) ? slug : null;
}
