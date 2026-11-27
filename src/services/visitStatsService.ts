import { getSupabaseClient } from '@/integrations/supabase/client';

const LOCAL_VISITS_STORAGE_KEY = 'pdu_local_total_visits_v1';

export interface VisitRecordResult {
  ok: boolean;
  totalVisits: number | null;
}

/**
 * Module-scoped single-flight promise for the current JS page load.
 * Resets automatically on full page open/reload, while ensuring React StrictMode,
 * component re-renders, or re-mounts never emit duplicate increments.
 */
let pageLoadVisitPromise: Promise<VisitRecordResult> | null = null;

function readLocalVisits(): number {
  try {
    const raw = localStorage.getItem(LOCAL_VISITS_STORAGE_KEY);
    if (!raw) return 0;
    const parsed = Number.parseInt(raw, 10);
    return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
  } catch {
    return 0;
  }
}

function writeLocalVisits(count: number): number {
  try {
    localStorage.setItem(LOCAL_VISITS_STORAGE_KEY, String(count));
  } catch {
    // Ignore storage quota/privacy mode failures
  }
  return count;
}

function extractVisitCount(data: unknown): number | null {
  const row = Array.isArray(data) ? data[0] : data;
  if (!row || typeof row !== 'object') {
    return null;
  }
  const value = (row as { total_visits?: unknown }).total_visits;
  if (typeof value === 'number' && Number.isFinite(value) && value >= 0) {
    return Math.trunc(value);
  }
  return null;
}

async function performVisitIncrement(): Promise<VisitRecordResult> {
  const supabase = getSupabaseClient();

  if (!supabase) {
    const nextCount = writeLocalVisits(readLocalVisits() + 1);
    return { ok: true, totalVisits: nextCount };
  }

  try {
    const { data, error } = await supabase.rpc('increment_site_visits');
    if (error) {
      return { ok: false, totalVisits: null };
    }

    const totalVisits = extractVisitCount(data);
    if (totalVisits === null) {
      return { ok: false, totalVisits: null };
    }

    return { ok: true, totalVisits };
  } catch {
    return { ok: false, totalVisits: null };
  }
}

/**
 * Records a single visit for the current public page load and returns the updated total.
 * Safe under React StrictMode and multiple renders.
 */
export function recordPublicPortfolioVisit(): Promise<VisitRecordResult> {
  if (!pageLoadVisitPromise) {
    pageLoadVisitPromise = performVisitIncrement();
  }
  return pageLoadVisitPromise;
}

/**
 * Reads the latest visit count without incrementing it (used for periodic UI refresh).
 */
export async function fetchPublicVisitCount(): Promise<number | null> {
  const supabase = getSupabaseClient();

  if (!supabase) {
    return readLocalVisits();
  }

  try {
    const { data, error } = await supabase
      .from('site_stats')
      .select('total_visits')
      .eq('id', 'primary')
      .maybeSingle();

    if (error) {
      return null;
    }

    return extractVisitCount(data);
  } catch {
    return null;
  }
}
