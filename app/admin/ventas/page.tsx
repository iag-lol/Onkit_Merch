"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Table, THead, TH, TR, TD } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";

const ventas = [
  { id: "V-100", fecha: "2024-05-02", cliente: "InnovaCorp", tipo: "empresa", neto: 1200000, iva: 228000 },
  { id: "V-101", fecha: "2024-05-12", cliente: "Colegio Andes", tipo: "colegio", neto: 2640000, iva: 501600 },
  { id: "V-102", fecha: "2024-05-18", cliente: "Eventos Chile", tipo: "evento", neto: 900000, iva: 171000 }
];

export default function VentasPage() {
  const [periodo, setPeriodo] = useState("mensual");
  const totales = ventas.reduce(
    (acc, v) => {
      acc.neto += v.neto;
      acc.iva += v.iva;
      acc.total += v.neto + v.iva;
      return acc;
    },
    { neto: 0, iva: 0, total: 0 }
  );

  return (
    <main className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm uppercase tracking-wide text-brand-accent">Ventas</p>
          <h1 className="text-2xl font-semibold text-brand-base">Resumen tipo SII</h1>
        </div>
        <div className="flex gap-2">
          <select
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
            value={periodo}
            onChange={(e) => setPeriodo(e.target.value)}
          >
            <option value="mensual">Mensual</option>
            <option value="trimestral">Trimestral</option>
            <option value="anual">Anual</option>
          </select>
          <Button variant="secondary">Descargar CSV</Button>
          <Button>Descargar PDF</Button>
        </div>
      </div>

      <Card>
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="rounded-2xl bg-white p-3 shadow-sm">
            <p className="text-slate-500">Total neto</p>
            <p className="text-xl font-semibold text-brand-base">{formatCurrency(totales.neto)}</p>
          </div>
          <div className="rounded-2xl bg-white p-3 shadow-sm">
            <p className="text-slate-500">IVA</p>
            <p className="text-xl font-semibold text-brand-base">{formatCurrency(totales.iva)}</p>
          </div>
          <div className="rounded-2xl bg-white p-3 shadow-sm">
            <p className="text-slate-500">Total</p>
            <p className="text-xl font-semibold text-brand-base">{formatCurrency(totales.total)}</p>
          </div>
        </div>
      </Card>

      <Table>
        <THead>
          <TH>ID</TH>
          <TH>Fecha</TH>
          <TH>Cliente</TH>
          <TH>Tipo</TH>
          <TH>Neto</TH>
          <TH>IVA</TH>
          <TH>Total</TH>
        </THead>
        <tbody>
          {ventas.map((venta) => (
            <TR key={venta.id}>
              <TD>{venta.id}</TD>
              <TD>{venta.fecha}</TD>
              <TD>{venta.cliente}</TD>
              <TD className="capitalize">{venta.tipo}</TD>
              <TD>{formatCurrency(venta.neto)}</TD>
              <TD>{formatCurrency(venta.iva)}</TD>
              <TD>{formatCurrency(venta.neto + venta.iva)}</TD>
            </TR>
          ))}
        </tbody>
      </Table>
    </main>
  );
}
