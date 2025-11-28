'use client';

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { clearAdminSession } from "@/lib/auth";

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
  const router = useRouter();

  const handleLogout = () => {
    clearAdminSession();
    router.push("/admin/login");
  };

  return (
    <nav className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
      <div>
        <p className="text-xs uppercase tracking-wide text-brand-accent">Panel ONKIT MERCH</p>
        <p className="text-sm font-semibold text-brand-base">Control de operaciones</p>
      </div>
      <div className="flex flex-wrap items-center gap-3 text-sm">
        <div className="flex flex-wrap gap-2">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-full px-3 py-1.5 font-medium transition-all ${
                path === link.href
                  ? "bg-brand-accent text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-100 hover:text-brand-base"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
        <button
          onClick={handleLogout}
          className="ml-2 flex items-center gap-2 rounded-full bg-red-50 px-4 py-1.5 font-medium text-red-600 hover:bg-red-100 transition-all"
          title="Cerrar sesión"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Salir
        </button>
      </div>
    </nav>
  );
};
