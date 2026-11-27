import { motion, type MotionValue, useTransform } from 'framer-motion';
import { lazy, Suspense } from 'react';
import { ErrorBoundary } from '@/components/feedback/ErrorBoundary';
import { useReducedMotionPref } from '@/hooks/useReducedMotionPref';
import type { PortfolioSectionId } from '@/types/portfolio';
import type { UniverseVisualState } from './types';

const UniverseCanvas = lazy(() => import('@/features/three/UniverseCanvas'));

interface UniverseBackdropProps {
  scrollYProgress: MotionValue<number>;
  visualState: UniverseVisualState;
  activeSkillLogoUrl?: string;
}

const SECTION_ACCENT_LINE: Record<PortfolioSectionId, string> = {
  identity: 'from-transparent via-cyan-400/35 to-transparent',
  about: 'from-transparent via-sky-400/35 to-transparent',
  education: 'from-transparent via-blue-400/35 to-transparent',
  experience: 'from-transparent via-blue-400/35 to-transparent',
  skills: 'from-transparent via-cyan-300/40 to-transparent',
  interests: 'from-transparent via-purple-400/40 to-transparent',
  projects: 'from-transparent via-emerald-400/35 to-transparent',
  achievements: 'from-transparent via-amber-400/35 to-transparent',
  certifications: 'from-transparent via-cyan-400/35 to-transparent',
  research: 'from-transparent via-purple-400/40 to-transparent',
  contact: 'from-transparent via-cyan-400/35 to-transparent',
};

export function UniverseBackdrop({
  scrollYProgress,
  visualState,
  activeSkillLogoUrl,
}: UniverseBackdropProps) {
  const reducedMotion = useReducedMotionPref();
  const gridShiftY = useTransform(scrollYProgress, [0, 1], ['0px', '-70px']);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[#030614]"
    >
      {/* Crisp subtle depth grid without fog/blur */}
      <motion.div
        style={reducedMotion ? undefined : { y: gridShiftY }}
        className="universe-grid-bg absolute -inset-24 opacity-55"
      />

      {/* Sharp directional accent light beam */}
      <div
        className={`absolute inset-x-0 top-0 h-px bg-gradient-to-r transition-colors duration-700 ${
          SECTION_ACCENT_LINE[visualState.activeSection]
        }`}
      />

      {/* Single shared lazy-loaded Three.js scene with crisp section objects */}
      <div className="absolute inset-0">
        <ErrorBoundary fallback={null}>
          <Suspense fallback={null}>
            <UniverseCanvas
              scrollYProgress={scrollYProgress}
              visualState={visualState}
              activeSkillLogoUrl={activeSkillLogoUrl}
            />
          </Suspense>
        </ErrorBoundary>
      </div>

      {/* Clean contrast edge scrim for text legibility */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_52%,rgba(3,6,20,0.58)_100%)]" />
    </div>
  );
}
