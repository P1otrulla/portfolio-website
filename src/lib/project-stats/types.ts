/** Typy współdzielone przez serwer i komponenty klienckie (bez importów serwerowych). */

export interface GithubStats {
  readonly stars: number;
  readonly forks: number;
  readonly pushedAt: string | null;
  readonly url: string;
}

export interface ModrinthStats {
  readonly downloads: number;
  readonly followers: number;
  readonly updatedAt: string | null;
  readonly url: string;
}

export interface ProjectStats {
  readonly github: GithubStats | null;
  readonly modrinth: ModrinthStats | null;
}
