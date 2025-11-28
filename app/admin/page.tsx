import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SimpleBar } from "@/components/charts/SimpleBar";
import { mockQuotes, mockProducts, mockVisits } from "@/lib/mockData";
import { formatCurrency } from "@/lib/utils";

const kpis = [
  { label: "Cotizaciones totales", value: mockQuotes.length, subtitle: "Últimos 30 días" },
  { label: "Ventas confirmadas", value: 18, subtitle: "Simulado", tone: "success" },
  { label: "Monto neto", value: formatCurrency(12500000), subtitle: "Sin IVA" },
  { label: "Visitas", value: mockVisits.length * 35, subtitle: "Tráfico capturado" }
];

const ventasMes = [
  { name: "Ene", value: 800000 },
  { name: "Feb", value: 1200000 },
  { name: "Mar", value: 1500000 },
  { name: "Abr", value: 1800000 },
  { name: "May", value: 2100000 }
];

const cotizacionesSegmento = [
  { name: "Empresa", value: 24 },
  { name: "Colegio", value: 18 },
  { name: "Sport", value: 12 },
  { name: "Evento", value: 20 },
  { name: "Otro", value: 6 }
];

export default function AdminDashboard() {
  return (
    <main className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-wide text-brand-accent">Dashboard</p>
          <h1 className="text-3xl font-semibold text-brand-base">Visión general</h1>
          <p className="text-slate-600">KPIs clave de cotizaciones, ventas, visitas y productos.</p>
        </div>
        <Badge tone="muted">Admin Supabase Auth</Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {kpis.map((kpi) => (
          <Card key={kpi.label} className="space-y-2">
            <p className="text-sm text-slate-500">{kpi.label}</p>
            <p className="text-3xl font-semibold text-brand-base">{kpi.value}</p>
            <p className="text-xs text-slate-500">{kpi.subtitle}</p>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card title="Ventas por mes">
          <SimpleBar data={ventasMes} color="#1DB9A0" />
        </Card>
        <Card title="Cotizaciones por segmento">
          <SimpleBar data={cotizacionesSegmento} color="#0F2535" />
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card title="Top productos cotizados">
          <div className="space-y-3">
            {mockProducts.map((product) => (
              <div key={product.id} className="flex items-center justify-between text-sm">
                <div>
                  <p className="font-semibold text-brand-base">{product.name}</p>
                  <p className="text-slate-600">{product.category}</p>
                </div>
                <Badge tone="muted">+{Math.round(product.stock / 4)} cotizaciones</Badge>
              </div>
            ))}
          </div>
        </Card>
        <Card title="Visitas recientes">
          <div className="space-y-3">
            {mockVisits.slice(0, 5).map((visit) => (
              <div key={visit.id} className="flex items-center justify-between text-sm">
                <div>
                  <p className="font-semibold text-brand-base">{visit.path}</p>
                  <p className="text-slate-600">{visit.userAgent}</p>
                </div>
                <p className="text-xs text-slate-500">{visit.createdAt}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </main>
  );
}
