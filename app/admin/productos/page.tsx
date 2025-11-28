"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Table, THead, TH, TR, TD, EmptyState } from "@/components/ui/table";
import { Modal } from "@/components/ui/modal";
import { formatCurrency } from "@/lib/utils";
import { Product, Segment } from "@/lib/types";
import { createProductClient, loadProductsClient, updateProductActive } from "@/lib/dataClient";

export default function AdminProducts() {
  const [selected, setSelected] = useState<Product | null>(null);
  const [filter, setFilter] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [createOpen, setCreateOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({
    name: "",
    category: "",
    description: "",
    basePrice: 0,
    stock: 0,
    allowSample: false,
    segments: ["empresa"] as Segment[]
  });

  useEffect(() => {
    loadProductsClient(true).then(setProducts).catch(console.error);
  }, []);

  const filtered = useMemo(
    () => products.filter((p) => p.name.toLowerCase().includes(filter.toLowerCase())),
    [filter, products]
  );

  const handleCreate = async () => {
    setCreating(true);
    try {
      const newProduct = await createProductClient({
        name: form.name,
        description: form.description,
        basePrice: form.basePrice,
        stock: form.stock,
        allowSample: form.allowSample,
        categoryName: form.category,
        segments: form.segments
      });
      setProducts((prev) => [newProduct, ...prev]);
      setCreateOpen(false);
      setForm({
        name: "",
        category: "",
        description: "",
        basePrice: 0,
        stock: 0,
        allowSample: false,
        segments: ["empresa"]
      });
    } catch (err) {
      console.error(err);
      alert("No se pudo crear el producto. Revisa credenciales Supabase.");
    } finally {
      setCreating(false);
    }
  };

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
          <Button onClick={() => setCreateOpen(true)}>Crear producto</Button>
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
                  <Button
                    variant="ghost"
                    onClick={() => {
                      updateProductActive(product.id, !(product.active ?? true)).then(() =>
                        setProducts((prev) =>
                          prev.map((p) => (p.id === product.id ? { ...p, active: !(product.active ?? true) } : p))
                        )
                      );
                    }}
                  >
                    {product.active === false ? "Activar" : "Desactivar"}
                  </Button>
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

      <Modal open={createOpen} title="Crear producto" onClose={() => setCreateOpen(false)}>
        <div className="space-y-3">
          <input
            className="w-full rounded-xl border border-slate-200 px-3 py-2"
            placeholder="Nombre"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          />
          <input
            className="w-full rounded-xl border border-slate-200 px-3 py-2"
            placeholder="Categoría"
            value={form.category}
            onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
          />
          <textarea
            className="w-full rounded-xl border border-slate-200 px-3 py-2"
            placeholder="Descripción"
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
          />
          <div className="grid grid-cols-2 gap-3">
            <input
              type="number"
              className="w-full rounded-xl border border-slate-200 px-3 py-2"
              placeholder="Precio base sin IVA"
              value={form.basePrice}
              onChange={(e) => setForm((f) => ({ ...f, basePrice: Number(e.target.value) }))}
            />
            <input
              type="number"
              className="w-full rounded-xl border border-slate-200 px-3 py-2"
              placeholder="Stock"
              value={form.stock}
              onChange={(e) => setForm((f) => ({ ...f, stock: Number(e.target.value) }))}
            />
          </div>
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={form.allowSample}
              onChange={(e) => setForm((f) => ({ ...f, allowSample: e.target.checked }))}
            />
            Permite muestra / unidad
          </label>
          <div className="space-y-2">
            <p className="text-sm font-semibold text-brand-base">Segmentos</p>
            {(["empresa", "colegio", "sport", "evento", "otro"] as Segment[]).map((seg) => (
              <label key={seg} className="flex items-center gap-2 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={form.segments.includes(seg)}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      segments: e.target.checked ? [...f.segments, seg] : f.segments.filter((s) => s !== seg)
                    }))
                  }
                />
                {seg}
              </label>
            ))}
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setCreateOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleCreate} disabled={creating}>
              {creating ? "Creando..." : "Crear"}
            </Button>
          </div>
        </div>
      </Modal>
    </main>
  );
}
