"use client";

import { useState } from "react";
import { mockReviews } from "@/lib/mockData";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Table, THead, TH, TR, TD } from "@/components/ui/table";

export default function ResenasPage() {
  const [reviews, setReviews] = useState(mockReviews);

  const updateStatus = (id: string, status: "aprobada" | "rechazada") => {
    setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
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
          </tbody>
        </Table>
      </Card>
    </main>
  );
}
