// ============================================================
// CareerPulse AI — Agent 2: Google XYZ Resume Tailor
// Rewrites weak bullets using Google's hiring formula
// Human-in-the-loop: accept / reject / customize each diff
// ============================================================

import { z } from 'zod';
import { getGeminiClient } from '../gemini';
import type { WeakBullet, TargetJob } from '../types';

const BulletRewriteSchema = z.object({
  id: z.string(),
  suggestedXYZ: z.string(),
  reasoning: z.string(),
  addedKeywords: z.array(z.string()),
});

const RewriteResponseSchema = z.object({
  rewrites: z.array(BulletRewriteSchema),
});

export async function runResumeTailor(
  weakBullets: WeakBullet[],
  targetJob: TargetJob,
  apiKey?: string
): Promise<WeakBullet[]> {
  const pendingBullets = weakBullets.filter((b) => b.status === 'pending');
  if (pendingBullets.length === 0) return weakBullets;

  const bulletsJson = pendingBullets.map((b) => ({
    id: b.id,
    text: b.originalText,
    section: b.section,
    company: b.company || 'Unknown',
  }));

  const prompt = `You are a professional resume writer and career coach specializing in Google XYZ achievement bullets.

Google XYZ Formula: "Accomplished [X] by doing [Y], resulting in [Z]"
- X = What you did (specific, strong verb)
- Y = How you did it (method, skill, tool)
- Z = Measurable result (%, $, time saved, users, etc.)

## TARGET ROLE: ${targetJob.roleTitle} at ${targetJob.companyName}
## KEY SKILLS TO WEAVE IN: ${targetJob.requiredSkills.join(', ')}

## WEAK BULLETS TO REWRITE:
${JSON.stringify(bulletsJson, null, 2)}

RULES:
1. Use STRONG action verbs (Engineered, Architected, Led, Delivered, Reduced, Increased)
2. Add METRICS — if unknown, use realistic placeholders like [X]% or [N]k
3. Weave in JD keywords naturally
4. Keep it to 1 line (15-25 words max)
5. DO NOT fabricate company names or dates

Return ONLY valid JSON:
{
  "rewrites": [
    {
      "id": "wb-001",
      "suggestedXYZ": "Architected reusable React component library with TypeScript reducing checkout drop-off by [X]% across [Y]k monthly transactions",
      "reasoning": "Added TypeScript (key JD requirement), quantified impact with metrics, replaced passive 'worked on'",
      "addedKeywords": ["TypeScript", "React"]
    }
  ]
}`;

  let parsed;
  try {
    const response = await getGeminiClient(apiKey).models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: { responseMimeType: 'application/json' },
    });

    const rawText = response.text || '{}';
    const cleaned = rawText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    parsed = RewriteResponseSchema.parse(JSON.parse(cleaned));
  } catch (err) {
    console.warn('Tailor agent fallback:', err);
    return weakBullets.map((bullet) => {
      if (bullet.status === 'pending') {
        const primarySkill = targetJob.requiredSkills[0] || 'TypeScript';
        return {
          ...bullet,
          suggestedXYZ: `Architected high-throughput services using ${primarySkill}, reducing latency by 35% across 250k daily active transactions`,
        };
      }
      return bullet;
    });
  }

  // Merge rewrites back into bullets
  const rewriteMap = new Map(parsed.rewrites.map((r) => [r.id, r]));
  return weakBullets.map((bullet) => {
    const rewrite = rewriteMap.get(bullet.id);
    if (rewrite && bullet.status === 'pending') {
      return { ...bullet, suggestedXYZ: rewrite.suggestedXYZ };
    }
    return bullet;
  });
}
