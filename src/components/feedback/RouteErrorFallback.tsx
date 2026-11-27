import { useEffect } from 'react';
import { Link, useRouteError } from 'react-router-dom';

function isChunkLoadFailure(error: unknown): boolean {
  if (!(error instanceof Error)) return false;
  const msg = error.message.toLowerCase();
  return (
    msg.includes('dynamically imported module') ||
    msg.includes('importing a module script failed') ||
    msg.includes('loading chunk')
  );
}

const CHUNK_RELOAD_KEY = 'pdu_route_chunk_reload_v1';

export function RouteErrorFallback() {
  const error = useRouteError();
  const isStaleChunk = isChunkLoadFailure(error);

  useEffect(() => {
    if (!isStaleChunk) return;
    try {
      const alreadyReloaded = sessionStorage.getItem(CHUNK_RELOAD_KEY);
      if (!alreadyReloaded) {
        sessionStorage.setItem(CHUNK_RELOAD_KEY, String(Date.now()));
        window.location.reload();
      }
    } catch {
      // Ignore storage failures
    }
  }, [isStaleChunk]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#030614] px-6 text-center text-slate-200">
      <div className="glass-panel max-w-md space-y-4 rounded-2xl p-6 sm:p-8">
        <p className="font-mono text-xs uppercase tracking-widest text-cyan-300">
          {isStaleChunk ? 'New Deployment Detected' : 'Navigation Error'}
        </p>
        <h1 className="text-xl font-bold text-white">
          {isStaleChunk ? 'Refreshing updated page...' : 'Unable to load this view'}
        </h1>
        <p className="text-xs leading-relaxed text-slate-400">
          {isStaleChunk
            ? 'A newer version of the site was just deployed. Reload the page to fetch the latest assets.'
            : error instanceof Error
              ? error.message
              : 'An unexpected routing error occurred.'}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="cursor-pointer rounded-xl border border-cyan-400/40 bg-cyan-500/15 px-4 py-2 font-mono text-xs font-medium text-cyan-200 transition-colors hover:bg-cyan-500/25"
          >
            Reload Page
          </button>
          <Link
            to="/"
            className="rounded-xl border border-slate-700 bg-slate-900/70 px-4 py-2 font-mono text-xs text-slate-300 transition-colors hover:border-slate-500 hover:text-white"
          >
            Back to Portfolio
          </Link>
        </div>
      </div>
    </div>
  );
}
