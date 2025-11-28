"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Table, THead, TH, TR, TD } from "@/components/ui/table";
import { Modal } from "@/components/ui/modal";
import { formatCurrency } from "@/lib/utils";
import { generateQuotePdf } from "@/lib/pdf";
import { Quote } from "@/lib/types";
import { convertQuoteToSale, loadQuotesClient } from "@/lib/dataClient";

export default function CotizacionesAdmin() {
  const [selected, setSelected] = useState<Quote | null>(null);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [convertingId, setConvertingId] = useState<string | null>(null);

  useEffect(() => {
    loadQuotesClient().then(setQuotes).catch(console.error);
  }, []);

  return (
    <main className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-wide text-brand-accent">Cotizaciones</p>
          <h1 className="text-2xl font-semibold text-brand-base">Seguimiento y conversión</h1>
        </div>
        <Button>Crear cotización manual</Button>
      </div>

      <Card>
        <Table>
          <THead>
            <TH>ID</TH>
            <TH>Cliente</TH>
            <TH>Tipo</TH>
            <TH>Monto neto</TH>
            <TH>Estado</TH>
            <TH></TH>
          </THead>
          <tbody>
            {quotes.map((quote) => (
              <TR key={quote.id}>
                <TD>{quote.id}</TD>
                <TD>
                  <p className="font-semibold text-brand-base">{quote.customerName}</p>
                  <p className="text-xs text-slate-500">{quote.company}</p>
                </TD>
                <TD className="capitalize">{quote.clientType}</TD>
                <TD>{formatCurrency(quote.netAmount)}</TD>
                <TD className="capitalize">{quote.status}</TD>
                <TD>
                  <div className="flex gap-2">
                    <Button variant="secondary" onClick={() => setSelected(quote)}>
                      Ver
                    </Button>
                    <Button
                      variant="ghost"
                      disabled={convertingId === quote.id}
                      onClick={async () => {
                        setConvertingId(quote.id);
                        try {
                          await convertQuoteToSale(quote);
                          setQuotes((prev) =>
                            prev.map((q) => (q.id === quote.id ? { ...q, status: "venta" } : q))
                          );
                        } catch (err) {
                          console.error(err);
                          alert("No se pudo convertir la cotización en venta.");
                        } finally {
                          setConvertingId(null);
                        }
                      }}
                    >
                      {convertingId === quote.id ? "Convirtiendo..." : "Convertir en venta"}
                    </Button>
                  </div>
                </TD>
              </TR>
            ))}
            {quotes.length === 0 && (
              <TR>
                <TD colSpan={6} className="text-center text-sm text-slate-500">
                  No hay cotizaciones registradas.
                </TD>
              </TR>
            )}
          </tbody>
        </Table>
      </Card>

      <Modal open={!!selected} title={`Cotización ${selected?.id ?? ""}`} onClose={() => setSelected(null)}>
        {selected && (
          <div className="space-y-3 text-sm">
            <div className="grid grid-cols-2 gap-2">
              <p><strong>Cliente:</strong> {selected.customerName}</p>
              <p><strong>Empresa:</strong> {selected.company}</p>
              <p><strong>Correo:</strong> {selected.email}</p>
              <p><strong>Teléfono:</strong> {selected.phone}</p>
            </div>
            <div className="rounded-xl border border-slate-100 p-3">
              {selected.items.map((item) => (
                <div key={item.productId} className="flex justify-between">
                  <span>
                    {item.name} x {item.quantity}
                  </span>
                  <span>{formatCurrency(item.unitPrice * item.quantity)}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between">
              <span>Neto</span>
              <span>{formatCurrency(selected.netAmount)}</span>
            </div>
            <div className="flex justify-between">
              <span>IVA 19%</span>
              <span>{formatCurrency(selected.vat)}</span>
            </div>
            <div className="flex justify-between font-semibold text-brand-base">
              <span>Total</span>
              <span>{formatCurrency(selected.total)}</span>
            </div>
            <div className="flex justify-end gap-3 pt-3">
              <Button variant="secondary" onClick={() => generateQuotePdf(selected)}>
                Descargar PDF
              </Button>
              <Button>Convertir en venta</Button>
            </div>
          </div>
        )}
      </Modal>
    </main>
  );
}
