import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/utils";

const BASE =
  "inline-flex items-center justify-center gap-2 rounded-md px-5 py-3 text-[0.95rem] font-semibold transition-colors disabled:pointer-events-none disabled:opacity-60";

const VARIANT = {
  solid: "bg-ink text-paper hover:bg-ink/85",
  outline: "border border-ink/25 text-ink hover:border-ink hover:bg-surface",
  quiet: "text-ink hover:bg-surface px-3",
} as const;

export type ButtonVariant = keyof typeof VARIANT;

export function buttonClass(variant: ButtonVariant = "solid", className?: string): string {
  return cn(BASE, VARIANT[variant], className);
}

interface ButtonLinkProps extends Omit<ComponentPropsWithoutRef<typeof Link>, "className"> {
  readonly variant?: ButtonVariant;
  readonly className?: string;
  readonly children: ReactNode;
}

export function ButtonLink({ variant = "solid", className, children, ...linkProps }: ButtonLinkProps) {
  return (
    <Link className={buttonClass(variant, className)} {...linkProps}>
      {children}
    </Link>
  );
}

interface ExternalLinkProps extends Omit<ComponentPropsWithoutRef<"a">, "target" | "rel"> {
  readonly href: string;
}

/** Link poza stronę – zawsze w nowej karcie i bez przekazywania window.opener. */
export function ExternalLink({ children, ...anchorProps }: ExternalLinkProps) {
  return (
    <a target="_blank" rel="noopener noreferrer" {...anchorProps}>
      {children}
    </a>
  );
}
