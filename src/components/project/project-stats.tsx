import { Download, GitFork, Heart, Star } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { ProjectStats } from "@/lib/project-stats/types";
import { cn, formatCompactNumber, formatMonthYear } from "@/lib/utils";

interface StatItem {
  readonly key: string;
  readonly icon: LucideIcon;
  readonly value: number;
  readonly label: string;
}

/** Lista liczb do pokazania – kolejność: najbardziej przekonujące najpierw. */
function collectStats(stats: ProjectStats): readonly StatItem[] {
  const items: StatItem[] = [];
  if (stats.modrinth) {
    items.push({ key: "downloads", icon: Download, value: stats.modrinth.downloads, label: "pobrań z Modrinth" });
  }
  if (stats.github) {
    items.push({ key: "stars", icon: Star, value: stats.github.stars, label: "gwiazdek na GitHubie" });
    if (stats.github.forks > 0) {
      items.push({ key: "forks", icon: GitFork, value: stats.github.forks, label: "forków na GitHubie" });
    }
  }
  if (stats.modrinth && stats.modrinth.followers > 0) {
    items.push({ key: "followers", icon: Heart, value: stats.modrinth.followers, label: "obserwujących na Modrinth" });
  }
  return items;
}

/** Kompaktowy pasek liczb na kafelku. */
export function ProjectStatsInline({ stats, className }: { readonly stats: ProjectStats; readonly className?: string }) {
  const items = collectStats(stats).slice(0, 3);
  if (items.length === 0) {
    return null;
  }
  return (
    <ul className={cn("flex flex-wrap gap-x-4 gap-y-1 text-sm text-ink-soft", className)} aria-label="Statystyki projektu">
      {items.map((item) => (
        <li key={item.key} className="inline-flex items-center gap-1.5" title={`${item.value} ${item.label}`}>
          <item.icon size={14} aria-hidden="true" />
          <span className="font-semibold tabular-nums text-ink">{formatCompactNumber(item.value)}</span>
          <span className="sr-only">{item.label}</span>
        </li>
      ))}
    </ul>
  );
}

/** Wiersze do tabelki parametrów na stronie projektu. */
export function projectStatsFacts(stats: ProjectStats): readonly { label: string; value: string }[] {
  const facts = collectStats(stats).map((item) => ({
    label: item.label.charAt(0).toUpperCase() + item.label.slice(1),
    value: new Intl.NumberFormat("pl-PL").format(item.value),
  }));
  const lastUpdate = [stats.github?.pushedAt, stats.modrinth?.updatedAt]
    .filter((date): date is string => Boolean(date))
    .sort()
    .at(-1);
  const lastUpdateLabel = formatMonthYear(lastUpdate);
  return lastUpdateLabel ? [...facts, { label: "Ostatnia aktualizacja", value: lastUpdateLabel }] : facts;
}
