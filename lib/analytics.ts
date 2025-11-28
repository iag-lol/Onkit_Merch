export const logVisit = async (path: string) => {
  // This runs client-side to avoid blocking SSR. If Supabase creds exist, insert quietly.
  if (typeof window === "undefined") return;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    console.debug("Visit log (mock)", path);
    return;
  }
  const body = {
    path,
    user_agent: navigator.userAgent,
    device: /Mobi|Android/.test(navigator.userAgent) ? "mobile" : "desktop"
  };
  try {
    await fetch(`${url}/rest/v1/visitas`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: key,
        Authorization: `Bearer ${key}`,
        Prefer: "return=minimal"
      },
      body: JSON.stringify(body)
    });
  } catch (err) {
    console.error("logVisit failed", err);
  }
};
