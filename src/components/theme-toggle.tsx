"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

const THEME = { LIGHT: "light", DARK: "dark" } as const;

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const nextTheme = resolvedTheme === THEME.DARK ? THEME.LIGHT : THEME.DARK;

  return (
    <button
      type="button"
      onClick={() => setTheme(nextTheme)}
      className="relative inline-flex h-10 w-10 items-center justify-center rounded-md text-ink-soft transition-colors hover:bg-surface hover:text-ink"
      aria-label="Przełącz jasny / ciemny motyw"
    >
      <Sun size={18} className="dark:hidden" />
      <Moon size={18} className="hidden dark:block" />
    </button>
  );
}
