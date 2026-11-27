import azureLogo from '@/assets/brands/azure.svg';
import djangoLogo from '@/assets/brands/django.svg';
import dockerLogo from '@/assets/brands/docker.svg';
import flaskLogo from '@/assets/brands/flask.svg';
import gcpLogo from '@/assets/brands/gcp.svg';
import gitLogo from '@/assets/brands/git.svg';
import livanovaLogo from '@/assets/brands/livanova.svg';
import mysqlLogo from '@/assets/brands/mysql.svg';
import numpyLogo from '@/assets/brands/numpy.svg';
import opencvLogo from '@/assets/brands/opencv.svg';
import pandasLogo from '@/assets/brands/pandas.svg';
import powerbiLogo from '@/assets/brands/powerbi.svg';
import pythonLogo from '@/assets/brands/python.svg';
import pytorchLogo from '@/assets/brands/pytorch.svg';
import sapLogo from '@/assets/brands/sap.svg';
import scikitlearnLogo from '@/assets/brands/scikitlearn.svg';
import streamlitLogo from '@/assets/brands/streamlit.svg';
import tensorflowLogo from '@/assets/brands/tensorflow.svg';
import pradhapPortrait from '@/assets/images/pradhap-portrait.jpg';
import type {
  InterestCategoryKey,
  InterestGroup,
  InterestItem,
  PortfolioData,
} from '@/types/portfolio';

export const INTEREST_CATEGORY_META: Record<
  InterestCategoryKey,
  { id: string; title: string; subtitle: string; sortOrder: number }
> = {
  'generative-ai': {
    id: 'int-genai',
    title: 'Generative AI & Intelligent Systems',
    subtitle: 'Foundation models, semantic retrieval, and agentic reasoning',
    sortOrder: 1,
  },
  'ai-cv': {
    id: 'int-ai-cv',
    title: 'AI & Computer Vision',
    subtitle: 'Deep neural architectures, visual perception, and pose modeling',
    sortOrder: 2,
  },
  'data-science': {
    id: 'int-data-science',
    title: 'Data & Analytics',
    subtitle: 'Statistical rigor, feature signals, and exploratory insight',
    sortOrder: 3,
  },
  programming: {
    id: 'int-programming',
    title: 'Programming',
    subtitle: 'Clean software architecture and object-oriented engineering',
    sortOrder: 4,
  },
};

export function buildInterestGroups(items: InterestItem[]): InterestGroup[] {
  const keys: InterestCategoryKey[] = [
    'generative-ai',
    'ai-cv',
    'data-science',
    'programming',
  ];

  return keys
    .map((key) => {
      const meta = INTEREST_CATEGORY_META[key];
      const matching = items
        .filter((item) => item.category === key && item.isPublished)
        .sort((a, b) => a.sortOrder - b.sortOrder)
        .map((item) => item.name);

      return {
        id: meta.id,
        key,
        title: meta.title,
        subtitle: meta.subtitle,
        items: matching,
        sortOrder: meta.sortOrder,
        isPublished: matching.length > 0,
      };
    })
    .filter((group) => group.isPublished);
}

