"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ nombre: "", email: "", mensaje: "" });

  return (
    <main className="container-page py-12">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-wide text-brand-accent">Contacto</p>
          <h1 className="text-3xl font-semibold text-brand-base">Hablemos de tu próximo kit</h1>
          <p className="text-slate-600">Correo, WhatsApp y redes listos para coordinar.</p>
        </div>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <Card className="space-y-3">
          <input
            className="rounded-xl border border-slate-200 px-3 py-2"
            placeholder="Nombre"
            value={form.nombre}
            onChange={(e) => setForm((f) => ({ ...f, nombre: e.target.value }))}
          />
          <input
            className="rounded-xl border border-slate-200 px-3 py-2"
            placeholder="Correo"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
          />
          <textarea
            className="rounded-xl border border-slate-200 px-3 py-2"
            rows={4}
            placeholder="Cuéntanos tu necesidad"
            value={form.mensaje}
            onChange={(e) => setForm((f) => ({ ...f, mensaje: e.target.value }))}
          />
          <Button type="button" onClick={() => setSent(true)}>
            Enviar
          </Button>
          {sent && <p className="text-sm text-green-600">Recibido. Te contactaremos.</p>}
        </Card>

        <Card className="space-y-2">
          <h3 className="text-lg font-semibold text-brand-base">Datos de contacto</h3>
          <p className="text-slate-700">Correo: onkitmerch@outlook.com</p>
          <p className="text-slate-700">
            WhatsApp: <a href="https://wa.me/56984752936">+56 9 8475 2936</a>
          </p>
          <p className="text-slate-700">Redes sociales: LinkedIn / Instagram (placeholder)</p>
          <p className="text-slate-700">Dirección: (definir)</p>
        </Card>
      </div>
    </main>
  );
}
