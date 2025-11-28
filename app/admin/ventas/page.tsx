"use client";

import { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Table, THead, TH, TR, TD } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { loadSalesClient } from "@/lib/dataClient";
import jsPDF from "jspdf";
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

  const filtered = useMemo(() => {
    const now = new Date();
    return ventas.filter((v) => {
      const d = new Date(v.createdAt);
      if (periodo === "mensual") return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
      if (periodo === "trimestral") {
        const currentQuarter = Math.floor(now.getMonth() / 3);
        const saleQuarter = Math.floor(d.getMonth() / 3);
        return saleQuarter === currentQuarter && d.getFullYear() === now.getFullYear();
      }
      if (periodo === "anual") return d.getFullYear() === now.getFullYear();
      return true;
    });
  }, [periodo, ventas]);

  const exportCsv = () => {
    const header = "ID,Fecha,Cliente,Tipo,Neto,IVA,Total\n";
    const rows = filtered
      .map(
        (v) =>
          `${v.id},"${new Date(v.createdAt).toLocaleDateString()}","${v.customer ?? ""}",${v.clientType ?? ""},${v.netAmount},${v.vat},${v.total}`
      )
      .join("\n");
    const blob = new Blob([header + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "ventas.csv";
    link.click();
  };

  const exportPdf = () => {
    const doc = new jsPDF();
    doc.text("Ventas ONKIT MERCH", 14, 16);
    // @ts-ignore
    doc.autoTable({
      head: [["ID", "Fecha", "Cliente", "Tipo", "Neto", "IVA", "Total"]],
      body: filtered.map((v) => [
        v.id,
        new Date(v.createdAt).toLocaleDateString(),
        v.customer ?? "",
        v.clientType ?? "",
        v.netAmount,
        v.vat,
        v.total
      ]),
      startY: 22
    });
    doc.save("ventas.pdf");
  };

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
          <Button variant="secondary" onClick={exportCsv}>
            Descargar CSV
          </Button>
          <Button onClick={exportPdf}>Descargar PDF</Button>
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
          {filtered.map((venta) => (
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
          {filtered.length === 0 && (
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
