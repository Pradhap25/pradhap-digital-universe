import { ArrowLeft, LogOut, Shield } from 'lucide-react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { AdminGuard } from '@/features/admin/AdminGuard';
import { portfolioRepository } from '@/services/portfolioRepository';

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const isLoginPage = location.pathname === '/admin/login';

  const handleSignOut = async () => {
    await portfolioRepository.signOutAdmin();
    navigate('/admin/login', { replace: true });
  };

  return (
    <AdminGuard>
      <div className="universe-grid-bg flex min-h-screen flex-col bg-[#030614]">
        <header className="border-b border-slate-800/80 bg-[#050816]/90 backdrop-blur-xl">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2.5">
              <Shield className="h-5 w-5 text-purple-400" aria-hidden="true" />
              <span className="font-display text-sm font-bold text-white sm:text-base">
                Pradhap CMS Command Center
              </span>
            </div>
            <div className="flex items-center gap-2.5 text-xs">
              <Link
                to="/"
                className="inline-flex items-center gap-1.5 rounded-xl border border-cyan-400/30 bg-cyan-500/10 px-3 py-1.5 text-cyan-200 hover:bg-cyan-500/20"
              >
                <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Public Portfolio</span>
              </Link>
              {!isLoginPage ? (
                <button
                  type="button"
                  onClick={() => void handleSignOut()}
                  className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-900/70 px-3 py-1.5 text-slate-300 hover:border-rose-400/40 hover:text-rose-200"
                >
                  <LogOut className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Sign Out</span>
                </button>
              ) : null}
            </div>
          </div>
        </header>

        <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </AdminGuard>
  );
}
