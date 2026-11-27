import { useCallback, useEffect, useState } from 'react';
import { portfolioRepository } from '@/services/portfolioRepository';
import { portfolioSeedData } from '@/services/seedData';
import type { PortfolioData } from '@/types/portfolio';

interface UsePortfolioDataResult {
  data: PortfolioData;
  isLoading: boolean;
  error: string | null;
}

export function usePortfolioData(): UsePortfolioDataResult {
  const [data, setData] = useState<PortfolioData>(portfolioSeedData);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPublic = useCallback(async () => {
    try {
      const result = await portfolioRepository.getPublicPortfolio();
      setData(result);
      setError(null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unable to load portfolio data');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchPublic();
    return portfolioRepository.subscribe(() => {
      void fetchPublic();
    });
  }, [fetchPublic]);

  return { data, isLoading, error };
}
