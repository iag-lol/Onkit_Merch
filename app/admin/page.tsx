"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SimpleBar } from "@/components/charts/SimpleBar";
import { formatCurrency } from "@/lib/utils";
import { useEffect, useMemo, useState } from "react";
import { loadProductsClient, loadQuotesClient, loadSalesClient, loadVisitsClient } from "@/lib/dataClient";
import { Product, Quote, Sale, VisitLog } from "@/lib/types";

export default function AdminDashboard() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [visits, setVisits] = useState<VisitLog[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    loadQuotesClient().then(setQuotes).catch(console.error);
    loadSalesClient().then(setSales).catch(console.error);
    loadVisitsClient().then(setVisits).catch(console.error);
    loadProductsClient().then(setProducts).catch(console.error);
  }, []);

  const netAmount = useMemo(() => sales.reduce((acc, s) => acc + s.netAmount, 0), [sales]);
  const kpis = [
    { label: "Cotizaciones totales", value: quotes.length, subtitle: "Total registradas" },
    { label: "Ventas confirmadas", value: sales.length, subtitle: "Registros en ventas" },
    { label: "Monto neto", value: formatCurrency(netAmount), subtitle: "Sin IVA" },
    { label: "Visitas", value: visits.length, subtitle: "Logs capturados" }
  ];

  const ventasMes = useMemo(() => {
    const grouped: Record<string, number> = {};
    sales.forEach((s) => {
      const month = new Date(s.createdAt).toLocaleString("es-CL", { month: "short" });
      grouped[month] = (grouped[month] ?? 0) + s.netAmount;
    });
    return Object.entries(grouped).map(([name, value]) => ({ name, value }));
  }, [sales]);

  const cotizacionesSegmento = useMemo(() => {
    const grouped: Record<string, number> = {};
    quotes.forEach((q) => {
      grouped[q.clientType] = (grouped[q.clientType] ?? 0) + 1;
    });
    return Object.entries(grouped).map(([name, value]) => ({ name, value }));
  }, [quotes]);

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
            {products.slice(0, 5).map((product) => (
              <div key={product.id} className="flex items-center justify-between text-sm">
                <div>
                  <p className="font-semibold text-brand-base">{product.name}</p>
                  <p className="text-slate-600">{product.category}</p>
                </div>
                <Badge tone="muted">Stock {product.stock}</Badge>
              </div>
            ))}
            {products.length === 0 && <p className="text-sm text-slate-500">Sin productos publicados.</p>}
          </div>
        </Card>
        <Card title="Visitas recientes">
          <div className="space-y-3">
            {visits.slice(0, 5).map((visit) => (
              <div key={visit.id} className="flex items-center justify-between text-sm">
                <div>
                  <p className="font-semibold text-brand-base">{visit.path}</p>
                  <p className="text-slate-600">{visit.userAgent}</p>
                </div>
                <p className="text-xs text-slate-500">{visit.createdAt}</p>
              </div>
            ))}
            {visits.length === 0 && <p className="text-sm text-slate-500">Aún no hay visitas registradas.</p>}
          </div>
        </Card>
      </div>
    </main>
  );
}
