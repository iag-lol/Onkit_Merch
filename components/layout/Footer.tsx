import Link from "next/link";

export const Footer = () => (
  <footer className="mt-16 border-t border-slate-200 bg-white">
    <div className="container-page flex flex-col gap-8 py-10 md:flex-row md:items-center md:justify-between">
      <div>
        <p className="text-sm font-semibold text-brand-base">ONKIT MERCH</p>
        <p className="text-sm text-slate-500">Kits personalizados, producción bajo demanda.</p>
      </div>
      <div className="flex gap-6 text-sm text-slate-600">
        <Link href="/aviso-legal">Aviso legal</Link>
        <Link href="/privacidad">Privacidad</Link>
        <Link href="mailto:onkitmerch@outlook.com">onkitmerch@outlook.com</Link>
        <Link href="https://wa.me/56984752936">WhatsApp</Link>
      </div>
    </div>
  </footer>
);
