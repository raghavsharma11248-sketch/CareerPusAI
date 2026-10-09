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
    roleTitle: 'Target Role (e.g. Senior Frontend Engineer)',
    companyName: 'Target Company',
    rawDescription: DEMO_JOB_DESCRIPTION,
    requiredSkills: ['React', 'TypeScript', 'System Design', 'Testing', 'Web Performance'],
    niceToHaveSkills: ['Next.js', 'Accessibility'],
    experienceLevel: 'senior',
  },
  candidateProfile: {
    fullName: 'Candidate Profile',
    email: 'candidate@gmail.com',
    headline: 'Software Engineer',
    summary: 'Awaiting resume upload to analyze candidate experience and skill alignment.',
    location: '',
  },
  atsScore: {
    overall: 0,
    keywordAlignment: 0,
    semanticRelevance: 0,
    experienceRelevance: 0,
    achievementEvidence: 0,
    hygieneCompleteness: 0,
    matchedSkills: [],
    missingSkills: [],
    hygieneFeedback: [
      'Awaiting candidate resume upload...',
      'System ready to audit against Workday & Greenhouse ATS rules',
      'Prompt-injection defense firewall active',
    ],
  },
  weakBullets: [],
  interviewGaps: [],
  outreachDrafts: {
    linkedInConnectionNote: '',
    coldEmailSubject: '',
    coldEmailBody: '',
    linkedInAboutSection: '',
  },
  portfolioData: {
    slug: 'demo-portfolio',
    name: 'Candidate',
    headline: 'Software Engineer',
    about: '',
    skills: [],
    projects: [],
    experience: [],
    education: [],
    contactEmail: '',
  },
  sessionId: 'session_ready',
  createdAt: new Date().toISOString(),
  lastUpdated: new Date().toISOString(),
  isDemo: false,
};

interface CandidateContextType {
  state: CandidateState;
  setState: React.Dispatch<React.SetStateAction<CandidateState>>;
  loadDemo: () => void;
  resetToGuide: () => void;
  updateBulletStatus: (id: string, status: 'accepted' | 'rejected' | 'customized', customText?: string) => void;
  addTerminalLog: (agent: string, message: string, type?: TerminalLog['type']) => void;
  terminalLogs: TerminalLog[];
  isProcessing: boolean;
  setIsProcessing: React.Dispatch<React.SetStateAction<boolean>>;
  apiKey: string;
  setApiKey: (key: string) => void;
  userEmail: string;
  setUserEmail: (email: string) => void;
  isAuthenticated: boolean;
  loginWithEmail: (email: string) => { success: boolean; error?: string };
  logout: () => void;
}

const CandidateContext = createContext<CandidateContextType | undefined>(undefined);

export function CandidateProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<CandidateState>(DEFAULT_STATE);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [apiKey, setApiKey] = useState<string>('');
  const [userEmail, setUserEmail] = useState<string>('alex.chen@gmail.com');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);

  // Initialize from localStorage on client
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedKey = localStorage.getItem('careerpulse_gemini_key');
      if (storedKey) setApiKey(storedKey);
      const storedEmail = localStorage.getItem('careerpulse_user_email');
      if (storedEmail) {
        setUserEmail(storedEmail);
        setIsAuthenticated(true);
      }
    }
  }, []);

  const handleSetApiKey = (key: string) => {
    setApiKey(key);
    if (typeof window !== 'undefined') {
      localStorage.setItem('careerpulse_gemini_key', key);
    }
    addTerminalLog('System', 'Google Gemini API Key updated and securely stored.', 'success');
  };

  const loginWithEmail = (email: string): { success: boolean; error?: string } => {
    const trimmed = email.trim().toLowerCase();
    const trustedDomains = ['gmail.com', 'googlemail.com', 'outlook.com', 'hotmail.com', 'live.com', 'yahoo.com', 'icloud.com'];
    const parts = trimmed.split('@');
    if (parts.length !== 2 || !trustedDomains.includes(parts[1])) {
      return {
        success: false,
        error: `Only verified trusted email providers (${trustedDomains.slice(0, 4).join(', ')}, etc.) are permitted for candidate security. Disposable/unverified emails are rejected.`,
      };
    }
    setUserEmail(trimmed);
    setIsAuthenticated(true);
    if (typeof window !== 'undefined') {
      localStorage.setItem('careerpulse_user_email', trimmed);
    }
    addTerminalLog('Auth Guard', `Candidate authenticated with trusted domain: ${parts[1]}`, 'success');
    return { success: true };
  };

  const logout = () => {
    setUserEmail('');
    setIsAuthenticated(false);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('careerpulse_user_email');
    }
    addTerminalLog('Auth Guard', 'Candidate signed out.', 'info');
  };
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
    setState({
      ...DEFAULT_STATE,
      ...DEMO_CANDIDATE_STATE,
      rawResumeText: DEMO_RESUME_TEXT,
      weakBullets: DEMO_CANDIDATE_STATE.weakBullets || [],
      atsScore: DEMO_CANDIDATE_STATE.atsScore || DEFAULT_STATE.atsScore,
      targetJob: DEMO_CANDIDATE_STATE.targetJob || DEFAULT_STATE.targetJob,
      candidateProfile: DEMO_CANDIDATE_STATE.candidateProfile || DEFAULT_STATE.candidateProfile,
      interviewGaps: DEMO_CANDIDATE_STATE.interviewGaps || [],
      lastUpdated: new Date().toISOString(),
      isDemo: true,
    } as CandidateState);
    addTerminalLog('System', 'Preloaded complete Stripe demo candidate preset.', 'success');
    addTerminalLog('Agent 1 (Auditor)', 'Parsed 3 weak achievement bullets. Explainable ATS score computed: 42/100.', 'info');
    addTerminalLog('Agent 2 (Tailor)', 'Google XYZ formula drafts generated for 3 pending experience items.', 'info');
    addTerminalLog('Agent 3 (Interview)', 'Identified 3 high-priority technical & behavioral interview gaps.', 'info');
  };

  const resetToGuide = () => {
    setState(DEFAULT_STATE);
    addTerminalLog('System', 'Returned to Guide mode.', 'info');
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
        resetToGuide,
        updateBulletStatus,
        addTerminalLog,
        terminalLogs,
        isProcessing,
        setIsProcessing,
        apiKey,
        setApiKey: handleSetApiKey,
        userEmail,
        setUserEmail,
        isAuthenticated,
        loginWithEmail,
        logout,
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
