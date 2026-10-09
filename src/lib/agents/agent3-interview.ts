// ============================================================
// CareerPulse AI — Agent 3: Voice Mock Interview Room
// Generates questions from gaps + evaluates answers (STAR rubric)
// Text fallback mode for noisy environments
// ============================================================

import { z } from 'zod';
import { getGeminiClient } from '../gemini';
import type { InterviewGap, STAREvaluation } from '../types';

const STARSchema = z.object({
  situation: z.number().min(1).max(5),
  task: z.number().min(1).max(5),
  action: z.number().min(1).max(5),
  result: z.number().min(1).max(5),
  overall: z.number().min(1).max(10),
  feedback: z.string(),
  modelAnswer: z.string(),
});

export async function generateInterviewQuestions(
  missingSkills: string[],
  roleTitle: string,
  companyName: string
): Promise<InterviewGap[]> {
  const prompt = `You are an expert interviewer at ${companyName} hiring for ${roleTitle}.

Generate interview questions targeting these skill gaps: ${missingSkills.join(', ')}

Return ONLY valid JSON:
{
  "questions": [
    {
      "id": "ig-001",
      "skillOrExperience": "TypeScript",
      "questionType": "technical",
      "question": "Walk me through a time you migrated a codebase from JavaScript to TypeScript..."
    }
  ]
}

Rules:
- Mix technical, behavioral, and situational questions
- Make questions specific to ${companyName}'s domain
- Maximum 5 questions total`;

  const response = await getGeminiClient().models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: { responseMimeType: 'application/json' },
  });

  try {
    const cleaned = (response.text || '{}').replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const data = JSON.parse(cleaned);
    return (data.questions || []).map((q: Omit<InterviewGap, 'status'>) => ({
      ...q,
      questionType: q.questionType || 'behavioral',
    }));
  } catch {
    return [{
      id: 'ig-fallback',
      skillOrExperience: missingSkills[0] || 'General',
      questionType: 'behavioral' as const,
      question: `Tell me about your experience with ${missingSkills[0] || 'this role'} and how you applied it in a recent project.`,
    }];
  }
}

export async function evaluateAnswer(
  question: string,
  userAnswer: string,
  skillContext: string
): Promise<STAREvaluation> {
  const prompt = `You are an expert interviewer evaluating a candidate's answer using the STAR rubric.

## QUESTION:
${question}

## SKILL CONTEXT: ${skillContext}

## CANDIDATE'S ANSWER:
${userAnswer}

Evaluate on STAR (each 1-5):
- Situation (1-5): Did they clearly set the context?
- Task (1-5): Did they define their specific responsibility?
- Action (1-5): Did they describe concrete steps they took?
- Result (1-5): Did they quantify/qualify the outcome?

Overall score = weighted composite (1-10)

Return ONLY valid JSON:
{
  "situation": 3,
  "task": 4,
  "action": 3,
  "result": 2,
  "overall": 6,
  "feedback": "Strong on task clarity, but result lacked specific metrics. Try to quantify impact.",
  "modelAnswer": "In my previous role at [Company], we faced [situation]. I was responsible for [task]. I [specific actions]. This resulted in [quantified outcome]."
}`;

  const response = await getGeminiClient().models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: { responseMimeType: 'application/json' },
  });

  try {
    const cleaned = (response.text || '{}').replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    return STARSchema.parse(JSON.parse(cleaned));
  } catch {
    return {
      situation: 3, task: 3, action: 3, result: 2,
      overall: 5,
      feedback: 'Could not fully evaluate. Try to include specific examples with measurable results.',
      modelAnswer: `A strong answer would describe a specific situation, your role, concrete actions you took, and quantified results.`,
    };
  }
}
