import { motion, useScroll, useTransform } from 'framer-motion';
import { BookOpen, Calendar, ExternalLink, FileText, FlaskConical, Radar } from 'lucide-react';
import { useRef } from 'react';
import { cn } from '@/components/ui/cn';
import { GlassCard } from '@/components/ui/GlassCard';
import { TechBadge } from '@/components/ui/TechBadge';
import { useReducedMotionPref } from '@/hooks/useReducedMotionPref';
import type { ResearchItem, ResearchStatus } from '@/types/portfolio';

interface ResearchLabSectionProps {
  research: ResearchItem[];
}

const STATUS_BADGE: Record<ResearchStatus, { label: string; style: string }> = {
  Draft: {
    label: 'Draft',
    style: 'border-slate-600 bg-slate-800 text-slate-200',
  },
  Submitted: {
    label: 'Submitted',
    style: 'border-amber-400/45 bg-amber-500/15 text-amber-200',
  },
  Accepted: {
    label: 'Accepted',
    style: 'border-blue-400/45 bg-blue-500/15 text-blue-200',
  },
  Published: {
    label: 'Published',
    style: 'border-emerald-400/45 bg-emerald-500/15 text-emerald-200',
  },
  Conference: {
    label: 'IEEE Conference Research',
    style: 'border-cyan-400/45 bg-cyan-500/15 text-cyan-200',
  },
};

export function ResearchLabSection({ research }: ResearchLabSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotionPref();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const panelY = useTransform(scrollYProgress, [0, 0.5, 1], [32, 0, -24]);

  return (
    <section
      ref={sectionRef}
      id="research"
      aria-labelledby="research-heading"
      className="snap-section relative mx-auto flex w-full max-w-7xl flex-col justify-center px-4 py-24 sm:px-6 lg:px-8"
    >
      <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl">
          <p className="font-mono text-xs uppercase tracking-[0.24em] text-purple-300">
            10 // Future Innovation Lab
          </p>
          <h2
            id="research-heading"
            className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl"
          >
            Publications &amp; <span className="text-gradient-universe">Research Lab</span>
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-300 sm:text-base">
            Peer-reviewed computer vision research and an extensible data-driven lab schema managed dynamically through the CMS.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 self-start rounded-xl border border-purple-400/30 bg-purple-500/10 px-3.5 py-2 font-mono text-xs text-purple-200">
          <Radar className="h-4 w-4 text-purple-300" aria-hidden="true" />
          <span>{research.length} Track{research.length === 1 ? '' : 's'}</span>
        </div>
      </div>

      {research.length === 0 ? (
        <GlassCard className="py-10 text-center">
          <p className="text-sm text-slate-400">No research publications published yet.</p>
        </GlassCard>
      ) : (
        <motion.div
          style={reducedMotion ? undefined : { y: panelY }}
          className="space-y-6"
        >
          {research.map((item) => {
            const statusMeta = STATUS_BADGE[item.status] ?? STATUS_BADGE.Draft;
            return (
              <GlassCard
                key={item.id}
                glowAccent="purple"
                className="relative overflow-hidden p-6 sm:p-8"
              >
                <div className="relative z-10">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span
                        className={cn(
                          'inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-mono text-xs',
                          statusMeta.style,
                        )}
                      >
                        <FlaskConical className="h-3.5 w-3.5" aria-hidden="true" />
                        {statusMeta.label}
                      </span>
                      {item.venue ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-700 bg-slate-900/75 px-3 py-1 font-mono text-xs text-slate-200">
                          <BookOpen className="h-3.5 w-3.5 text-cyan-400" aria-hidden="true" />
                          {item.venue}
                        </span>
                      ) : null}
                    </div>

                    {item.publishedDate ? (
                      <span className="inline-flex items-center gap-1.5 font-mono text-xs text-cyan-300">
                        <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
                        {item.publishedDate}
                      </span>
                    ) : null}
                  </div>

                  <p className="mt-4 font-mono text-xs uppercase tracking-wider text-blue-300">
                    {item.domain}
                    {item.authors ? ` • ${item.authors}` : ''}
                  </p>
                  <h3 className="mt-1.5 text-xl font-bold text-white sm:text-2xl">
                    {item.title}
                  </h3>
                  {item.doi ? (
                    <p className="mt-1 font-mono text-xs text-slate-400">DOI: {item.doi}</p>
                  ) : null}

                  {item.highlights.length > 0 ? (
                    <ul className="mt-4 space-y-2.5 text-sm leading-relaxed text-slate-300">
                      {item.highlights.map((bullet) => (
                        <li key={bullet} className="flex items-start gap-2.5">
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-purple-400" />
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-4 text-sm leading-relaxed text-slate-300">
                      {item.abstract}
                    </p>
                  )}

                  {typeof item.progressPercent === 'number' ? (
                    <div className="mt-5 max-w-md">
                      <div className="mb-1.5 flex justify-between font-mono text-xs text-slate-300">
                        <span>Prototype Progress</span>
                        <span className="text-cyan-300">{item.progressPercent}%</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-slate-800">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500"
                          style={{ width: `${item.progressPercent}%` }}
                        />
                      </div>
                    </div>
                  ) : null}

                  <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex flex-wrap gap-2">
                      {item.techTags.map((tag) => (
                        <TechBadge key={tag} label={tag} tone="purple" />
                      ))}
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {item.paperOrDemoUrl ? (
                        <a
                          href={item.paperOrDemoUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-xl border border-cyan-400/35 bg-cyan-500/10 px-3 py-1.5 font-mono text-xs text-cyan-200 hover:bg-cyan-500/20"
                        >
                          <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                          <span>Paper Link</span>
                        </a>
                      ) : null}
                      {item.pdfUrl ? (
                        <a
                          href={item.pdfUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-xl border border-purple-400/35 bg-purple-500/10 px-3 py-1.5 font-mono text-xs text-purple-200 hover:bg-purple-500/20"
                        >
                          <FileText className="h-3.5 w-3.5" aria-hidden="true" />
                          <span>PDF</span>
                        </a>
                      ) : null}
                    </div>
                  </div>
                </div>
              </GlassCard>
            );
          })}
        </motion.div>
      )}
    </section>
  );
}
