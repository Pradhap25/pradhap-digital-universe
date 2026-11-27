export function RouteLoader({ label = 'Loading module...' }: { label?: string }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex min-h-[50vh] flex-col items-center justify-center gap-3 px-6 text-center"
    >
      <div className="h-9 w-9 animate-spin rounded-full border-2 border-cyan-400/25 border-t-cyan-400" />
      <p className="font-mono text-xs uppercase tracking-widest text-slate-400">
        {label}
      </p>
    </div>
  );
}
