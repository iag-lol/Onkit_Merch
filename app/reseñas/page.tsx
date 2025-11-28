"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getApprovedReviews } from "@/lib/services";
import { Review } from "@/lib/types";

export default function ReviewsPage() {
  const [form, setForm] = useState({ nombre: "", tipo: "empresa", comentario: "", rating: 5 });
  const [submitted, setSubmitted] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    getApprovedReviews().then(setReviews).catch(console.error);
  }, []);

  const handleSubmit = () => {
    setSubmitted(true);
    console.info("Reseña pendiente", form);
  };

  return (
    <main className="container-page py-12">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-wide text-brand-accent">Reseñas</p>
          <h1 className="text-3xl font-semibold text-brand-base">Testimonios con aprobación</h1>
          <p className="text-slate-600">Las reseñas se guardan como pendientes hasta aprobación en el panel.</p>
        </div>
        <Badge tone="muted">Moderación activa</Badge>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-4">
          {reviews.map((review) => (
            <Card key={review.id}>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-brand-muted" />
                <div>
                  <p className="font-semibold text-brand-base">{review.name}</p>
                  <p className="text-xs uppercase tracking-wide text-slate-500">{review.clientType}</p>
                </div>
                <div className="ml-auto text-yellow-400">
                  {"★".repeat(review.rating)}
                  {"☆".repeat(5 - review.rating)}
                </div>
              </div>
              <p className="mt-3 text-slate-700">{review.comment}</p>
            </Card>
          ))}
          {reviews.length === 0 && <p className="text-slate-600">Aún no hay reseñas aprobadas.</p>}
        </div>
        <Card className="space-y-3">
          <h3 className="text-lg font-semibold text-brand-base">Dejar reseña</h3>
          <input
            className="w-full rounded-xl border border-slate-200 px-3 py-2"
            placeholder="Nombre"
            value={form.nombre}
            onChange={(e) => setForm((f) => ({ ...f, nombre: e.target.value }))}
          />
          <select
            className="w-full rounded-xl border border-slate-200 px-3 py-2"
            value={form.tipo}
            onChange={(e) => setForm((f) => ({ ...f, tipo: e.target.value }))}
          >
            <option value="empresa">Empresa</option>
            <option value="colegio">Colegio</option>
            <option value="sport">Sport</option>
            <option value="evento">Evento</option>
            <option value="otro">Otro</option>
          </select>
          <textarea
            className="w-full rounded-xl border border-slate-200 px-3 py-2"
            rows={3}
            placeholder="Comentario"
            value={form.comentario}
            onChange={(e) => setForm((f) => ({ ...f, comentario: e.target.value }))}
          />
          <label className="text-sm text-slate-600">Rating</label>
          <input
            type="range"
            min={1}
            max={5}
            value={form.rating}
            onChange={(e) => setForm((f) => ({ ...f, rating: Number(e.target.value) }))}
            className="w-full"
          />
          <Button className="w-full" type="button" onClick={handleSubmit}>
            Enviar reseña
          </Button>
          {submitted && <p className="text-sm text-brand-base">Recibido. Aparecerá tras aprobación.</p>}
        </Card>
      </div>
    </main>
  );
}
