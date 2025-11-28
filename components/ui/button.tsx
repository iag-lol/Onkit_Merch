import clsx from "clsx";
import Link from "next/link";
import { ButtonHTMLAttributes, PropsWithChildren } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  href?: string;
}

const base =
  "inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-semibold transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2";

const variants: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary:
    "bg-brand-accent text-slate-900 shadow-lg shadow-brand-accent/30 hover:-translate-y-0.5 hover:shadow-xl focus-visible:outline-brand-accent",
  secondary:
    "bg-white text-brand-base border border-white/60 shadow-card hover:-translate-y-0.5 focus-visible:outline-brand-base",
  ghost: "text-white/90 hover:text-white focus-visible:outline-white"
};

export const Button = ({ variant = "primary", href, children, className, ...props }: PropsWithChildren<ButtonProps>) => {
  const cls = clsx(base, variants[variant], className);
  if (href) {
    return (
      <Link href={href} className={cls}>
        {children}
      </Link>
    );
  }
  return (
    <button className={cls} {...props}>
      {children}
    </button>
  );
};
