import { createClient as createSupabaseClient } from '@supabase/supabase-js';

/**
 * Service-role client for privileged server-only operations
 * (e.g. writing orders from a public checkout action).
 * NEVER import this into client components.
 */
export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );
}
