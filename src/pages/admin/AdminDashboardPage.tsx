import {
  Award,
  BadgeCheck,
  Briefcase,
  Compass,
  Cpu,
  FlaskConical,
  GraduationCap,
  Image as ImageIcon,
  Layers,
  LayoutDashboard,
  Mail,
  Phone,
  Settings,
  Sparkles,
  User,
  Users,
} from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { RouteLoader } from '@/components/feedback/RouteLoader';
import { cn } from '@/components/ui/cn';
import { CrudSectionManager } from '@/features/admin/components/CrudSectionManager';
import { EnquiriesManager } from '@/features/admin/components/EnquiriesManager';
import { MediaLibraryManager } from '@/features/admin/components/MediaLibraryManager';
import {
  OverviewPanel,
  SettingsPanel,
} from '@/features/admin/components/OverviewAndSettings';
import { ProfileSectionEditor } from '@/features/admin/components/ProfileSectionEditor';
import { portfolioRepository } from '@/services/portfolioRepository';
import type {
  CmsCollectionKey,
  EnquiryItem,
  MediaAsset,
  PortfolioData,
} from '@/types/portfolio';

type AdminTab =
  | 'overview'
  | 'hero'
  | 'about'
  | 'education'
  | 'experiences'
  | 'skills'
  | 'interestItems'
  | 'projects'
  | 'achievements'
  | 'certifications'
  | 'research'
  | 'leadership'
  | 'contact'
  | 'enquiries'
  | 'media'
  | 'settings';

const ADMIN_TABS: { id: AdminTab; label: string; icon: typeof LayoutDashboard }[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'hero', label: 'Profile / Hero', icon: Sparkles },
  { id: 'about', label: 'About', icon: User },
  { id: 'education', label: 'Education', icon: GraduationCap },
  { id: 'experiences', label: 'Experience', icon: Briefcase },
  { id: 'skills', label: 'Skills', icon: Cpu },
  { id: 'interestItems', label: 'Interests', icon: Compass },
  { id: 'projects', label: 'Projects', icon: Layers },
  { id: 'achievements', label: 'Achievements', icon: Award },
  { id: 'certifications', label: 'Certifications', icon: BadgeCheck },
  { id: 'research', label: 'Research', icon: FlaskConical },
  { id: 'leadership', label: 'Leadership', icon: Users },
  { id: 'contact', label: 'Contact Details', icon: Phone },
  { id: 'enquiries', label: 'Enquiries', icon: Mail },
  { id: 'media', label: 'Media Library', icon: ImageIcon },
  { id: 'settings', label: 'Settings', icon: Settings },
];

const CRUD_TABS = new Set<CmsCollectionKey>([
  'education',
  'experiences',
  'skills',
  'interestItems',
  'projects',
  'achievements',
  'certifications',
  'research',
  'leadership',
]);

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [portfolio, setPortfolio] = useState<PortfolioData | null>(null);
  const [enquiries, setEnquiries] = useState<EnquiryItem[]>([]);
  const [mediaAssets, setMediaAssets] = useState<MediaAsset[]>([]);

  const loadAll = useCallback(async () => {
    const [nextPortfolio, nextEnquiries, nextMedia] = await Promise.all([
      portfolioRepository.getAdminPortfolio(),
      portfolioRepository.getEnquiries(),
      portfolioRepository.getMediaAssets(),
    ]);
    setPortfolio(nextPortfolio);
    setEnquiries(nextEnquiries);
    setMediaAssets(nextMedia);
  }, []);

  useEffect(() => {
    void loadAll();
  }, [loadAll]);

  if (!portfolio) {
    return <RouteLoader label="Loading CMS workspace..." />;
  }

  const unreadCount = enquiries.filter((e) => e.status === 'new').length;

  return (
    <div className="grid gap-6 lg:grid-cols-12">
      {/* Sidebar Navigation */}
      <aside aria-label="CMS module navigation" className="lg:col-span-3">
        {/* Mobile Tab Selector */}
        <div className="mb-4 lg:hidden">
          <select
            aria-label="Select CMS module"
            value={activeTab}
            onChange={(e) => setActiveTab(e.target.value as AdminTab)}
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-sm text-white"
          >
            {ADMIN_TABS.map((tab) => (
              <option key={tab.id} value={tab.id}>
                {tab.label}
                {tab.id === 'enquiries' && unreadCount > 0 ? ` (${unreadCount})` : ''}
              </option>
            ))}
          </select>
        </div>

        {/* Desktop Sidebar */}
        <nav className="glass-panel hidden space-y-1 rounded-2xl p-2.5 lg:block">
          {ADMIN_TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'flex w-full cursor-pointer items-center justify-between rounded-xl px-3 py-2 text-left text-xs font-medium transition-colors',
                  isActive
                    ? 'border border-cyan-400/40 bg-cyan-500/15 text-white'
                    : 'text-slate-300 hover:bg-slate-800/60 hover:text-white',
                )}
              >
                <span className="inline-flex items-center gap-2.5">
                  <Icon
                    className={cn(
                      'h-4 w-4 shrink-0',
                      isActive ? 'text-cyan-300' : 'text-slate-400',
                    )}
                    aria-hidden="true"
                  />
                  <span>{tab.label}</span>
                </span>
                {tab.id === 'enquiries' && unreadCount > 0 ? (
                  <span className="rounded-full bg-cyan-400 px-1.5 py-0.5 font-mono text-[10px] font-bold text-slate-950">
                    {unreadCount}
                  </span>
                ) : null}
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Active Workspace */}
      <section className="min-w-0 lg:col-span-9">
        {activeTab === 'overview' ? (
          <OverviewPanel
            data={portfolio}
            enquiries={enquiries}
            onNavigateTab={(tab) => setActiveTab(tab as AdminTab)}
          />
        ) : activeTab === 'hero' || activeTab === 'about' || activeTab === 'contact' ? (
          <ProfileSectionEditor
            mode={activeTab}
            profile={portfolio.profile}
            softSkills={portfolio.softSkills}
            onRefresh={loadAll}
          />
        ) : activeTab === 'enquiries' ? (
          <EnquiriesManager enquiries={enquiries} onRefresh={loadAll} />
        ) : activeTab === 'media' ? (
          <MediaLibraryManager assets={mediaAssets} onRefresh={loadAll} />
        ) : activeTab === 'settings' ? (
          <SettingsPanel onRefresh={loadAll} />
        ) : CRUD_TABS.has(activeTab as CmsCollectionKey) ? (
          <CrudSectionManager
            key={activeTab}
            collection={activeTab as CmsCollectionKey}
            items={portfolio[activeTab as CmsCollectionKey] as never}
            onRefresh={loadAll}
          />
        ) : null}
      </section>
    </div>
  );
}
