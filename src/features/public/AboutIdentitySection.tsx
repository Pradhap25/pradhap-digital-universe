import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { CutoutPortrait } from '@/components/ui/CutoutPortrait';
import { useReducedMotionPref } from '@/hooks/useReducedMotionPref';
import type { SiteProfile } from '@/types/portfolio';

interface AboutIdentitySectionProps {
  profile: SiteProfile;
}

export function AboutIdentitySection({
  profile,
}: AboutIdentitySectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotionPref();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const textY = useTransform(scrollYProgress, [0, 0.5, 1], [24, 0, -24]);

  return (
    <section
      ref={sectionRef}
      id="about"
      aria-labelledby="about-heading"
      className="snap-section relative mx-auto flex w-full max-w-7xl flex-col justify-center px-4 py-24 sm:px-6 lg:px-8"
    >
      <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
        {/* Profile Photograph */}
        <div className="relative flex items-center justify-center lg:col-span-5">
          <div className="glass-panel relative z-10 flex h-[340px] w-[260px] flex-col items-center justify-between overflow-hidden rounded-[2rem] border border-cyan-400/25 p-4 shadow-[0_24px_60px_-24px_rgba(34,211,238,0.25)] sm:h-[385px] sm:w-[295px]">
            {profile.portraitUrl ? (
              <div className="relative flex h-full w-full flex-col items-center justify-end overflow-hidden rounded-2xl bg-[radial-gradient(circle_at_50%_35%,rgba(34,211,238,0.12),rgba(15,23,42,0.88)_75%)]">
                <CutoutPortrait
                  src={profile.portraitUrl}
                  alt={`${profile.fullName} portrait`}
                  className="h-[94%] w-auto object-contain object-bottom"
                />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-[#060b1c] via-[#060b1c]/65 to-transparent" />
                <div className="absolute inset-x-3 bottom-2.5 flex items-center justify-between rounded-xl border border-cyan-400/25 bg-slate-950/75 px-3 py-1.5 backdrop-blur-md">
                  <span className="text-xs font-semibold text-white">{profile.fullName}</span>
                  <span className="font-mono text-[10px] text-cyan-300">AI &amp; DS</span>
                </div>
              </div>
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center rounded-2xl border border-slate-800/80 bg-slate-950/60 p-4 text-center">
                <p className="text-sm font-semibold text-white">{profile.fullName}</p>
                <p className="mt-1 font-mono text-[11px] text-cyan-300">Portrait Slot</p>
              </div>
            )}
          </div>
        </div>

        {/* Profile Summary */}
        <motion.div
          style={reducedMotion ? undefined : { y: textY }}
          className="space-y-6 lg:col-span-7"
        >
          <h2
            id="about-heading"
            className="text-3xl font-bold tracking-tight text-white sm:text-4xl"
          >
            <span className="text-gradient-universe">PROFILE</span>
          </h2>

          <motion.p
            initial={reducedMotion ? false : { opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.25 }}
            transition={{ duration: 0.45 }}
            className="text-base leading-relaxed text-slate-300 sm:text-[17px] sm:leading-8"
          >
            {profile.bio}
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
