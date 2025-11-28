import clsx from "clsx";
import { HTMLAttributes, PropsWithChildren } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
  title?: string;
  action?: React.ReactNode;
}

export const Card = ({ className, children, title, action, ...rest }: PropsWithChildren<CardProps>) => (
  <div className={clsx("glass-panel rounded-3xl p-6", className)} {...rest}>
    {(title || action) && (
      <div className="mb-4 flex items-center justify-between gap-4">
        {title && <h3 className="text-lg font-semibold text-brand-base">{title}</h3>}
        {action}
      </div>
    )}
    {children}
  </div>
);
