import { createClient } from "@supabase/supabase-js";

// Reads Supabase env vars from Next runtime.
export const supabaseClient = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    console.warn("Supabase env vars missing - using fallback mock mode.");
    return null;
  }

  return createClient(url, key, {
    auth: { autoRefreshToken: true, persistSession: true }
  });
};

// Helper to guard server components that rely on Supabase.
export const requireSupabase = () => {
  const client = supabaseClient();
  if (!client) {
    throw new Error("Supabase configuration is missing.");
  }
  return client;
};
