import { MotionConfig } from 'framer-motion';
import { RouterProvider } from 'react-router-dom';
import { ErrorBoundary } from '@/components/feedback/ErrorBoundary';
import { router } from './router';

function AppCrashFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#050816] px-6 text-center text-slate-200">
      <div className="max-w-md space-y-3">
        <h1 className="text-xl font-bold text-white">Something went wrong</h1>
        <p className="text-sm text-slate-400">
          Please refresh the page to reload Pradhap Digital Universe.
        </p>
      </div>
    </div>
  );
}

export function App() {
  return (
    <ErrorBoundary fallback={<AppCrashFallback />}>
      <MotionConfig reducedMotion="user">
        <RouterProvider router={router} />
      </MotionConfig>
    </ErrorBoundary>
  );
}
