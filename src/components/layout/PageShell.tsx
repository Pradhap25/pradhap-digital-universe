import type { ReactNode } from 'react';
import { SkipLink } from '@/components/ui/SkipLink';

interface PageShellProps {
  backdrop?: ReactNode;
  header?: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
}

export function PageShell({ backdrop, header, footer, children }: PageShellProps) {
  return (
    <div className="relative flex min-h-screen flex-col overflow-x-clip">
      <SkipLink />
      {backdrop}
      {header}
      <main id="main-content" tabIndex={-1} className="relative z-10 flex-1 focus:outline-none">
        {children}
      </main>
      {footer}
    </div>
  );
}
