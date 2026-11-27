import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, ExternalLink, Github, Layers, Workflow } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/components/ui/cn';
import { GlassCard } from '@/components/ui/GlassCard';
import { TechBadge } from '@/components/ui/TechBadge';
import { useReducedMotionPref } from '@/hooks/useReducedMotionPref';
import type { ProjectItem } from '@/types/portfolio';

interface ProjectsWorldSectionProps {
  projects: ProjectItem[];
  onProjectChange?: (projectId: string) => void;
}

const PROJECT_ACCENT: Record<string, { border: string; accent: string; badge: 'cyan' | 'purple' | 'blue' }> = {
  'proj-traffic-fine': {
    border: 'border-cyan-400/35',
    accent: 'text-cyan-300',
    badge: 'cyan',
  },
  'proj-rag-resume': {
    border: 'border-purple-400/35',
    accent: 'text-purple-300',
    badge: 'purple',
  },
  'proj-solar-dust': {
    border: 'border-blue-400/35',
    accent: 'text-blue-300',
    badge: 'blue',
  },
};

function cleanText(value?: string): string | null {
  const trimmed = value?.trim();
  return trimmed && trimmed.length > 0 ? trimmed : null;
}

function cleanList(items?: string[]): string[] {
  return (items ?? []).map((item) => item.trim()).filter((item) => item.length > 0);
}

interface CaseStudyTextBlockProps {
  index: string;
  title: string;
  accentClass: string;
  paragraphs: string[];
  bullets?: string[];
}

