import { cn } from './cn';

interface TechBadgeProps {
  label: string;
  tone?: 'cyan' | 'blue' | 'purple' | 'slate';
  className?: string;
}

const TONE_MAP: Record<NonNullable<TechBadgeProps['tone']>, string> = {
  cyan: 'border-cyan-400/30 bg-cyan-500/10 text-cyan-200',
  blue: 'border-blue-400/30 bg-blue-500/10 text-blue-200',
  purple: 'border-purple-400/30 bg-purple-500/10 text-purple-200',
  slate: 'border-slate-700 bg-slate-800/70 text-slate-200',
};

export function TechBadge({ label, tone = 'cyan', className }: TechBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-3 py-1 font-mono text-xs',
        TONE_MAP[tone],
        className,
      )}
    >
      {label}
    </span>
  );
}
