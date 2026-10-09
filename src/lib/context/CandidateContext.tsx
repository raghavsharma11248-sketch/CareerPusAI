'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import type { CandidateState, WeakBullet, TargetJob } from '@/lib/types';
import { DEMO_CANDIDATE_STATE, DEMO_RESUME_TEXT, DEMO_JOB_DESCRIPTION } from '@/lib/sampleData';

export interface TerminalLog {
  id: string;
  timestamp: string;
  agent: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
}

const DEFAULT_STATE: CandidateState = {
  rawResumeText: '',
  targetJob: {
    roleTitle: 'Senior Frontend Engineer',
    companyName: 'Stripe',
    rawDescription: DEMO_JOB_DESCRIPTION,
    requiredSkills: ['React', 'TypeScript', 'Performance Optimization', 'Jest', 'Accessibility'],
    niceToHaveSkills: ['Next.js', 'Playwright'],
    experienceLevel: 'senior',
  },
  candidateProfile: {
    fullName: 'Alex Chen',
    email: 'alex.chen@email.com',
    headline: 'Frontend Engineer · React & TypeScript Specialist',
    summary: 'Experienced software engineer focused on building responsive, high-performance web applications.',
    location: 'San Francisco, CA',
    linkedin: 'linkedin.com/in/alexchen',
    github: 'github.com/alexchen',
  },
  atsScore: {
    overall: 42,
    keywordAlignment: 35,
    semanticRelevance: 50,
    experienceRelevance: 40,
    achievementEvidence: 15,
    hygieneCompleteness: 70,
    matchedSkills: ['React', 'JavaScript', 'Node.js', 'Git'],
    missingSkills: ['TypeScript', 'Jest', 'Cypress', 'WCAG', 'Core Web Vitals'],
    hygieneFeedback: [
      'Missing TypeScript in skills — required by 4+ JD requirements',
      'Bullets lack quantifiable metrics (X achieved by doing Y as measured by Z)',
      'Replace passive verbs ("worked on", "helped") with strong action verbs',
    ],
  },
  weakBullets: DEMO_CANDIDATE_STATE.weakBullets || [],
  interviewGaps: DEMO_CANDIDATE_STATE.interviewGaps || [],
  outreachDrafts: {
    linkedInConnectionNote: 'Hi! I noticed Stripe\'s search for a Senior Frontend Engineer on the Payments team. With 3+ years in high-throughput React UIs and performance optimization, I\'d love to connect and follow your work!',
    coldEmailSubject: 'Senior Frontend Engineer — Alex Chen (React / Web Performance)',
    coldEmailBody: 'Hi Stripe Recruiting Team,\n\nI recently came across the Senior Frontend Engineer role on the Payments team. Having spent 3 years engineering scalable React interfaces and optimizing Core Web Vitals, I\'m deeply impressed by Stripe\'s engineering bar.\n\nI\'ve tailored my portfolio and key project case studies specifically for this opening.\n\nBest regards,\nAlex Chen',
    linkedInAboutSection: 'Frontend Engineer specializing in React, TypeScript, and modern web performance. Dedicated to crafting accessible, pixel-perfect user experiences that scale seamlessly across millions of users.',
  },
  portfolioData: {
    slug: 'alex-chen-stripe-2026',
    name: 'Alex Chen',
    headline: 'Senior Frontend Engineer · Payments & Web Performance',
    about: 'Software engineer passionate about building frictionless payment flows, design systems, and hyper-optimized React architectures.',
    skills: ['React', 'TypeScript', 'Next.js', 'Node.js', 'Performance Optimization', 'WCAG 2.1'],
    projects: [
      {
        title: 'High-Throughput Checkout Redesign',
        description: 'Engineered modular payment UI components reducing checkout latency by 38% and boosting conversion rates.',
        techStack: ['React', 'TypeScript', 'Tailwind', 'Stripe Elements'],
        liveLink: 'https://demo.stripe.com',
        githubLink: 'https://github.com/alexchen/checkout-core',
      },
      {
        title: 'Accessible Design System Engine',
        description: 'Architected 40+ WCAG 2.1 AA compliant UI components with comprehensive automated test suites.',
        techStack: ['TypeScript', 'Storybook', 'Jest', 'Axe-core'],
        githubLink: 'https://github.com/alexchen/accessible-design-tokens',
      },
    ],
    experience: [
      {
        role: 'Software Engineer',
        company: 'TechCorp Inc.',
        duration: '2022 – Present',
        bullets: [
          'Architected reusable React component library with TypeScript, reducing checkout drop-off by 18%.',
          'Optimized Core Web Vitals, improving Largest Contentful Paint (LCP) from 3.4s to 1.1s.',
        ],
      },
    ],
    education: [
      {
        degree: 'B.S. in Computer Science',
        institution: 'UC Berkeley',
        year: '2021',
      },
    ],
    contactEmail: 'alex.chen@email.com',
    linkedin: 'linkedin.com/in/alexchen',
    github: 'github.com/alexchen',
  },
  sessionId: 'session_demo_2026',
  createdAt: new Date().toISOString(),
  lastUpdated: new Date().toISOString(),
  isDemo: true,
  demoPresetId: 'stripe-senior-frontend-2026',
};

