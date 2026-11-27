import { Lock } from 'lucide-react';
import { type FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GlassCard } from '@/components/ui/GlassCard';
import { NeonButton } from '@/components/ui/NeonButton';
import { isSupabaseConfigured } from '@/integrations/supabase/env';
import { portfolioRepository } from '@/services/portfolioRepository';

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const configured = isSupabaseConfigured();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const res = await portfolioRepository.signInAdmin(email, password);
      if (res.ok) {
        navigate('/admin', { replace: true });
      } else {
        setError(res.error ?? 'Authentication failed.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-md py-10">
      <GlassCard glowAccent="purple" className="p-6 sm:p-8">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-purple-400/35 bg-purple-500/15 text-purple-300">
            <Lock className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Admin Sign In</h1>
            <p className="text-xs text-slate-400">
              {configured
                ? 'Supabase Auth protected CMS access'
                : 'Local Browser CMS preview access (Supabase not connected)'}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="admin-email" className="mb-1.5 block text-xs font-medium text-slate-300">
              Admin Email
            </label>
            <input
              id="admin-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@pradhap.dev"
              className="w-full rounded-xl border border-slate-700 bg-slate-900/75 px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="admin-password" className="mb-1.5 block text-xs font-medium text-slate-300">
              Password
            </label>
            <input
              id="admin-password"
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimum 6 characters"
              className="w-full rounded-xl border border-slate-700 bg-slate-900/75 px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none"
            />
          </div>

          {error ? (
            <p role="alert" className="rounded-xl border border-rose-500/35 bg-rose-500/10 px-3 py-2 text-xs text-rose-200">
              {error}
            </p>
          ) : null}

          <NeonButton type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? 'Signing In...' : 'Enter CMS Dashboard'}
          </NeonButton>
        </form>

        {!configured ? (
          <p className="mt-4 rounded-xl border border-slate-800 bg-slate-950/65 p-3 font-mono text-[11px] leading-relaxed text-slate-400">
            Supabase credentials are not configured in .env.local yet. Signing in opens the persistent Local Browser CMS so you can test every CRUD module and public update.
          </p>
        ) : null}
      </GlassCard>
    </div>
  );
}
