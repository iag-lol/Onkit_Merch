"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { mockProducts } from "@/lib/mockData";
import { formatCurrency } from "@/lib/utils";
import { useCart } from "@/context/cart";

const categorias = Array.from(new Set(mockProducts.map((p) => p.category)));

export default function CatalogPage() {
  const [category, setCategory] = useState<string | null>(null);
  const [segment, setSegment] = useState<string | null>(null);
  const { addItem } = useCart();

  const filtered = useMemo(() => {
    return mockProducts.filter((p) => {
      if (category && p.category !== category) return false;
      if (segment && !p.segments.includes(segment as any)) return false;
      return true;
    });
  }, [category, segment]);

  return (
    <main className="container-page py-12">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-wide text-brand-accent">Catálogo</p>
          <h1 className="text-3xl font-semibold text-brand-base">Productos listos para personalizar</h1>
          <p className="text-slate-600">Precios base sin IVA. Mínimo 10 unidades por producto (muestras 1u).</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <select
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
            value={category ?? ""}
            onChange={(e) => setCategory(e.target.value || null)}
          >
            <option value="">Todas las categorías</option>
            {categorias.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <select
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
            value={segment ?? ""}
            onChange={(e) => setSegment(e.target.value || null)}
          >
            <option value="">Todos los segmentos</option>
            <option value="empresa">Empresa</option>
            <option value="colegio">Colegio</option>
            <option value="sport">Sport</option>
            <option value="evento">Evento</option>
            <option value="otro">Otro</option>
          </select>
        </div>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        {filtered.map((product) => (
          <Card key={product.id} id={product.id} className="grid gap-4 md:grid-cols-[140px,1fr]">
            <div className="h-32 w-full rounded-2xl bg-brand-muted/70" />
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <Badge>{product.category}</Badge>
                {product.allowSample && <Badge tone="success">Disponible para prueba</Badge>}
                <Badge tone="muted">{product.segments.join(" / ")}</Badge>
              </div>
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <h3 className="text-xl font-semibold text-brand-base">{product.name}</h3>
                  <p className="text-sm text-slate-600">{product.description}</p>
                </div>
                <p className="text-right text-brand-accent font-semibold">{formatCurrency(product.basePrice)} + IVA</p>
              </div>
              <p className="text-sm text-slate-600">Stock: {product.stock} • Mínimo 10u (muestras 1u)</p>
              {product.volumeDiscounts && (
                <div className="rounded-xl bg-brand-muted/60 p-3 text-sm text-slate-700">
                  <p className="font-semibold text-brand-base">Descuentos por volumen</p>
                  <div className="flex flex-wrap gap-2">
                    {product.volumeDiscounts.map((rule) => (
                      <span key={rule.from} className="rounded-full bg-white px-3 py-1 shadow-sm">
                        {rule.from}+ uds: {rule.discountPct}% OFF
                      </span>
                    ))}
                  </div>
                </div>
              )}
              <div className="flex gap-3">
                <Button onClick={() => addItem(product)}>Agregar</Button>
                <Button variant="secondary" href={`/cotizacion?producto=${product.id}`}>
                  Cotizar
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </main>
  );
}
