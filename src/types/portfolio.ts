export type PortfolioSectionId =
  | 'identity'
  | 'about'
  | 'education'
  | 'experience'
  | 'skills'
  | 'interests'
  | 'projects'
  | 'achievements'
  | 'certifications'
  | 'research'
  | 'contact';

export interface SocialLinkItem {
  label: string;
  url: string;
}

export interface SiteProfile {
  fullName: string;
  brandTitle: string;
  heroHeadline: string;
  roleTitle: string;
  tagline: string;
  bio: string;
  professionalSummary: string;
  additionalDetails: string;
  availabilityStatus: string;
  location: string;
  languages: string[];
  areasOfInterest: string[];
  portraitUrl?: string;
  heroBackgroundUrl?: string;
  primaryCtaLabel: string;
  primaryCtaHref: string;
  secondaryCtaLabel: string;
  secondaryCtaHref: string;
  contactEmail?: string;
  contactPhone?: string;
  resumeUrl?: string;
  githubUrl?: string;
  leetcodeUrl?: string;
  linkedinUrl?: string;
  otherSocialLinks: SocialLinkItem[];
  updatedAt?: string;
}

export interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy?: string;
  startDate?: string;
  endDate: string;
  gradeOrGpa?: string;
  statusLabel?: string;
  description?: string;
  logoUrl?: string;
  highlights: string[];
  sortOrder: number;
  isPublished: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  location: string;
  employmentType: 'Internship' | 'Full-time' | 'Part-time' | 'Research';
  statusLabel?: string;
  isCurrent?: boolean;
  startDate: string;
  endDate: string;
  summary: string;
  logoUrl?: string;
  supportingMediaUrl?: string;
  highlights: string[];
  techStack: string[];
  sortOrder: number;
  isPublished: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export type SkillCategory =
  | 'Programming'
  | 'AI / Machine Learning'
  | 'Generative AI / LLM / RAG'
  | 'Data Science & Analytics'
  | 'Cloud & Automation'
  | 'Backend & Deployment';

export interface SkillItem {
  id: string;
  name: string;
  category: SkillCategory;
  proficiency?: number;
  summary?: string;
  logoUrl?: string;
  sortOrder: number;
  isFeatured: boolean;
  isPublished: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export type InterestCategoryKey =
  | 'generative-ai'
  | 'ai-cv'
  | 'data-science'
  | 'programming';

export interface InterestItem {
  id: string;
  name: string;
  category: InterestCategoryKey;
  description?: string;
  iconUrl?: string;
  sortOrder: number;
  isPublished: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface InterestGroup {
  id: string;
  key: InterestCategoryKey;
  title: string;
  subtitle: string;
  items: string[];
  sortOrder: number;
  isPublished: boolean;
}

export interface ProjectItem {
  id: string;
  title: string;
  slug: string;
  domainLabel: string;
  tagline: string;
  description: string;
  imageUrl?: string;
  statusLabel?: string;
  startDate?: string;
  endDate?: string;
  techStack: string[];
  architectureFlow: string[];
  highlights: string[];
  liveUrl?: string;
  repoUrl?: string;
  sortOrder: number;
  isFeatured: boolean;
  isPublished: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface AchievementItem {
  id: string;
  title: string;
  awardLabel?: string;
  issuer: string;
  achievedAt?: string;
  category: string;
  badgeType: 'trophy' | 'medal' | 'award';
  description: string;
  imageUrl?: string;
  proofUrl?: string;
  sortOrder: number;
  isFeatured?: boolean;
  isPublished: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CertificationItem {
  id: string;
  title: string;
  issuer: string;
  issueDate?: string;
  expiryDate?: string;
  credentialId?: string;
  credentialUrl?: string;
  certificateFileUrl?: string;
  issuerLogoUrl?: string;
  skillsCovered: string[];
  sortOrder: number;
  isPublished: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export type ResearchStatus =
  | 'Draft'
  | 'Submitted'
  | 'Accepted'
  | 'Published'
  | 'Conference';

export interface ResearchItem {
  id: string;
  title: string;
  domain: string;
  authors?: string;
  venue?: string;
  publishedDate?: string;
  doi?: string;
  status: ResearchStatus;
  progressPercent?: number;
  abstract: string;
  coverImageUrl?: string;
  pdfUrl?: string;
  highlights: string[];
  techTags: string[];
  paperOrDemoUrl?: string;
  sortOrder: number;
  isPublished: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface LeadershipItem {
  id: string;
  role: string;
  organization: string;
  category: 'Leadership' | 'Extracurricular';
  description: string;
  startDate?: string;
  endDate?: string;
  imageUrl?: string;
  logoUrl?: string;
  sortOrder: number;
  isPublished: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export type EnquiryStatus = 'new' | 'read' | 'replied' | 'archived';

export interface EnquiryPayload {
  senderName: string;
  senderEmail: string;
  senderPhone?: string;
  opportunityType: 'Recruiter' | 'Collaboration' | 'Freelance' | 'General';
  subject: string;
  message: string;
  honeypot?: string;
}

export interface EnquiryItem extends Omit<EnquiryPayload, 'honeypot'> {
  id: string;
  status: EnquiryStatus;
  createdAt: string;
  updatedAt: string;
}

export type MediaCategory =
  | 'image'
  | 'company-logo'
  | 'tech-logo'
  | 'certificate'
  | 'research-paper'
  | 'portrait';

export interface MediaAsset {
  id: string;
  name: string;
  category: MediaCategory;
  mimeType: string;
  sizeBytes: number;
  url: string;
  storagePath?: string;
  createdAt: string;
}

export type CmsCollectionKey =
  | 'education'
  | 'experiences'
  | 'skills'
  | 'interestItems'
  | 'projects'
  | 'achievements'
  | 'certifications'
  | 'research'
  | 'leadership';

export interface PortfolioData {
  profile: SiteProfile;
  education: EducationItem[];
  experiences: ExperienceItem[];
  skills: SkillItem[];
  interestItems: InterestItem[];
  interests: InterestGroup[];
  projects: ProjectItem[];
  achievements: AchievementItem[];
  certifications: CertificationItem[];
  research: ResearchItem[];
  leadership: LeadershipItem[];
  softSkills: string[];
}
