import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';
import { getSupabaseEnv } from './env';

let cachedClient: SupabaseClient<Database> | null = null;

/**
 * Returns a typed Supabase client when environment variables are valid,
 * or null during local preview operation.
 */
export function getSupabaseClient(): SupabaseClient<Database> | null {
  if (cachedClient) {
    return cachedClient;
  }

  const env = getSupabaseEnv();
  if (!env) {
    return null;
  }

  try {
    cachedClient = createClient<Database>(env.url, env.anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });
    return cachedClient;
  } catch {
    return null;
  }
}
