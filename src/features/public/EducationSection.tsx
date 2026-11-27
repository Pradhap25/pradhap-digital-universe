import { motion } from 'framer-motion';
import { GraduationCap } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { TechBadge } from '@/components/ui/TechBadge';
import { useReducedMotionPref } from '@/hooks/useReducedMotionPref';
import type { EducationItem } from '@/types/portfolio';

interface EducationSectionProps {
  education: EducationItem[];
}

export function EducationSection({ education }: EducationSectionProps) {
  const reducedMotion = useReducedMotionPref();

  return (
    <section
      id="education"
      aria-labelledby="education-heading"
      className="snap-section relative mx-auto flex w-full max-w-7xl flex-col justify-center px-4 py-24 sm:px-6 lg:px-8"
    >
      <div className="grid items-center gap-10 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <div className="mb-8">
            <p className="font-mono text-xs uppercase tracking-[0.24em] text-blue-400">
              03 // Education
            </p>
            <h2
              id="education-heading"
              className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl"
            >
              Academic <span className="text-gradient-universe">Foundation</span>
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-300 sm:text-base">
              Undergraduate specialization in Artificial Intelligence &amp; Data Science alongside foundational secondary schooling.
            </p>
          </div>

          {education.length === 0 ? (
            <GlassCard className="py-10 text-center">
              <p className="text-sm text-slate-400">No education entries published yet.</p>
            </GlassCard>
          ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {education.map((edu, index) => (
              <motion.article
                key={edu.id}
                initial={reducedMotion ? undefined : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.3 }}
                transition={{ duration: 0.45, delay: index * 0.08 }}
              >
                <GlassCard glowAccent={index === 0 ? 'cyan' : 'blue'} className="flex h-full flex-col justify-between p-6">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-cyan-400/35 bg-cyan-500/10 text-cyan-300">
                        {edu.logoUrl ? (
                          <img
                            src={edu.logoUrl}
                            alt=""
                            aria-hidden="true"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                            className="h-7 w-7 object-contain"
                          />
                        ) : (
                          <GraduationCap className="h-5 w-5" aria-hidden="true" />
                        )}
                      </span>
                      <TechBadge
                        label={edu.startDate ? `${edu.startDate} – ${edu.endDate}` : edu.endDate}
                        tone={index === 0 ? 'cyan' : 'blue'}
                      />
                    </div>

                    <h3 className="mt-4 text-lg font-bold text-white">
                      {edu.institution}
                    </h3>
                    <p className="mt-1.5 text-sm text-blue-200">
                      {edu.degree}
                      {edu.fieldOfStudy ? ` • ${edu.fieldOfStudy}` : ''}
                    </p>

                    {edu.highlights.length > 0 ? (
                      <ul className="mt-4 space-y-2 text-xs leading-relaxed text-slate-300">
                        {edu.highlights.map((item) => (
                          <li key={item} className="flex items-start gap-2">
                            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-400" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </div>

                  <div className="mt-5 border-t border-slate-800/80 pt-3">
                    {edu.gradeOrGpa ? (
                      <p className="font-mono text-xs text-purple-300">{edu.gradeOrGpa}</p>
                    ) : null}
                    {edu.statusLabel ? (
                      <p className="mt-1 font-mono text-[11px] text-cyan-300">
                        {edu.statusLabel}
                      </p>
                    ) : null}
                  </div>
                </GlassCard>
              </motion.article>
            ))}
          </div>
          )}
        </div>
      </div>
    </section>
  );
}
