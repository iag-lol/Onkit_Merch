"use client";

import { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Table, THead, TH, TR, TD } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { loadSalesClient } from "@/lib/dataClient";
import { Sale } from "@/lib/types";

export default function VentasPage() {
  const [periodo, setPeriodo] = useState("mensual");
  const [ventas, setVentas] = useState<Sale[]>([]);

  useEffect(() => {
    loadSalesClient().then(setVentas).catch(console.error);
  }, []);

  const totales = useMemo(
    () =>
      ventas.reduce(
        (acc, v) => {
          acc.neto += v.netAmount;
          acc.iva += v.vat;
          acc.total += v.total;
          return acc;
        },
        { neto: 0, iva: 0, total: 0 }
      ),
    [ventas]
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
              <TD>{new Date(venta.createdAt).toLocaleDateString()}</TD>
              <TD>{venta.customer ?? "-"}</TD>
              <TD className="capitalize">{venta.clientType ?? "-"}</TD>
              <TD>{formatCurrency(venta.netAmount)}</TD>
              <TD>{formatCurrency(venta.vat)}</TD>
              <TD>{formatCurrency(venta.total)}</TD>
            </TR>
          ))}
          {ventas.length === 0 && (
            <TR>
              <TD colSpan={7} className="text-center text-sm text-slate-500">
                No hay ventas registradas.
              </TD>
            </TR>
          )}
        </tbody>
      </Table>
    </main>
  );
}
