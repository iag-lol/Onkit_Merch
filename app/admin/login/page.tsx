"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabaseClient } from "@/lib/supabaseClient";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error" | "sent">("idle");

  const handleLogin = async () => {
    setStatus("loading");
    try {
      const supabase = supabaseClient();
      if (supabase) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        setStatus("sent");
      } else {
        setStatus("sent");
        console.info("Login mock", email);
      }
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  return (
    <main className="container-page py-12">
      <Card className="mx-auto max-w-md space-y-4">
        <div>
          <p className="text-sm uppercase tracking-wide text-brand-accent">Admin</p>
          <h1 className="text-2xl font-semibold text-brand-base">Acceso seguro</h1>
          <p className="text-slate-600">Protegido con Supabase Auth (email + password).</p>
        </div>
        <input
          className="w-full rounded-xl border border-slate-200 px-3 py-2"
          placeholder="Correo admin"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          className="w-full rounded-xl border border-slate-200 px-3 py-2"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button className="w-full" onClick={handleLogin} disabled={status === "loading"}>
          {status === "loading" ? "Ingresando..." : "Ingresar"}
        </Button>
        {status === "sent" && <p className="text-sm text-green-600">Acceso correcto (demo).</p>}
        {status === "error" && <p className="text-sm text-red-500">Error de autenticación.</p>}
      </Card>
    </main>
  );
}
