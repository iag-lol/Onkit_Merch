"use client";

import { useCart } from "@/context/cart";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

export default function CartPage() {
  const { items, updateQuantity, removeItem, totals } = useCart();

  return (
    <main className="container-page py-12">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-wide text-brand-accent">Carrito B2B</p>
          <h1 className="text-3xl font-semibold text-brand-base">Control de pedido y cotización</h1>
          <p className="text-slate-600">Mínimo 10 unidades por producto (muestras 1u). Precios sin IVA.</p>
        </div>
        <div className="flex gap-3">
          <Button href="/cotizacion">Convertir a cotización</Button>
          <Button variant="secondary">Comprar ahora</Button>
        </div>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2 space-y-4">
          {items.length === 0 && <p className="text-slate-600">Aún no agregas productos.</p>}
          {items.map((line) => (
            <div key={line.product.id} className="flex flex-col gap-2 border-b border-slate-100 pb-4 md:flex-row md:items-center">
              <div className="flex-1">
                <p className="text-lg font-semibold text-brand-base">{line.product.name}</p>
                <p className="text-sm text-slate-600">{line.product.description}</p>
                <p className="text-sm text-brand-accent font-semibold">
                  {formatCurrency(line.product.basePrice)} + IVA • mínimo {line.product.allowSample ? 1 : 10}u
                </p>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={line.product.allowSample ? 1 : 10}
                  value={line.quantity}
                  onChange={(e) => updateQuantity(line.product.id, Number(e.target.value))}
                  className="w-24 rounded-xl border border-slate-200 px-3 py-2"
                />
                <p className="w-28 text-right text-sm font-semibold">
                  {formatCurrency(line.product.basePrice * line.quantity)}
                </p>
                <button onClick={() => removeItem(line.product.id)} className="text-sm text-red-500">
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </Card>

        <Card className="space-y-3">
          <h3 className="text-lg font-semibold text-brand-base">Resumen</h3>
          <div className="flex justify-between text-sm text-slate-600">
            <span>Subtotal sin IVA</span>
            <span className="font-semibold text-slate-800">{formatCurrency(totals.net)}</span>
          </div>
          <div className="flex justify-between text-sm text-slate-600">
            <span>IVA (19%)</span>
            <span className="font-semibold text-slate-800">{formatCurrency(totals.vat)}</span>
          </div>
          <div className="flex justify-between text-base font-semibold text-brand-base">
            <span>Total con IVA</span>
            <span>{formatCurrency(totals.total)}</span>
          </div>
          <Button href="/cotizacion" className="w-full">
            Solicitar cotización
          </Button>
          <Button variant="secondary" className="w-full">
            Comprar ahora
          </Button>
        </Card>
      </div>
    </main>
  );
}
