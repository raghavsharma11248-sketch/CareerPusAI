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
      
      {/* Top Banner: Hackathon Context & Autonomous Value Prop */}
      <div className="blueprint-card p-4 bg-white/80 border-stone-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-stone-900 text-white shrink-0">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-sm font-semibold text-stone-900">
                  CareerPulse AI — Autonomous Hiring Readiness System
                </h1>
                <span className="hidden sm:inline-flex px-1.5 py-0.5 rounded text-[10px] font-mono bg-sky-100 text-sky-800">
                  Track: Future of Work
                </span>
              </div>
              <p className="text-xs text-stone-500 mt-0.5">
                88% of qualified candidates are filtered out by enterprise ATS algorithms (Harvard Business School). CareerPulse uses Google XYZ formulas & Gemini to bridge the readiness gap.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 text-xs font-mono shrink-0">
            <Link
              href="/interview"
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-md bg-stone-900 hover:bg-stone-800 text-white transition-colors"
            >
              <span>Mock Interview</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

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