const seedInterestItems: InterestItem[] = [
  // Generative AI & Intelligent Systems
  { id: 'inti-1', name: 'Generative AI', category: 'generative-ai', sortOrder: 1, isPublished: true },
  { id: 'inti-2', name: 'Large Language Models (LLMs)', category: 'generative-ai', sortOrder: 2, isPublished: true },
  { id: 'inti-3', name: 'Small Language Models (SLMs)', category: 'generative-ai', sortOrder: 3, isPublished: true },
  { id: 'inti-4', name: 'Retrieval-Augmented Generation (RAG)', category: 'generative-ai', sortOrder: 4, isPublished: true },
  { id: 'inti-5', name: 'Agentic AI', category: 'generative-ai', sortOrder: 5, isPublished: true },
  { id: 'inti-6', name: 'Natural Language Processing (NLP)', category: 'generative-ai', sortOrder: 6, isPublished: true },

  // AI & Computer Vision
  { id: 'inti-7', name: 'Artificial Intelligence', category: 'ai-cv', sortOrder: 7, isPublished: true },
  { id: 'inti-8', name: 'Machine Learning', category: 'ai-cv', sortOrder: 8, isPublished: true },
  { id: 'inti-9', name: 'Deep Learning', category: 'ai-cv', sortOrder: 9, isPublished: true },
  { id: 'inti-10', name: 'Computer Vision', category: 'ai-cv', sortOrder: 10, isPublished: true },
  { id: 'inti-11', name: 'Pose Estimation', category: 'ai-cv', sortOrder: 11, isPublished: true },

  // Data & Analytics
  { id: 'inti-12', name: 'Statistics', category: 'data-science', sortOrder: 12, isPublished: true },
  { id: 'inti-13', name: 'Data Science', category: 'data-science', sortOrder: 13, isPublished: true },
  { id: 'inti-14', name: 'Data Analytics', category: 'data-science', sortOrder: 14, isPublished: true },
  { id: 'inti-15', name: 'Exploratory Data Analysis (EDA)', category: 'data-science', sortOrder: 15, isPublished: true },
  { id: 'inti-16', name: 'Data Visualization', category: 'data-science', sortOrder: 16, isPublished: true },
  { id: 'inti-17', name: 'Feature Engineering', category: 'data-science', sortOrder: 17, isPublished: true },

  // Programming
  { id: 'inti-18', name: 'Python', category: 'programming', sortOrder: 18, isPublished: true },
  { id: 'inti-19', name: 'OOPs', category: 'programming', sortOrder: 19, isPublished: true },
];

