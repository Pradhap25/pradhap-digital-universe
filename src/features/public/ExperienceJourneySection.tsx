import { motion, useScroll, useTransform } from 'framer-motion';
import { Briefcase, Calendar, MapPin } from 'lucide-react';
import { useRef } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { TechBadge } from '@/components/ui/TechBadge';
import type { ExperienceCompanyKey } from '@/features/three/types';
import { useReducedMotionPref } from '@/hooks/useReducedMotionPref';
import type { ExperienceItem } from '@/types/portfolio';

interface ExperienceJourneySectionProps {
  experiences: ExperienceItem[];
  onCompanyInView?: (company: ExperienceCompanyKey) => void;
}

export function ExperienceJourneySection({
  experiences,
  onCompanyInView,
}: ExperienceJourneySectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotionPref();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start 0.75', 'end 0.4'],
  });

  const beamScaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section
      ref={sectionRef}
      id="experience"
      aria-labelledby="experience-heading"
      className="snap-section relative mx-auto flex w-full max-w-7xl flex-col justify-center px-4 py-24 sm:px-6 lg:px-8"
    >
      <div className="mb-10 max-w-2xl">
        <p className="font-mono text-xs uppercase tracking-[0.24em] text-blue-400">
          04 // Career Journey
        </p>
        <h2
          id="experience-heading"
          className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl"
        >
          Industry &amp; Engineering <span className="text-gradient-universe">Timeline</span>
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-slate-300 sm:text-base">
          Enterprise data analytics automation and machine learning data intelligence across LivaNova and SAP Labs.
        </p>
      </div>

      <div className="relative pl-6 sm:pl-10">
        {/* Base Track Line */}
        <div
          aria-hidden="true"
          className="absolute top-2 bottom-2 left-2 w-px bg-slate-800 sm:left-4"
        />

        {/* Scroll-linked Glowing Energy Beam */}
        <motion.div
          aria-hidden="true"
          style={reducedMotion ? undefined : { scaleY: beamScaleY, transformOrigin: 'top' }}
          className="absolute top-2 bottom-2 left-2 w-[2px] bg-gradient-to-b from-cyan-400 via-blue-500 to-purple-500 shadow-[0_0_16px_rgba(34,211,238,0.65)] sm:left-4"
        />

        <div className="space-y-6">
          {experiences.map((exp, index) => {
            const companyKey: ExperienceCompanyKey = exp.company
              .toLowerCase()
              .includes('livanova')
              ? 'livanova'
              : 'sap';

            return (
              <motion.article
                key={exp.id}
                initial={reducedMotion ? undefined : { opacity: 0, x: 24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: false, amount: 0.45 }}
                onViewportEnter={() => onCompanyInView?.(companyKey)}
                onMouseEnter={() => onCompanyInView?.(companyKey)}
                transition={{ duration: 0.5, delay: index * 0.06, ease: 'easeOut' }}
                className="relative"
              >
              {/* Timeline Node Marker */}
              <span
                aria-hidden="true"
                className="absolute top-7 -left-[22px] flex h-4 w-4 items-center justify-center rounded-full border border-cyan-300 bg-[#030614] shadow-[0_0_14px_rgba(34,211,238,0.8)] sm:-left-[31px]"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
              </span>

              <GlassCard glowAccent={index === 0 ? 'cyan' : index === 1 ? 'blue' : 'purple'}>
                <div className="flex flex-col justify-between gap-4 border-b border-slate-800/80 pb-4 md:flex-row md:items-center">
                  <div>
                    <div className="flex flex-wrap items-center gap-2.5">
                      {exp.logoUrl ? (
                        <span
                          className={
                            companyKey === 'livanova'
                              ? 'inline-flex h-8 items-center rounded-lg bg-slate-100/95 px-2.5 py-1 shadow-sm'
                              : 'inline-flex h-8 items-center rounded-lg bg-slate-950/60 px-2 py-1'
                          }
                        >
                          <img
                            src={exp.logoUrl}
                            alt={`${exp.company} logo`}
                            className="h-5 w-auto object-contain"
                          />
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-lg border border-blue-400/30 bg-blue-500/15 px-2.5 py-1 font-mono text-xs font-semibold text-blue-200">
                          <Briefcase className="h-3.5 w-3.5" aria-hidden="true" />
                          {exp.company}
                        </span>
                      )}
                      <span className="font-mono text-[11px] uppercase tracking-wider text-purple-300">
                        {exp.employmentType}
                        {exp.statusLabel ? ` • ${exp.statusLabel}` : ''}
                      </span>
                    </div>
                    <h3 className="mt-2.5 text-xl font-bold text-white">{exp.role}</h3>
                  </div>

                  <div className="flex flex-wrap gap-3 font-mono text-xs text-slate-300">
                    <span className="inline-flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900/70 px-3 py-1.5">
                      <Calendar className="h-3.5 w-3.5 text-cyan-400" aria-hidden="true" />
                      {exp.startDate === exp.endDate
                        ? exp.startDate
                        : `${exp.startDate} – ${exp.endDate}`}
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900/70 px-3 py-1.5">
                      <MapPin className="h-3.5 w-3.5 text-purple-400" aria-hidden="true" />
                      {exp.location}
                    </span>
                  </div>
                </div>

                <ul className="mt-4 space-y-2.5 text-sm leading-relaxed text-slate-300">
                  {exp.highlights.map((bullet) => (
                    <li key={bullet} className="flex items-start gap-2.5">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-400" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-5 flex flex-wrap gap-2">
                  {exp.techStack.map((tech) => (
                    <TechBadge key={tech} label={tech} tone="slate" />
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
