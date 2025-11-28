import { createClient } from "@supabase/supabase-js";

// Server-side client (can use service role). Keep keys in server env, not exposed to browser.
export const supabaseServer = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    throw new Error("Faltan variables de entorno de Supabase en el servidor.");
  }
  return createClient(url, key);
};
