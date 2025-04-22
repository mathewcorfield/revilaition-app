import { createClient } from '@supabase/supabase-js'

// These variables must be defined in .env files
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL!
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables.")
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
