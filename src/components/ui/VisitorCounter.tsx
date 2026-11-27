import { motion } from 'framer-motion';
import { Eye } from 'lucide-react';
import { useReducedMotionPref } from '@/hooks/useReducedMotionPref';
import { useSiteVisitCounter } from '@/hooks/useSiteVisitCounter';

const NUMBER_FORMATTER = new Intl.NumberFormat('en-US');

export function VisitorCounter() {
  const { status, totalVisits } = useSiteVisitCounter();
  const reducedMotion = useReducedMotionPref();

  // Fail gracefully without affecting the portfolio when backend stats are unreachable
  if (status === 'unavailable') {
    return null;
  }

  return (
    <div className="pointer-events-none fixed inset-x-0 top-[4.75rem] z-30 px-4 sm:top-[5.15rem] sm:px-6">
      <div className="mx-auto flex max-w-7xl justify-end">
        <motion.aside
          aria-label="Total website visits"
          aria-live="polite"
          initial={reducedMotion ? false : { opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="pointer-events-auto inline-flex items-center gap-1.5 rounded-full border border-cyan-400/22 bg-[#050a1b]/75 px-3 py-1 font-mono text-[11px] tracking-wide text-slate-200 shadow-[0_10px_28px_-10px_rgba(2,6,23,0.9),0_0_20px_-8px_rgba(34,211,238,0.28)] backdrop-blur-xl sm:gap-2 sm:px-3.5 sm:py-1.5 sm:text-xs"
        >
          <Eye className="h-3.5 w-3.5 shrink-0 text-cyan-400" aria-hidden="true" />
          <span className="text-slate-400">Total Visits:</span>
          {status === 'loading' || totalVisits === null ? (
            <span
              className="inline-block h-3 w-10 animate-pulse rounded bg-cyan-400/20 motion-reduce:animate-none"
              aria-label="Loading visit count"
            />
          ) : (
            <span className="font-semibold tabular-nums text-cyan-300">
              {NUMBER_FORMATTER.format(totalVisits)}
            </span>
          )}
        </motion.aside>
      </div>
    </div>
  );
}
