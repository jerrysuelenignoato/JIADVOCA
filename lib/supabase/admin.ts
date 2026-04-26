import { createClient } from "@supabase/supabase-js";

// cliente com service role — ignora RLS, usar SOMENTE em server-side seguro
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}
