"use client";

import { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Table, THead, TH, TR, TD } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { loadProductsClient, loadInventoryMovementsClient } from "@/lib/dataClient";
import { Product, InventoryMovement } from "@/lib/types";

export default function InventarioPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [movimientos, setMovimientos] = useState<InventoryMovement[]>([]);

  useEffect(() => {
    loadProductsClient().then(setProducts).catch(console.error);
    loadInventoryMovementsClient().then(setMovimientos).catch(console.error);
  }, []);

  const movementsWithName = useMemo(
    () =>
      movimientos.map((m) => ({
        ...m,
        nombre: products.find((p) => p.id === m.productId)?.name || m.productId
      })),
    [movimientos, products]
  );

  return (
    <main className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-wide text-brand-accent">Inventario</p>
          <h1 className="text-2xl font-semibold text-brand-base">Stock y movimientos</h1>
        </div>
        <Button>Registrar movimiento</Button>
      </div>

      <Card title="Stock actual">
        <Table>
          <THead>
            <TH>Producto</TH>
            <TH>Stock</TH>
            <TH>Permite muestra</TH>
          </THead>
          <tbody>
            {products.map((p) => (
              <TR key={p.id}>
                <TD>
                  <p className="font-semibold text-brand-base">{p.name}</p>
                  <p className="text-xs text-slate-500">{p.category}</p>
                </TD>
                <TD>{p.stock}</TD>
                <TD>{p.allowSample ? "Sí" : "No"}</TD>
              </TR>
            ))}
            {products.length === 0 && (
              <TR>
                <TD colSpan={3} className="text-center text-sm text-slate-500">
                  Sin productos cargados.
                </TD>
              </TR>
            )}
          </tbody>
        </Table>
      </Card>

      <Card title="Movimientos">
        <Table>
          <THead>
            <TH>ID</TH>
            <TH>Producto</TH>
            <TH>Tipo</TH>
            <TH>Cantidad</TH>
            <TH>Fecha</TH>
          </THead>
          <tbody>
            {movementsWithName.map((m) => (
              <TR key={m.id}>
                <TD>{m.id}</TD>
                <TD>{m.nombre}</TD>
                <TD className="capitalize">{m.type}</TD>
                <TD>{m.quantity}</TD>
                <TD>{new Date(m.createdAt).toLocaleDateString()}</TD>
              </TR>
            ))}
            {movementsWithName.length === 0 && (
              <TR>
                <TD colSpan={5} className="text-center text-sm text-slate-500">
                  No hay movimientos registrados.
                </TD>
              </TR>
            )}
          </tbody>
        </Table>
      </Card>
    </main>
  );
}
