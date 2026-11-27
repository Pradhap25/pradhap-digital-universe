import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { cn } from '@/components/ui/cn';
import { useReducedMotionPref } from '@/hooks/useReducedMotionPref';
import type { ProjectItem } from '@/types/portfolio';

interface ProjectsWorldSectionProps {
  projects: ProjectItem[];
  onProjectChange?: (projectId: string) => void;
}

interface CaseStudyStageData {
  index: string;
  title: string;
  accentClass: string;
  lineClass: string;
  paragraphs: string[];
  bullets: string[];
  diagramUrl?: string | null;
  stages: string[];
}

function cleanText(value?: string): string | null {
  const trimmed = value?.trim();
  return trimmed && trimmed.length > 0 ? trimmed : null;
}

function cleanList(items?: string[]): string[] {
  return (items ?? []).map((item) => item.trim()).filter((item) => item.length > 0);
}

function buildCaseStudyStages(project: ProjectItem): CaseStudyStageData[] {
  const cs = project.caseStudy;

  const problemParagraphs = [
    cleanText(cs?.problemStatement),
    cleanText(cs?.problemImportance),
  ].filter((item): item is string => item !== null);

  const builtParagraphs = [cleanText(cs?.whatIBuilt)].filter(
    (item): item is string => item !== null,
  );
  const builtBullets = cleanList(cs?.featuresAndImplementation);

  const solutionParagraphs = [
    cleanText(cs?.solutionOverview),
    cleanText(cs?.workflowAndOutcome),
  ].filter((item): item is string => item !== null);

  const archSummary = cleanText(cs?.architectureSummary);
  const archParagraphs = archSummary ? [archSummary] : [];
  const archDiagramUrl = cleanText(cs?.architectureDiagramUrl);
  const archStages = cleanList(cs?.architectureStages);

  return [
    {
      index: '01',
      title: 'Problem Statement',
      accentClass: 'text-cyan-300',
      lineClass: 'from-cyan-400/75 via-blue-500/40 to-transparent',
      paragraphs: problemParagraphs,
      bullets: [],
      stages: [],
    },
    {
      index: '02',
      title: 'What I Built',
      accentClass: 'text-blue-300',
      lineClass: 'from-blue-400/75 via-cyan-400/40 to-transparent',
      paragraphs: builtParagraphs,
      bullets: builtBullets,
      stages: [],
    },
    {
      index: '03',
      title: 'Solution',
      accentClass: 'text-purple-300',
      lineClass: 'from-purple-400/75 via-blue-400/40 to-transparent',
      paragraphs: solutionParagraphs,
      bullets: [],
      stages: [],
    },
    {
      index: '04',
      title: 'System Architecture',
      accentClass: 'text-cyan-300',
      lineClass: 'from-cyan-400/75 via-purple-400/40 to-transparent',
      paragraphs: archParagraphs,
      bullets: [],
      diagramUrl: archDiagramUrl,
      stages: archStages,
    },
  ];
}

