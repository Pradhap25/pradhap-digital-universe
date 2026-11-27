import type { BrandAssetKind } from '@/services/logoResolver';
import type { CmsCollectionKey, MediaCategory } from '@/types/portfolio';

export type FieldKind =
  | 'text'
  | 'textarea'
  | 'select'
  | 'number'
  | 'checkbox'
  | 'tags'
  | 'lines'
  | 'media';

export interface CmsFieldConfig {
  key: string;
  label: string;
  kind: FieldKind;
  required?: boolean;
  placeholder?: string;
  options?: { value: string; label: string }[];
  mediaCategory?: MediaCategory;
  autoLogoKind?: BrandAssetKind;
  autoLogoSourceField?: string;
  accept?: string;
  colSpan2?: boolean;
}

export interface CmsSectionSchema {
  collection: CmsCollectionKey;
  title: string;
  subtitle: string;
  singularName: string;
  primaryField: string;
  secondaryField?: string;
  badgeField?: string;
  logoField?: string;
  defaultValues: Record<string, unknown>;
  fields: CmsFieldConfig[];
}

export const CMS_SCHEMAS: Record<CmsCollectionKey, CmsSectionSchema> = {
  education: {
    collection: 'education',
    title: 'Education Management',
    subtitle: 'Manage university degrees, schooling, GPAs, graduation status, and institution logos.',
    singularName: 'Education Entry',
    primaryField: 'institution',
    secondaryField: 'degree',
    badgeField: 'endDate',
    logoField: 'logoUrl',
    defaultValues: {
      institution: '',
      degree: '',
      fieldOfStudy: '',
      startDate: '',
      endDate: '',
      gradeOrGpa: '',
      statusLabel: '',
      description: '',
      logoUrl: '',
      highlights: [],
      isPublished: true,
    },
    fields: [
      { key: 'institution', label: 'Institution Name', kind: 'text', required: true },
      { key: 'degree', label: 'Degree / Course', kind: 'text', required: true },
      { key: 'fieldOfStudy', label: 'Specialization / Field', kind: 'text' },
      { key: 'statusLabel', label: 'Education Status', kind: 'text', placeholder: 'e.g. Graduated (Degree Certificate Pending)' },
      { key: 'startDate', label: 'Start Year', kind: 'text', placeholder: 'e.g. 2022' },
      { key: 'endDate', label: 'End Year', kind: 'text', required: true, placeholder: 'e.g. 2026' },
      { key: 'gradeOrGpa', label: 'CGPA / Percentage', kind: 'text', placeholder: 'e.g. CGPA: 7.73' },
      { key: 'description', label: 'Description', kind: 'textarea', colSpan2: true },
      { key: 'highlights', label: 'Key Highlights (one per line)', kind: 'lines', colSpan2: true },
      { key: 'logoUrl', label: 'Institution Logo', kind: 'media', mediaCategory: 'company-logo', colSpan2: true },
      { key: 'isPublished', label: 'Published on Public Portfolio', kind: 'checkbox' },
    ],
  },

  experiences: {
    collection: 'experiences',
    title: 'Experience & Internships',
    subtitle: 'Add multiple experiences cleanly—including multiple roles or dates at the same company.',
    singularName: 'Experience',
    primaryField: 'role',
    secondaryField: 'company',
    badgeField: 'startDate',
    logoField: 'logoUrl',
    defaultValues: {
      company: '',
      role: '',
      location: '',
      employmentType: 'Internship',
      statusLabel: 'Completed',
      isCurrent: false,
      startDate: '',
      endDate: '',
      summary: '',
      highlights: [],
      techStack: [],
      logoUrl: '',
      supportingMediaUrl: '',
      isPublished: true,
    },
    fields: [
      { key: 'company', label: 'Company Name', kind: 'text', required: true },
      { key: 'role', label: 'Role / Designation', kind: 'text', required: true },
      { key: 'location', label: 'Location', kind: 'text', required: true },
      {
        key: 'employmentType',
        label: 'Employment Type',
        kind: 'select',
        options: [
          { value: 'Internship', label: 'Internship' },
          { value: 'Full-time', label: 'Full-time' },
          { value: 'Part-time', label: 'Part-time' },
          { value: 'Research', label: 'Research' },
        ],
      },
      { key: 'startDate', label: 'Start Date', kind: 'text', required: true, placeholder: 'e.g. June 2026' },
      { key: 'endDate', label: 'End Date', kind: 'text', required: true, placeholder: 'e.g. November 2026' },
      { key: 'statusLabel', label: 'Status Label', kind: 'text', placeholder: 'Completed / Currently Working' },
      { key: 'isCurrent', label: 'Currently Working Here', kind: 'checkbox' },
      { key: 'summary', label: 'Role Summary', kind: 'textarea', required: true, colSpan2: true },
      { key: 'highlights', label: 'Responsibilities & Impact (one per line)', kind: 'lines', colSpan2: true },
      { key: 'techStack', label: 'Technologies Used (comma-separated)', kind: 'tags', colSpan2: true },
      {
        key: 'logoUrl',
        label: 'Company Logo',
        kind: 'media',
        mediaCategory: 'company-logo',
        autoLogoKind: 'company',
        autoLogoSourceField: 'company',
        colSpan2: true,
      },
      {
        key: 'supportingMediaUrl',
        label: 'Supporting Document / Image (Optional)',
        kind: 'media',
        mediaCategory: 'image',
        colSpan2: true,
      },
      { key: 'isPublished', label: 'Published on Public Portfolio', kind: 'checkbox' },
    ],
  },

  skills: {
    collection: 'skills',
    title: 'Technical Skills',
    subtitle: 'Manage skills with automatic logo detection, categories, ordering, and visibility.',
    singularName: 'Skill',
    primaryField: 'name',
    secondaryField: 'category',
    logoField: 'logoUrl',
    defaultValues: {
      name: '',
      category: 'Programming',
      proficiency: undefined,
      summary: '',
      logoUrl: '',
      isFeatured: false,
      isPublished: true,
    },
    fields: [
      { key: 'name', label: 'Skill Name', kind: 'text', required: true, placeholder: 'e.g. Python, React, TensorFlow' },
      {
        key: 'category',
        label: 'Category',
        kind: 'select',
        options: [
          { value: 'Programming', label: 'Programming' },
          { value: 'AI / Machine Learning', label: 'AI / Machine Learning' },
          { value: 'Generative AI / LLM / RAG', label: 'Generative AI / LLM / RAG' },
          { value: 'Data Science & Analytics', label: 'Data Science & Analytics' },
          { value: 'Cloud & Automation', label: 'Cloud & Automation' },
          { value: 'Backend & Deployment', label: 'Backend & Deployment' },
        ],
      },
      { key: 'proficiency', label: 'Proficiency Level (Optional 1–100)', kind: 'number', placeholder: 'Leave empty to hide percentages' },
      { key: 'isFeatured', label: 'Highlight as Core Skill', kind: 'checkbox' },
      { key: 'summary', label: 'Description', kind: 'textarea', colSpan2: true },
      {
        key: 'logoUrl',
        label: 'Skill Logo / Icon',
        kind: 'media',
        mediaCategory: 'tech-logo',
        autoLogoKind: 'technology',
        autoLogoSourceField: 'name',
        colSpan2: true,
      },
      { key: 'isPublished', label: 'Published on Public Portfolio', kind: 'checkbox' },
    ],
  },

  interestItems: {
    collection: 'interestItems',
    title: 'Area of Interests',
    subtitle: 'Manage interest topics separately from Technical Skills across the 4 exploration realms.',
    singularName: 'Interest',
    primaryField: 'name',
    secondaryField: 'category',
    logoField: 'iconUrl',
    defaultValues: {
      name: '',
      category: 'generative-ai',
      description: '',
      iconUrl: '',
      isPublished: true,
    },
    fields: [
      { key: 'name', label: 'Interest Name', kind: 'text', required: true },
      {
        key: 'category',
        label: 'Realm Category',
        kind: 'select',
        options: [
          { value: 'generative-ai', label: 'Generative AI & Intelligent Systems' },
          { value: 'ai-cv', label: 'AI & Computer Vision' },
          { value: 'data-science', label: 'Data & Analytics' },
          { value: 'programming', label: 'Programming' },
        ],
      },
      { key: 'description', label: 'Description (Optional)', kind: 'textarea', colSpan2: true },
      {
        key: 'iconUrl',
        label: 'Visual Asset / Icon (Optional)',
        kind: 'media',
        mediaCategory: 'tech-logo',
        autoLogoKind: 'technology',
        autoLogoSourceField: 'name',
        colSpan2: true,
      },
      { key: 'isPublished', label: 'Published on Public Portfolio', kind: 'checkbox' },
    ],
  },

  projects: {
    collection: 'projects',
    title: 'Projects Showcase',
    subtitle: 'Add unlimited projects with architecture pipelines, stack tags, images, and demo/repo URLs.',
    singularName: 'Project',
    primaryField: 'title',
    secondaryField: 'domainLabel',
    badgeField: 'statusLabel',
    logoField: 'imageUrl',
    defaultValues: {
      title: '',
      slug: '',
      domainLabel: '',
      tagline: '',
      description: '',
      imageUrl: '',
      statusLabel: 'Completed',
      startDate: '',
      endDate: '',
      techStack: [],
      architectureFlow: [],
      highlights: [],
      repoUrl: '',
      liveUrl: '',
      isFeatured: true,
      isPublished: true,
    },
    fields: [
      { key: 'title', label: 'Project Title', kind: 'text', required: true },
      { key: 'slug', label: 'URL Slug', kind: 'text', placeholder: 'auto-generated if blank' },
      { key: 'domainLabel', label: 'Domain Subtitle', kind: 'text', required: true, placeholder: 'e.g. Computer Vision • Urban Enforcement' },
      { key: 'statusLabel', label: 'Project Status', kind: 'text', placeholder: 'Completed / In Progress' },
      { key: 'startDate', label: 'Start Date (Optional)', kind: 'text' },
      { key: 'endDate', label: 'Completion Date (Optional)', kind: 'text' },
      { key: 'tagline', label: 'Short Description', kind: 'textarea', required: true, colSpan2: true },
      { key: 'description', label: 'Detailed Description', kind: 'textarea', required: true, colSpan2: true },
      { key: 'techStack', label: 'Technologies Used (comma-separated)', kind: 'tags', colSpan2: true },
      { key: 'architectureFlow', label: 'Architecture Pipeline Steps (one per line)', kind: 'lines', colSpan2: true },
      { key: 'highlights', label: 'Key Outcomes (one per line)', kind: 'lines', colSpan2: true },
      { key: 'repoUrl', label: 'GitHub Repository URL', kind: 'text' },
      { key: 'liveUrl', label: 'Live Demo URL', kind: 'text' },
      { key: 'imageUrl', label: 'Project Thumbnail Image', kind: 'media', mediaCategory: 'image', colSpan2: true },
      { key: 'isFeatured', label: 'Featured Project', kind: 'checkbox' },
      { key: 'isPublished', label: 'Published on Public Portfolio', kind: 'checkbox' },
    ],
  },

  achievements: {
    collection: 'achievements',
    title: 'Achievements & Honors',
    subtitle: 'Manage national finals, medals, hackathon awards, and supporting proof.',
    singularName: 'Achievement',
    primaryField: 'title',
    secondaryField: 'issuer',
    badgeField: 'achievedAt',
    logoField: 'imageUrl',
    defaultValues: {
      title: '',
      awardLabel: '',
      issuer: '',
      achievedAt: '',
      category: '',
      badgeType: 'trophy',
      description: '',
      imageUrl: '',
      proofUrl: '',
      isFeatured: true,
      isPublished: true,
    },
    fields: [
      { key: 'title', label: 'Achievement Title', kind: 'text', required: true },
      { key: 'awardLabel', label: 'Award / Recognition Label', kind: 'text', placeholder: 'e.g. Gold Medal / Finalist' },
      { key: 'issuer', label: 'Organization / Event', kind: 'text', required: true },
      { key: 'category', label: 'Category', kind: 'text', required: true },
      { key: 'achievedAt', label: 'Date', kind: 'text', placeholder: 'e.g. Feb 2025' },
      {
        key: 'badgeType',
        label: '3D Pedestal Style',
        kind: 'select',
        options: [
          { value: 'trophy', label: 'Innovation Trophy' },
          { value: 'medal', label: 'Gold Medal' },
          { value: 'award', label: 'Hackathon Award' },
        ],
      },
      { key: 'description', label: 'Description', kind: 'textarea', required: true, colSpan2: true },
      { key: 'imageUrl', label: 'Certificate / Medal / Trophy Image', kind: 'media', mediaCategory: 'image', colSpan2: true },
      { key: 'proofUrl', label: 'Supporting Document / Proof URL', kind: 'media', mediaCategory: 'certificate', colSpan2: true },
      { key: 'isFeatured', label: 'Featured Achievement', kind: 'checkbox' },
      { key: 'isPublished', label: 'Published on Public Portfolio', kind: 'checkbox' },
    ],
  },

  certifications: {
    collection: 'certifications',
    title: 'Certifications & Training',
    subtitle: 'Upload certificates, manage credential IDs, and detect issuing organization logos.',
    singularName: 'Certification',
    primaryField: 'title',
    secondaryField: 'issuer',
    badgeField: 'issueDate',
    logoField: 'issuerLogoUrl',
    defaultValues: {
      title: '',
      issuer: '',
      issueDate: '',
      expiryDate: '',
      credentialId: '',
      credentialUrl: '',
      certificateFileUrl: '',
      issuerLogoUrl: '',
      skillsCovered: [],
      isPublished: true,
    },
    fields: [
      { key: 'title', label: 'Certification Name', kind: 'text', required: true },
      { key: 'issuer', label: 'Issuing Organization', kind: 'text', required: true },
      { key: 'issueDate', label: 'Issue Date', kind: 'text', placeholder: 'e.g. Jan 2025' },
      { key: 'expiryDate', label: 'Expiry Date (Optional)', kind: 'text' },
      { key: 'credentialId', label: 'Credential ID', kind: 'text' },
      { key: 'credentialUrl', label: 'Credential Verification URL', kind: 'text' },
      { key: 'skillsCovered', label: 'Skills Covered (comma-separated)', kind: 'tags', colSpan2: true },
      {
        key: 'issuerLogoUrl',
        label: 'Organization Logo',
        kind: 'media',
        mediaCategory: 'company-logo',
        autoLogoKind: 'certification',
        autoLogoSourceField: 'issuer',
        colSpan2: true,
      },
      {
        key: 'certificateFileUrl',
        label: 'Certificate PDF / Image Upload',
        kind: 'media',
        mediaCategory: 'certificate',
        colSpan2: true,
      },
      { key: 'isPublished', label: 'Published on Public Portfolio', kind: 'checkbox' },
    ],
  },

  research: {
    collection: 'research',
    title: 'Research & Publications',
    subtitle: 'Manage research papers with explicit status (Draft / Submitted / Accepted / Published / Conference).',
    singularName: 'Research Paper',
    primaryField: 'title',
    secondaryField: 'venue',
    badgeField: 'status',
    logoField: 'coverImageUrl',
    defaultValues: {
      title: '',
      domain: '',
      authors: '',
      venue: '',
      publishedDate: '',
      doi: '',
      status: 'Draft',
      progressPercent: undefined,
      abstract: '',
      highlights: [],
      techTags: [],
      paperOrDemoUrl: '',
      pdfUrl: '',
      coverImageUrl: '',
      isPublished: true,
    },
    fields: [
      { key: 'title', label: 'Paper Title', kind: 'text', required: true, colSpan2: true },
      { key: 'domain', label: 'Research Domain', kind: 'text', required: true },
      { key: 'authors', label: 'Authors', kind: 'text', placeholder: 'e.g. M Lalpradhap' },
      { key: 'venue', label: 'Journal / Conference', kind: 'text' },
      { key: 'publishedDate', label: 'Publication / Conference Date', kind: 'text' },
      { key: 'doi', label: 'DOI (Optional)', kind: 'text' },
      {
        key: 'status',
        label: 'Research Status',
        kind: 'select',
        options: [
          { value: 'Draft', label: 'Draft' },
          { value: 'Submitted', label: 'Submitted' },
          { value: 'Accepted', label: 'Accepted' },
          { value: 'Published', label: 'Published' },
          { value: 'Conference', label: 'Conference' },
        ],
      },
      { key: 'progressPercent', label: 'Prototype Progress % (Optional)', kind: 'number' },
      { key: 'paperOrDemoUrl', label: 'Paper / Demo URL', kind: 'text' },
      { key: 'abstract', label: 'Abstract', kind: 'textarea', required: true, colSpan2: true },
      { key: 'highlights', label: 'Key Contributions (one per line)', kind: 'lines', colSpan2: true },
      { key: 'techTags', label: 'Tags (comma-separated)', kind: 'tags', colSpan2: true },
      { key: 'pdfUrl', label: 'Paper PDF Upload', kind: 'media', mediaCategory: 'research-paper', colSpan2: true },
      { key: 'coverImageUrl', label: 'Research Thumbnail / Diagram', kind: 'media', mediaCategory: 'image', colSpan2: true },
      { key: 'isPublished', label: 'Published on Public Portfolio', kind: 'checkbox' },
    ],
  },

  leadership: {
    collection: 'leadership',
    title: 'Leadership & Activities',
    subtitle: 'Manage technical team leadership, sports representation, and extracurricular roles.',
    singularName: 'Leadership Role',
    primaryField: 'role',
    secondaryField: 'organization',
    badgeField: 'category',
    logoField: 'logoUrl',
    defaultValues: {
      role: '',
      organization: '',
      category: 'Leadership',
      description: '',
      startDate: '',
      endDate: '',
      imageUrl: '',
      logoUrl: '',
      isPublished: true,
    },
    fields: [
      { key: 'role', label: 'Position / Role', kind: 'text', required: true },
      { key: 'organization', label: 'Organization', kind: 'text', required: true },
      {
        key: 'category',
        label: 'Category',
        kind: 'select',
        options: [
          { value: 'Leadership', label: 'Leadership' },
          { value: 'Extracurricular', label: 'Extracurricular' },
        ],
      },
      { key: 'startDate', label: 'Start Date (Optional)', kind: 'text' },
      { key: 'endDate', label: 'End Date (Optional)', kind: 'text' },
      { key: 'description', label: 'Description', kind: 'textarea', required: true, colSpan2: true },
      { key: 'logoUrl', label: 'Organization Logo', kind: 'media', mediaCategory: 'company-logo', colSpan2: true },
      { key: 'imageUrl', label: 'Supporting Image', kind: 'media', mediaCategory: 'image', colSpan2: true },
      { key: 'isPublished', label: 'Published on Public Portfolio', kind: 'checkbox' },
    ],
  },
};
