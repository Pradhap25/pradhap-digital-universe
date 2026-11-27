import orbitalEmblem from '@/assets/vectors/orbital-emblem.svg';

interface WebGLFallbackProps {
  reason?: 'loading' | 'reduced-motion' | 'unsupported';
}

export function WebGLFallback({ reason = 'unsupported' }: WebGLFallbackProps) {
  return (
    <div
      aria-hidden="true"
      className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-3xl border border-cyan-400/15 bg-slate-950/60"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.22),rgba(168,85,247,0.12)_45%,transparent_72%)]" />
      <img
        src={orbitalEmblem}
        alt=""
        className="relative z-10 h-52 w-52 opacity-90 sm:h-64 sm:w-64"
      />
      <span className="sr-only">
        {reason === 'loading'
          ? 'Loading 3D digital universe scene'
          : 'Static orbital emblem fallback'}
      </span>
    </div>
  );
}
