import { useEffect, useState } from 'react';
import type { PortfolioSectionId } from '@/types/portfolio';

export function useActiveSection(sectionIds: readonly PortfolioSectionId[]): PortfolioSectionId {
  const [activeId, setActiveId] = useState<PortfolioSectionId>(sectionIds[0] ?? 'identity');

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined;
    }

    let rafId = 0;

    const updateFromScroll = () => {
      rafId = 0;
      const viewportCenter = window.innerHeight * 0.42;
      let bestId: PortfolioSectionId = sectionIds[0] ?? 'identity';
      let bestDistance = Number.POSITIVE_INFINITY;

      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (!el) continue;

        const rect = el.getBoundingClientRect();
        if (rect.top <= viewportCenter && rect.bottom >= viewportCenter) {
          bestId = id;
          bestDistance = 0;
          break;
        }

        const sectionCenter = rect.top + rect.height / 2;
        const distance = Math.abs(sectionCenter - viewportCenter);
        if (distance < bestDistance) {
          bestDistance = distance;
          bestId = id;
        }
      }

      setActiveId(bestId);
    };

    const handleScroll = () => {
      if (!rafId) {
        rafId = window.requestAnimationFrame(updateFromScroll);
      }
    };

    updateFromScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });

    return () => {
      if (rafId) {
        window.cancelAnimationFrame(rafId);
      }
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [sectionIds]);

  return activeId;
}
