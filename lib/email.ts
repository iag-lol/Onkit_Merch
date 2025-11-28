export interface EmailPayload {
  to: string;
  subject: string;
  html: string;
}

// Placeholder for connecting SMTP/Outlook. Can be swapped for Supabase function or external provider.
export const sendEmail = async (payload: EmailPayload) => {
  const endpoint = process.env.NEXT_PUBLIC_EMAIL_WEBHOOK || "/api/email";
  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      console.error("Email endpoint failed", await res.text());
    }
  } catch (err) {
    console.error("Email send error", err);
  }
};
