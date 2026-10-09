import { NextRequest, NextResponse } from 'next/server';
import { generateInterviewQuestions, evaluateAnswer } from '@/lib/agents/agent3-interview';

export async function POST(req: NextRequest) {
  try {
    const customApiKey = req.headers.get('x-gemini-key') || undefined;
    const body = await req.json();
    const { action } = body;

    if (action === 'generate') {
      const { missingSkills, roleTitle, companyName } = body;
      const questions = await generateInterviewQuestions(
        missingSkills || ['Technical Skills', 'Team Collaboration'],
        roleTitle || 'Software Engineer',
        companyName || 'Target Company',
        customApiKey
      );
      return NextResponse.json({ success: true, questions });
    }

    if (action === 'evaluate') {
      const { question, userAnswer, skillContext } = body;
      if (!question || !userAnswer) {
        return NextResponse.json(
          { error: 'question and userAnswer are required for evaluation' },
          { status: 400 }
        );
      }
      const evaluation = await evaluateAnswer(question, userAnswer, skillContext || 'General', customApiKey);
      return NextResponse.json({ success: true, evaluation });
    }

    return NextResponse.json({ error: 'Invalid action specified' }, { status: 400 });
  } catch (error) {
    console.error('Interview API error:', error);
    return NextResponse.json(
      { error: 'Failed in interview processing', details: String(error) },
      { status: 500 }
    );
  }
}
