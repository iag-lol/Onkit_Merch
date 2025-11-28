"use client";

import { useMemo, useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { calcVat, formatCurrency, normalizeQuantity } from "@/lib/utils";
import { supabaseClient } from "@/lib/supabaseClient";
import { getProducts } from "@/lib/services";
import type { Product } from "@/lib/types";
import { sendEmail } from "@/lib/email";

interface FormState {
  nombre: string;
  email: string;
  telefono: string;
  tipo: string;
  empresa: string;
  notas: string;
}

export default function CotizacionPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<FormState>({
    nombre: "",
    email: "",
    telefono: "",
    tipo: "empresa",
    empresa: "",
    notas: ""
  });
  const [items, setItems] = useState<{ productId: string; quantity: number }[]>([]);
  const [productId, setProductId] = useState<string>("");
  const [quantity, setQuantity] = useState(10);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    async function loadProducts() {
      const data = await getProducts();
      setProducts(data);
      if (data.length > 0) {
        setProductId(data[0].id);
      }
      setLoading(false);
    }
    loadProducts();
  }, []);

  const itemsDetailed = useMemo(
    () =>
      items.map((item) => {
        const product = products.find((p) => p.id === item.productId)!;
        const qty = normalizeQuantity(item.quantity, 10, product?.allowSample);
        return { ...item, product, quantity: qty, lineNet: qty * (product?.basePrice || 0) };
      }),
    [items, products]
  );

  const totals = useMemo(() => {
    const net = itemsDetailed.reduce((acc, line) => acc + line.lineNet, 0);
    return calcVat(net);
  }, [itemsDetailed]);

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!form.nombre.trim()) errors.nombre = "El nombre es requerido";
    if (!form.email.trim()) errors.email = "El email es requerido";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = "Email inválido";
    if (!form.telefono.trim()) errors.telefono = "El teléfono es requerido";
    if (!form.empresa.trim()) errors.empresa = "El nombre de empresa/organización es requerido";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const addLine = () => {
    if (!productId) return;
    const product = products.find(p => p.id === productId);
    if (!product) return;

    setItems((prev) => {
      const exists = prev.find((p) => p.productId === productId);
      const newQty = normalizeQuantity(quantity, 10, product.allowSample);
      if (exists) {
        return prev.map((p) => (p.productId === productId ? { ...p, quantity: p.quantity + newQty } : p));
      }
      return [...prev, { productId, quantity: newQty }];
    });
    setQuantity(10);
  };

  const removeLine = (productId: string) => {
    setItems(prev => prev.filter(item => item.productId !== productId));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (items.length === 0) {
      alert("Agrega al menos un producto a la cotización");
      return;
    }

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
        await sendEmail({
          to: "onkitmerch@outlook.com",
          subject: `Nueva cotización de ${form.empresa}`,
          html: `
            <h2>Nueva cotización</h2>
            <p><strong>Cliente:</strong> ${form.nombre} (${form.tipo})</p>
            <p><strong>Empresa:</strong> ${form.empresa}</p>
            <p><strong>Correo:</strong> ${form.email}</p>
            <p><strong>Teléfono:</strong> ${form.telefono}</p>
            <p><strong>Notas:</strong> ${form.notas || "Sin notas"}</p>
            <h3>Productos</h3>
            <ul>
              ${itemsDetailed
                .map(
                  (line) =>
                    `<li>${line.product.name} - ${line.quantity} uds - ${formatCurrency(
                      line.product.basePrice
                    )} c/u</li>`
                )
                .join("")}
            </ul>
            <p><strong>Neto:</strong> ${formatCurrency(totals.net)}</p>
            <p><strong>IVA:</strong> ${formatCurrency(totals.vat)}</p>
            <p><strong>Total:</strong> ${formatCurrency(totals.total)}</p>
          `
        });
      } else {
        console.info("Payload cotizacion (mock)", payload, itemsDetailed);
      }

      setStatus("sent");
      // Reset form
      setForm({
        nombre: "",
        email: "",
        telefono: "",
        tipo: "empresa",
        empresa: "",
        notas: ""
      });
      setItems([]);
      setFormErrors({});
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  if (loading) {
    return (
      <main className="container-page py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-accent mx-auto"></div>
          <p className="mt-4 text-slate-600">Cargando productos...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="container-page py-12">
      <div className="mb-8">
        <div className="text-center max-w-2xl mx-auto">
          <Badge tone="success" className="mb-4">Respuesta en 24hrs</Badge>
          <h1 className="text-4xl font-bold text-brand-base mb-3">Solicitar Cotización</h1>
          <p className="text-lg text-slate-600">
            Completa el formulario y recibe una cotización detallada. Trabajamos con mínimo 10 unidades por producto.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-3">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Contact Information */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-brand-base mb-4 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Información de Contacto
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Nombre completo <span className="text-red-500">*</span>
                </label>
                <input
                  className={`w-full rounded-xl border ${formErrors.nombre ? 'border-red-300' : 'border-slate-300'} px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-accent focus:border-transparent transition-all`}
                  placeholder="Juan Pérez"
                  value={form.nombre}
                  onChange={(e) => setForm((f) => ({ ...f, nombre: e.target.value }))}
                />
                {formErrors.nombre && <p className="mt-1 text-sm text-red-500">{formErrors.nombre}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  className={`w-full rounded-xl border ${formErrors.email ? 'border-red-300' : 'border-slate-300'} px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-accent focus:border-transparent transition-all`}
                  placeholder="juan@empresa.cl"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                />
                {formErrors.email && <p className="mt-1 text-sm text-red-500">{formErrors.email}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Teléfono / WhatsApp <span className="text-red-500">*</span>
                </label>
                <input
                  className={`w-full rounded-xl border ${formErrors.telefono ? 'border-red-300' : 'border-slate-300'} px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-accent focus:border-transparent transition-all`}
                  placeholder="+56 9 1234 5678"
                  value={form.telefono}
                  onChange={(e) => setForm((f) => ({ ...f, telefono: e.target.value }))}
                />
                {formErrors.telefono && <p className="mt-1 text-sm text-red-500">{formErrors.telefono}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Tipo de cliente <span className="text-red-500">*</span>
                </label>
                <select
                  className="w-full rounded-xl border border-slate-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-accent focus:border-transparent transition-all bg-white"
                  value={form.tipo}
                  onChange={(e) => setForm((f) => ({ ...f, tipo: e.target.value }))}
                >
                  <option value="empresa">Empresa</option>
                  <option value="colegio">Colegio</option>
                  <option value="sport">Sport / Club</option>
                  <option value="evento">Evento</option>
                  <option value="otro">Otro</option>
                </select>
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Nombre de empresa/organización <span className="text-red-500">*</span>
              </label>
              <input
                className={`w-full rounded-xl border ${formErrors.empresa ? 'border-red-300' : 'border-slate-300'} px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-accent focus:border-transparent transition-all`}
                placeholder="Ej: Empresa ABC S.A."
                value={form.empresa}
                onChange={(e) => setForm((f) => ({ ...f, empresa: e.target.value }))}
              />
              {formErrors.empresa && <p className="mt-1 text-sm text-red-500">{formErrors.empresa}</p>}
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Notas adicionales
              </label>
              <textarea
                className="w-full rounded-xl border border-slate-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-accent focus:border-transparent transition-all"
                rows={3}
                placeholder="Detalles especiales, colores, logos, fechas de entrega, etc."
                value={form.notas}
                onChange={(e) => setForm((f) => ({ ...f, notas: e.target.value }))}
              />
            </div>
          </Card>

          {/* Products Selection */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-brand-base mb-4 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              Productos a Cotizar
            </h2>

            <div className="bg-slate-50 rounded-xl p-4 mb-4">
              <div className="flex flex-wrap gap-3 items-end">
                <div className="flex-1 min-w-[200px]">
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Producto</label>
                  <select
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-accent transition-all"
                    value={productId}
                    onChange={(e) => setProductId(e.target.value)}
                  >
                    {products.length === 0 ? (
                      <option>No hay productos disponibles</option>
                    ) : (
                      products.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} - ${p.basePrice.toLocaleString()} ({p.allowSample ? "Muestra disponible" : "Mín. 10u"})
                        </option>
                      ))
                    )}
                  </select>
                </div>
                <div className="w-32">
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Cantidad</label>
                  <input
                    type="number"
                    min={1}
                    className="w-full rounded-xl border border-slate-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-accent transition-all"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                  />
                </div>
                <Button
                  type="button"
                  onClick={addLine}
                  disabled={!productId || products.length === 0}
                  className="px-6 py-2.5"
                >
                  + Agregar
                </Button>
              </div>
            </div>

            {items.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-slate-700 mb-2">Productos agregados:</p>
                {itemsDetailed.map((line) => (
                  <div
                    key={line.productId}
                    className="flex items-center justify-between bg-white border border-slate-200 rounded-xl p-4 hover:shadow-sm transition-shadow"
                  >
                    <div className="flex-1">
                      <p className="font-semibold text-brand-base">{line.product.name}</p>
                      <p className="text-sm text-slate-600">
                        {line.quantity} unidades × {formatCurrency(line.product.basePrice)} = {formatCurrency(line.lineNet)}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeLine(line.productId)}
                      className="ml-4 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Eliminar"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}

            {items.length === 0 && (
              <div className="text-center py-8 text-slate-400">
                <svg className="w-16 h-16 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                <p>No hay productos agregados</p>
              </div>
            )}
          </Card>
        </div>

        {/* Summary Sidebar */}
        <div className="lg:col-span-1">
          <Card className="p-6 sticky top-4">
            <h3 className="text-xl font-bold text-brand-base mb-4">Resumen</h3>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal (sin IVA)</span>
                <span className="font-semibold text-brand-base">{formatCurrency(totals.net)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>IVA 19%</span>
                <span className="font-semibold text-brand-base">{formatCurrency(totals.vat)}</span>
              </div>
              <div className="pt-3 border-t border-slate-200">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-brand-base">Total</span>
                  <span className="text-2xl font-bold text-brand-accent">{formatCurrency(totals.total)}</span>
                </div>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full py-3 text-base font-semibold"
              disabled={status === "sending" || items.length === 0}
            >
              {status === "sending" ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white inline" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Enviando...
                </>
              ) : (
                "Enviar Cotización"
              )}
            </Button>

            {status === "sent" && (
              <div className="mt-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm">
                <div className="flex items-start gap-2">
                  <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p className="font-semibold">¡Cotización enviada!</p>
                    <p className="mt-1">Te contactaremos pronto a tu email.</p>
                  </div>
                </div>
              </div>
            )}

            {status === "error" && (
              <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                <div className="flex items-start gap-2">
                  <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p className="font-semibold">Error al enviar</p>
                    <p className="mt-1">Verifica tu conexión e intenta nuevamente.</p>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-6 pt-6 border-t border-slate-200 text-center text-sm text-slate-500">
              <p className="mb-2">¿Necesitas ayuda?</p>
              <a
                href="mailto:onkitmerch@outlook.com"
                className="text-brand-accent hover:underline font-medium"
              >
                onkitmerch@outlook.com
              </a>
            </div>
          </Card>
        </div>
      </form>
    </main>
  );
}
