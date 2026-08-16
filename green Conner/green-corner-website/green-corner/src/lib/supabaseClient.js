import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// The site works fully on demo data even before Supabase is connected.
// Once VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set (see .env.example),
// the admin dashboard and public pages automatically switch to live data.
export const isSupabaseConfigured = Boolean(url && anonKey);

export const supabase = isSupabaseConfigured
  ? createClient(url, anonKey)
  : null;
