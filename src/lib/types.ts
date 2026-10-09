// ============================================================
// CareerPulse AI — Canonical CandidateState
// Single source of truth shared by all 5 agents
// ============================================================

export interface CandidateProfile {
  fullName: string;
  email: string;
  headline: string;
  summary: string;
  location?: string;
  linkedin?: string;
  github?: string;
}

export interface TargetJob {
  roleTitle: string;
  companyName: string;
  rawDescription: string;
  requiredSkills: string[];
  niceToHaveSkills: string[];
  experienceLevel: 'entry' | 'mid' | 'senior' | 'lead';
}

export interface WeakBullet {
  id: string;
  section: string;
  company?: string;
  originalText: string;
  missingMetric: boolean;
  passiveVerbs: string[];
  suggestedXYZ?: string;
  status: 'pending' | 'accepted' | 'rejected' | 'customized';
  customText?: string;
}

export interface ExplainableScore {
  overall: number;
  keywordAlignment: number;
  semanticRelevance: number;
  experienceRelevance: number;
  achievementEvidence: number;
  hygieneCompleteness: number;
  matchedSkills: string[];
  missingSkills: string[];
  hygieneFeedback: string[];
}

export interface STAREvaluation {
  situation: number;
  task: number;
  action: number;
  result: number;
  overall: number;
  feedback: string;
  modelAnswer: string;
}

export interface InterviewGap {
  id: string;
  skillOrExperience: string;
  questionType: 'technical' | 'behavioral' | 'situational';
  question: string;
  userAnswer?: string;
  answeredVia?: 'voice' | 'text';
  starEvaluation?: STAREvaluation;
}

export interface OutreachDrafts {
  linkedInConnectionNote: string;
  coldEmailSubject: string;
  coldEmailBody: string;
  linkedInAboutSection: string;
}

export interface PortfolioProject {
  title: string;
  description: string;
  techStack: string[];
  liveLink?: string;
  githubLink?: string;
}

export interface PortfolioExperience {
  role: string;
  company: string;
  duration: string;
  bullets: string[];
}

export interface PortfolioData {
  slug: string;
  name: string;
  headline: string;
  about: string;
  skills: string[];
  projects: PortfolioProject[];
  experience: PortfolioExperience[];
  education: Array<{ degree: string; institution: string; year: string }>;
  contactEmail: string;
  linkedin?: string;
  github?: string;
}

export interface CandidateState {
  rawResumeText: string;
  uploadedFileName?: string;
  targetJob: TargetJob;
  candidateProfile: CandidateProfile;
  atsScore: ExplainableScore;
  weakBullets: WeakBullet[];
  interviewGaps: InterviewGap[];
  outreachDrafts: OutreachDrafts;
  portfolioData: PortfolioData;
  sessionId: string;
  createdAt: string;
  lastUpdated: string;
  isDemo: boolean;
  demoPresetId?: string;
}

export const SCORE_WEIGHTS = {
  keywordAlignment: 0.40,
  semanticRelevance: 0.25,
  experienceRelevance: 0.15,
  achievementEvidence: 0.10,
  hygieneCompleteness: 0.10,
} as const;