function CaseStudySectionCard({
  index,
  title,
  accentClass,
  paragraphs,
  bullets = [],
}: CaseStudyTextBlockProps) {
  const hasContent = paragraphs.length > 0 || bullets.length > 0;

  return (
    <section
      aria-label={`${index} ${title}`}
      className="rounded-xl border border-slate-800/85 bg-slate-950/60 p-4 sm:p-5"
    >
      <div className="flex items-center justify-between gap-2">
        <h4 className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-white">
          <span className={cn('mr-2', accentClass)}>{index}</span>
          <span className="text-slate-500">—</span>
          <span className="ml-2">{title}</span>
        </h4>
      </div>

      {hasContent ? (
        <div className="mt-3 space-y-2.5 text-sm leading-relaxed text-slate-300">
          {paragraphs.map((text) => (
            <p key={text}>{text}</p>
          ))}
          {bullets.length > 0 ? (
            <ul className="space-y-2 pt-1">
              {bullets.map((bullet) => (
                <li key={bullet} className="flex items-start gap-2.5">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-400" />
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}

export function ProjectsWorldSection({
  projects,
  onProjectChange,
}: ProjectsWorldSectionProps) {
  const reducedMotion = useReducedMotionPref();
  const [activeIndex, setActiveIndex] = useState(0);

  const safeIndex = projects.length > 0 ? Math.min(activeIndex, projects.length - 1) : 0;
  const activeProject = projects[safeIndex] ?? null;

  if (!activeProject) {
    return (
      <section
        id="projects"
        aria-labelledby="projects-heading"
        className="snap-section relative mx-auto flex w-full max-w-7xl flex-col justify-center px-4 py-24 sm:px-6 lg:px-8"
      >
        <GlassCard className="py-12 text-center">
          <h2 id="projects-heading" className="text-2xl font-bold text-white">
            Project Case Study Showcase
          </h2>
          <p className="mt-2 text-sm text-slate-400">No projects published yet.</p>
        </GlassCard>
      </section>
    );
  }

  const accent = PROJECT_ACCENT[activeProject.id] ?? {
    border: 'border-cyan-400/35',
    accent: 'text-cyan-300',
    badge: 'cyan' as const,
  };

  const caseStudy = activeProject.caseStudy;
  const problemBlocks = [
    cleanText(caseStudy?.problemStatement),
    cleanText(caseStudy?.problemImportance),
  ].filter((item): item is string => item !== null);

  const builtParagraphs = [cleanText(caseStudy?.whatIBuilt)].filter(
    (item): item is string => item !== null,
  );
  const builtFeatures = cleanList(caseStudy?.featuresAndImplementation);

  const solutionBlocks = [
    cleanText(caseStudy?.solutionOverview),
    cleanText(caseStudy?.workflowAndOutcome),
  ].filter((item): item is string => item !== null);

  const architectureDiagramUrl = cleanText(caseStudy?.architectureDiagramUrl);
  const architectureSummary = cleanText(caseStudy?.architectureSummary);
  const customStages = cleanList(caseStudy?.architectureStages);
  const architectureStages =
    customStages.length > 0 ? customStages : cleanList(activeProject.architectureFlow);

  const hasArchitectureContent =
    Boolean(architectureDiagramUrl) ||
    Boolean(architectureSummary) ||
    architectureStages.length > 0;

  return (
    <section
      id="projects"
      aria-labelledby="projects-heading"
      className="snap-section relative mx-auto flex w-full max-w-7xl flex-col justify-center px-4 py-24 sm:px-6 lg:px-8"
    >
      <div className="mb-8 max-w-2xl">
        <p className="font-mono text-xs uppercase tracking-[0.24em] text-cyan-400">
          05 // Project Case Studies
        </p>
        <h2
          id="projects-heading"
          className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl"
        >
          Project Case Study <span className="text-gradient-universe">Showcase</span>
        </h2>
      </div>

      <div className="grid gap-6 lg:grid-cols-12 lg:items-start">
        {/* Project Selector */}
        <div
          role="tablist"
          aria-label="Project case study selector"
          className="flex flex-col gap-3 lg:col-span-4"
        >
          {projects.map((project, idx) => {
            const isSelected = idx === safeIndex;
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
                    ? 'glass-panel border-cyan-400/50 shadow-[0_0_24px_rgba(34,211,238,0.14)]'
                    : 'border-slate-800/80 bg-slate-950/60 hover:border-slate-700 hover:bg-slate-900/65',
                )}
              >
                <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-widest">
                  <span className={isSelected ? 'text-cyan-300' : 'text-slate-400'}>
                    0{idx + 1} // Case Study
                  </span>
                  <Layers
                    className={cn(
                      'h-4 w-4 transition-colors',
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

        {/* Consistent 4-Section Case Study Stage */}
        <div className="lg:col-span-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeProject.id}
              initial={reducedMotion ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reducedMotion ? undefined : { opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
            >
              <GlassCard className={cn('p-6 sm:p-8', accent.border)}>
                {/* Project Header */}
                <div className="border-b border-slate-800/80 pb-6">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <span className={cn('font-mono text-xs uppercase tracking-widest', accent.accent)}>
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
                          <span>GitHub</span>
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

                  <h3 className="mt-3 text-2xl font-bold tracking-tight text-white sm:text-3xl">
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

                  {activeProject.description ? (
                    <p className="mt-3 text-sm leading-relaxed text-slate-300 sm:text-base">
                      {activeProject.description}
                    </p>
                  ) : null}

                  {activeProject.techStack.length > 0 ? (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {activeProject.techStack.map((tech) => (
                        <TechBadge key={tech} label={tech} tone={accent.badge} />
                      ))}
                    </div>
                  ) : null}
                </div>

                {/* 4 Consistent Case Study Sections */}
                <div className="mt-6 grid gap-4">
                  <CaseStudySectionCard
                    index="01"
                    title="Problem Statement"
                    accentClass={accent.accent}
                    paragraphs={problemBlocks}
                  />

                  <CaseStudySectionCard
                    index="02"
                    title="What I Built"
                    accentClass={accent.accent}
                    paragraphs={builtParagraphs}
                    bullets={builtFeatures}
                  />

                  <CaseStudySectionCard
                    index="03"
                    title="Solution"
                    accentClass={accent.accent}
                    paragraphs={solutionBlocks}
                  />

                  <section
                    aria-label="04 System Architecture"
                    className="rounded-xl border border-slate-800/85 bg-slate-950/60 p-4 sm:p-5"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="inline-flex items-center font-mono text-xs font-semibold uppercase tracking-[0.18em] text-white">
                        <Workflow
                          className={cn('mr-2 h-3.5 w-3.5', accent.accent)}
                          aria-hidden="true"
                        />
                        <span className={cn('mr-2', accent.accent)}>04</span>
                        <span className="text-slate-500">—</span>
                        <span className="ml-2">System Architecture</span>
                      </h4>
                    </div>

                    {hasArchitectureContent ? (
                      <div className="mt-4 space-y-4">
                        {architectureDiagramUrl ? (
                          <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-950/85">
                            <img
                              src={architectureDiagramUrl}
                              alt={`${activeProject.title} system architecture`}
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                              }}
                              className="max-h-72 w-full object-contain"
                            />
                          </div>
                        ) : null}

                        {architectureStages.length > 0 ? (
                          <div className="flex flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:items-center">
                            {architectureStages.map((stage, stageIdx) => (
                              <div key={stage} className="flex items-center gap-2">
                                <div className="rounded-xl border border-cyan-400/25 bg-slate-900/85 px-3 py-2 font-mono text-xs text-slate-100">
                                  {stage}
                                </div>
                                {stageIdx < architectureStages.length - 1 ? (
                                  <ArrowRight
                                    className="hidden h-3.5 w-3.5 shrink-0 text-cyan-400 sm:block"
                                    aria-hidden="true"
                                  />
                                ) : null}
                              </div>
                            ))}
                          </div>
                        ) : null}

                        {architectureSummary ? (
                          <p className="text-sm leading-relaxed text-slate-300">
                            {architectureSummary}
                          </p>
                        ) : null}
                      </div>
                    ) : null}
                  </section>
                </div>
              </GlassCard>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
