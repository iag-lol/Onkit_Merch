import clsx from "clsx";
import { PropsWithChildren } from "react";

interface CardProps {
  className?: string;
  title?: string;
  action?: React.ReactNode;
}

export const Card = ({ className, children, title, action }: PropsWithChildren<CardProps>) => (
  <div className={clsx("glass-panel rounded-3xl p-6", className)}>
    {(title || action) && (
      <div className="mb-4 flex items-center justify-between gap-4">
        {title && <h3 className="text-lg font-semibold text-brand-base">{title}</h3>}
        {action}
      </div>
    )}
    {children}
  </div>
);
