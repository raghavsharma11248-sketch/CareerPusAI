// ============================================================
// CareerPulse AI — Agent 5: Portfolio Architect
// Generates a live /portfolio/[slug] page from resume data
// ============================================================

import { z } from 'zod';
import { getGeminiClient } from '../gemini';
import type { CandidateProfile, TargetJob, PortfolioData } from '../types';

const PortfolioSchema = z.object({
  slug: z.string(),
  name: z.string(),
  headline: z.string(),
  about: z.string(),
  skills: z.array(z.string()),
  projects: z.array(z.object({
    title: z.string(),
    description: z.string(),
    techStack: z.array(z.string()),
    liveLink: z.string().optional(),
    githubLink: z.string().optional(),
  })),
  experience: z.array(z.object({
    role: z.string(),
    company: z.string(),
    duration: z.string(),
    bullets: z.array(z.string()),
  })),
  education: z.array(z.object({
    degree: z.string(),
    institution: z.string(),
    year: z.string(),
  })),
  contactEmail: z.string(),
});

function generateSlug(name: string, company: string, year: string): string {
  return `${name.toLowerCase().replace(/\s+/g, '-')}-${company.toLowerCase().replace(/\s+/g, '-')}-${year}`
    .replace(/[^a-z0-9-]/g, '');
}

export async function generatePortfolio(
  profile: CandidateProfile,
  targetJob: TargetJob,
  rawResumeText: string
): Promise<PortfolioData> {
  const currentYear = new Date().getFullYear().toString();

  const prompt = `You are a portfolio architect. Extract structured portfolio data from this resume.

## CANDIDATE PROFILE:
Name: ${profile.fullName}
Email: ${profile.email}
Headline: ${profile.headline}
Target Role: ${targetJob.roleTitle} at ${targetJob.companyName}

## RAW RESUME TEXT:
${rawResumeText.slice(0, 4000)}

Extract and structure all information. Return ONLY valid JSON:
{
  "slug": "${generateSlug(profile.fullName, targetJob.companyName, currentYear)}",
  "name": "${profile.fullName}",
  "headline": "optimized headline for ${targetJob.roleTitle}",
  "about": "compelling 3-4 sentence bio tailored for ${targetJob.companyName} roles",
  "skills": ["skill1", "skill2"],
  "projects": [
    {
      "title": "Project Name",
      "description": "1-2 sentence description with impact",
      "techStack": ["React", "TypeScript"],
      "liveLink": "https://...",
      "githubLink": "https://github.com/..."
    }
  ],
  "experience": [
    {
      "role": "Job Title",
      "company": "Company",
      "duration": "2022 – Present",
      "bullets": ["strong XYZ bullet 1", "strong XYZ bullet 2"]
    }
  ],
  "education": [
    {
      "degree": "B.S. Computer Science",
      "institution": "University Name",
      "year": "2021"
    }
  ],
  "contactEmail": "${profile.email}"
}`;

  const response = await getGeminiClient().models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: { responseMimeType: 'application/json' },
  });

  try {
    const cleaned = (response.text || '{}').replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const data = PortfolioSchema.parse(JSON.parse(cleaned));
    return {
      ...data,
      linkedin: profile.linkedin,
      github: profile.github,
    };
  } catch {
    return {
      slug: generateSlug(profile.fullName, targetJob.companyName, currentYear),
      name: profile.fullName,
      headline: profile.headline,
      about: profile.summary,
      skills: targetJob.requiredSkills,
      projects: [],
      experience: [],
      education: [],
      contactEmail: profile.email,
      linkedin: profile.linkedin,
      github: profile.github,
    };
  }
}
