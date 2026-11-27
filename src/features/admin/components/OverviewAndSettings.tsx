import {
  Award,
  BadgeCheck,
  Briefcase,
  Cpu,
  Database,
  FlaskConical,
  Layers,
  Mail,
  RefreshCw,
} from 'lucide-react';
import { useState } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { isSupabaseConfigured } from '@/integrations/supabase/env';
import { portfolioRepository } from '@/services/portfolioRepository';
import type { EnquiryItem, PortfolioData } from '@/types/portfolio';
import { ConfirmDialog } from './ConfirmDialog';

interface OverviewPanelProps {
  data: PortfolioData;
  enquiries: EnquiryItem[];
  onNavigateTab: (tab: string) => void;
}

export function OverviewPanel({
  data,
  enquiries,
  onNavigateTab,
}: OverviewPanelProps) {
  const unreadEnquiries = enquiries.filter((e) => e.status === 'new').length;

  const stats = [
    { label: 'Projects', count: data.projects.length, icon: Layers, tab: 'projects' },
    { label: 'Skills', count: data.skills.length, icon: Cpu, tab: 'skills' },
    { label: 'Experiences', count: data.experiences.length, icon: Briefcase, tab: 'experiences' },
    { label: 'Achievements', count: data.achievements.length, icon: Award, tab: 'achievements' },
    { label: 'Certifications', count: data.certifications.length, icon: BadgeCheck, tab: 'certifications' },
    { label: 'Publications', count: data.research.length, icon: FlaskConical, tab: 'research' },
    { label: 'New Enquiries', count: unreadEnquiries, icon: Mail, tab: 'enquiries' },
  ];

  const recentItems = [
    ...data.experiences.map((x) => ({ title: `${x.role} @ ${x.company}`, kind: 'Experience', tab: 'experiences', updated: x.updatedAt })),
    ...data.projects.map((x) => ({ title: x.title, kind: 'Project', tab: 'projects', updated: x.updatedAt })),
    ...data.research.map((x) => ({ title: x.title, kind: `Research (${x.status})`, tab: 'research', updated: x.updatedAt })),
  ]
    .sort((a, b) => (b.updated ?? '').localeCompare(a.updated ?? ''))
    .slice(0, 6);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">CMS Overview</h2>
        <p className="mt-1 text-sm text-slate-400">
          Manage all 11 public portfolio sections, media assets, and incoming enquiries.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <button
              key={stat.label}
              type="button"
              onClick={() => onNavigateTab(stat.tab)}
              className="cursor-pointer text-left"
            >
              <GlassCard className="flex items-center justify-between p-5 hover:border-cyan-400/45">
                <div>
                  <p className="font-mono text-xs text-slate-400">{stat.label}</p>
                  <p className="mt-1 text-2xl font-bold text-white">{stat.count}</p>
                </div>
                <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-400/30 bg-cyan-500/10 text-cyan-300">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
              </GlassCard>
            </button>
          );
        })}
      </div>

      <GlassCard className="p-6">
        <h3 className="text-base font-bold text-white">Recently Active Portfolio Records</h3>
        <div className="mt-4 divide-y divide-slate-800/80">
          {recentItems.map((item) => (
            <div
              key={`${item.kind}-${item.title}`}
              className="flex flex-wrap items-center justify-between gap-2 py-3 text-sm"
            >
              <div>
                <p className="font-medium text-slate-200">{item.title}</p>
                <p className="font-mono text-[11px] text-cyan-300">{item.kind}</p>
              </div>
              <button
                type="button"
                onClick={() => onNavigateTab(item.tab)}
                className="cursor-pointer rounded-lg border border-slate-700 px-3 py-1 text-xs text-slate-300 hover:border-cyan-400/50 hover:text-white"
              >
                Manage
              </button>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}

export function SettingsPanel({ onRefresh }: { onRefresh: () => Promise<void> }) {
  const configured = isSupabaseConfigured();
  const [confirmReset, setConfirmReset] = useState(false);

  const handleReset = async () => {
    portfolioRepository.resetLocalCmsData();
    setConfirmReset(false);
    await onRefresh();
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">System &amp; Supabase Settings</h2>
        <p className="mt-1 text-sm text-slate-400">
          Connection status, environment configuration, and local preview controls.
        </p>
      </div>

      <GlassCard className="space-y-4 p-6">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-400/35 bg-cyan-500/10 text-cyan-300">
            <Database className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <h3 className="text-base font-bold text-white">
              {configured
                ? 'Supabase Connected (Live Postgres + Auth + Storage)'
                : 'Local Browser CMS Mode (Supabase Not Connected)'}
            </h3>
            <p className="text-xs text-slate-400">
              {configured
                ? 'All changes read and write directly against your configured Supabase project.'
                : 'Missing VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY. Changes persist in your browser localStorage until Supabase is configured.'}
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-950/75 p-4 font-mono text-xs text-slate-300">
          <p className="text-cyan-300">Required .env.local variables for live Supabase:</p>
          <p className="mt-2">VITE_SUPABASE_URL=https://your-project-ref.supabase.co</p>
          <p>VITE_SUPABASE_ANON_KEY=your-public-anon-key</p>
          <p className="mt-3 text-slate-400">
            SQL Schema &amp; RLS migration file: supabase/migrations/001_portfolio_cms_schema.sql
          </p>
        </div>

        {!configured ? (
          <div className="border-t border-slate-800 pt-4">
            <button
              type="button"
              onClick={() => setConfirmReset(true)}
              className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-amber-400/35 bg-amber-500/10 px-4 py-2 text-xs font-medium text-amber-200 hover:bg-amber-500/20"
            >
              <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Reset Local Browser CMS to Resume Seed</span>
            </button>
          </div>
        ) : null}
      </GlassCard>

      <ConfirmDialog
        open={confirmReset}
        title="Reset Local CMS Data?"
        description="This restores all sections to your initial resume seed data and clears local browser edits, enquiries, and local media uploads."
        confirmLabel="Reset to Seed"
        onCancel={() => setConfirmReset(false)}
        onConfirm={() => void handleReset()}
      />
    </div>
  );
}
