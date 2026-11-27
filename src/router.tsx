import { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { RouteLoader } from '@/components/feedback/RouteLoader';
import { HomePage } from '@/pages/public/HomePage';
import { NotFoundPage } from '@/pages/public/NotFoundPage';

const AdminLayout = lazy(() => import('@/pages/admin/AdminLayout'));
const AdminDashboardPage = lazy(() => import('@/pages/admin/AdminDashboardPage'));
const AdminLoginPage = lazy(() => import('@/pages/admin/AdminLoginPage'));

export const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/admin',
    element: (
      <Suspense fallback={<RouteLoader label="Loading admin workspace..." />}>
        <AdminLayout />
      </Suspense>
    ),
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<RouteLoader label="Loading dashboard..." />}>
            <AdminDashboardPage />
          </Suspense>
        ),
      },
      {
        path: 'login',
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
  },
]);
