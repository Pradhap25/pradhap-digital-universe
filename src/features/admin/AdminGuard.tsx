import { useEffect, useState, type ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { RouteLoader } from '@/components/feedback/RouteLoader';
import { isSupabaseConfigured } from '@/integrations/supabase/env';
import { portfolioRepository, type AdminSessionInfo } from '@/services/portfolioRepository';

interface AdminGuardProps {
  children: ReactNode;
}

export function AdminGuard({ children }: AdminGuardProps) {
  const location = useLocation();
  const configured = isSupabaseConfigured();
  const [session, setSession] = useState<AdminSessionInfo | null>(null);

  useEffect(() => {
    let active = true;
    portfolioRepository
      .getAdminSession()
      .then((info) => {
        if (active) setSession(info);
      })
      .catch(() => {
        if (active) {
          setSession({
            authenticated: false,
            email: null,
            mode: configured ? 'supabase' : 'local-cms',
          });
        }
      });
    return () => {
      active = false;
    };
  }, [configured, location.pathname]);

  const isLoginRoute = location.pathname === '/admin/login';

  if (!session) {
    return <RouteLoader label="Verifying admin session..." />;
  }

  if (!session.authenticated && !isLoginRoute) {
    return <Navigate to="/admin/login" replace />;
  }

  if (session.authenticated && isLoginRoute) {
    return <Navigate to="/admin" replace />;
  }

  return (
    <>
      {!configured ? (
        <div
          role="status"
          className="border-b border-amber-500/30 bg-amber-950/40 px-4 py-2 text-center font-mono text-xs text-amber-200"
        >
          Local Browser CMS Mode &bull; Supabase is not connected yet (changes persist locally; see Settings for .env.local setup).
        </div>
      ) : null}
      {children}
    </>
  );
}
