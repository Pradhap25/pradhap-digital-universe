export interface SupabaseEnvConfig {
  url: string;
  anonKey: string;
}

function sanitizeEnvValue(raw: string | undefined): string {
  return (raw ?? '').trim().replace(/^['"]|['"]$/g, '').trim();
}

export function getSupabaseEnv(): SupabaseEnvConfig | null {
  const url = sanitizeEnvValue(import.meta.env.VITE_SUPABASE_URL).replace(/\/+$/, '');
  const anonKey = sanitizeEnvValue(import.meta.env.VITE_SUPABASE_ANON_KEY);

  if (!url || !anonKey) {
    return null;
  }

  try {
    const parsed = new URL(url);
    if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
      return null;
    }
  } catch {
    return null;
  }

  return { url, anonKey };
}

export function isSupabaseConfigured(): boolean {
  return getSupabaseEnv() !== null;
}
