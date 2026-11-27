import { motion, useScroll, useTransform } from 'framer-motion';
import { Award, Medal, Trophy } from 'lucide-react';
import { useRef } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { useReducedMotionPref } from '@/hooks/useReducedMotionPref';
import type { AchievementItem } from '@/types/portfolio';

interface ExcellenceHallSectionProps {
  achievements: AchievementItem[];
  onAchievementFocus?: (achievementId: string) => void;
}

function AwardEmblem({ badgeType }: { badgeType: AchievementItem['badgeType'] }) {
  if (badgeType === 'medal') {
    return (
      <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl border border-amber-400/45 bg-gradient-to-br from-amber-400/25 via-yellow-500/15 to-purple-500/20 text-amber-300 shadow-[0_0_25px_rgba(251,191,36,0.28)]">
        <Medal className="h-7 w-7" aria-hidden="true" />
      </div>
    );
  }
  if (badgeType === 'trophy') {
    return (
      <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-400/45 bg-gradient-to-br from-cyan-400/25 via-blue-500/15 to-purple-500/20 text-cyan-300 shadow-[0_0_25px_rgba(34,211,238,0.25)]">
        <Trophy className="h-7 w-7" aria-hidden="true" />
      </div>
    );
  }
  return (
    <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl border border-purple-400/45 bg-gradient-to-br from-purple-400/25 via-amber-400/15 to-cyan-500/20 text-purple-300 shadow-[0_0_25px_rgba(168,85,247,0.25)]">
      <Award className="h-7 w-7" aria-hidden="true" />
    </div>
  );
}

export function ExcellenceHallSection({
  achievements,
  onAchievementFocus,
}: ExcellenceHallSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotionPref();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const centerPedestalY = useTransform(scrollYProgress, [0, 0.5, 1], [32, -8, 24]);

  return (
    <section
      ref={sectionRef}
      id="achievements"
      aria-labelledby="achievements-heading"
      className="snap-section relative flex flex-col justify-center overflow-hidden py-24"
    >
      {/* Crisp Hall of Excellence Boundary (no opaque haze obscuring 3D medals/trophies) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 border-y border-amber-400/15"
      />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 max-w-2xl">
          <p className="font-mono text-xs uppercase tracking-[0.24em] text-amber-300">
            08 // Hall of Excellence
          </p>
          <h2
            id="achievements-heading"
            className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl"
          >
            Achievements &amp; <span className="text-gradient-universe">Honors</span>
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-300 sm:text-base">
            National engineering finalist recognition, hackathon innovation awards, and national athletics honors.
          </p>
        </div>

        {/* Floating Pedestal Gallery */}
        <div className="grid gap-6 md:grid-cols-3">
          {achievements.map((item, idx) => (
            <motion.article
              key={item.id}
              style={reducedMotion || idx !== 1 ? undefined : { y: centerPedestalY }}
              initial={reducedMotion ? undefined : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.35 }}
              onViewportEnter={() => onAchievementFocus?.(item.id)}
              onMouseEnter={() => onAchievementFocus?.(item.id)}
              onFocus={() => onAchievementFocus?.(item.id)}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
            >
              <GlassCard
                glowAccent={idx === 1 ? 'purple' : 'cyan'}
                className="flex h-full flex-col justify-between border-amber-400/20 p-6"
              >
                <div>
                  <div className="flex items-start justify-between gap-4">
                    <motion.div
                      animate={reducedMotion ? undefined : { y: [-3, 3, -3] }}
                      transition={
                        reducedMotion
                          ? undefined
                          : { duration: 4.5 + idx, repeat: Infinity, ease: 'easeInOut' }
                      }
                    >
                      <AwardEmblem badgeType={item.badgeType} />
                    </motion.div>
                    {item.achievedAt ? (
                      <span className="rounded-full border border-amber-400/35 bg-amber-500/10 px-3 py-1 font-mono text-[11px] text-amber-200">
                        {item.achievedAt}
                      </span>
                    ) : null}
                  </div>

                  <p className="mt-5 font-mono text-[11px] uppercase tracking-wider text-amber-300/90">
                    {item.category}
                  </p>
                  <h3 className="mt-1.5 text-lg font-bold text-white">{item.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-300">
                    {item.description}
                  </p>
                </div>

                <div className="mt-5 border-t border-slate-800/80 pt-3 font-mono text-[11px] text-slate-400">
                  {item.issuer}
                </div>
              </GlassCard>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
