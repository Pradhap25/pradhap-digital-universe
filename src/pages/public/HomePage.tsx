import { useScroll } from 'framer-motion';
import { useMemo, useState } from 'react';
import { Footer } from '@/components/layout/Footer';
import { PageShell } from '@/components/layout/PageShell';
import { UniverseNav } from '@/components/layout/UniverseNav';
import { VisitorCounter } from '@/components/ui/VisitorCounter';
import { AboutIdentitySection } from '@/features/public/AboutIdentitySection';
import { AreaOfInterestsSection } from '@/features/public/AreaOfInterestsSection';
import { CertificationsSection } from '@/features/public/CertificationsSection';
import { ContactPortalSection } from '@/features/public/ContactPortalSection';
import { EducationSection } from '@/features/public/EducationSection';
import { ExcellenceHallSection } from '@/features/public/ExcellenceHallSection';
import { ExperienceJourneySection } from '@/features/public/ExperienceJourneySection';
import { HeroSection } from '@/features/public/HeroSection';
import { ProjectsWorldSection } from '@/features/public/ProjectsWorldSection';
import { ResearchLabSection } from '@/features/public/ResearchLabSection';
import { SkillsUniverseSection } from '@/features/public/SkillsUniverseSection';
import type { ExperienceCompanyKey, UniverseVisualState } from '@/features/three/types';
import { UniverseBackdrop } from '@/features/three/UniverseBackdrop';
import { useActiveSection } from '@/hooks/useActiveSection';
import { usePortfolioData } from '@/hooks/usePortfolioData';
import type {
  InterestCategoryKey,
  PortfolioSectionId,
  SkillCategory,
} from '@/types/portfolio';

const SECTION_IDS: readonly PortfolioSectionId[] = [
  'identity',
  'about',
  'education',
  'experience',
  'projects',
  'skills',
  'interests',
  'achievements',
  'certifications',
  'research',
  'contact',
];

export function HomePage() {
  const { data, isLoading } = usePortfolioData();
  const activeSection = useActiveSection(SECTION_IDS);
  const { scrollYProgress } = useScroll();

  const [activeInterestCategory, setActiveInterestCategory] =
    useState<InterestCategoryKey>('generative-ai');
  const [activeCompany, setActiveCompany] = useState<ExperienceCompanyKey>('livanova');
  const [activeSkillCategory, setActiveSkillCategory] = useState<'All' | SkillCategory>('All');
  const [activeSkillId, setActiveSkillId] = useState<string | null>(data.skills[0]?.id ?? null);
  const [activeProjectId, setActiveProjectId] = useState<string>(
    data.projects[0]?.id ?? 'proj-traffic-fine',
  );
  const [activeAchievementId, setActiveAchievementId] = useState<string>(
    data.achievements[1]?.id ?? 'ach-silambam-national',
  );

  const activeSkillLogoUrl = useMemo(
    () => data.skills.find((s) => s.id === activeSkillId)?.logoUrl,
    [data.skills, activeSkillId],
  );

  const visualState = useMemo<UniverseVisualState>(
    () => ({
      activeSection,
      activeInterestCategory,
      activeCompany,
      activeSkillCategory,
      activeSkillId,
      activeProjectId,
      activeAchievementId,
    }),
    [
      activeSection,
      activeInterestCategory,
      activeCompany,
      activeSkillCategory,
      activeSkillId,
      activeProjectId,
      activeAchievementId,
    ],
  );

  return (
    <>
      <VisitorCounter />
      <PageShell
        backdrop={
          <UniverseBackdrop
            scrollYProgress={scrollYProgress}
            visualState={visualState}
            activeSkillLogoUrl={activeSkillLogoUrl}
          />
        }
        header={
          <UniverseNav
            activeSection={activeSection}
            brandTitle={data.profile.brandTitle}
            scrollYProgress={scrollYProgress}
          />
        }
      >
      <HeroSection profile={data.profile} />
      {isLoading ? (
        <div
          role="status"
          aria-live="polite"
          className="mx-auto mb-4 max-w-7xl px-4 font-mono text-xs text-cyan-300/80 sm:px-6 lg:px-8"
        >
          Syncing dynamic portfolio data...
        </div>
      ) : null}
      <AboutIdentitySection profile={data.profile} />
      <EducationSection education={data.education} />
      <ExperienceJourneySection
        experiences={data.experiences}
        onCompanyInView={setActiveCompany}
      />
      <ProjectsWorldSection
        projects={data.projects}
        onProjectChange={setActiveProjectId}
      />
      <SkillsUniverseSection
        skills={data.skills}
        onSkillFocusChange={(category, skillId) => {
          setActiveSkillCategory(category);
          setActiveSkillId(skillId);
        }}
      />
      <AreaOfInterestsSection
        interests={data.interests}
        activeCategory={activeInterestCategory}
        onCategoryChange={setActiveInterestCategory}
      />
      <ExcellenceHallSection
        achievements={data.achievements}
        onAchievementFocus={setActiveAchievementId}
      />
      <CertificationsSection
        certifications={data.certifications}
        leadership={data.leadership}
        softSkills={data.softSkills}
      />
      <ResearchLabSection research={data.research} />
      <ContactPortalSection
        profile={data.profile}
        footer={<Footer profile={data.profile} />}
      />
      </PageShell>
    </>
  );
}
