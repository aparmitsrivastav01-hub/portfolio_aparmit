export interface PortfolioProject {
  id: number
  name: string
  summary: string
  overview: string
  features: string[]
  technologies: string[]
  status: string
  type: string
  period?: string
  liveUrl?: string
  repositoryUrl?: string
  verificationNote?: string
}

export const projects: PortfolioProject[] = [
  {
    id: 1,
    name: 'FinSight',
    summary: 'AI-powered financial document analysis, built to make company reports easier to explore.',
    overview: 'FinSight lets users upload financial statement PDFs, retrieve relevant context, and ask questions that receive analyst-style answers grounded in the source documents.',
    features: [
      'PDF statement ingestion and text extraction',
      'Financial knowledge retrieval with ChromaDB and embeddings',
      'Document-grounded answers using NVIDIA Nemotron through OpenRouter',
    ],
    technologies: ['React', 'TypeScript', 'Python', 'FastAPI', 'ChromaDB', 'OpenRouter'],
    status: 'Actively building',
    type: 'AI · Financial technology',
    period: '2026 — ongoing',
    liveUrl: 'https://finsight-ai-ebon.vercel.app/',
    repositoryUrl: 'https://github.com/aparmitsrivastav01-hub/finsight-ai',
  },
  {
    id: 2,
    name: 'Dawa-Wise',
    summary: 'A hackathon medicine discovery project focused on clearer medicine information.',
    overview: 'The current project supports medicine search, catalogue-listed generic alternatives, and pricing details with source and verification labels. Prescription image extraction is described in its documentation as future scope.',
    features: [
      'Search by medicine name, brand, or active ingredient',
      'AI-assisted interpretation for misspelled or ambiguous search queries',
      'Medicine and price results with source and verification labels',
      'Third place at the SRM hackathon with Dawa-Wise',
    ],
    technologies: ['React', 'Vite', 'Python', 'FastAPI', 'OpenRouter', 'NVIDIA Nemotron'],
    status: 'Hackathon project',
    type: 'Health technology · Hackathon',
    period: '2026',
    liveUrl: 'https://dawa-wise-production.vercel.app/',
    repositoryUrl: 'https://github.com/aparmitsrivastav01-hub/DawaWise_production',
  },
  {
    id: 3,
    name: 'OpenClaw Clone',
    summary: 'A local AI agent CLI with agent, plan, and ask workflows.',
    overview: 'This project runs against a local Ollama model and uses the Vercel AI SDK. Its documented workflows support tool execution, planning, approval steps, and optional web research integrations.',
    features: [
      'Agent, Plan, and Ask modes',
      'Local model support through Ollama',
      'Tool integrations and multi-step planning workflows',
    ],
    technologies: ['TypeScript', 'Ollama', 'Vercel AI SDK'],
    status: 'In progress',
    type: 'AI agent · CLI',
    period: '2026',
    repositoryUrl: 'https://github.com/aparmitsrivastav01-hub/OpenClaw-local-clone',
  },
  {
    id: 4,
    name: 'Black Cat Gym',
    summary: 'A website project for a local gym client.',
    overview: 'A live website for Black Cat Gym. The implementation source and its specific features and technology stack have not been verified.',
    features: ['Local gym client website'],
    technologies: [],
    status: 'Live website',
    type: 'Client website',
    liveUrl: 'https://blackcatgym.in/',
    verificationNote: 'The public website is available; implementation details and technology stack need confirmation.',
  },
  {
    id: 5,
    name: 'YK Fitness',
    summary: 'A separate gym website project.',
    overview: 'A live website for YK Fitness Academy. It is separate from Black Cat Gym; the implementation source and its specific features and technology stack have not been verified.',
    features: [],
    technologies: [],
    status: 'Live website',
    type: 'Website',
    liveUrl: 'https://www.ykfitnessacademy.in/',
    verificationNote: 'The public website is available; implementation details and technology stack need confirmation.',
  },
  {
    id: 6,
    name: 'Code Yudh Notes',
    summary: 'An educational website for Class 12 Computer Science notes.',
    overview: 'The available brief identifies the site’s subject and audience, but its implementation source and a verified public demo were not present in the inspected workspace or public repositories.',
    features: ['Class 12 Computer Science notes'],
    technologies: [],
    status: 'Details to verify',
    type: 'Education · Website',
    verificationNote: 'Features, technology stack, and project link need confirmation.',
  },
  {
    id: 7,
    name: 'PYCOM',
    summary: 'A Python and MySQL command-line database project.',
    overview: 'The public repository describes a menu-based personal database application for managing user records. It performs CRUD operations and demonstrates database connectivity, validation, and error handling.',
    features: [
      'Create, read, update, and delete user records',
      'MySQL database connectivity',
      'Input validation and error handling',
    ],
    technologies: ['Python', 'MySQL'],
    status: 'Completed project',
    type: 'Command-line application',
    period: '2025',
    repositoryUrl: 'https://github.com/aparmitsrivastav01-hub/PYCOM-A-Python-Based-Personal-Command-Line-Database-System',
    verificationNote: 'The public repository describes PYCOM as a command-line CRUD database system, not an e-commerce application.',
  },
]
