// ============================================================
// CareerPulse AI — 1-Click Demo Preset Data
// Used for hackathon judge demo — preloads full realistic state
// ============================================================

import type { CandidateState } from './types';

export const DEMO_RESUME_TEXT = `
ALEX CHEN
alex.chen@email.com | San Francisco, CA | linkedin.com/in/alexchen | github.com/alexchen

SUMMARY
Software engineer with 3 years of experience building React and Node.js applications. 
Worked on various projects and helped team members. Good at problem solving.

EXPERIENCE

Software Engineer — TechCorp Inc. (2022 – Present)
- Worked on frontend features using React
- Helped improve application performance
- Participated in code reviews
- Fixed bugs reported by customers

Junior Developer — StartupXYZ (2021 – 2022)
- Assisted with developing new features
- Wrote some unit tests
- Collaborated with the team

EDUCATION
B.S. Computer Science — UC Berkeley (2021)

SKILLS
JavaScript, React, Node.js, Python, SQL, Git
`;

export const DEMO_JOB_DESCRIPTION = `
Senior Frontend Engineer — Stripe

We're looking for a Senior Frontend Engineer to join our Payments team.

Requirements:
- 4+ years of experience with React and TypeScript
- Experience with performance optimization (Core Web Vitals, bundle splitting)
- Strong understanding of accessibility (WCAG 2.1 AA)
- Experience with testing frameworks (Jest, Cypress, Playwright)
- Familiarity with design systems and component libraries

Nice to have:
- Experience with Next.js App Router
- Knowledge of payment flows (PCI compliance)
- Open source contributions

Responsibilities:
- Lead development of core payment UI components
- Collaborate with design to build pixel-perfect, accessible interfaces
- Mentor junior engineers
- Drive performance improvements across checkout flows
`;

export const DEMO_CANDIDATE_STATE: Partial<CandidateState> = {
  rawResumeText: DEMO_RESUME_TEXT,
  uploadedFileName: 'alex_chen_resume.pdf',
  isDemo: true,
  demoPresetId: 'stripe-senior-frontend-2026',
  targetJob: {
    roleTitle: 'Senior Frontend Engineer',
    companyName: 'Stripe',
    rawDescription: DEMO_JOB_DESCRIPTION,
    requiredSkills: ['React', 'TypeScript', 'Performance Optimization', 'Jest', 'Accessibility', 'WCAG'],
    niceToHaveSkills: ['Next.js', 'Playwright', 'Design Systems'],
    experienceLevel: 'senior',
  },
  candidateProfile: {
    fullName: 'Alex Chen',
    email: 'alex.chen@email.com',
    headline: 'Software Engineer · React · Node.js · 3 Years Experience',
    summary: 'Software engineer with 3 years building React and Node.js apps.',
    location: 'San Francisco, CA',
    linkedin: 'linkedin.com/in/alexchen',
    github: 'github.com/alexchen',
  },
  atsScore: {
    overall: 42,
    keywordAlignment: 35,
    semanticRelevance: 50,
    experienceRelevance: 40,
    achievementEvidence: 10,
    hygieneCompleteness: 70,
    matchedSkills: ['React', 'JavaScript', 'Node.js', 'Python'],
    missingSkills: ['TypeScript', 'Cypress', 'Playwright', 'WCAG', 'Core Web Vitals'],
    hygieneFeedback: [
      'Missing TypeScript in skills — mentioned in 4+ JD lines',
      'No quantified achievements (use Google XYZ formula)',
      'Weak action verbs detected: "worked on", "helped", "assisted"',
    ],
  },
  weakBullets: [
    {
      id: 'wb-001',
      section: 'experience',
      company: 'TechCorp Inc.',
      originalText: 'Worked on frontend features using React',
      missingMetric: true,
      passiveVerbs: ['worked on'],
      suggestedXYZ: 'Engineered [X] React component library features that reduced checkout drop-off by [Y]%, saving $[Z]k in potential revenue monthly',
      status: 'pending',
    },
    {
      id: 'wb-002',
      section: 'experience',
      company: 'TechCorp Inc.',
      originalText: 'Helped improve application performance',
      missingMetric: true,
      passiveVerbs: ['helped improve'],
      suggestedXYZ: 'Optimized [X] Core Web Vitals metrics, improving LCP by [Y]ms and reducing bundle size by [Z]%, boosting Lighthouse score from 65 → 94',
      status: 'pending',
    },
    {
      id: 'wb-003',
      section: 'experience',
      company: 'StartupXYZ',
      originalText: 'Assisted with developing new features',
      missingMetric: true,
      passiveVerbs: ['assisted with'],
      suggestedXYZ: 'Developed [X] user-facing features used by [Y]k+ customers, contributing to [Z]% increase in DAU over 2 quarters',
      status: 'pending',
    },
  ],
  interviewGaps: [
    {
      id: 'ig-001',
      skillOrExperience: 'TypeScript',
      questionType: 'technical',
      question: 'Walk me through a time you migrated a large JavaScript codebase to TypeScript. What challenges did you face and how did you ensure type safety without breaking existing functionality?',
    },
    {
      id: 'ig-002',
      skillOrExperience: 'Performance Optimization',
      questionType: 'technical',
      question: 'Describe how you would diagnose and fix poor Core Web Vitals scores on a React app. What tools would you use?',
    },
    {
      id: 'ig-003',
      skillOrExperience: 'Mentorship',
      questionType: 'behavioral',
      question: 'Tell me about a time you mentored a junior engineer. How did you structure your feedback and track their progress?',
    },
  ],
};
