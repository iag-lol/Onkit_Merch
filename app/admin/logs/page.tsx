"use client";

import { useMemo } from "react";
import { mockVisits } from "@/lib/mockData";
import { Card } from "@/components/ui/card";
import { Table, THead, TH, TR, TD } from "@/components/ui/table";

export default function LogsPage() {
  const stats = useMemo(() => {
    const byDevice: Record<string, number> = {};
    mockVisits.forEach((v) => {
      byDevice[v.device] = (byDevice[v.device] ?? 0) + 1;
    });
    return byDevice;
  }, []);

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
            {mockVisits.map((visit) => (
              <TR key={visit.id}>
                <TD>{visit.createdAt}</TD>
                <TD>{visit.path}</TD>
                <TD>{visit.userAgent}</TD>
                <TD>{visit.ip}</TD>
                <TD className="capitalize">{visit.device}</TD>
              </TR>
            ))}
          </tbody>
        </Table>
      </Card>
    </main>
  );
}
