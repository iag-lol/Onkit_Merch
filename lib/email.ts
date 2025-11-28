export interface EmailPayload {
  to: string;
  subject: string;
  html: string;
}

// Placeholder for connecting SMTP/Outlook. Can be swapped for Supabase function or external provider.
export const sendEmail = async (payload: EmailPayload) => {
  if (!process.env.NEXT_PUBLIC_EMAIL_WEBHOOK) {
    console.info("Email (mock):", payload);
    return;
  }
  await fetch(process.env.NEXT_PUBLIC_EMAIL_WEBHOOK, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
};
