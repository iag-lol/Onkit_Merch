"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const defaults = {
  nombreLegal: "ONKIT MERCH SPA",
  rut: "76.xxx.xxx-x",
  giro: "Merchandising y producción textil",
  direccion: "Santiago, Chile",
  correo: "onkitmerch@outlook.com",
  telefono: "+56 9 8475 2936",
  iva: 19,
  minimo: 10
};

export default function ConfigPage() {
  const [config, setConfig] = useState(defaults);
  const [saved, setSaved] = useState(false);

  const save = () => {
    setSaved(true);
    console.info("Config guardada", config);
  };

  return (
    <main className="space-y-4">
      <div>
        <p className="text-sm uppercase tracking-wide text-brand-accent">Configuración</p>
        <h1 className="text-2xl font-semibold text-brand-base">Parámetros generales</h1>
      </div>

      <Card className="space-y-3">
        <div className="grid gap-3 md:grid-cols-2">
          <input
            className="rounded-xl border border-slate-200 px-3 py-2"
            value={config.nombreLegal}
            onChange={(e) => setConfig((c) => ({ ...c, nombreLegal: e.target.value }))}
            placeholder="Nombre legal"
          />
          <input
            className="rounded-xl border border-slate-200 px-3 py-2"
            value={config.rut}
            onChange={(e) => setConfig((c) => ({ ...c, rut: e.target.value }))}
            placeholder="RUT"
          />
          <input
            className="rounded-xl border border-slate-200 px-3 py-2"
            value={config.giro}
            onChange={(e) => setConfig((c) => ({ ...c, giro: e.target.value }))}
            placeholder="Giro"
          />
          <input
            className="rounded-xl border border-slate-200 px-3 py-2"
            value={config.direccion}
            onChange={(e) => setConfig((c) => ({ ...c, direccion: e.target.value }))}
            placeholder="Dirección"
          />
          <input
            className="rounded-xl border border-slate-200 px-3 py-2"
            value={config.correo}
            onChange={(e) => setConfig((c) => ({ ...c, correo: e.target.value }))}
            placeholder="Correo"
          />
          <input
            className="rounded-xl border border-slate-200 px-3 py-2"
            value={config.telefono}
            onChange={(e) => setConfig((c) => ({ ...c, telefono: e.target.value }))}
            placeholder="Teléfono"
          />
          <input
            type="number"
            className="rounded-xl border border-slate-200 px-3 py-2"
            value={config.iva}
            onChange={(e) => setConfig((c) => ({ ...c, iva: Number(e.target.value) }))}
            placeholder="IVA %"
          />
          <input
            type="number"
            className="rounded-xl border border-slate-200 px-3 py-2"
            value={config.minimo}
            onChange={(e) => setConfig((c) => ({ ...c, minimo: Number(e.target.value) }))}
            placeholder="Mínimo unidades"
          />
        </div>
        <Button onClick={save}>Guardar</Button>
        {saved && <p className="text-sm text-green-600">Configuración guardada (simulada).</p>}
      </Card>
    </main>
  );
}
