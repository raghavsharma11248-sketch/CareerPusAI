// ============================================================
// CareerPulse AI — Agent 4: Recruiter Outreach Strategist
// Generates LinkedIn DMs + Cold Emails personalized to JD
// ============================================================

import { z } from 'zod';
import { getGeminiClient } from '../gemini';
import type { CandidateProfile, TargetJob, OutreachDrafts } from '../types';

const OutreachSchema = z.object({
  linkedInConnectionNote: z.string().max(300),
  coldEmailSubject: z.string(),
  coldEmailBody: z.string(),
  linkedInAboutSection: z.string(),
});

export async function generateOutreach(
  profile: CandidateProfile,
  targetJob: TargetJob,
  matchedSkills: string[],
  apiKey?: string
): Promise<OutreachDrafts> {
  const prompt = `You are an expert career strategist writing personalized outreach messages.

## CANDIDATE:
Name: ${profile.fullName}
Headline: ${profile.headline}
Matched Skills: ${matchedSkills.join(', ')}

## TARGET ROLE: ${targetJob.roleTitle} at ${targetJob.companyName}

Generate professional outreach content. Return ONLY valid JSON:
{
  "linkedInConnectionNote": "Hi [Name], I noticed your work at ${targetJob.companyName}... (MAX 300 chars, personalized, non-spammy)",
  "coldEmailSubject": "Re: ${targetJob.roleTitle} — ${profile.fullName} | [specific hook]",
  "coldEmailBody": "Hi [Recruiter Name],\\n\\n[3-4 sentences: who you are, why this role, specific value you bring]\\n\\nBest,\\n${profile.fullName}",
  "linkedInAboutSection": "Updated About section for ${profile.fullName}'s LinkedIn profile optimized for ${targetJob.roleTitle} roles (150-200 words)"
}

Rules:
- LinkedIn note MUST be under 300 characters
- No generic copy-paste language  
- Reference specific ${targetJob.companyName} products/values
- Highlight top matched skills: ${matchedSkills.slice(0, 3).join(', ')}`;

  const response = await getGeminiClient(apiKey).models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: { responseMimeType: 'application/json' },
  });

  try {
    const cleaned = (response.text || '{}').replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    return OutreachSchema.parse(JSON.parse(cleaned));
  } catch {
    return {
      linkedInConnectionNote: `Hi, I'm ${profile.fullName}, a ${profile.headline} excited about the ${targetJob.roleTitle} role at ${targetJob.companyName}. Would love to connect!`,
      coldEmailSubject: `${targetJob.roleTitle} Interest — ${profile.fullName}`,
      coldEmailBody: `Hi,\n\nI'm ${profile.fullName}, a ${profile.headline} with proven experience in ${matchedSkills.slice(0, 2).join(' and ')}.\n\nI'm very interested in the ${targetJob.roleTitle} opportunity at ${targetJob.companyName} and believe my background aligns well.\n\nWould love to discuss further.\n\nBest,\n${profile.fullName}`,
      linkedInAboutSection: `${profile.summary} Passionate about building impactful software and currently exploring ${targetJob.roleTitle} opportunities.`,
    };
  }
}
