import { NextResponse } from "next/server";

// Simple proxy to Resend API (gratis hasta 100 emails/mes con la clave onboarding).
export async function POST(req: Request) {
  try {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "RESEND_API_KEY no configurada" }, { status: 500 });
    }

    const { to, subject, html } = await req.json();
    if (!to || !subject || !html) {
      return NextResponse.json({ error: "Faltan campos to/subject/html" }, { status: 400 });
    }

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: "onboarding@resend.dev",
        to,
        subject,
        html
      })
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("Error Resend:", text);
      return NextResponse.json({ error: "Fallo al enviar correo" }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
