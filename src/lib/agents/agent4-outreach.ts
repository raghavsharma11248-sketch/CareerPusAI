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

  try {
    const response = await getGeminiClient(apiKey).models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: { responseMimeType: 'application/json' },
    });

    const cleaned = (response.text || '{}').replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    return OutreachSchema.parse(JSON.parse(cleaned));
  } catch (err) {
    console.warn('Outreach agent fallback:', err);
    return {
      linkedInConnectionNote: `Hi, I noticed ${targetJob.companyName}'s work in ${targetJob.roleTitle}. With my background in ${matchedSkills.slice(0, 2).join(' & ')}, I would love to connect!`,
      coldEmailSubject: `${targetJob.roleTitle} role — ${profile.fullName} application`,
      coldEmailBody: `Hi Hiring Team,\n\nI am writing to express my strong interest in the ${targetJob.roleTitle} opening at ${targetJob.companyName}.\n\nWith proven experience delivering production software using ${matchedSkills.slice(0, 3).join(', ')}, I believe my technical background aligns directly with your team's goals.\n\nI have attached my tailored resume and would welcome the opportunity to discuss further.\n\nBest regards,\n${profile.fullName}`,
      linkedInAboutSection: `${profile.summary || 'Software engineer passionate about scalable systems.'} Experienced in ${matchedSkills.slice(0, 4).join(', ')}. Currently targeting ${targetJob.roleTitle} opportunities at innovative teams like ${targetJob.companyName}.`,
    };
  }
}
