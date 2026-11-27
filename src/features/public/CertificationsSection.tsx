import { motion } from 'framer-motion';
import { BadgeCheck, ExternalLink, FileText, ShieldCheck, Users } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { TechBadge } from '@/components/ui/TechBadge';
import { useReducedMotionPref } from '@/hooks/useReducedMotionPref';
import type { CertificationItem, LeadershipItem } from '@/types/portfolio';

interface CertificationsSectionProps {
  certifications: CertificationItem[];
  leadership: LeadershipItem[];
  softSkills: string[];
}

export function CertificationsSection({
  certifications,
  leadership,
  softSkills,
}: CertificationsSectionProps) {
  const reducedMotion = useReducedMotionPref();

  return (
    <section
      id="certifications"
      aria-labelledby="certifications-heading"
      className="snap-section relative mx-auto flex w-full max-w-7xl flex-col justify-center px-4 py-24 sm:px-6 lg:px-8"
    >
      <motion.div
        initial={reducedMotion ? undefined : { opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.25 }}
        transition={{ duration: 0.45 }}
      >
        <div className="mb-10 max-w-2xl">
          <p className="font-mono text-xs uppercase tracking-[0.24em] text-cyan-400">
            09 // Verified Credentials
          </p>
          <h2
            id="certifications-heading"
            className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl"
          >
            Certifications &amp; <span className="text-gradient-universe">Leadership</span>
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-300 sm:text-base">
            Technical training credentials alongside leadership responsibilities and collaborative strengths.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-12">
          <GlassCard glowAccent="cyan" className="p-6 lg:col-span-5">
            <div className="mb-4 flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-cyan-300">
              <BadgeCheck className="h-4 w-4" aria-hidden="true" />
              <span>Certifications &amp; Training</span>
            </div>

            {certifications.length === 0 ? (
              <p className="rounded-xl border border-dashed border-slate-800 p-4 text-xs text-slate-400">
                No certifications published yet.
              </p>
            ) : (
              <div className="space-y-3">
                {certifications.map((cert) => (
                  <div
                    key={cert.id}
                    className="flex items-start justify-between gap-3 rounded-xl border border-slate-800 bg-slate-950/65 px-4 py-4"
                  >
                    <div className="flex min-w-0 items-start gap-3">
                      {cert.issuerLogoUrl ? (
                        <img
                          src={cert.issuerLogoUrl}
                          alt=""
                          aria-hidden="true"
                          className="mt-0.5 h-6 w-6 shrink-0 rounded object-contain"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      ) : null}
                      <div className="min-w-0">
                        <h3 className="text-sm font-semibold text-white">{cert.title}</h3>
                        <p className="mt-0.5 text-xs text-slate-400">
                          Issued by {cert.issuer}
                          {cert.issueDate ? ` • ${cert.issueDate}` : ''}
                        </p>
                        {cert.credentialId ? (
                          <p className="mt-1 font-mono text-[10px] text-slate-500">
                            ID: {cert.credentialId}
                          </p>
                        ) : null}
                        <div className="mt-2 flex flex-wrap gap-2">
                          {cert.credentialUrl ? (
                            <a
                              href={cert.credentialUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 font-mono text-[11px] text-cyan-300 hover:underline"
                            >
                              <ExternalLink className="h-3 w-3" aria-hidden="true" />
                              <span>Verify</span>
                            </a>
                          ) : null}
                          {cert.certificateFileUrl ? (
                            <a
                              href={cert.certificateFileUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 font-mono text-[11px] text-purple-300 hover:underline"
                            >
                              <FileText className="h-3 w-3" aria-hidden="true" />
                              <span>Certificate</span>
                            </a>
                          ) : null}
                        </div>
                      </div>
                    </div>
                    <ShieldCheck className="h-5 w-5 shrink-0 text-cyan-400" aria-hidden="true" />
                  </div>
                ))}
              </div>
            )}
          </GlassCard>

          <GlassCard glowAccent="purple" className="p-6 lg:col-span-7">
            <div className="mb-4 flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-purple-300">
              <Users className="h-4 w-4" aria-hidden="true" />
              <span>Responsibility, Extracurricular &amp; Soft Skills</span>
            </div>

            {leadership.length === 0 ? (
              <p className="rounded-xl border border-dashed border-slate-800 p-4 text-xs text-slate-400">
                No leadership activities published yet.
              </p>
            ) : (
              <div className="grid gap-3 sm:grid-cols-3">
                {leadership.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-xl border border-slate-800 bg-slate-950/65 p-4"
                  >
                    <p className="font-mono text-[10px] uppercase tracking-wider text-purple-300">
                      {item.category}
                    </p>
                    <h3 className="mt-1.5 text-sm font-bold text-white">{item.role}</h3>
                    <p className="mt-1 text-xs text-slate-400">{item.organization}</p>
                    {item.startDate || item.endDate ? (
                      <p className="mt-1.5 font-mono text-[10px] text-slate-500">
                        {[item.startDate, item.endDate].filter(Boolean).join(' – ')}
                      </p>
                    ) : null}
                  </div>
                ))}
              </div>
            )}

            <div className="mt-5 flex flex-wrap gap-2">
              {softSkills.map((skill) => (
                <TechBadge key={skill} label={skill} tone="purple" />
              ))}
            </div>
          </GlassCard>
        </div>
      </motion.div>
    </section>
  );
}
