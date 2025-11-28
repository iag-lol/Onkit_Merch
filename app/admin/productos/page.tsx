"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Table, THead, TH, TR, TD, EmptyState } from "@/components/ui/table";
import { Modal } from "@/components/ui/modal";
import { formatCurrency } from "@/lib/utils";
import { Product } from "@/lib/types";
import { loadProductsClient } from "@/lib/dataClient";

export default function AdminProducts() {
  const [selected, setSelected] = useState<Product | null>(null);
  const [filter, setFilter] = useState("");
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    loadProductsClient(true).then(setProducts).catch(console.error);
  }, []);

  const filtered = useMemo(
    () => products.filter((p) => p.name.toLowerCase().includes(filter.toLowerCase())),
    [filter, products]
  );

  return (
    <main className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm uppercase tracking-wide text-brand-accent">Productos</p>
          <h1 className="text-2xl font-semibold text-brand-base">Catálogo administrable</h1>
        </div>
        <div className="flex gap-2">
          <input
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
            placeholder="Buscar..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
          <Button>Crear producto</Button>
        </div>
      </div>

      <Table>
        <THead>
          <TH>Producto</TH>
          <TH>Segmentos</TH>
          <TH>Precio base</TH>
          <TH>Stock</TH>
          <TH>Estado</TH>
          <TH></TH>
        </THead>
        <tbody>
          {filtered.map((product) => (
            <TR key={product.id}>
              <TD>
                <p className="font-semibold text-brand-base">{product.name}</p>
                <p className="text-xs text-slate-500">{product.category}</p>
              </TD>
              <TD className="text-sm capitalize">{product.segments.join(", ")}</TD>
              <TD>{formatCurrency(product.basePrice)} + IVA</TD>
              <TD>{product.stock}</TD>
              <TD>{product.active === false ? "Inactivo" : "Activo"}</TD>
              <TD>
                <div className="flex gap-2">
                  <Button variant="secondary" onClick={() => setSelected(product)}>
                    Editar
                  </Button>
                  <Button variant="ghost">Desactivar</Button>
                </div>
              </TD>
            </TR>
          ))}
        </tbody>
        {filtered.length === 0 && <EmptyState title="Sin productos" description="Crea tu primer producto." />}
      </Table>

      <Modal open={!!selected} title={`Editar ${selected?.name ?? ""}`} onClose={() => setSelected(null)}>
        {selected && (
          <div className="space-y-3">
            <input className="w-full rounded-xl border border-slate-200 px-3 py-2" defaultValue={selected.name} />
            <input className="w-full rounded-xl border border-slate-200 px-3 py-2" defaultValue={selected.category} />
            <input className="w-full rounded-xl border border-slate-200 px-3 py-2" defaultValue={selected.basePrice} />
            <textarea className="w-full rounded-xl border border-slate-200 px-3 py-2" defaultValue={selected.description} />
            <div className="flex justify-end gap-3">
              <Button variant="secondary" onClick={() => setSelected(null)}>
                Cancelar
              </Button>
              <Button>Guardar</Button>
            </div>
          </div>
        )}
      </Modal>
    </main>
  );
}
