"use client";

import { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Table, THead, TH, TR, TD } from "@/components/ui/table";
import { loadVisitsClient } from "@/lib/dataClient";
import { VisitLog } from "@/lib/types";

export default function LogsPage() {
  const [visits, setVisits] = useState<VisitLog[]>([]);

  useEffect(() => {
    loadVisitsClient().then(setVisits).catch(console.error);
  }, []);

  const stats = useMemo(() => {
    const byDevice: Record<string, number> = {};
    visits.forEach((v) => {
      byDevice[v.device] = (byDevice[v.device] ?? 0) + 1;
    });
    return byDevice;
  }, [visits]);

  return (
    <main className="space-y-4">
      <div>
        <p className="text-sm uppercase tracking-wide text-brand-accent">Conexiones / Logs</p>
        <h1 className="text-2xl font-semibold text-brand-base">Visitas registradas</h1>
        <p className="text-slate-600">Captura IP, user agent y página visitada (registro discreto).</p>
      </div>

      <Card title="Estadísticas rápidas">
        <div className="flex gap-4">
          {Object.entries(stats).map(([device, count]) => (
            <div key={device} className="rounded-2xl bg-white p-3 shadow-sm">
              <p className="text-xs uppercase text-slate-500">{device}</p>
              <p className="text-xl font-semibold text-brand-base">{count}</p>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <Table>
          <THead>
            <TH>Fecha</TH>
            <TH>Path</TH>
            <TH>User Agent</TH>
            <TH>IP</TH>
            <TH>Device</TH>
          </THead>
          <tbody>
            {visits.map((visit) => (
              <TR key={visit.id}>
                <TD>{visit.createdAt}</TD>
                <TD>{visit.path}</TD>
                <TD>{visit.userAgent}</TD>
                <TD>{visit.ip}</TD>
                <TD className="capitalize">{visit.device}</TD>
              </TR>
            ))}
            {visits.length === 0 && (
              <TR>
                <TD colSpan={5} className="text-center text-sm text-slate-500">
                  Sin visitas registradas.
                </TD>
              </TR>
            )}
          </tbody>
        </Table>
      </Card>
    </main>
  );
}
