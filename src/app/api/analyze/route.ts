import { NextRequest, NextResponse } from 'next/server';
import { runSemanticAudit } from '@/lib/agents/agent1-auditor';
import type { TargetJob } from '@/lib/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { resumeText, targetJob } = body as { resumeText: string; targetJob: TargetJob };

    if (!resumeText || !targetJob) {
      return NextResponse.json(
        { error: 'Both resumeText and targetJob are required.' },
        { status: 400 }
      );
    }

    const { score, weakBullets } = await runSemanticAudit(resumeText, targetJob);

    return NextResponse.json({
      success: true,
      score,
      weakBullets,
    });
  } catch (error) {
    console.error('Analyze API error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze resume', details: String(error) },
      { status: 500 }
    );
  }
}
