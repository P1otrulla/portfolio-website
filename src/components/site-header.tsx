"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ROUTES, SECTION_ID } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { buttonClass } from "./ui/button";
import { ThemeToggle } from "./theme-toggle";
import { Logo } from "./logo";

const REVIEWS_HREF = `/#${SECTION_ID.REVIEWS}`;

const ALL_NAV_ITEMS = Object.freeze([
  { label: "Usługi", href: `/#${SECTION_ID.SERVICES}` },
  { label: "Realizacje", href: `/#${SECTION_ID.PROJECTS}` },
  { label: "Opinie", href: REVIEWS_HREF },
  { label: "Kontakt", href: `/#${SECTION_ID.CONTACT}` },
]);

const SCROLLED_THRESHOLD_PX = 8;

export function SiteHeader({ showReviews }: { readonly showReviews: boolean }) {
  const navItems = showReviews ? ALL_NAV_ITEMS : ALL_NAV_ITEMS.filter((item) => item.href !== REVIEWS_HREF);
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > SCROLLED_THRESHOLD_PX);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setMenuOpen(false), [pathname]);

  useEffect(() => {
    if (!isMenuOpen) {
      return;
    }
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setMenuOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isMenuOpen]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b transition-colors",
        isScrolled || isMenuOpen ? "border-rule bg-paper/92 backdrop-blur-md" : "border-transparent bg-paper",
      )}
    >
      <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between gap-4 px-4 sm:px-6">
        <Link href={ROUTES.HOME} className="shrink-0" aria-label="Piotr Zych – strona główna">
          <Logo />
        </Link>

        <nav aria-label="Główna nawigacja" className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-2 text-[0.95rem] text-ink-soft transition-colors hover:text-ink"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <ThemeToggle />
          <Link href={`/#${SECTION_ID.CONTACT}`} className={buttonClass("solid", "ml-2 hidden px-4 py-2 sm:inline-flex")}>
            Zapytaj o wycenę
          </Link>
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-md text-ink hover:bg-surface md:hidden"
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
            aria-label={isMenuOpen ? "Zamknij menu" : "Otwórz menu"}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <nav id="mobile-menu" aria-label="Menu mobilne" className="border-t border-rule bg-paper px-4 pb-5 pt-2 md:hidden">
          <ul className="flex flex-col">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="block border-b border-rule py-3.5 text-lg font-medium"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href={`/#${SECTION_ID.CONTACT}`}
            onClick={() => setMenuOpen(false)}
            className={buttonClass("solid", "mt-5 w-full")}
          >
            Zapytaj o wycenę
          </Link>
        </nav>
      )}
    </header>
  );
}
