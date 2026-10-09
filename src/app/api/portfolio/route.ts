import { NextRequest, NextResponse } from 'next/server';
import { generatePortfolio } from '@/lib/agents/agent5-portfolio';
import type { CandidateProfile, TargetJob } from '@/lib/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { candidateProfile, targetJob, rawResumeText } = body as {
      candidateProfile: CandidateProfile;
      targetJob: TargetJob;
      rawResumeText: string;
    };

    if (!candidateProfile || !targetJob) {
      return NextResponse.json(
        { error: 'candidateProfile and targetJob are required' },
        { status: 400 }
      );
    }

    const portfolio = await generatePortfolio(
      candidateProfile,
      targetJob,
      rawResumeText || ''
    );

    return NextResponse.json({ success: true, portfolio });
  } catch (error) {
    console.error('Portfolio API error:', error);
    return NextResponse.json(
      { error: 'Failed to generate portfolio data', details: String(error) },
      { status: 500 }
    );
  }
}
