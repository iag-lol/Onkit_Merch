import { PropsWithChildren, ReactNode } from "react";
import clsx from "clsx";

export const Table = ({ children, className }: PropsWithChildren<{ className?: string }>) => (
  <div className={clsx("overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm", className)}>
    <table className="min-w-full divide-y divide-slate-100">{children}</table>
  </div>
);

export const THead = ({ children }: PropsWithChildren) => (
  <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
    <tr>{children}</tr>
  </thead>
);

export const TH = ({ children }: PropsWithChildren) => <th className="px-4 py-3">{children}</th>;
export const TR = ({ children }: PropsWithChildren) => <tr className="even:bg-slate-50/40">{children}</tr>;
export const TD = ({ children, className }: PropsWithChildren<{ className?: string }>) => (
  <td className={clsx("px-4 py-3 text-sm text-slate-800", className)}>{children}</td>
);

export const EmptyState = ({ icon, title, description }: { icon?: ReactNode; title: string; description?: string }) => (
  <div className="flex flex-col items-center justify-center gap-2 px-6 py-8 text-center text-slate-500">
    {icon}
    <p className="text-sm font-semibold text-slate-700">{title}</p>
    {description && <p className="text-sm">{description}</p>}
  </div>
);
