import { Sparkles } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { type MutableRefObject, useMemo, useRef } from 'react';
import { Color, type PointLight } from 'three';
import type { PortfolioSectionId } from '@/types/portfolio';
import {
  AboutHaloGroup,
  AchievementsGroup,
  CertificationsGroup,
  ContactRelayGroup,
  EducationGroup,
  ExperienceGroup,
  HeroCoreGroup,
  ProjectsGroup,
  ResearchGroup,
  SkillsGroup,
} from './scenes/SectionSceneGroups';
import { InterestsGroup } from './scenes/InterestSceneGroup';
import type { UniverseVisualState } from './types';

interface UniverseSceneProps {
  scrollProgressRef: MutableRefObject<number>;
  visualState: UniverseVisualState;
  activeSkillLogoUrl?: string;
  isLowPower: boolean;
  reducedMotion: boolean;
}

const SECTION_LIGHTS: Record<PortfolioSectionId, { primary: string; secondary: string }> = {
  identity: { primary: '#22d3ee', secondary: '#a855f7' },
  about: { primary: '#38bdf8', secondary: '#818cf8' },
  education: { primary: '#3b82f6', secondary: '#fbbf24' },
  experience: { primary: '#3b82f6', secondary: '#22d3ee' },
  skills: { primary: '#06b6d4', secondary: '#6366f1' },
  interests: { primary: '#a855f7', secondary: '#22d3ee' },
  projects: { primary: '#2dd4bf', secondary: '#3b82f6' },
  achievements: { primary: '#fbbf24', secondary: '#a855f7' },
  certifications: { primary: '#22d3ee', secondary: '#3b82f6' },
  research: { primary: '#c084fc', secondary: '#22d3ee' },
  contact: { primary: '#22d3ee', secondary: '#3b82f6' },
};

export function UniverseScene({
  visualState,
  activeSkillLogoUrl,
  isLowPower,
  reducedMotion,
}: UniverseSceneProps) {
  const primaryLightRef = useRef<PointLight>(null);
  const secondaryLightRef = useRef<PointLight>(null);
  const targetPrimary = useMemo(() => new Color('#22d3ee'), []);
  const targetSecondary = useMemo(() => new Color('#a855f7'), []);

  useFrame((_state, delta) => {
    const palette = SECTION_LIGHTS[visualState.activeSection] ?? SECTION_LIGHTS.identity;
    const damp = Math.min(1, delta * 3);

    targetPrimary.set(palette.primary);
    targetSecondary.set(palette.secondary);

    if (primaryLightRef.current) {
      primaryLightRef.current.color.lerp(targetPrimary, damp);
    }
    if (secondaryLightRef.current) {
      secondaryLightRef.current.color.lerp(targetSecondary, damp);
    }
  });

  const sparkleCount = isLowPower ? 14 : 28;

  return (
    <>
      <ambientLight intensity={0.45} />
      <pointLight ref={primaryLightRef} position={[4.5, 4, 5]} intensity={28} color="#22d3ee" />
      <pointLight ref={secondaryLightRef} position={[-4.5, -3.5, 3]} intensity={20} color="#a855f7" />
      <directionalLight position={[0, 6, 3]} intensity={1.4} color="#e2e8f0" />

      {/* Section-Specific 3D Environments inside One Shared Canvas */}
      <HeroCoreGroup
        active={visualState.activeSection === 'identity'}
        reducedMotion={reducedMotion}
      />
      <AboutHaloGroup
        active={visualState.activeSection === 'about'}
        reducedMotion={reducedMotion}
      />
      <EducationGroup
        active={visualState.activeSection === 'education'}
        reducedMotion={reducedMotion}
      />
      <ExperienceGroup
        active={visualState.activeSection === 'experience'}
        company={visualState.activeCompany}
        reducedMotion={reducedMotion}
      />
      <SkillsGroup
        active={visualState.activeSection === 'skills'}
        category={visualState.activeSkillCategory}
        skillId={visualState.activeSkillId}
        skillLogoUrl={activeSkillLogoUrl}
        reducedMotion={reducedMotion}
      />
      <InterestsGroup
        active={visualState.activeSection === 'interests'}
        category={visualState.activeInterestCategory}
        reducedMotion={reducedMotion}
      />
      <ProjectsGroup
        active={visualState.activeSection === 'projects'}
        projectId={visualState.activeProjectId}
        reducedMotion={reducedMotion}
      />
      <AchievementsGroup
        active={visualState.activeSection === 'achievements'}
        achievementId={visualState.activeAchievementId}
        reducedMotion={reducedMotion}
      />
      <CertificationsGroup
        active={visualState.activeSection === 'certifications'}
        reducedMotion={reducedMotion}
      />
      <ResearchGroup
        active={visualState.activeSection === 'research'}
        reducedMotion={reducedMotion}
      />
      <ContactRelayGroup
        active={visualState.activeSection === 'contact'}
        reducedMotion={reducedMotion}
      />

      {/* Restrained crisp pinpoint stars (no excessive particles or fog) */}
      <Sparkles
        count={sparkleCount}
        scale={[12, 7, 5]}
        size={1.4}
        speed={reducedMotion ? 0 : 0.16}
        opacity={0.38}
        color="#67e8f9"
      />
    </>
  );
}
