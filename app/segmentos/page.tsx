"use client";

import { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Segment, Product } from "@/lib/types";
import { loadProductsClient } from "@/lib/dataClient";

const segmentCopy: Record<Segment, { title: string; text: string }> = {
  empresa: { title: "Empresas", text: "Kits de onboarding, regalos ejecutivos y campañas internas con branding premium." },
  colegio: { title: "Colegios", text: "Uniformes, kits deportivos, eventos estudiantiles y bienvenida docente." },
  sport: { title: "Sport / Clubes", text: "Entrenamiento, staff técnico y fan shop para hinchas." },
  evento: { title: "Eventos", text: "Acreditaciones, ferias, congresos y marketing experiencial." },
  otro: { title: "Otros", text: "Fundaciones, municipalidades, asociaciones y ONG." }
};

export default function SegmentosPage() {
  const [selected, setSelected] = useState<Segment>("empresa");
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    loadProductsClient().then(setProducts).catch(console.error);
  }, []);

  const kits = useMemo(() => products.filter((p) => p.segments.includes(selected)), [products, selected]);

  return (
    <main className="container-page py-12">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-wide text-brand-accent">Segmentos</p>
          <h1 className="text-3xl font-semibold text-brand-base">Contenido curado por sector</h1>
        </div>
        <Button href={`/cotizacion?segmento=${selected}`}>Cotizar {segmentCopy[selected].title}</Button>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-5">
        {(Object.keys(segmentCopy) as Segment[]).map((seg) => (
          <Card
            key={seg}
            className={`cursor-pointer border ${selected === seg ? "border-brand-accent shadow-lg" : "border-slate-100"}`}
            onClick={() => setSelected(seg)}
          >
            <h3 className="text-lg font-semibold text-brand-base">{segmentCopy[seg].title}</h3>
            <p className="text-sm text-slate-600">{segmentCopy[seg].text}</p>
          </Card>
        ))}
      </div>

      <section className="mt-10 grid gap-6 md:grid-cols-2">
        {kits.map((product) => (
          <Card key={product.id} className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-brand-base">{product.name}</h3>
              <p className="text-brand-accent font-semibold">Desde {product.basePrice.toLocaleString()} + IVA</p>
            </div>
            <p className="text-slate-600">{product.description}</p>
            <div className="flex gap-3">
              <Button href={`/cotizacion?segmento=${selected}&producto=${product.id}`}>Solicitar cotización</Button>
              <Button variant="secondary" href="/catalogo">
                Ver catálogo
              </Button>
            </div>
          </Card>
        ))}
      </section>
    </main>
  );
}
