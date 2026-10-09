import { NextRequest, NextResponse } from 'next/server';
import { runResumeTailor } from '@/lib/agents/agent2-tailor';
import type { WeakBullet, TargetJob } from '@/lib/types';

export async function POST(req: NextRequest) {
  try {
    const customApiKey = req.headers.get('x-gemini-key') || undefined;
    const body = await req.json();
    const { weakBullets, targetJob } = body as { weakBullets: WeakBullet[]; targetJob: TargetJob };

    if (!weakBullets || !targetJob) {
      return NextResponse.json(
        { error: 'weakBullets and targetJob are required.' },
        { status: 400 }
      );
    }

    const updatedBullets = await runResumeTailor(weakBullets, targetJob, customApiKey);

    return NextResponse.json({
      success: true,
      weakBullets: updatedBullets,
    });
  } catch (error) {
    console.error('Tailor API error:', error);
    return NextResponse.json(
      { error: 'Failed to tailor resume bullets', details: String(error) },
      { status: 500 }
    );
  }
}
