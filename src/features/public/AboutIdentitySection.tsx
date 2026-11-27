import { motion, useMotionValue, useScroll, useSpring, useTransform } from 'framer-motion';
import { useRef, type MouseEvent } from 'react';
import { CutoutPortrait } from '@/components/ui/CutoutPortrait';
import { TechBadge } from '@/components/ui/TechBadge';
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

  // Bidirectional scroll parallax for floating portrait stage & rings
  const portraitY = useTransform(scrollYProgress, [0, 0.5, 1], [55, 0, -55]);
  const ringRotate = useTransform(scrollYProgress, [0, 1], [-18, 22]);
  const textY = useTransform(scrollYProgress, [0, 0.5, 1], [30, 0, -25]);

  // Interactive pointer tilt on portrait frame
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const tiltX = useSpring(useTransform(pointerY, [-0.5, 0.5], [8, -8]), { stiffness: 150, damping: 20 });
  const tiltY = useSpring(useTransform(pointerX, [-0.5, 0.5], [-8, 8]), { stiffness: 150, damping: 20 });

  const handlePointerMove = (event: MouseEvent<HTMLDivElement>) => {
    if (reducedMotion) return;
    const rect = event.currentTarget.getBoundingClientRect();
    pointerX.set((event.clientX - rect.left) / rect.width - 0.5);
    pointerY.set((event.clientY - rect.top) / rect.height - 0.5);
  };

  const resetPointer = () => {
    pointerX.set(0);
    pointerY.set(0);
  };

  return (
    <section
      ref={sectionRef}
      id="about"
      aria-labelledby="about-heading"
      className="snap-section relative mx-auto flex w-full max-w-7xl flex-col justify-center px-4 py-24 sm:px-6 lg:px-8"
    >
      <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-14">
        {/* Floating Portrait Stage */}
        <motion.div
          style={reducedMotion ? undefined : { y: portraitY }}
          className="relative flex items-center justify-center lg:col-span-5"
        >
          <div
            onMouseMove={handlePointerMove}
            onMouseLeave={resetPointer}
            className="relative flex h-[380px] w-full max-w-[360px] items-center justify-center sm:h-[440px]"
            style={{ perspective: 1000 }}
          >
            {/* Crisp Rim Glow behind Portrait (zero fog) */}
            <div className="pointer-events-none absolute h-[290px] w-[240px] rounded-[2rem] border border-cyan-400/20 shadow-[0_0_55px_-12px_rgba(34,211,238,0.4)]" />

            {/* Scroll-rotating holographic orbital rings */}
            <motion.div
              style={reducedMotion ? undefined : { rotate: ringRotate }}
              className="pointer-events-none absolute h-[320px] w-[320px] rounded-full border border-dashed border-cyan-400/35 sm:h-[360px] sm:w-[360px]"
            />
            <motion.div
              style={reducedMotion ? undefined : { rotate: ringRotate }}
              className="pointer-events-none absolute h-[265px] w-[265px] rounded-full border border-purple-400/30 sm:h-[300px] sm:w-[300px]"
            />

            {/* Floating Portrait Frame */}
            <motion.div
              style={reducedMotion ? undefined : { rotateX: tiltX, rotateY: tiltY }}
              animate={reducedMotion ? undefined : { y: [-6, 6, -6] }}
              transition={reducedMotion ? undefined : { duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              className="glass-panel relative z-10 flex h-[340px] w-[260px] flex-col items-center justify-between overflow-hidden rounded-[2rem] border border-cyan-300/40 p-4 shadow-[0_30px_70px_-20px_rgba(34,211,238,0.35)] sm:h-[385px] sm:w-[295px]"
            >
              {profile.portraitUrl ? (
                <div className="relative flex h-full w-full flex-col items-center justify-end overflow-hidden rounded-2xl bg-[radial-gradient(circle_at_50%_35%,rgba(34,211,238,0.18),rgba(15,23,42,0.85)_75%)]">
                  <CutoutPortrait
                    src={profile.portraitUrl}
                    alt={`${profile.fullName} portrait`}
                    className="h-[94%] w-auto object-contain object-bottom drop-shadow-[0_10px_25px_rgba(34,211,238,0.28)]"
                  />
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-[#060b1c] via-[#060b1c]/65 to-transparent" />
                  <div className="absolute inset-x-3 bottom-2.5 flex items-center justify-between rounded-xl border border-cyan-400/25 bg-slate-950/75 px-3 py-1.5 backdrop-blur-md">
                    <span className="text-xs font-semibold text-white">{profile.fullName}</span>
                    <span className="font-mono text-[10px] text-cyan-300">AI &amp; DS</span>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex w-full items-center justify-between font-mono text-[10px] uppercase tracking-widest text-cyan-300/90">
                    <span>ID // 02</span>
                    <span className="inline-flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                      Portrait Slot
                    </span>
                  </div>

                  {/* Clean Silhouette Cutout Placeholder (No AI-generated face) */}
                  <div className="relative flex flex-1 items-center justify-center">
                    <div className="absolute h-40 w-40 rounded-full bg-gradient-to-b from-cyan-400/20 to-purple-500/20 blur-xl" />
                    <svg
                      viewBox="0 0 180 210"
                      className="relative z-10 h-44 w-40 text-cyan-200/80"
                      fill="none"
                      aria-hidden="true"
                    >
                      <circle
                        cx="90"
                        cy="66"
                        r="32"
                        stroke="currentColor"
                        strokeWidth="1.75"
                        strokeDasharray="4 4"
                      />
                      <path
                        d="M34 178C38 138 61 118 90 118C119 118 142 138 146 178"
                        stroke="url(#portraitGrad)"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                      <defs>
                        <linearGradient id="portraitGrad" x1="34" y1="118" x2="146" y2="178" gradientUnits="userSpaceOnUse">
                          <stop stopColor="#22D3EE" />
                          <stop offset="0.5" stopColor="#3B82F6" />
                          <stop offset="1" stopColor="#A855F7" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>

                  <div className="w-full rounded-xl border border-slate-700/80 bg-slate-950/70 px-3 py-2.5 text-center">
                    <p className="text-xs font-semibold text-white">{profile.fullName}</p>
                    <p className="mt-0.5 font-mono text-[10px] text-cyan-300">
                      Ready for transparent PNG portrait
                    </p>
                  </div>
                </>
              )}
            </motion.div>
          </div>
        </motion.div>

        {/* Identity Narrative & Education */}
        <motion.div
          style={reducedMotion ? undefined : { y: textY }}
          className="space-y-6 lg:col-span-7"
        >
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.24em] text-cyan-400">
              02 // Floating Human Identity
            </p>
            <h2
              id="about-heading"
              className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl"
            >
              Bridging <span className="text-gradient-universe">AI Intelligence</span> &amp; Enterprise Systems
            </h2>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.25 }}
            transition={{ duration: 0.45 }}
            className="text-base leading-relaxed text-slate-300"
          >
            {profile.bio}
          </motion.p>

          <div className="flex flex-wrap gap-3">
            <TechBadge label={profile.location} tone="cyan" />
            <TechBadge label={`Languages: ${profile.languages.join(' / ')}`} tone="purple" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
