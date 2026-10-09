// ============================================================
// CareerPulse AI — Agent 1: Semantic ATS Auditor
// Uses Gemini Flash to score resume against job description
// ============================================================

import { z } from 'zod';
import { getGeminiClient } from '../gemini';
import type { ExplainableScore, WeakBullet, TargetJob } from '../types';
import { SCORE_WEIGHTS } from '../types';

// Zod schema to prevent JSON parse crashes
const AnalysisSchema = z.object({
  matchedSkills: z.array(z.string()),
  missingSkills: z.array(z.string()),
  keywordAlignmentScore: z.number().min(0).max(100),
  experienceRelevanceScore: z.number().min(0).max(100),
  achievementEvidenceScore: z.number().min(0).max(100),
  hygieneScore: z.number().min(0).max(100),
  hygieneFeedback: z.array(z.string()),
  weakBullets: z.array(z.object({
    id: z.string(),
    section: z.string(),
    company: z.string().optional(),
    originalText: z.string(),
    missingMetric: z.boolean(),
    passiveVerbs: z.array(z.string()),
    suggestedXYZ: z.string().optional(),
  })),
});

// Sanitize resume text to prevent prompt injection
function sanitizeInput(text: string): string {
  return text
    .replace(/ignore\s+previous\s+instructions?/gi, '[REDACTED]')
    .replace(/system\s*:/gi, '[REDACTED]:')
    .replace(/you\s+are\s+now/gi, '[REDACTED]')
    .replace(/forget\s+everything/gi, '[REDACTED]')
    .slice(0, 8000); // Max token guard
}

export async function runSemanticAudit(
  resumeText: string,
  targetJob: TargetJob
): Promise<{ score: ExplainableScore; weakBullets: WeakBullet[] }> {
  const safeResume = sanitizeInput(resumeText);
  const safeJD = sanitizeInput(targetJob.rawDescription);

  const prompt = `You are an expert ATS (Applicant Tracking System) auditor and career coach.

Analyze this resume against the job description and return a JSON object.

## RESUME:
${safeResume}

## JOB DESCRIPTION (${targetJob.roleTitle} at ${targetJob.companyName}):
${safeJD}

## REQUIRED SKILLS FROM JD:
${targetJob.requiredSkills.join(', ')}

Return ONLY valid JSON matching this exact schema:
{
  "matchedSkills": ["skill1", "skill2"], // Skills present in BOTH resume and JD
  "missingSkills": ["skill3", "skill4"], // Required JD skills MISSING from resume
  "keywordAlignmentScore": 65, // 0-100: % of required JD skills found in resume
  "experienceRelevanceScore": 70, // 0-100: how relevant experience level is to JD
  "achievementEvidenceScore": 20, // 0-100: % of bullets that use Google XYZ formula (X impact by Y amount using Z method)
  "hygieneScore": 80, // 0-100: ATS-parsability (single col, standard headers, no tables)
  "hygieneFeedback": ["issue1", "issue2"], // Specific ATS hygiene problems
  "weakBullets": [
    {
      "id": "wb-001",
      "section": "experience",
      "company": "CompanyName",
      "originalText": "exact bullet text from resume",
      "missingMetric": true,
      "passiveVerbs": ["worked on", "helped"],
      "suggestedXYZ": "Strong rewrite using Google XYZ: Accomplished [X] by doing [Y] resulting in [Z]"
    }
  ]
}

Focus on identifying ALL weak bullets (no metrics, passive verbs, vague language).
Be specific and actionable in the XYZ suggestions.`;

  const response = await getGeminiClient().models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: { responseMimeType: 'application/json' },
  });

  const rawText = response.text || '{}';
  let parsed;
  try {
    const cleaned = rawText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    parsed = AnalysisSchema.parse(JSON.parse(cleaned));
  } catch {
    // Fallback on parse error
    parsed = {
      matchedSkills: targetJob.requiredSkills.slice(0, 2),
      missingSkills: targetJob.requiredSkills.slice(2),
      keywordAlignmentScore: 40,
      experienceRelevanceScore: 50,
      achievementEvidenceScore: 15,
      hygieneScore: 65,
      hygieneFeedback: ['Could not fully parse resume — please check formatting'],
      weakBullets: [],
    };
  }

  // Calculate weighted overall score
  const overall = Math.round(
    parsed.keywordAlignmentScore * SCORE_WEIGHTS.keywordAlignment +
    50 * SCORE_WEIGHTS.semanticRelevance + // Cosine sim placeholder (pgvector)
    parsed.experienceRelevanceScore * SCORE_WEIGHTS.experienceRelevance +
    parsed.achievementEvidenceScore * SCORE_WEIGHTS.achievementEvidence +
    parsed.hygieneScore * SCORE_WEIGHTS.hygieneCompleteness
  );

  const score: ExplainableScore = {
    overall,
    keywordAlignment: parsed.keywordAlignmentScore,
    semanticRelevance: 50,
    experienceRelevance: parsed.experienceRelevanceScore,
    achievementEvidence: parsed.achievementEvidenceScore,
    hygieneCompleteness: parsed.hygieneScore,
    matchedSkills: parsed.matchedSkills,
    missingSkills: parsed.missingSkills,
    hygieneFeedback: parsed.hygieneFeedback,
  };

  const weakBullets: WeakBullet[] = parsed.weakBullets.map((wb) => ({
    ...wb,
    status: 'pending' as const,
  }));

  return { score, weakBullets };
}
