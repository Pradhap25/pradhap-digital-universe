import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';
import { getSupabaseEnv } from './env';

let cachedClient: SupabaseClient<Database> | null = null;

/**
 * Returns a typed Supabase client when environment variables are configured,
 * or null during Phase 1–3 local-seed operation.
 */
export function getSupabaseClient(): SupabaseClient<Database> | null {
  if (cachedClient) {
    return cachedClient;
  }

  const env = getSupabaseEnv();
  if (!env) {
    return null;
  }

  cachedClient = createClient<Database>(env.url, env.anonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  });

  return cachedClient;
}
