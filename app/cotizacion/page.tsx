"use client";

import { useMemo, useState } from "react";
import { mockProducts } from "@/lib/mockData";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { calcVat, formatCurrency, normalizeQuantity } from "@/lib/utils";
import { supabaseClient } from "@/lib/supabaseClient";

interface FormState {
  nombre: string;
  email: string;
  telefono: string;
  tipo: string;
  empresa: string;
  notas: string;
}

export default function CotizacionPage() {
  const [form, setForm] = useState<FormState>({
    nombre: "",
    email: "",
    telefono: "",
    tipo: "empresa",
    empresa: "",
    notas: ""
  });
  const [items, setItems] = useState<{ productId: string; quantity: number }[]>([]);
  const [productId, setProductId] = useState<string>(mockProducts[0]?.id ?? "");
  const [quantity, setQuantity] = useState(10);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const itemsDetailed = useMemo(
    () =>
      items.map((item) => {
        const product = mockProducts.find((p) => p.id === item.productId)!;
        const qty = normalizeQuantity(item.quantity, 10, product.allowSample);
        return { ...item, product, quantity: qty, lineNet: qty * product.basePrice };
      }),
    [items]
  );

  const totals = useMemo(() => {
    const net = itemsDetailed.reduce((acc, line) => acc + line.lineNet, 0);
    return calcVat(net);
  }, [itemsDetailed]);

  const addLine = () => {
    if (!productId) return;
    setItems((prev) => {
      const exists = prev.find((p) => p.productId === productId);
      const newQty = normalizeQuantity(quantity, 10, mockProducts.find((p) => p.id === productId)?.allowSample);
      if (exists) {
        return prev.map((p) => (p.productId === productId ? { ...p, quantity: p.quantity + newQty } : p));
      }
      return [...prev, { productId, quantity: newQty }];
    });
  };

  const handleSubmit = async () => {
    if (items.length === 0) return alert("Agrega al menos un producto");
    setStatus("sending");
    try {
      const supabase = supabaseClient();
      const payload = {
        cliente: form.nombre,
        email: form.email,
        telefono: form.telefono,
        tipo_cliente: form.tipo,
        empresa: form.empresa,
        notas: form.notas,
        monto_neto: totals.net,
        iva: totals.vat,
        total: totals.total,
        estado: "pendiente"
      };

      if (supabase) {
        const { data, error } = await supabase.from("cotizaciones").insert(payload).select().single();
        if (error) throw error;
        await supabase.from("cotizacion_items").insert(
          itemsDetailed.map((item) => ({
            cotizacion_id: data.id,
            producto_id: item.productId,
            nombre: item.product.name,
            cantidad: item.quantity,
            precio_unitario: item.product.basePrice
          }))
        );
      } else {
        console.info("Payload cotizacion (mock)", payload, itemsDetailed);
      }

      setStatus("sent");
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  return (
    <main className="container-page py-12">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-wide text-brand-accent">Solicitar cotización</p>
          <h1 className="text-3xl font-semibold text-brand-base">Detalle preciso para responder en minutos</h1>
          <p className="text-slate-600">Precios base sin IVA. Calculamos IVA 19% automáticamente.</p>
        </div>
        <Badge tone="muted">onkitmerch@outlook.com</Badge>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2 space-y-4">
          <div className="grid gap-3 md:grid-cols-2">
            <input
              className="rounded-xl border border-slate-200 px-3 py-2"
              placeholder="Nombre de contacto"
              value={form.nombre}
              onChange={(e) => setForm((f) => ({ ...f, nombre: e.target.value }))}
            />
            <input
              className="rounded-xl border border-slate-200 px-3 py-2"
              placeholder="Correo"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            />
            <input
              className="rounded-xl border border-slate-200 px-3 py-2"
              placeholder="Teléfono / WhatsApp"
              value={form.telefono}
              onChange={(e) => setForm((f) => ({ ...f, telefono: e.target.value }))}
            />
            <select
              className="rounded-xl border border-slate-200 px-3 py-2"
              value={form.tipo}
              onChange={(e) => setForm((f) => ({ ...f, tipo: e.target.value }))}
            >
              <option value="empresa">Empresa</option>
              <option value="colegio">Colegio</option>
              <option value="sport">Sport</option>
              <option value="evento">Evento</option>
              <option value="otro">Otro</option>
            </select>
          </div>
          <input
            className="rounded-xl border border-slate-200 px-3 py-2"
            placeholder="Nombre de empresa/colegio/club"
            value={form.empresa}
            onChange={(e) => setForm((f) => ({ ...f, empresa: e.target.value }))}
          />
          <textarea
            className="rounded-xl border border-slate-200 px-3 py-2"
            rows={3}
            placeholder="Notas adicionales"
            value={form.notas}
            onChange={(e) => setForm((f) => ({ ...f, notas: e.target.value }))}
          />

          <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
            <p className="text-sm font-semibold text-brand-base">Productos a cotizar</p>
            <div className="mt-3 flex flex-wrap gap-3">
              <select
                className="rounded-xl border border-slate-200 bg-white px-3 py-2"
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
              >
                {mockProducts.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.allowSample ? "muestra 1u" : "min 10u"})
                  </option>
                ))}
              </select>
              <input
                type="number"
                min={1}
                className="w-24 rounded-xl border border-slate-200 px-3 py-2"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
              />
              <Button type="button" onClick={addLine}>
                Agregar
              </Button>
            </div>

            <div className="mt-4 space-y-2">
              {itemsDetailed.map((line) => (
                <div key={line.productId} className="flex items-center justify-between text-sm">
                  <div>
                    <p className="font-semibold text-brand-base">{line.product.name}</p>
                    <p className="text-slate-600">
                      {line.quantity} uds • {formatCurrency(line.product.basePrice)} + IVA
                    </p>
                  </div>
                  <p className="font-semibold">{formatCurrency(line.lineNet)}</p>
                </div>
              ))}
            </div>
          </div>
        </Card>

        <Card className="space-y-3">
          <h3 className="text-lg font-semibold text-brand-base">Resumen</h3>
          <div className="flex justify-between text-sm text-slate-600">
            <span>Subtotal sin IVA</span>
            <span className="font-semibold text-slate-800">{formatCurrency(totals.net)}</span>
          </div>
          <div className="flex justify-between text-sm text-slate-600">
            <span>IVA 19%</span>
            <span className="font-semibold text-slate-800">{formatCurrency(totals.vat)}</span>
          </div>
          <div className="flex justify-between text-base font-semibold text-brand-base">
            <span>Total con IVA</span>
            <span>{formatCurrency(totals.total)}</span>
          </div>
          <Button className="w-full" type="button" onClick={handleSubmit} disabled={status === "sending"}>
            {status === "sending" ? "Enviando..." : "Enviar cotización"}
          </Button>
          {status === "sent" && <p className="text-sm text-green-600">Cotización enviada. Te contactaremos pronto.</p>}
          {status === "error" && <p className="text-sm text-red-500">Error al enviar. Revisa conexión o credenciales Supabase.</p>}
        </Card>
      </div>
    </main>
  );
}