interface CandidateContextType {
  state: CandidateState;
  setState: React.Dispatch<React.SetStateAction<CandidateState>>;
  loadDemo: () => void;
  updateBulletStatus: (id: string, status: 'accepted' | 'rejected' | 'customized', customText?: string) => void;
  addTerminalLog: (agent: string, message: string, type?: TerminalLog['type']) => void;
  terminalLogs: TerminalLog[];
  isProcessing: boolean;
  setIsProcessing: React.Dispatch<React.SetStateAction<boolean>>;
}

const CandidateContext = createContext<CandidateContextType | undefined>(undefined);

export function CandidateProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<CandidateState>(DEFAULT_STATE);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [terminalLogs, setTerminalLogs] = useState<TerminalLog[]>([
    {
      id: 'log-1',
      timestamp: '00:00:01',
      agent: 'System',
      message: 'Autonomous Hiring Readiness Engine initialized (Optimus Mode).',
      type: 'info',
    },
    {
      id: 'log-2',
      timestamp: '00:00:02',
      agent: 'Agent 1 (Auditor)',
      message: 'Demo state preloaded: Stripe Senior Frontend Engineer profile ready.',
      type: 'success',
    },
  ]);

  const addTerminalLog = (agent: string, message: string, type: TerminalLog['type'] = 'info') => {
    const now = new Date();
    const timestamp = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
    setTerminalLogs((prev) => [
      ...prev.slice(-30), // keep last 30 logs
      {
        id: `log-${Date.now()}-${Math.random()}`,
        timestamp,
        agent,
        message,
        type,
      },
    ]);
  };

  const loadDemo = () => {
    setState((prev) => ({
      ...DEFAULT_STATE,
      rawResumeText: DEMO_RESUME_TEXT,
      lastUpdated: new Date().toISOString(),
    }));
    addTerminalLog('System', 'Preloaded complete Stripe demo candidate preset.', 'success');
    addTerminalLog('Agent 1 (Auditor)', 'Parsed 4 weak achievement bullets. Explainable ATS score computed: 42/100.', 'info');
    addTerminalLog('Agent 2 (Tailor)', 'Google XYZ formula drafts generated for 3 pending experience items.', 'info');
    addTerminalLog('Agent 3 (Interview)', 'Identified 3 high-priority technical & behavioral interview gaps.', 'info');
  };

  const updateBulletStatus = (
    id: string,
    status: 'accepted' | 'rejected' | 'customized',
    customText?: string
  ) => {
    setState((prev) => {
      const updatedBullets = prev.weakBullets.map((b) => {
        if (b.id === id) {
          return {
            ...b,
            status,
            customText: customText || b.customText,
          };
        }
        return b;
      });

      // Recalculate achievementEvidence and overall score
      const acceptedCount = updatedBullets.filter((b) => b.status === 'accepted' || b.status === 'customized').length;
      const totalBullets = updatedBullets.length || 1;
      const newAchievementScore = Math.min(100, Math.round((acceptedCount / totalBullets) * 100));

      const newOverall = Math.min(
        100,
        Math.round(
          prev.atsScore.keywordAlignment * 0.40 +
          prev.atsScore.semanticRelevance * 0.25 +
          prev.atsScore.experienceRelevance * 0.15 +
          newAchievementScore * 0.10 +
          prev.atsScore.hygieneCompleteness * 0.10
        )
      );

      return {
        ...prev,
        weakBullets: updatedBullets,
        atsScore: {
          ...prev.atsScore,
          achievementEvidence: newAchievementScore,
          overall: newOverall,
        },
        lastUpdated: new Date().toISOString(),
      };
    });

    addTerminalLog(
      'Agent 2 (Tailor)',
      `Bullet ${id} marked as ${status.toUpperCase()}. Recalculating live ATS score...`,
      status === 'accepted' ? 'success' : 'warning'
    );
  };

  return (
    <CandidateContext.Provider
      value={{
        state,
        setState,
        loadDemo,
        updateBulletStatus,
        addTerminalLog,
        terminalLogs,
        isProcessing,
        setIsProcessing,
      }}
    >
      {children}
    </CandidateContext.Provider>
  );
}

export function useCandidate() {
  const context = useContext(CandidateContext);
  if (!context) {
    throw new Error('useCandidate must be used within a CandidateProvider');
  }
  return context;
}
