import clsx from "clsx";
import { PropsWithChildren } from "react";

interface BadgeProps {
  tone?: "accent" | "muted" | "warning" | "success";
  className?: string;
}

const toneStyles: Record<NonNullable<BadgeProps["tone"]>, string> = {
  accent: "bg-brand-accent/15 text-brand-base",
  muted: "bg-brand-muted text-brand-base",
  warning: "bg-yellow-100 text-yellow-800",
  success: "bg-green-100 text-green-700"
};

export const Badge = ({ tone = "accent", children, className }: PropsWithChildren<BadgeProps>) => (
  <span
    className={clsx(
      "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide",
      toneStyles[tone],
      className
    )}
  >
    {children}
  </span>
);
