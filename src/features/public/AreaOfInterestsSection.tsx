import { motion } from 'framer-motion';
import { BarChart3, BrainCircuit, Code2, Compass, Eye } from 'lucide-react';
import { cn } from '@/components/ui/cn';
import { GlassCard } from '@/components/ui/GlassCard';
import { TechBadge } from '@/components/ui/TechBadge';
import { useReducedMotionPref } from '@/hooks/useReducedMotionPref';
import type { InterestCategoryKey, InterestGroup } from '@/types/portfolio';

interface AreaOfInterestsSectionProps {
  interests: InterestGroup[];
  activeCategory: InterestCategoryKey;
  onCategoryChange: (category: InterestCategoryKey) => void;
}

const CATEGORY_META: Record<
  InterestCategoryKey,
  { icon: typeof BrainCircuit; accent: 'purple' | 'cyan' | 'blue'; badgeLabel: string }
> = {
  'generative-ai': {
    icon: BrainCircuit,
    accent: 'purple',
    badgeLabel: 'Neural Brain & Vector Space',
  },
  'ai-cv': {
    icon: Eye,
    accent: 'cyan',
    badgeLabel: 'Detection Frames & Pose Lattice',
  },
  'data-science': {
    icon: BarChart3,
    accent: 'blue',
    badgeLabel: 'Analytics & Statistical Models',
  },
  programming: {
    icon: Code2,
    accent: 'cyan',
    badgeLabel: 'Python & OOPs Architecture',
  },
};

export function AreaOfInterestsSection({
  interests,
  activeCategory,
  onCategoryChange,
}: AreaOfInterestsSectionProps) {
  const reducedMotion = useReducedMotionPref();
  const publishedGroups = interests
    .filter((group) => group.isPublished)
    .sort((a, b) => a.sortOrder - b.sortOrder);

  const activeGroup =
    publishedGroups.find((g) => g.key === activeCategory) ?? publishedGroups[0];

  return (
    <section
      id="interests"
      aria-labelledby="interests-heading"
      className="snap-section relative mx-auto flex w-full max-w-7xl flex-col justify-center px-4 py-24 sm:px-6 lg:px-8"
    >
      <div className="grid items-center gap-8 lg:grid-cols-12">
        {/* Left Domain Navigator */}
        <div className="lg:col-span-4">
          <div className="space-y-5">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.24em] text-cyan-400">
                06 // Area of Interests
              </p>
              <h2
                id="interests-heading"
                className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl"
              >
                Domains of <span className="text-gradient-universe">Exploration</span>
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-300 sm:text-base">
                Core intellectual and research domains driving my engineering focus—each triggering its own 3D visual environment as you explore.
              </p>
            </div>

            <GlassCard glowAccent="cyan" className="p-5">
              <div className="mb-3 flex items-center justify-between font-mono text-[11px] uppercase tracking-widest text-cyan-300">
                <span className="inline-flex items-center gap-2">
                  <Compass className="h-3.5 w-3.5" aria-hidden="true" />
                  Active 3D Environment
                </span>
                <span>{publishedGroups.length} Realms</span>
              </div>

              {activeGroup ? (
                <p className="text-sm font-semibold text-white">{activeGroup.title}</p>
              ) : null}

              <div className="mt-4 grid gap-2">
                {publishedGroups.map((group) => {
                  const meta = CATEGORY_META[group.key];
                  const Icon = meta.icon;
                  const isActive = activeCategory === group.key;

                  return (
                    <button
                      key={group.id}
                      type="button"
                      onClick={() => {
                        onCategoryChange(group.key);
                        document.getElementById(`interest-${group.key}`)?.scrollIntoView({
                          behavior: reducedMotion ? 'auto' : 'smooth',
                          block: 'center',
                        });
                      }}
                      className={cn(
                        'flex cursor-pointer items-center justify-between rounded-xl border px-3.5 py-2.5 text-left text-xs font-medium transition-all',
                        isActive
                          ? 'border-cyan-400/55 bg-cyan-500/15 text-white shadow-[0_0_20px_rgba(34,211,238,0.18)]'
                          : 'border-slate-800/90 bg-slate-950/60 text-slate-300 hover:border-slate-700 hover:text-white',
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
                        <span>{group.title}</span>
                      </span>
                      <span className="font-mono text-[10px] text-slate-400">
                        {group.items.length}
                      </span>
                    </button>
                  );
                })}
              </div>
            </GlassCard>
          </div>
        </div>

        {/* Right Scroll-Driven Interest Realms (2x2 for crisp 100svh fit) */}
        <div className="grid gap-4 sm:grid-cols-2 lg:col-span-8">
          {publishedGroups.map((group, idx) => {
            const meta = CATEGORY_META[group.key];
            const Icon = meta.icon;
            const isActive = activeCategory === group.key;

            return (
              <motion.article
                key={group.id}
                id={`interest-${group.key}`}
                initial={reducedMotion ? undefined : { opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.4 }}
                onViewportEnter={() => onCategoryChange(group.key)}
                onMouseEnter={() => onCategoryChange(group.key)}
                onFocus={() => onCategoryChange(group.key)}
                transition={{ duration: 0.45, delay: idx * 0.04 }}
              >
                <GlassCard
                  glowAccent={meta.accent}
                  className={cn(
                    'p-6 transition-all duration-300 sm:p-7',
                    isActive
                      ? 'border-cyan-400/45 shadow-[0_0_32px_-8px_rgba(34,211,238,0.28)]'
                      : 'border-slate-800/80',
                  )}
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-400/35 bg-cyan-500/10 text-cyan-300">
                        <Icon className="h-5 w-5" aria-hidden="true" />
                      </span>
                      <div>
                        <p className="font-mono text-[11px] uppercase tracking-widest text-cyan-300">
                          {meta.badgeLabel}
                        </p>
                        <h3 className="text-lg font-bold text-white sm:text-xl">
                          {group.title}
                        </h3>
                      </div>
                    </div>
                    <TechBadge
                      label={isActive ? 'Active Scene' : `${group.items.length} Topics`}
                      tone={meta.accent}
                    />
                  </div>

                  <p className="mt-3 text-sm text-slate-300">{group.subtitle}</p>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {group.items.map((topic) => (
                      <TechBadge key={topic} label={topic} tone="slate" />
                    ))}
                  </div>
                </GlassCard>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