export const portfolioSeedData: PortfolioData = {
  profile: {
    fullName: 'M Lalpradhap',
    brandTitle: 'Pradhap Digital Universe',
    heroHeadline: "Lalpradhap's Portfolio",
    roleTitle: 'AI & Data Science Engineer • ML, Computer Vision & Cloud Analytics',
    tagline:
      'B.Tech AI & Data Science graduate building enterprise ML pipelines, YOLOv11 computer vision systems, RAG architectures, and Azure data automation.',
    bio: 'B.Tech graduate in Artificial Intelligence & Data Science from PSG Institute of Technology and Applied Research (2022 – 2026) with completed industry internship experience across LivaNova and SAP Labs. Focused on machine learning data intelligence, computer vision, Retrieval-Augmented Generation (RAG), and cloud-based analytics automation.',
    professionalSummary:
      'Completed internships at LivaNova (Data Analytics Intern) and SAP Labs (AI/ML Intern), building enterprise deduplication models, expense classification systems, and Azure Synapse / Power Platform data workflows.',
    additionalDetails: 'Languages: Tamil, English • Based in Coimbatore, Tamil Nadu, India',
    availabilityStatus: 'B.Tech AI & Data Science Graduate (2022 – 2026) • Open to Opportunities',
    location: 'Coimbatore, Tamil Nadu, India',
    languages: ['Tamil', 'English'],
    areasOfInterest: [
      'Generative AI, Large Language Models (LLMs), Small Language Models (SLMs)',
      'Retrieval-Augmented Generation (RAG), Agentic AI, NLP, Statistics, Data Science, OOPs',
      'Deep Learning, Computer Vision, Machine Learning, Artificial Intelligence, Pose Estimation',
      'Data Analytics, Exploratory Data Analysis, Data Visualization, Feature Engineering, Python',
    ],
    portraitUrl: pradhapPortrait,
    primaryCtaLabel: 'Enter Innovation World',
    primaryCtaHref: '#projects',
    secondaryCtaLabel: 'Explore Identity',
    secondaryCtaHref: '#about',
    contactEmail: 'lalpradhapking@gmail.com',
    contactPhone: '',
    githubUrl: 'https://github.com/Pradhap25',
    leetcodeUrl: 'https://leetcode.com/u/M_Lalpradhap/',
    linkedinUrl: '',
    otherSocialLinks: [],
  },

  education: [
    {
      id: 'edu-psg-btech',
      institution: 'PSG Institute of Technology and Applied Research',
      degree: 'Bachelor of Technology',
      fieldOfStudy: 'Artificial Intelligence & Data Science',
      startDate: '2022',
      endDate: '2026',
      gradeOrGpa: 'CGPA: 7.73',
      statusLabel: 'Graduated (Degree Certificate Pending)',
      description: 'Four-year undergraduate engineering degree focused on AI, Machine Learning, Computer Vision, and Data Science.',
      highlights: [
        'Completed B.Tech in Artificial Intelligence & Data Science (2022 – 2026); degree certificate pending.',
      ],
      sortOrder: 1,
      isPublished: true,
    },
    {
      id: 'edu-ghss-karuvalur',
      institution: 'Government Higher Secondary School, Karuvalur',
      degree: 'Secondary & Higher Secondary Education (10th & 12th)',
      startDate: '2020',
      endDate: '2022',
      gradeOrGpa: '10th: 77% | 12th: 75%',
      highlights: [],
      sortOrder: 2,
      isPublished: true,
    },
  ],

  experiences: [
    {
      id: 'exp-livanova-2026',
      role: 'Data Analytics Intern',
      company: 'LivaNova',
      location: 'Remote, India',
      employmentType: 'Internship',
      statusLabel: 'Completed',
      isCurrent: false,
      startDate: 'June 2026',
      endDate: 'November 2026',
      logoUrl: livanovaLogo,
      summary:
        'Developed enterprise data lineage and access request automation systems across Power Platform and Azure Synapse Analytics.',
      highlights: [
        'Developed a Synapse DFD Generator using Power Apps, Power Automate, Azure Functions, and Azure Synapse Analytics; worked on Azure REST API integration, pipeline dependency mapping, data lineage, and workflow automation.',
        'Developed a Power BI Access Request System using Power Apps, Dataverse, and Power Automate; applied Dataverse data modeling, approval workflows, role-based access management concepts, and enterprise application development.',
      ],
      techStack: [
        'Power Apps',
        'Power Automate',
        'Azure Functions',
        'Azure Synapse Analytics',
        'Dataverse',
        'Power BI',
        'Azure REST API',
      ],
      sortOrder: 1,
      isPublished: true,
    },
    {
      id: 'exp-sap-2025',
      role: 'AI/ML Intern',
      company: 'SAP Labs',
      location: 'Bangalore, India',
      employmentType: 'Internship',
      statusLabel: 'Completed',
      isCurrent: false,
      startDate: 'September 2025',
      endDate: 'September 2025',
      logoUrl: sapLogo,
      summary:
        'Built an AI-powered financial expense classification system backed by structured reporting and data validation pipelines.',
      highlights: [
        'Developed an AI-powered expense classification system to automatically categorize financial transactions and generate structured reports.',
        'Improved expense management accuracy by reducing manual errors and ensuring consistency across financial records.',
        'Designed data preprocessing and validation pipelines to enhance data integrity and model reliability.',
      ],
      techStack: ['Python', 'Machine Learning', 'Data Preprocessing', 'Validation Pipelines'],
      sortOrder: 2,
      isPublished: true,
    },
    {
      id: 'exp-sap-2024',
      role: 'AI/ML Intern',
      company: 'SAP Labs',
      location: 'Bangalore, India',
      employmentType: 'Internship',
      statusLabel: 'Completed',
      isCurrent: false,
      startDate: 'May 2024',
      endDate: 'August 2024',
      logoUrl: sapLogo,
      summary:
        'Developed and deployed ML-based data intelligence models for enterprise record deduplication and dataset quality.',
      highlights: [
        'Developed and deployed machine learning–based data intelligence models to identify and eliminate duplicate records in enterprise-scale systems.',
        'Enhanced data quality and system accuracy by optimizing data validation and deduplication pipelines, reducing redundancy across datasets.',
      ],
      techStack: ['Python', 'Machine Learning', 'Data Validation', 'Deduplication Pipelines'],
      sortOrder: 3,
      isPublished: true,
    },
  ],

  skills: [
    // Programming
    { id: 'sk-python', name: 'Python', category: 'Programming', logoUrl: pythonLogo, summary: 'Core language for ML pipelines, computer vision, backend APIs, and data analysis.', sortOrder: 1, isFeatured: true, isPublished: true },
    { id: 'sk-sql', name: 'SQL', category: 'Programming', summary: 'Relational querying, data validation, and analytical dataset preparation.', sortOrder: 2, isFeatured: true, isPublished: true },

    // AI / Machine Learning
    { id: 'sk-sklearn', name: 'Scikit-learn', category: 'AI / Machine Learning', logoUrl: scikitlearnLogo, summary: 'Classical ML modeling, classification, and enterprise deduplication workflows.', sortOrder: 3, isFeatured: true, isPublished: true },
    { id: 'sk-tf', name: 'TensorFlow', category: 'AI / Machine Learning', logoUrl: tensorflowLogo, summary: 'Deep learning training and neural network experimentation.', sortOrder: 4, isFeatured: true, isPublished: true },
    { id: 'sk-pytorch', name: 'PyTorch', category: 'AI / Machine Learning', logoUrl: pytorchLogo, summary: 'Custom neural architectures and deep vision model development.', sortOrder: 5, isFeatured: true, isPublished: true },
    { id: 'sk-cnns', name: 'CNNs', category: 'AI / Machine Learning', summary: 'Convolutional vision networks including ResNet-style condition monitoring.', sortOrder: 6, isFeatured: false, isPublished: true },
    { id: 'sk-rnn', name: 'RNN', category: 'AI / Machine Learning', summary: 'Sequential deep learning modeling and pattern analysis.', sortOrder: 7, isFeatured: false, isPublished: true },
    { id: 'sk-yolov11', name: 'YOLOv11', category: 'AI / Machine Learning', summary: 'Real-time object detection used in heavy vehicle traffic monitoring.', sortOrder: 8, isFeatured: true, isPublished: true },
    { id: 'sk-opencv', name: 'OpenCV', category: 'AI / Machine Learning', logoUrl: opencvLogo, summary: 'Video frame processing, ANPR extraction, and real-time vision pipelines.', sortOrder: 9, isFeatured: true, isPublished: true },
    { id: 'sk-cv', name: 'Computer Vision', category: 'AI / Machine Learning', summary: 'End-to-end visual inspection, ANPR, and surface condition detection.', sortOrder: 10, isFeatured: true, isPublished: true },

    // Generative AI / LLM / RAG
    { id: 'sk-llms', name: 'Large Language Models', category: 'Generative AI / LLM / RAG', summary: 'Contextual reasoning and domain Q&A powered by foundation language models.', sortOrder: 11, isFeatured: true, isPublished: true },
    { id: 'sk-prompt', name: 'Prompt Engineering', category: 'Generative AI / LLM / RAG', summary: 'Structured prompting strategies for reliable extraction and grounded answers.', sortOrder: 12, isFeatured: false, isPublished: true },
    { id: 'sk-rag', name: 'Retrieval-Augmented Generation (RAG)', category: 'Generative AI / LLM / RAG', summary: 'Vector-indexed semantic retrieval with reduced hallucinations.', sortOrder: 13, isFeatured: true, isPublished: true },
    { id: 'sk-mcp', name: 'Model Context Protocol (MCP)', category: 'Generative AI / LLM / RAG', summary: 'Structured context and tool integration for agentic LLM workflows.', sortOrder: 14, isFeatured: true, isPublished: true },

    // Data Science & Analytics
    { id: 'sk-powerbi', name: 'Power BI', category: 'Data Science & Analytics', logoUrl: powerbiLogo, summary: 'Interactive reporting, governance workflows, and analytics dashboards.', sortOrder: 15, isFeatured: true, isPublished: true },
    { id: 'sk-pandas', name: 'Pandas', category: 'Data Science & Analytics', logoUrl: pandasLogo, summary: 'Tabular transformation, data cleaning, and validation pipelines.', sortOrder: 16, isFeatured: true, isPublished: true },
    { id: 'sk-numpy', name: 'NumPy', category: 'Data Science & Analytics', logoUrl: numpyLogo, summary: 'Vectorized numerical computation for analytics and ML preprocessing.', sortOrder: 17, isFeatured: false, isPublished: true },
    { id: 'sk-matplotlib', name: 'Matplotlib', category: 'Data Science & Analytics', summary: 'Diagnostic plotting and exploratory data visualization.', sortOrder: 18, isFeatured: false, isPublished: true },
    { id: 'sk-mysql', name: 'MySQL', category: 'Data Science & Analytics', logoUrl: mysqlLogo, summary: 'Structured database storage and relational query design.', sortOrder: 19, isFeatured: false, isPublished: true },
    { id: 'sk-seaborn', name: 'Seaborn', category: 'Data Science & Analytics', summary: 'Statistical distribution and correlation visualization.', sortOrder: 20, isFeatured: false, isPublished: true },
    { id: 'sk-feature-eng', name: 'Feature Engineering', category: 'Data Science & Analytics', summary: 'Signal extraction and feature design to strengthen model accuracy.', sortOrder: 21, isFeatured: false, isPublished: true },
    { id: 'sk-eda', name: 'Exploratory Data Analysis', category: 'Data Science & Analytics', summary: 'Pattern discovery, anomaly detection, and dataset quality auditing.', sortOrder: 22, isFeatured: false, isPublished: true },
    { id: 'sk-preprocessing', name: 'Data Preprocessing', category: 'Data Science & Analytics', summary: 'Deduplication, normalization, and validation pipelines.', sortOrder: 23, isFeatured: false, isPublished: true },

    // Cloud & Automation
    { id: 'sk-azure', name: 'Azure', category: 'Cloud & Automation', logoUrl: azureLogo, summary: 'Azure Functions, Synapse Analytics, and REST API pipeline integration.', sortOrder: 24, isFeatured: true, isPublished: true },
    { id: 'sk-powerapps', name: 'Microsoft PowerApps', category: 'Cloud & Automation', summary: 'Enterprise internal tooling and Dataverse-backed request interfaces.', sortOrder: 25, isFeatured: false, isPublished: true },
    { id: 'sk-powerautomate', name: 'Microsoft Power Automate', category: 'Cloud & Automation', summary: 'Automated approval flows and cloud pipeline orchestration.', sortOrder: 26, isFeatured: false, isPublished: true },
    { id: 'sk-fabric', name: 'Fabric (Basics)', category: 'Cloud & Automation', summary: 'Foundational familiarity with Microsoft Fabric unified analytics.', sortOrder: 27, isFeatured: false, isPublished: true },
    { id: 'sk-gcp', name: 'GCP (project-based deployment)', category: 'Cloud & Automation', logoUrl: gcpLogo, summary: 'Project-level cloud application hosting and deployment.', sortOrder: 28, isFeatured: false, isPublished: true },

    // Backend & Deployment
    { id: 'sk-apis', name: 'APIs', category: 'Backend & Deployment', summary: 'RESTful service design and external integration endpoints.', sortOrder: 29, isFeatured: true, isPublished: true },
    { id: 'sk-flask', name: 'Flask', category: 'Backend & Deployment', logoUrl: flaskLogo, summary: 'Lightweight Python web backends powering ML and RAG chatbot services.', sortOrder: 30, isFeatured: true, isPublished: true },
    { id: 'sk-django', name: 'Django', category: 'Backend & Deployment', logoUrl: djangoLogo, summary: 'Structured full-stack Python backend web architecture.', sortOrder: 31, isFeatured: false, isPublished: true },
    { id: 'sk-git', name: 'Git/GitHub', category: 'Backend & Deployment', logoUrl: gitLogo, summary: 'Version control, collaborative branching, and repository workflows.', sortOrder: 32, isFeatured: true, isPublished: true },
    { id: 'sk-docker', name: 'Docker', category: 'Backend & Deployment', logoUrl: dockerLogo, summary: 'Containerized model and service packaging for reproducible runs.', sortOrder: 33, isFeatured: true, isPublished: true },
    { id: 'sk-streamlit', name: 'Streamlit', category: 'Backend & Deployment', logoUrl: streamlitLogo, summary: 'Rapid interactive data and ML demonstration applications.', sortOrder: 34, isFeatured: false, isPublished: true },
  ],

  interestItems: seedInterestItems,
  interests: buildInterestGroups(seedInterestItems),

  projects: [
    {
      id: 'proj-traffic-fine',
      title: 'Traffic Fine System for Heavy Vehicles',
      slug: 'traffic-fine-system-heavy-vehicles',
      domainLabel: 'Computer Vision • Urban Enforcement',
      tagline: 'YOLOv11 & ANPR computer vision system for automated restricted-window traffic enforcement.',
      description:
        'Built a computer vision–based traffic monitoring system using YOLOv11 to detect heavy vehicles, perform automatic number plate recognition (ANPR), and report violations during restricted time windows.',
      statusLabel: 'Completed',
      techStack: ['YOLOv11', 'ANPR', 'OpenCV', 'Computer Vision', 'Python'],
      architectureFlow: [
        'Traffic Video Stream',
        'YOLOv11 Heavy Vehicle Detection',
        'ANPR Plate Extraction',
        'Restricted Window Check & Violation Log',
      ],
      highlights: [
        'Built a computer vision–based traffic monitoring system using YOLOv11 to detect heavy vehicles, perform automatic number plate recognition (ANPR), and report violations during restricted time windows.',
        'Enabled real-time traffic enforcement workflows by integrating vehicle detection, license plate extraction, and automated violation logging for traffic authorities.',
      ],
      repoUrl: 'https://github.com/Pradhap25',
      sortOrder: 1,
      isFeatured: true,
      isPublished: true,
    },
    {
      id: 'proj-rag-resume',
      title: 'RAG-Based Resume Parser & Intelligent Chatbot',
      slug: 'rag-resume-parser-chatbot',
      domainLabel: 'Generative AI • Semantic Retrieval',
      tagline: 'Semantic resume search and contextual Q&A powered by LLMs, Pinecone vector DB, and Flask.',
      description:
        'Built a RAG-based resume parser chatbot using LLMs, Pinecone vector DB, and Flask, enabling semantic resume search and contextual Q&A with reduced hallucinations.',
      statusLabel: 'Completed',
      techStack: ['LLMs', 'RAG', 'Pinecone Vector DB', 'Flask', 'Python'],
      architectureFlow: [
        'Resume Document Ingestion',
        'Vector Embeddings & Pinecone Index',
        'Semantic Retrieval',
        'Grounded LLM Q&A via Flask API',
      ],
      highlights: [
        'Built a RAG-based resume parser chatbot using LLMs, Pinecone vector DB, and Flask.',
        'Enabled semantic resume search and contextual Q&A with reduced hallucinations.',
      ],
      repoUrl: 'https://github.com/Pradhap25',
      sortOrder: 2,
      isFeatured: true,
      isPublished: true,
    },
    {
      id: 'proj-solar-dust',
      title: 'Solar Panel Dust Detection System',
      slug: 'solar-panel-dust-detection',
      domainLabel: 'Deep Learning • Condition Monitoring',
      tagline: 'ResNet-style deep learning vision model for solar panel dust monitoring and maintenance support.',
      description:
        'Designed and implemented a deep learning–based vision system using a ResNet-style architecture to detect dust accumulation on solar panels and support condition monitoring decisions.',
      statusLabel: 'Completed',
      techStack: ['Deep Learning', 'ResNet-style Architecture', 'Computer Vision', 'Python'],
      architectureFlow: [
        'Solar Surface Imagery',
        'ResNet-Style Feature Extraction',
        'Dust Accumulation Classification',
        'Maintenance Decision Support',
      ],
      highlights: [
        'Designed and implemented a deep learning–based vision system using a ResNet-style architecture to detect dust accumulation on solar panels.',
        'Enabled condition monitoring and maintenance decision support by accurately identifying dust-related performance degradation.',
      ],
      repoUrl: 'https://github.com/Pradhap25',
      sortOrder: 3,
      isFeatured: true,
      isPublished: true,
    },
  ],

  achievements: [
    {
      id: 'ach-techgium-8',
      title: 'TECHGIUM – 8th Edition (Finalist)',
      awardLabel: 'National Finalist',
      issuer: 'TECHGIUM – 8th Edition',
      category: 'National Engineering Competition',
      badgeType: 'trophy',
      description:
        'Finalist in Techgium 8th Edition, qualifying for the final round among 39,000+ participants from 560+ engineering institutes across India.',
      sortOrder: 1,
      isFeatured: true,
      isPublished: true,
    },
    {
      id: 'ach-silambam-national',
      title: 'National Gold Medalist – Silambam',
      awardLabel: 'Gold Medal',
      issuer: 'State & National-Level Competitions',
      category: 'Sports / Athletics',
      badgeType: 'medal',
      description:
        'Won Gold Medal at the National Level, representing at state and national-level competitions.',
      sortOrder: 2,
      isFeatured: true,
      isPublished: true,
    },
    {
      id: 'ach-uyir-hackathon',
      title: 'National Level Uyir Road Safety Hackathon — Best Idea Award',
      awardLabel: 'Best Idea Award (₹10,000)',
      issuer: 'National Level Uyir Road Safety Hackathon',
      achievedAt: 'Feb 2025',
      category: 'Hackathon',
      badgeType: 'award',
      description:
        'Received Best Idea Award in the National Level Uyir Road Safety Hackathon with a prize of ₹10,000.',
      sortOrder: 3,
      isFeatured: true,
      isPublished: true,
    },
  ],

  certifications: [
    {
      id: 'cert-ibm-ml',
      title: 'Machine Learning',
      issuer: 'IBM',
      skillsCovered: ['Machine Learning'],
      sortOrder: 1,
      isPublished: true,
    },
    {
      id: 'cert-gl-sql',
      title: 'SQL',
      issuer: 'Great Learning',
      skillsCovered: ['SQL'],
      sortOrder: 2,
      isPublished: true,
    },
  ],

  research: [
    {
      id: 'res-ieee-yolov11-2025',
      title: 'YOLOv11-Powered Real-Time Automatic Fine System for Heavy Vehicle Violations in Protected Urban Zones',
      domain: 'Computer Vision & Intelligent Traffic Systems',
      authors: 'M Lalpradhap',
      venue: 'IEEE International Conference',
      publishedDate: '21 Aug 2025',
      status: 'Conference',
      abstract:
        'Designed an AI-powered real-time violation detection system using YOLOv11 and ANPR, enabling automated fine generation, route optimization, live analytics, and intelligent routing.',
      highlights: [
        'Designed an AI-powered real-time violation detection system using YOLOv11 and ANPR, enabling automated fine generation and route optimization.',
        'Enhanced urban traffic enforcement through live analytics and intelligent routing, reducing congestion and manual intervention.',
      ],
      techTags: ['YOLOv11', 'ANPR', 'Live Analytics', 'Intelligent Routing'],
      sortOrder: 1,
      isPublished: true,
    },
  ],

  leadership: [
    {
      id: 'lead-kmva',
      role: 'Head of the Technical Team',
      organization: 'KMVA Sports Academy',
      category: 'Leadership',
      description: 'Head of the Technical Team, KMVA Sports Academy.',
      sortOrder: 1,
      isPublished: true,
    },
    {
      id: 'lead-college-projects',
      role: 'Team Leader',
      organization: 'College Projects',
      category: 'Leadership',
      description: 'Team Leader across college engineering projects.',
      sortOrder: 2,
      isPublished: true,
    },
    {
      id: 'lead-silambam-rep',
      role: 'State & National-Level Silambam Competitor',
      organization: 'Silambam (National Gold Medalist)',
      category: 'Extracurricular',
      description: 'Represented at state and national-level competitions.',
      sortOrder: 3,
      isPublished: true,
    },
  ],

  softSkills: [
    'Teamwork',
    'Time Management',
    'Communication',
    'Leadership',
    'Adaptability',
  ],
};
