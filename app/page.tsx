import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { mockProducts, mockReviews } from "@/lib/mockData";
import { formatCurrency } from "@/lib/utils";

const segmentos = [
  { id: "empresa", title: "Empresas", desc: "Onboarding, regalos ejecutivos, activaciones internas." },
  { id: "colegio", title: "Colegios", desc: "Uniformes, kits deportivos, eventos estudiantiles." },
  { id: "sport", title: "Sport / Clubes", desc: "Entrenamiento, staff, hinchas." },
  { id: "evento", title: "Eventos", desc: "Ferias, congresos, acreditaciones premium." },
  { id: "otro", title: "Otros", desc: "Fundaciones, municipalidades y más." }
];

export default function HomePage() {
  return (
    <main>
      <section className="gradient-hero text-white">
        <div className="container-page grid items-center gap-10 py-16 md:grid-cols-2 md:py-20">
          <div className="space-y-6">
            <Badge tone="accent" className="bg-white/15 text-white">
              Kits personalizados, producción bajo demanda
            </Badge>
            <h1 className="text-4xl font-bold leading-tight md:text-5xl">
              Merchandising inteligente y kits personalizados para empresas, colegios y eventos.
            </h1>
            <p className="text-lg text-white/80">
              ONKIT MERCH diseña, produce y entrega kits corporativos de alto impacto con control de inventario, descuentos
              por volumen y seguimiento de cotizaciones.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button href="/cotizacion">Solicitar cotización</Button>
              <Button variant="secondary" href="/catalogo">
                Ver catálogo
              </Button>
            </div>
            <div className="flex flex-wrap gap-3 text-sm text-white/80">
              <span className="rounded-full bg-white/10 px-3 py-1">Mínimo 10 unidades (muestras 1u)</span>
              <span className="rounded-full bg-white/10 px-3 py-1">Descuentos progresivos</span>
              <span className="rounded-full bg-white/10 px-3 py-1">Producción nacional</span>
            </div>
          </div>
          <Card className="glass-panel border-white/20 bg-white/10">
            <h3 className="mb-4 text-xl font-semibold text-white">Control total para tu marca</h3>
            <ul className="space-y-3 text-white/80">
              <li>✓ Panel admin con KPIs de cotizaciones, ventas y stock.</li>
              <li>✓ Segmentos: empresa, colegio, sport, evento y otros.</li>
              <li>✓ PDF de cotización con IVA 19% y reglas por volumen.</li>
              <li>✓ Logs de visitas y reseñas moderadas.</li>
            </ul>
            <div className="mt-6 flex gap-3">
              <Button variant="secondary" href="/admin">
                Ir al panel
              </Button>
              <Button href="/segmentos">Ver sectores</Button>
            </div>
          </Card>
        </div>
      </section>

      <section className="container-page py-16">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm uppercase tracking-wide text-brand-accent">Qué hacemos</p>
            <h2 className="text-3xl font-semibold text-brand-base">Kits B2B/B2C con control y trazabilidad</h2>
          </div>
          <Button variant="secondary" href="/catalogo">
            Catálogo
          </Button>
        </div>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <Card>
            <h3 className="text-lg font-semibold text-brand-base">Diseño y personalización</h3>
            <p className="text-slate-600">Creamos kits alineados a tu marca, listos para onboarding, eventos o retail.</p>
          </Card>
          <Card>
            <h3 className="text-lg font-semibold text-brand-base">Operación integral</h3>
            <p className="text-slate-600">Stock gestionado, mínimos por producto y muestras unitarias para QA.</p>
          </Card>
          <Card>
            <h3 className="text-lg font-semibold text-brand-base">Panel de control</h3>
            <p className="text-slate-600">KPI de cotizaciones, ventas, visitas y reseñas para decisiones rápidas.</p>
          </Card>
        </div>
      </section>

      <section className="container-page py-12">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-wide text-brand-accent">Segmentos</p>
            <h2 className="text-3xl font-semibold text-brand-base">Soluciones adaptadas por industria</h2>
          </div>
          <Button variant="secondary" href="/segmentos">
            Ver todos los segmentos
          </Button>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {segmentos.map((seg) => (
            <Link key={seg.id} href={`/segmentos?tipo=${seg.id}`}>
              <Card className="h-full border border-slate-100 hover:-translate-y-1 hover:shadow-lg">
                <div className="flex items-start justify-between">
                  <h3 className="text-xl font-semibold text-brand-base">{seg.title}</h3>
                  <Badge>{seg.title}</Badge>
                </div>
                <p className="mt-3 text-slate-600">{seg.desc}</p>
                <p className="mt-4 text-sm font-semibold text-brand-accent">Cotizar para {seg.title} →</p>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="container-page flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-wide text-brand-accent">Productos destacados</p>
            <h2 className="text-3xl font-semibold text-brand-base">Kits listos para activar</h2>
          </div>
          <Button href="/catalogo">Ir al catálogo completo</Button>
        </div>
        <div className="container-page mt-8 grid gap-6 md:grid-cols-2">
          {mockProducts.map((product) => (
            <Card key={product.id} className="flex flex-col gap-3 md:flex-row md:items-center">
              <div className="h-28 w-full rounded-2xl bg-brand-muted/60 md:w-32" />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <Badge>{product.category}</Badge>
                  {product.allowSample && <Badge tone="success">Disponible muestra</Badge>}
                </div>
                <h3 className="mt-2 text-lg font-semibold text-brand-base">{product.name}</h3>
                <p className="text-sm text-slate-600">{product.description}</p>
                <p className="text-brand-accent font-semibold mt-2">
                  {formatCurrency(product.basePrice)} + IVA • stock {product.stock}
                </p>
              </div>
              <Button href={`/catalogo#${product.id}`}>Agregar</Button>
            </Card>
          ))}
        </div>
      </section>

      <section className="container-page py-16">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-wide text-brand-accent">Reseñas</p>
            <h2 className="text-3xl font-semibold text-brand-base">Clientes que ya confían</h2>
          </div>
          <Button variant="secondary" href="/reseñas">
            Ver todas
          </Button>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {mockReviews.map((review) => (
            <Card key={review.id}>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-brand-muted" />
                <div>
                  <p className="font-semibold text-brand-base">{review.name}</p>
                  <p className="text-xs uppercase tracking-wide text-slate-500">{review.clientType}</p>
                </div>
                <div className="ml-auto text-yellow-400">
                  {"★".repeat(review.rating)}
                  {"☆".repeat(5 - review.rating)}
                </div>
              </div>
              <p className="mt-3 text-slate-700">{review.comment}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="bg-brand-base text-white">
        <div className="container-page grid gap-6 py-12 md:grid-cols-2 md:items-center">
          <div>
            <h2 className="text-3xl font-semibold">¿Listo para cotizar?</h2>
            <p className="mt-2 text-white/80">Responde en minutos. Preselecciona tu segmento y productos.</p>
          </div>
          <form className="glass-panel grid gap-3 rounded-2xl border border-white/10 bg-white/10 p-6 text-slate-900">
            <input className="rounded-xl border border-white/40 bg-white/70 px-3 py-2" placeholder="Nombre de contacto" />
            <div className="grid gap-3 md:grid-cols-2">
              <input className="rounded-xl border border-white/40 bg-white/70 px-3 py-2" placeholder="Correo" />
              <input className="rounded-xl border border-white/40 bg-white/70 px-3 py-2" placeholder="Teléfono / WhatsApp" />
            </div>
            <select className="rounded-xl border border-white/40 bg-white/70 px-3 py-2">
              <option>Empresa</option>
              <option>Colegio</option>
              <option>Sport</option>
              <option>Evento</option>
              <option>Otro</option>
            </select>
            <textarea
              className="rounded-xl border border-white/40 bg-white/70 px-3 py-2"
              placeholder="Detalle corto de lo que necesitas"
              rows={3}
            />
            <Button type="button">Enviar y cotizar</Button>
          </form>
        </div>
      </section>
    </main>
  );
}
