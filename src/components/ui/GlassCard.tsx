import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from './cn';

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  glowAccent?: 'cyan' | 'blue' | 'purple' | 'none';
}

const ACCENT_RING: Record<NonNullable<GlassCardProps['glowAccent']>, string> = {
  cyan: 'hover:border-cyan-400/40',
  blue: 'hover:border-blue-400/40',
  purple: 'hover:border-purple-400/40',
  none: '',
};

export function GlassCard({
  children,
  className,
  glowAccent = 'cyan',
  ...props
}: GlassCardProps) {
  return (
    <div
      className={cn(
        'glass-panel rounded-2xl p-6 transition-colors duration-300',
        ACCENT_RING[glowAccent],
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
