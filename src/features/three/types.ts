import type {
  InterestCategoryKey,
  PortfolioSectionId,
  SkillCategory,
} from '@/types/portfolio';

export type ExperienceCompanyKey = 'livanova' | 'sap';

export interface UniverseVisualState {
  activeSection: PortfolioSectionId;
  activeInterestCategory: InterestCategoryKey;
  activeCompany: ExperienceCompanyKey;
  activeSkillCategory: 'All' | SkillCategory;
  activeSkillId: string | null;
  activeProjectId: string;
  activeAchievementId: string;
}
