import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, ExternalLink, Github, Layers, Workflow } from 'lucide-react';
import { useRef, useState } from 'react';
import { cn } from '@/components/ui/cn';
import { GlassCard } from '@/components/ui/GlassCard';
import { TechBadge } from '@/components/ui/TechBadge';
import { useReducedMotionPref } from '@/hooks/useReducedMotionPref';
import type { ProjectItem } from '@/types/portfolio';

interface ProjectsWorldSectionProps {
  projects: ProjectItem[];
  onProjectChange?: (projectId: string) => void;
}

const PROJECT_AURA: Record<string, { gradient: string; accent: string }> = {
  'proj-traffic-fine': {
    gradient: 'from-cyan-500/20 via-blue-600/15 to-amber-500/15',
    accent: 'text-cyan-300',
  },
  'proj-rag-resume': {
    gradient: 'from-purple-600/22 via-indigo-600/15 to-cyan-500/15',
    accent: 'text-purple-300',
  },
  'proj-solar-dust': {
    gradient: 'from-emerald-500/20 via-cyan-500/15 to-blue-600/15',
    accent: 'text-emerald-300',
  },
};

export function ProjectsWorldSection({
  projects,
  onProjectChange,
}: ProjectsWorldSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotionPref();
  const [activeIndex, setActiveIndex] = useState(0);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const stageY = useTransform(scrollYProgress, [0, 0.5, 1], [35, 0, -35]);
  const safeIndex = projects.length > 0 ? Math.min(activeIndex, projects.length - 1) : 0;
  const activeProject = projects[safeIndex] ?? null;
  const aura = (activeProject && PROJECT_AURA[activeProject.id]) ?? {
    gradient: 'from-cyan-500/20 via-blue-600/15 to-purple-600/15',
    accent: 'text-cyan-300',
  };

  if (!activeProject) {
    return (
      <section
        ref={sectionRef}
        id="projects"
        aria-labelledby="projects-heading"
        className="snap-section relative mx-auto flex w-full max-w-7xl flex-col justify-center px-4 py-24 sm:px-6 lg:px-8"
      >
        <GlassCard className="py-12 text-center">
          <h2 id="projects-heading" className="text-2xl font-bold text-white">
            Projects Showcase
          </h2>
          <p className="mt-2 text-sm text-slate-400">No projects published yet.</p>
        </GlassCard>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      id="projects"
      aria-labelledby="projects-heading"
      className="snap-section relative mx-auto flex w-full max-w-7xl flex-col justify-center px-4 py-24 sm:px-6 lg:px-8"
    >
      <div className="mb-10 max-w-2xl">
        <p className="font-mono text-xs uppercase tracking-[0.24em] text-cyan-400">
          07 // Interactive Innovation World
        </p>
        <h2
          id="projects-heading"
          className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl"
        >
          Engineered Systems &amp; <span className="text-gradient-universe">Architectures</span>
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-slate-300 sm:text-base">
          Select a project realm to inspect its real-time vision, vector retrieval, or deep learning pipeline.
        </p>
      </div>

      <motion.div
        style={reducedMotion ? undefined : { y: stageY }}
        className="grid gap-6 lg:grid-cols-12"
      >
        {/* Interactive Project Chapter Selector */}
        <div
          role="tablist"
          aria-label="Featured projects selector"
          className="flex flex-col gap-3 lg:col-span-4"
        >
          {projects.map((project, idx) => {
            const isSelected = idx === activeIndex;
            return (
              <button
                key={project.id}
                role="tab"
                type="button"
                aria-selected={isSelected}
                onClick={() => {
                  setActiveIndex(idx);
                  onProjectChange?.(project.id);
                }}
                className={cn(
                  'group relative cursor-pointer rounded-2xl border p-5 text-left transition-all',
                  isSelected
                    ? 'glass-panel border-cyan-400/55 shadow-[0_0_30px_rgba(34,211,238,0.18)]'
                    : 'border-slate-800/80 bg-slate-950/55 hover:border-slate-700 hover:bg-slate-900/65',
                )}
              >
                <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-widest">
                  <span className={isSelected ? 'text-cyan-300' : 'text-slate-400'}>
                    0{idx + 1} // Build
                  </span>
                  <Layers
                    className={cn(
                      'h-4 w-4 transition-transform group-hover:scale-110',
                      isSelected ? 'text-cyan-300' : 'text-slate-500',
                    )}
                    aria-hidden="true"
                  />
                </div>
                <h3 className="mt-2 text-base font-bold text-white sm:text-lg">
                  {project.title}
                </h3>
                <p className="mt-1 text-xs text-slate-400">{project.domainLabel}</p>
              </button>
            );
          })}
        </div>

        {/* Floating Project Exploration Stage */}
        <div className="lg:col-span-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeProject.id}
              initial={reducedMotion ? undefined : { opacity: 0, y: 14, scale: 0.99 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={reducedMotion ? undefined : { opacity: 0, y: -10, scale: 0.99 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
              <GlassCard className="relative overflow-hidden p-6 sm:p-8">
                {/* Project-specific crisp border glow (no hazy blur wash) */}
                <div
                  aria-hidden="true"
                  className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${aura.gradient} opacity-25`}
                />

                <div className="relative z-10">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <span className={cn('font-mono text-xs uppercase tracking-widest', aura.accent)}>
                      {activeProject.domainLabel}
                    </span>
                    <div className="flex items-center gap-2.5">
                      {activeProject.repoUrl ? (
                        <a
                          href={activeProject.repoUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-700/80 bg-slate-950/75 px-3 py-1.5 text-xs font-medium text-slate-200 transition-colors hover:border-cyan-400/50 hover:text-cyan-200"
                        >
                          <Github className="h-3.5 w-3.5" aria-hidden="true" />
                          <span>Source / GitHub</span>
                        </a>
                      ) : null}
                      {activeProject.liveUrl ? (
                        <a
                          href={activeProject.liveUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-xl border border-cyan-400/40 bg-cyan-500/15 px-3 py-1.5 text-xs font-medium text-cyan-200 hover:bg-cyan-500/25"
                        >
                          <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                          <span>Live Demo</span>
                        </a>
                      ) : null}
                    </div>
                  </div>

                  <h3 className="mt-3 text-2xl font-bold text-white sm:text-3xl">
                    {activeProject.title}
                  </h3>
                  {activeProject.imageUrl ? (
                    <div className="mt-4 overflow-hidden rounded-xl border border-slate-800 bg-slate-950/80">
                      <img
                        src={activeProject.imageUrl}
                        alt={activeProject.title}
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                        className="max-h-56 w-full object-cover"
                      />
                    </div>
                  ) : null}
                  <p className="mt-3 text-sm leading-relaxed text-slate-200 sm:text-base">
                    {activeProject.description}
                  </p>

                  {/* Animated Technical Architecture Flow */}
                  <div className="mt-6 rounded-2xl border border-slate-800/90 bg-slate-950/75 p-4 sm:p-5">
                    <div className="mb-3 flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-cyan-300">
                      <Workflow className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>System Architecture Pipeline</span>
                    </div>
                    <div className="flex flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:items-center">
                      {activeProject.architectureFlow.map((stage, stageIdx) => (
                        <div key={stage} className="flex items-center gap-2">
                          <motion.div
                            initial={reducedMotion ? undefined : { opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: stageIdx * 0.08, duration: 0.25 }}
                            className="rounded-xl border border-cyan-400/25 bg-slate-900/90 px-3 py-2 font-mono text-xs text-slate-100"
                          >
                            {stage}
                          </motion.div>
                          {stageIdx < activeProject.architectureFlow.length - 1 ? (
                            <ArrowRight
                              className="hidden h-3.5 w-3.5 shrink-0 text-cyan-400 sm:block"
                              aria-hidden="true"
                            />
                          ) : null}
                        </div>
                      ))}
                    </div>
                  </div>

                  <ul className="mt-6 space-y-2.5 text-sm leading-relaxed text-slate-300">
                    {activeProject.highlights.map((highlight) => (
                      <li key={highlight} className="flex items-start gap-2.5">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-400" />
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-6 flex flex-wrap gap-2">
                    {activeProject.techStack.map((tech) => (
                      <TechBadge key={tech} label={tech} tone="cyan" />
                    ))}
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </section>
  );
}
