import Link from "next/link";
import { Button } from "../ui/button";

const nav = [
  { href: "/catalogo", label: "Catálogo" },
  { href: "/segmentos", label: "Sectores" },
  { href: "/cotizacion", label: "Solicitar cotización" },
  { href: "/reseñas", label: "Reseñas" },
  { href: "/contacto", label: "Contacto" }
];

export const Header = () => (
  <header className="sticky top-0 z-40 border-b border-white/20 bg-white/80 backdrop-blur-md">
    <div className="container-page flex items-center justify-between py-4">
      <Link href="/" className="flex items-center gap-3 text-brand-base">
        <div className="h-10 w-10 rounded-2xl bg-brand-accent/30" />
        <div>
          <p className="text-sm uppercase tracking-widest text-brand-accent">ONKIT MERCH</p>
          <p className="text-xs text-slate-500">Kits personalizados, producción bajo demanda</p>
        </div>
      </Link>

      <nav className="hidden items-center gap-6 text-sm font-semibold text-slate-700 md:flex">
        {nav.map((item) => (
          <Link key={item.href} href={item.href} className="hover:text-brand-accent">
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="hidden items-center gap-3 md:flex">
        <Button variant="secondary" href="/admin">
          Panel Admin
        </Button>
        <Button href="/cotizacion">Cotizar ahora</Button>
      </div>

      <Button className="md:hidden" href="/cotizacion">
        Cotizar
      </Button>
    </div>
  </header>
);
