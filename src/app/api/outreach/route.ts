import { NextRequest, NextResponse } from 'next/server';
import { generateOutreach } from '@/lib/agents/agent4-outreach';
import type { CandidateProfile, TargetJob } from '@/lib/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { candidateProfile, targetJob, matchedSkills } = body as {
      candidateProfile: CandidateProfile;
      targetJob: TargetJob;
      matchedSkills: string[];
    };

    if (!candidateProfile || !targetJob) {
      return NextResponse.json(
        { error: 'candidateProfile and targetJob are required' },
        { status: 400 }
      );
    }

    const drafts = await generateOutreach(
      candidateProfile,
      targetJob,
      matchedSkills || []
    );

    return NextResponse.json({ success: true, drafts });
  } catch (error) {
    console.error('Outreach API error:', error);
    return NextResponse.json(
      { error: 'Failed to generate outreach drafts', details: String(error) },
      { status: 500 }
    );
  }
}
