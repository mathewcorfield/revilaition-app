import { createClient } from '@supabase/supabase-js'

// These variables must be defined in .env files
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey  = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey ) {
  throw new Error("Missing Supabase environment variables.")
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey )

supabase.auth.onAuthStateChange((event, session) => {
  console.log("[Supabase] Auth event:", event);
  console.log("[Supabase] Session:", session);
});
