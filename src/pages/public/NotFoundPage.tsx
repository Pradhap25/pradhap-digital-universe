import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PageShell } from '@/components/layout/PageShell';
import { GlassCard } from '@/components/ui/GlassCard';

export function NotFoundPage() {
  return (
    <PageShell>
      <div className="mx-auto flex min-h-[80vh] max-w-xl items-center justify-center px-4">
        <GlassCard className="w-full text-center">
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-cyan-400">
            404 // Signal Lost
          </p>
          <h1 className="mt-3 text-3xl font-bold text-white">
            Coordinates Not Found
          </h1>
          <p className="mt-3 text-sm text-slate-300">
            The requested route does not exist in Pradhap Digital Universe.
          </p>
          <Link
            to="/"
            className="mt-6 inline-flex items-center gap-2 rounded-xl border border-cyan-400/35 bg-cyan-500/15 px-4 py-2 text-sm font-medium text-cyan-200 transition-colors hover:bg-cyan-500/25"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            <span>Return to Portfolio</span>
          </Link>
        </GlassCard>
      </div>
    </PageShell>
  );
}
