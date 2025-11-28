"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Table, THead, TH, TR, TD } from "@/components/ui/table";
import { loadReviewsClient, updateReviewStatus } from "@/lib/dataClient";
import { Review } from "@/lib/types";

export default function ResenasPage() {
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    loadReviewsClient(false).then(setReviews).catch(console.error);
  }, []);

  const updateStatus = (id: string, status: "aprobada" | "rechazada") => {
    updateReviewStatus(id, status)
      .then(() => setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r))))
      .catch(console.error);
  };

  return (
    <main className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-wide text-brand-accent">Reseñas</p>
          <h1 className="text-2xl font-semibold text-brand-base">Moderación</h1>
        </div>
      </div>

      <Card>
        <Table>
          <THead>
            <TH>Cliente</TH>
            <TH>Tipo</TH>
            <TH>Rating</TH>
            <TH>Comentario</TH>
            <TH>Estado</TH>
            <TH></TH>
          </THead>
          <tbody>
            {reviews.map((review) => (
              <TR key={review.id}>
                <TD className="font-semibold text-brand-base">{review.name}</TD>
                <TD className="capitalize">{review.clientType}</TD>
                <TD>{"★".repeat(review.rating)}</TD>
                <TD>{review.comment}</TD>
                <TD className="capitalize">{review.status}</TD>
                <TD>
                  <div className="flex gap-2">
                    <Button variant="secondary" onClick={() => updateStatus(review.id, "aprobada")}>
                      Aprobar
                    </Button>
                    <Button variant="ghost" onClick={() => updateStatus(review.id, "rechazada")}>
                      Rechazar
                    </Button>
                  </div>
                </TD>
              </TR>
            ))}
            {reviews.length === 0 && (
              <TR>
                <TD colSpan={6} className="text-center text-sm text-slate-500">
                  No hay reseñas registradas.
                </TD>
              </TR>
            )}
          </tbody>
        </Table>
      </Card>
    </main>
  );
}
