'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/productos", label: "Productos" },
  { href: "/admin/inventario", label: "Inventario" },
  { href: "/admin/cotizaciones", label: "Cotizaciones" },
  { href: "/admin/ventas", label: "Ventas" },
  { href: "/admin/resenas", label: "Reseñas" },
  { href: "/admin/logs", label: "Logs" },
  { href: "/admin/config", label: "Configuración" }
];

export const AdminNav = () => {
  const path = usePathname();
  return (
    <nav className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
      <div>
        <p className="text-xs uppercase tracking-wide text-brand-accent">Panel ONKIT MERCH</p>
        <p className="text-sm font-semibold text-brand-base">Control de operaciones</p>
      </div>
      <div className="flex flex-wrap gap-3 text-sm font-semibold text-slate-600">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`rounded-full px-3 py-1 ${
              path === link.href ? "bg-brand-accent/20 text-brand-base" : "hover:text-brand-base"
            }`}
          >
            {link.label}
          </Link>
        ))}
      </div>
    </nav>
  );
};
