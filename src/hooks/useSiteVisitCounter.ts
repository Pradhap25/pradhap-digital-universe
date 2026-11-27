import { useEffect, useState } from 'react';
import {
  fetchPublicVisitCount,
  recordPublicPortfolioVisit,
} from '@/services/visitStatsService';

export type VisitCounterStatus = 'loading' | 'ready' | 'unavailable';

interface UseSiteVisitCounterResult {
  status: VisitCounterStatus;
  totalVisits: number | null;
}

const REFRESH_INTERVAL_MS = 30_000;

/**
 * Tracks a single page-load visit on mount and periodically refreshes the count
 * without incrementing again.
 */
export function useSiteVisitCounter(): UseSiteVisitCounterResult {
  const [state, setState] = useState<UseSiteVisitCounterResult>({
    status: 'loading',
    totalVisits: null,
  });

  useEffect(() => {
    let cancelled = false;

    void recordPublicPortfolioVisit().then((result) => {
      if (cancelled) return;
      if (result.ok && result.totalVisits !== null) {
        setState({ status: 'ready', totalVisits: result.totalVisits });
      } else {
        setState({ status: 'unavailable', totalVisits: null });
      }
    });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (state.status !== 'ready') return;

    let cancelled = false;
    const intervalId = window.setInterval(() => {
      if (document.visibilityState !== 'visible') return;
      void fetchPublicVisitCount().then((latest) => {
        if (!cancelled && latest !== null) {
          setState((prev) =>
            prev.status === 'ready' ? { ...prev, totalVisits: latest } : prev,
          );
        }
      });
    }, REFRESH_INTERVAL_MS);

    return () => {
      cancelled = true;
      window.clearInterval(intervalId);
    };
  }, [state.status]);

  return state;
}
