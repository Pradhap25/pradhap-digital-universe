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

export type BrandAssetKind = 'technology' | 'company' | 'certification';

export interface BrandLogoResolution {
  found: boolean;
  url?: string;
  matchedName?: string;
  source: 'local-verified' | 'devicon' | 'simpleicons' | 'none';
  note?: string;
}

interface CatalogEntry {
  canonical: string;
  aliases: string[];
  url: string;
  source: 'local-verified' | 'devicon' | 'simpleicons';
  kind: BrandAssetKind;
}

const BRAND_CATALOG: readonly CatalogEntry[] = [
  // Local Verified Company Assets
  {
    canonical: 'LivaNova',
    aliases: ['livanova', 'liva nova'],
    url: livanovaLogo,
    source: 'local-verified',
    kind: 'company',
  },
  {
    canonical: 'SAP Labs',
    aliases: ['sap', 'sap labs', 'sap se'],
    url: sapLogo,
    source: 'local-verified',
    kind: 'company',
  },

  // Local Verified Technology Assets
  {
    canonical: 'Python',
    aliases: ['python', 'py'],
    url: pythonLogo,
    source: 'local-verified',
    kind: 'technology',
  },
  {
    canonical: 'TensorFlow',
    aliases: ['tensorflow', 'tf'],
    url: tensorflowLogo,
    source: 'local-verified',
    kind: 'technology',
  },
  {
    canonical: 'PyTorch',
    aliases: ['pytorch', 'torch'],
    url: pytorchLogo,
    source: 'local-verified',
    kind: 'technology',
  },
  {
    canonical: 'OpenCV',
    aliases: ['opencv', 'cv2'],
    url: opencvLogo,
    source: 'local-verified',
    kind: 'technology',
  },
  {
    canonical: 'Scikit-learn',
    aliases: ['scikit-learn', 'scikitlearn', 'sklearn', 'scikit learn'],
    url: scikitlearnLogo,
    source: 'local-verified',
    kind: 'technology',
  },
  {
    canonical: 'Microsoft Azure',
    aliases: ['azure', 'microsoft azure', 'azure functions', 'azure synapse', 'azure synapse analytics'],
    url: azureLogo,
    source: 'local-verified',
    kind: 'technology',
  },
  {
    canonical: 'Power BI',
    aliases: ['power bi', 'powerbi'],
    url: powerbiLogo,
    source: 'local-verified',
    kind: 'technology',
  },
  {
    canonical: 'Pandas',
    aliases: ['pandas'],
    url: pandasLogo,
    source: 'local-verified',
    kind: 'technology',
  },
  {
    canonical: 'NumPy',
    aliases: ['numpy'],
    url: numpyLogo,
    source: 'local-verified',
    kind: 'technology',
  },
  {
    canonical: 'MySQL',
    aliases: ['mysql'],
    url: mysqlLogo,
    source: 'local-verified',
    kind: 'technology',
  },
  {
    canonical: 'Flask',
    aliases: ['flask'],
    url: flaskLogo,
    source: 'local-verified',
    kind: 'technology',
  },
  {
    canonical: 'Django',
    aliases: ['django'],
    url: djangoLogo,
    source: 'local-verified',
    kind: 'technology',
  },
  {
    canonical: 'Docker',
    aliases: ['docker'],
    url: dockerLogo,
    source: 'local-verified',
    kind: 'technology',
  },
  {
    canonical: 'Git / GitHub',
    aliases: ['git', 'github', 'git/github'],
    url: gitLogo,
    source: 'local-verified',
    kind: 'technology',
  },
  {
    canonical: 'Streamlit',
    aliases: ['streamlit'],
    url: streamlitLogo,
    source: 'local-verified',
    kind: 'technology',
  },
  {
    canonical: 'Google Cloud (GCP)',
    aliases: ['gcp', 'google cloud', 'google cloud platform'],
    url: gcpLogo,
    source: 'local-verified',
    kind: 'technology',
  },

  // Verified Devicon / Simple Icons CDN Catalog for dynamic future skills
  {
    canonical: 'React',
    aliases: ['react', 'reactjs', 'react.js'],
    url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg',
    source: 'devicon',
    kind: 'technology',
  },
  {
    canonical: 'TypeScript',
    aliases: ['typescript', 'ts'],
    url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg',
    source: 'devicon',
    kind: 'technology',
  },
  {
    canonical: 'JavaScript',
    aliases: ['javascript', 'js', 'ecmascript'],
    url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg',
    source: 'devicon',
    kind: 'technology',
  },
  {
    canonical: 'Next.js',
    aliases: ['nextjs', 'next.js', 'next'],
    url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg',
    source: 'devicon',
    kind: 'technology',
  },
  {
    canonical: 'Node.js',
    aliases: ['nodejs', 'node.js', 'node'],
    url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg',
    source: 'devicon',
    kind: 'technology',
  },
  {
    canonical: 'FastAPI',
    aliases: ['fastapi', 'fast api'],
    url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/fastapi/fastapi-original.svg',
    source: 'devicon',
    kind: 'technology',
  },
  {
    canonical: 'PostgreSQL',
    aliases: ['postgresql', 'postgres', 'psql'],
    url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg',
    source: 'devicon',
    kind: 'technology',
  },
  {
    canonical: 'MongoDB',
    aliases: ['mongodb', 'mongo'],
    url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg',
    source: 'devicon',
    kind: 'technology',
  },
  {
    canonical: 'Tailwind CSS',
    aliases: ['tailwind', 'tailwindcss', 'tailwind css'],
    url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg',
    source: 'devicon',
    kind: 'technology',
  },
  {
    canonical: 'Supabase',
    aliases: ['supabase'],
    url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/supabase/supabase-original.svg',
    source: 'devicon',
    kind: 'technology',
  },
  {
    canonical: 'Kubernetes',
    aliases: ['kubernetes', 'k8s'],
    url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kubernetes/kubernetes-original.svg',
    source: 'devicon',
    kind: 'technology',
  },
  {
    canonical: 'AWS',
    aliases: ['aws', 'amazon web services'],
    url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original-wordmark.svg',
    source: 'devicon',
    kind: 'technology',
  },
  {
    canonical: 'Linux',
    aliases: ['linux', 'ubuntu'],
    url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linux/linux-original.svg',
    source: 'devicon',
    kind: 'technology',
  },
  {
    canonical: 'Jupyter',
    aliases: ['jupyter', 'jupyter notebook'],
    url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jupyter/jupyter-original.svg',
    source: 'devicon',
    kind: 'technology',
  },
  {
    canonical: 'Hugging Face',
    aliases: ['huggingface', 'hugging face', 'transformers'],
    url: 'https://cdn.simpleicons.org/huggingface/FFD21E',
    source: 'simpleicons',
    kind: 'technology',
  },
  {
    canonical: 'LangChain',
    aliases: ['langchain'],
    url: 'https://cdn.simpleicons.org/langchain/1C3C3C',
    source: 'simpleicons',
    kind: 'technology',
  },
  {
    canonical: 'Microsoft',
    aliases: ['microsoft'],
    url: 'https://cdn.simpleicons.org/microsoft/5E5E5E',
    source: 'simpleicons',
    kind: 'company',
  },
  {
    canonical: 'Google',
    aliases: ['google'],
    url: 'https://cdn.simpleicons.org/google/4285F4',
    source: 'simpleicons',
    kind: 'company',
  },
  {
    canonical: 'IBM',
    aliases: ['ibm'],
    url: 'https://cdn.simpleicons.org/ibm/054ADA',
    source: 'simpleicons',
    kind: 'certification',
  },
];

