import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowDown, ArrowRight, Code2, FileDown, Github, Sparkles } from 'lucide-react';
import { useRef } from 'react';
import { NeonLinkButton } from '@/components/ui/NeonButton';
import { TechBadge } from '@/components/ui/TechBadge';
import { useReducedMotionPref } from '@/hooks/useReducedMotionPref';
import type { SiteProfile } from '@/types/portfolio';

interface HeroSectionProps {
  profile: SiteProfile;
}

export function HeroSection({ profile }: HeroSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotionPref();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });

  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '22%']);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0.15]);

  return (
    <section
      ref={sectionRef}
      id="identity"
      aria-labelledby="hero-heading"
      className="snap-section relative flex items-center px-4 pt-24 pb-24 sm:px-6 lg:px-8"
    >
      <motion.div
        style={reducedMotion ? undefined : { y: contentY, opacity: contentOpacity }}
        className="mx-auto w-full max-w-7xl"
      >
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-cyan-400/30 bg-slate-950/70 px-4 py-1.5 text-xs font-medium text-cyan-200 backdrop-blur-md"
          >
            <span className="h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_10px_#22d3ee]" />
            <span>{profile.availabilityStatus}</span>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.06 }}
            className="font-mono text-xs uppercase tracking-[0.26em] text-blue-300 sm:text-sm"
          >
            {profile.fullName} &bull; {profile.location}
          </motion.p>

          <motion.h1
            id="hero-heading"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.12 }}
            className="mt-4 text-4xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl lg:leading-[1.06]"
          >
            <span className="text-gradient-universe block">{profile.heroHeadline}</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg"
          >
            {profile.tagline}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.28 }}
            className="mt-9 flex flex-wrap items-center gap-4"
          >
            <NeonLinkButton href={profile.primaryCtaHref || '#projects'} variant="primary">
              <span>{profile.primaryCtaLabel || 'Enter Innovation World'}</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </NeonLinkButton>
            <NeonLinkButton href={profile.secondaryCtaHref || '#about'} variant="secondary">
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              <span>{profile.secondaryCtaLabel || 'Explore Identity'}</span>
            </NeonLinkButton>
            {profile.resumeUrl ? (
              <NeonLinkButton
                href={profile.resumeUrl}
                target="_blank"
                rel="noreferrer"
                variant="secondary"
              >
                <FileDown className="h-4 w-4" aria-hidden="true" />
                <span>Resume</span>
              </NeonLinkButton>
            ) : null}
            {profile.githubUrl ? (
              <a
                href={profile.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-700/80 bg-slate-900/60 px-4 py-2.5 text-sm text-slate-200 transition-colors hover:border-cyan-400/50 hover:text-cyan-200"
              >
                <Github className="h-4 w-4" aria-hidden="true" />
                <span>GitHub</span>
              </a>
            ) : null}
            {profile.leetcodeUrl ? (
              <a
                href={profile.leetcodeUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-700/80 bg-slate-900/60 px-4 py-2.5 text-sm text-slate-200 transition-colors hover:border-purple-400/50 hover:text-purple-200"
              >
                <Code2 className="h-4 w-4" aria-hidden="true" />
                <span>LeetCode</span>
              </a>
            ) : null}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.36 }}
            className="mt-10 flex flex-wrap gap-2"
          >
            <TechBadge label="Python & AI/ML" tone="cyan" />
            <TechBadge label="LLMs • RAG • MCP" tone="purple" />
            <TechBadge label="YOLOv11 & Computer Vision" tone="blue" />
            <TechBadge label="Azure Synapse & Power Platform" tone="slate" />
          </motion.div>
        </div>

        {/* Scroll Telemetry Prompt */}
        <motion.a
          href="#about"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.55, duration: 0.6 }}
          className="mt-14 inline-flex items-center gap-3 font-mono text-xs uppercase tracking-[0.22em] text-slate-400 transition-colors hover:text-cyan-300"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-full border border-cyan-400/35 bg-cyan-500/10 text-cyan-300">
            <ArrowDown className="h-4 w-4 animate-bounce" aria-hidden="true" />
          </span>
          <span>Scroll to transform the universe</span>
        </motion.a>
      </motion.div>
    </section>
  );
}
