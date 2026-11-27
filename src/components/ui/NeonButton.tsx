import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from './cn';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';

const VARIANT_STYLES: Record<ButtonVariant, string> = {
  primary:
    'bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 text-slate-950 font-semibold shadow-lg shadow-cyan-500/20 hover:brightness-110',
  secondary:
    'glass-panel text-cyan-200 border border-cyan-400/30 hover:border-cyan-300/60 hover:bg-slate-900/80',
  ghost:
    'text-slate-300 hover:text-cyan-300 hover:bg-slate-800/50',
};

const BASE_CLASSES =
  'inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed';

interface NeonButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  children: ReactNode;
}

export function NeonButton({
  variant = 'primary',
  className,
  children,
  type = 'button',
  ...props
}: NeonButtonProps) {
  return (
    <button
      type={type}
      className={cn(BASE_CLASSES, VARIANT_STYLES[variant], className)}
      {...props}
    >
      {children}
    </button>
  );
}

interface NeonLinkButtonProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: ButtonVariant;
  children: ReactNode;
}

export function NeonLinkButton({
  variant = 'primary',
  className,
  children,
  ...props
}: NeonLinkButtonProps) {
  return (
    <a className={cn(BASE_CLASSES, VARIANT_STYLES[variant], className)} {...props}>
      {children}
    </a>
  );
}
