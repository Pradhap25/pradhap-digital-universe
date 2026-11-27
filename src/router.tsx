import { type ComponentType, lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { RouteErrorFallback } from '@/components/feedback/RouteErrorFallback';
import { RouteLoader } from '@/components/feedback/RouteLoader';
import { HomePage } from '@/pages/public/HomePage';
import { NotFoundPage } from '@/pages/public/NotFoundPage';

const CHUNK_RETRY_STORAGE_KEY = 'pdu_lazy_chunk_retry_v1';

/**
 * Automatically performs a one-time hard reload if a new Vercel deployment invalidates
 * an already-open tab's lazy chunk hashes, preventing stale asset crashes.
 */
function lazyWithChunkRecovery<T extends ComponentType<unknown>>(
  importer: () => Promise<{ default: T }>,
) {
  return lazy(async () => {
    try {
      const mod = await importer();
      try {
        sessionStorage.removeItem(CHUNK_RETRY_STORAGE_KEY);
      } catch {
        // Ignore storage errors
      }
      return mod;
    } catch (error) {
      try {
        const lastAttempt = Number(sessionStorage.getItem(CHUNK_RETRY_STORAGE_KEY) ?? '0');
        if (!lastAttempt || Date.now() - lastAttempt > 15_000) {
          sessionStorage.setItem(CHUNK_RETRY_STORAGE_KEY, String(Date.now()));
          window.location.reload();
          return new Promise<{ default: T }>(() => {});
        }
      } catch {
        // Ignore storage errors and surface to RouteErrorFallback
      }
      throw error;
    }
  });
}

const AdminLayout = lazyWithChunkRecovery(() => import('@/pages/admin/AdminLayout'));
const AdminDashboardPage = lazyWithChunkRecovery(
  () => import('@/pages/admin/AdminDashboardPage'),
);
const AdminLoginPage = lazyWithChunkRecovery(() => import('@/pages/admin/AdminLoginPage'));

export const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
    errorElement: <RouteErrorFallback />,
  },
  {
    path: '/admin',
    errorElement: <RouteErrorFallback />,
    element: (
      <Suspense fallback={<RouteLoader label="Loading admin workspace..." />}>
        <AdminLayout />
      </Suspense>
    ),
    children: [
      {
        index: true,
        errorElement: <RouteErrorFallback />,
        element: (
          <Suspense fallback={<RouteLoader label="Loading dashboard..." />}>
            <AdminDashboardPage />
          </Suspense>
        ),
      },
      {
        path: 'login',
        errorElement: <RouteErrorFallback />,
        element: (
          <Suspense fallback={<RouteLoader label="Loading sign in..." />}>
            <AdminLoginPage />
          </Suspense>
        ),
      },
    ],
  },
  {
    path: '*',
    element: <NotFoundPage />,
    errorElement: <RouteErrorFallback />,
  },
]);