export function ProjectsWorldSection({
  projects,
  onProjectChange,
}: ProjectsWorldSectionProps) {
  const reducedMotion = useReducedMotionPref();
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeStageIndex, setActiveStageIndex] = useState(0);
  const readerRef = useRef<HTMLDivElement>(null);

  const safeIndex = projects.length > 0 ? Math.min(activeIndex, projects.length - 1) : 0;
  const activeProject = projects[safeIndex] ?? null;

  useEffect(() => {
    setActiveStageIndex(0);
    if (readerRef.current) {
      readerRef.current.scrollTo({ top: 0, behavior: 'auto' });
    }
  }, [activeProject?.id]);

  if (!activeProject) {
    return (
      <section
        id="projects"
        aria-labelledby="projects-heading"
        className="snap-section relative mx-auto flex w-full max-w-7xl flex-col justify-center px-4 py-24 sm:px-6 lg:px-8"
      >
        <div className="border-t border-slate-800/80 py-12 text-center">
          <h2 id="projects-heading" className="text-2xl font-bold text-white">
            Projects
          </h2>
          <p className="mt-2 text-sm text-slate-400">No projects published yet.</p>
        </div>
      </section>
    );
  }

  const stages = buildCaseStudyStages(activeProject);

  const handleSelectProject = (idx: number, projectId: string) => {
    setActiveIndex(idx);
    setActiveStageIndex(0);
    if (readerRef.current) {
      readerRef.current.scrollTo({ top: 0, behavior: 'auto' });
    }
    onProjectChange?.(projectId);
  };

  const handleReaderScroll = () => {
    const el = readerRef.current;
    if (!el || el.clientHeight <= 0) return;
    const nextStage = Math.min(
      stages.length - 1,
      Math.max(0, Math.round(el.scrollTop / el.clientHeight)),
    );
    if (nextStage !== activeStageIndex) {
      setActiveStageIndex(nextStage);
    }
  };

  const scrollToStage = (stageIdx: number) => {
    const el = readerRef.current;
    if (!el) return;
    setActiveStageIndex(stageIdx);
    el.scrollTo({
      top: stageIdx * el.clientHeight,
      behavior: reducedMotion ? 'auto' : 'smooth',
    });
  };

  return (
    <section
      id="projects"
      aria-labelledby="projects-heading"
      className="snap-section relative mx-auto flex w-full max-w-7xl flex-col justify-center px-4 py-24 sm:px-6 lg:px-8"
    >
      <div className="grid gap-8 lg:grid-cols-12 lg:items-start lg:gap-12">
        {/* LEFT COLUMN — Persistent Minimal Project Navigation */}
        <aside className="lg:sticky lg:top-28 lg:col-span-4">
          <p className="font-mono text-xs uppercase tracking-[0.24em] text-cyan-400">
            05 // Projects
          </p>
          <h2
            id="projects-heading"
            className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl"
          >
            Selected <span className="text-gradient-universe">Case Studies</span>
          </h2>

          {/* Mobile Compact Selector */}
          <div
            role="tablist"
            aria-label="Project selector"
            className="mt-5 flex flex-col gap-2 lg:hidden"
          >
            {projects.map((project, idx) => {
              const isSelected = idx === safeIndex;
              return (
                <button
                  key={project.id}
                  role="tab"
                  type="button"
                  aria-selected={isSelected}
                  onClick={() => handleSelectProject(idx, project.id)}
                  className={cn(
                    'w-full cursor-pointer border-l-2 py-2 pl-3.5 text-left text-sm font-medium transition-colors',
                    isSelected
                      ? 'border-cyan-400 text-white'
                      : 'border-slate-800 text-slate-400 hover:border-slate-600 hover:text-slate-200',
                  )}
                >
                  {project.title}
                </button>
              );
            })}
          </div>

          {/* Desktop Persistent Sticky Navigation */}
          <nav
            role="tablist"
            aria-label="Project navigation"
            className="mt-8 hidden space-y-2 lg:block"
          >
            {projects.map((project, idx) => {
              const isSelected = idx === safeIndex;
              return (
                <button
                  key={project.id}
                  role="tab"
                  type="button"
                  aria-selected={isSelected}
                  onClick={() => handleSelectProject(idx, project.id)}
                  className={cn(
                    'block w-full cursor-pointer border-l-2 py-3 pl-4 text-left text-sm font-medium leading-snug transition-all sm:text-base',
                    isSelected
                      ? 'border-cyan-400 bg-cyan-500/5 text-white'
                      : 'border-slate-800 text-slate-400 hover:border-slate-600 hover:text-slate-200',
                  )}
                >
                  {project.title}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* RIGHT COLUMN — Scroll-Driven Project Details */}
        <div className="lg:col-span-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeProject.id}
              initial={reducedMotion ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reducedMotion ? undefined : { opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
            >
              {/* Project Title Header & Stage Indicator */}
              <div className="flex flex-wrap items-end justify-between gap-4 border-b border-slate-800/80 pb-4">
                <h3 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                  {activeProject.title}
                </h3>

                <div
                  aria-label="Case study scroll stages"
                  className="flex items-center gap-2 font-mono text-[11px]"
                >
                  {stages.map((stage, stageIdx) => {
                    const isCurrent = stageIdx === activeStageIndex;
                    return (
                      <button
                        key={stage.index}
                        type="button"
                        onClick={() => scrollToStage(stageIdx)}
                        className={cn(
                          'cursor-pointer rounded-md px-2 py-1 transition-colors',
                          isCurrent
                            ? 'bg-cyan-500/15 text-cyan-300'
                            : 'text-slate-500 hover:text-slate-300',
                        )}
                      >
                        {stage.index}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Scrollable Reading Container (reveals one case-study section sequentially) */}
              <div
                ref={readerRef}
                onScroll={handleReaderScroll}
                tabIndex={0}
                aria-label={`${activeProject.title} case study sections`}
                className="h-[52svh] snap-y snap-mandatory overflow-y-auto pr-2 focus:outline-none sm:h-[56svh] sm:pr-4 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-cyan-400/25 [&::-webkit-scrollbar-track]:bg-transparent"
              >
                {stages.map((stage, stageIdx) => {
                  const isActiveStage = stageIdx === activeStageIndex;
                  const hasContent =
                    stage.paragraphs.length > 0 ||
                    stage.bullets.length > 0 ||
                    Boolean(stage.diagramUrl) ||
                    stage.stages.length > 0;

                  return (
                    <motion.article
                      key={`${activeProject.id}-${stage.index}`}
                      animate={
                        reducedMotion
                          ? undefined
                          : {
                              opacity: isActiveStage ? 1 : 0.25,
                              y: isActiveStage ? 0 : 12,
                            }
                      }
                      transition={{ duration: 0.35, ease: 'easeOut' }}
                      className="flex min-h-[52svh] snap-start flex-col justify-center py-8 sm:min-h-[56svh]"
                    >
                      <div className="max-w-2xl">
                        <p
                          className={cn(
                            'font-mono text-xs uppercase tracking-[0.22em]',
                            stage.accentClass,
                          )}
                        >
                          {stage.index} — {stage.title}
                        </p>
                        <h4 className="mt-2.5 text-xl font-semibold tracking-tight text-white sm:text-2xl">
                          {stage.title}
                        </h4>
                        <div
                          aria-hidden="true"
                          className={cn('mt-3 h-px w-24 bg-gradient-to-r', stage.lineClass)}
                        />

                        {/* Empty reading space until actual content is provided */}
                        <div className="mt-6 min-h-[11rem]">
                          {hasContent ? (
                            <div className="space-y-4 text-sm leading-relaxed text-slate-300 sm:text-base sm:leading-7">
                              {stage.diagramUrl ? (
                                <div className="overflow-hidden rounded-xl border border-slate-800/80 bg-slate-950/60">
                                  <img
                                    src={stage.diagramUrl}
                                    alt={`${activeProject.title} architecture diagram`}
                                    onError={(e) => {
                                      e.currentTarget.style.display = 'none';
                                    }}
                                    className="max-h-64 w-full object-contain"
                                  />
                                </div>
                              ) : null}

                              {stage.stages.length > 0 ? (
                                <div className="flex flex-wrap items-center gap-2 font-mono text-xs text-slate-200">
                                  {stage.stages.map((item, idx) => (
                                    <span key={item} className="inline-flex items-center gap-2">
                                      <span className="border-b border-cyan-400/35 pb-0.5">
                                        {item}
                                      </span>
                                      {idx < stage.stages.length - 1 ? (
                                        <span className="text-cyan-400">&rarr;</span>
                                      ) : null}
                                    </span>
                                  ))}
                                </div>
                              ) : null}

                              {stage.paragraphs.map((text) => (
                                <p key={text}>{text}</p>
                              ))}

                              {stage.bullets.length > 0 ? (
                                <ul className="space-y-2.5 pt-1">
                                  {stage.bullets.map((bullet) => (
                                    <li key={bullet} className="flex items-start gap-2.5">
                                      <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-400" />
                                      <span>{bullet}</span>
                                    </li>
                                  ))}
                                </ul>
                              ) : null}
                            </div>
                          ) : null}
                        </div>
                      </div>
                    </motion.article>
                  );
                })}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