function normalizeName(input: string): string {
  return input
    .toLowerCase()
    .replace(/\(.*?\)/g, '')
    .replace(/[^a-z0-9+.#/\s-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function resolveBrandLogo(
  rawName: string,
  preferredKind?: BrandAssetKind,
): BrandLogoResolution {
  const normalized = normalizeName(rawName);
  if (!normalized) {
    return {
      found: false,
      source: 'none',
      note: 'Enter a technology, company, or provider name first.',
    };
  }

  const exact = BRAND_CATALOG.find(
    (entry) =>
      (!preferredKind || entry.kind === preferredKind || preferredKind === 'certification') &&
      entry.aliases.some((alias) => alias === normalized),
  );

  if (exact) {
    return {
      found: true,
      url: exact.url,
      matchedName: exact.canonical,
      source: exact.source,
    };
  }

  const partial = BRAND_CATALOG.find(
    (entry) =>
      (!preferredKind || entry.kind === preferredKind || preferredKind === 'certification') &&
      entry.aliases.some(
        (alias) =>
          normalized.includes(alias) ||
          (normalized.length >= 3 && alias.includes(normalized)),
      ),
  );

  if (partial) {
    return {
      found: true,
      url: partial.url,
      matchedName: partial.canonical,
      source: partial.source,
    };
  }

  return {
    found: false,
    source: 'none',
    note: 'No verified official logo found automatically. Upload a custom asset or paste a verified logo URL.',
  };
}

export function searchBrandLogos(query: string): CatalogEntry[] {
  const normalized = normalizeName(query);
  if (!normalized) {
    return BRAND_CATALOG.slice(0, 12);
  }
  return BRAND_CATALOG.filter(
    (entry) =>
      entry.canonical.toLowerCase().includes(normalized) ||
      entry.aliases.some((alias) => alias.includes(normalized)),
  );
}
