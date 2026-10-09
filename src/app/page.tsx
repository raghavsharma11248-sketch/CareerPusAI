'use client';

import React from 'react';
import ScoreGauge from '@/components/ScoreGauge';
import ResumeTailor from '@/components/ResumeTailor';
import AgentTerminal from '@/components/AgentTerminal';
import { Sparkles, ArrowRight, ShieldCheck, Cpu } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      


      {/* 3-Panel Main Layout (Optimus Light Architecture) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: ATS Score Gauge & Skill Breakdown (3.5 cols on large screens) */}
        <div className="lg:col-span-4 xl:col-span-3">
          <ScoreGauge />
        </div>

        {/* Center Column: Side-by-Side Resume Tailor (5 cols on large screens) */}
        <div className="lg:col-span-8 xl:col-span-6">
          <ResumeTailor />
        </div>

        {/* Right Column: Autonomous Agent Terminal & Fleets (3 cols on large screens) */}
        <div className="lg:col-span-12 xl:col-span-3">
          <AgentTerminal />
        </div>

      </div>

    </div>
  );
}
