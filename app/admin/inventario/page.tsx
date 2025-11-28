"use client";

import { Card } from "@/components/ui/card";
import { Table, THead, TH, TR, TD } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { mockProducts } from "@/lib/mockData";

const movimientos = [
  { id: "M1", producto: "Kit Ejecutivo Premium", tipo: "entrada", cantidad: 50, fecha: "2024-05-10" },
  { id: "M2", producto: "Kit Escolar Completo", tipo: "salida", cantidad: 30, fecha: "2024-05-12" },
  { id: "M3", producto: "Kit Evento Corporativo", tipo: "ajuste", cantidad: 10, fecha: "2024-05-14" }
];

export default function InventarioPage() {
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
            {mockProducts.map((p) => (
              <TR key={p.id}>
                <TD>
                  <p className="font-semibold text-brand-base">{p.name}</p>
                  <p className="text-xs text-slate-500">{p.category}</p>
                </TD>
                <TD>{p.stock}</TD>
                <TD>{p.allowSample ? "Sí" : "No"}</TD>
              </TR>
            ))}
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
            {movimientos.map((m) => (
              <TR key={m.id}>
                <TD>{m.id}</TD>
                <TD>{m.producto}</TD>
                <TD className="capitalize">{m.tipo}</TD>
                <TD>{m.cantidad}</TD>
                <TD>{m.fecha}</TD>
              </TR>
            ))}
          </tbody>
        </Table>
      </Card>
    </main>
  );
}
