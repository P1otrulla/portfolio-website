import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

const MONTH_YEAR_FORMAT = new Intl.DateTimeFormat("pl-PL", { month: "long", year: "numeric" });

export function formatMonthYear(isoDate: string | null | undefined): string | null {
  if (!isoDate) {
    return null;
  }
  const date = new Date(isoDate);
  return Number.isNaN(date.getTime()) ? null : MONTH_YEAR_FORMAT.format(date);
}

export function isNonEmpty(value: string | null | undefined): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

/** Polska odmiana: 1 opinia, 2–4 opinie, 5+ opinii (z wyjątkiem 12–14). */
export function pluralizePl(count: number, one: string, few: string, many: string): string {
  if (count === 1) {
    return one;
  }
  const lastDigit = count % 10;
  const lastTwoDigits = count % 100;
  const isFew = lastDigit >= 2 && lastDigit <= 4 && (lastTwoDigits < 12 || lastTwoDigits > 14);
  return isFew ? few : many;
}
