'use client';

import React from 'react';
import { useCandidate } from '@/lib/context/CandidateContext';
import { CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';

export default function ScoreGauge() {
  const { state } = useCandidate();
  const { atsScore, targetJob, candidateProfile, weakBullets } = state;
  const isAnalyzed = weakBullets.length > 0;

  // Score color logic
  const score = atsScore.overall;
  let strokeColor = '#f59e0b'; // amber
  let badgeColor = 'text-amber-700 bg-amber-50 border-amber-200';
  let ratingText = 'Needs Optimization';

  if (!isAnalyzed) {
    strokeColor = '#d6d3d1';
    badgeColor = 'text-stone-700 bg-stone-100 border-stone-200';
    ratingText = 'Awaiting Resume';
  } else if (score >= 75) {
    strokeColor = '#10b981'; // emerald
    badgeColor = 'text-emerald-700 bg-emerald-50 border-emerald-200';
    ratingText = 'Interview Ready';
  } else if (score < 45) {
    strokeColor = '#ef4444'; // rose/red
    badgeColor = 'text-rose-700 bg-rose-50 border-rose-200';
    ratingText = 'High ATS Filter Risk';
  }

  // SVG Gauge math
  const radius = 68;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = isAnalyzed ? circumference - (score / 100) * circumference : circumference * 0.95;

  return (
    <div className="space-y-4">
      {/* Target Job Header Card */}
      <div className="blueprint-card p-4">
        <div className="flex items-start justify-between">
          <div>
            <span className="mono-tag text-stone-500 uppercase tracking-wider block">Target Opening</span>
            <h3 className="font-semibold text-stone-900 text-sm mt-0.5">
              {isAnalyzed ? targetJob.roleTitle : 'Agent 1 · ATS Auditor'}
            </h3>
            <p className="text-xs text-stone-600 font-mono mt-0.5">
              {isAnalyzed ? `@${targetJob.companyName} · ${targetJob.experienceLevel.toUpperCase()}` : 'Awaiting Resume & Job Description'}
            </p>
          </div>
          <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-stone-100 text-stone-700 border border-stone-200">
            {isAnalyzed ? candidateProfile.fullName : 'Ready to Audit'}
          </span>
        </div>
      </div>

      {/* Circular ATS Gauge Card */}
      <div className="blueprint-card p-5 text-center">
        <div className="flex items-center justify-between mb-2">
          <span className="mono-tag text-stone-500 uppercase tracking-wider">Explainable ATS Score</span>
          <span className={`px-2 py-0.5 rounded-full text-[11px] font-medium border ${badgeColor}`}>
            {ratingText}
          </span>
        </div>

        {/* Circular SVG Gauge */}
        <div className="relative inline-flex items-center justify-center my-3">
          <svg className="w-40 h-40 transform -rotate-90">
            <circle
              cx="80"
              cy="80"
              r={radius}
              stroke="#f5f5f4"
              strokeWidth="12"
              fill="transparent"
            />
            <circle
              cx="80"
              cy="80"
              r={radius}
              stroke={strokeColor}
              strokeWidth="12"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-700 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-extrabold text-stone-900 font-mono tracking-tight">
              {isAnalyzed ? score : '--'}
            </span>
            <span className="text-[11px] font-mono text-stone-500 uppercase tracking-widest mt-0.5">/ 100 HRI</span>
          </div>
        </div>

      </div>


      {/* Skill Gap & Hygiene Cards (Shown only after audit) */}
      {isAnalyzed && (
        <>
          <div className="blueprint-card p-4 space-y-3">
            <span className="mono-tag text-stone-500 uppercase tracking-wider block">Skill Gap Analysis</span>
            
            <div>
              <span className="text-xs font-semibold text-stone-700 flex items-center mb-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mr-1" />
                Matched Skills ({atsScore.matchedSkills.length})
              </span>
              <div className="flex flex-wrap gap-1">
                {atsScore.matchedSkills.map((s) => (
                  <span key={s} className="px-2 py-0.5 rounded text-[11px] font-mono bg-emerald-50 text-emerald-800 border border-emerald-200">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <span className="text-xs font-semibold text-stone-700 flex items-center mb-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600 mr-1" />
                Missing From Resume ({atsScore.missingSkills.length})
              </span>
              <div className="flex flex-wrap gap-1">
                {atsScore.missingSkills.map((s) => (
                  <span key={s} className="px-2 py-0.5 rounded text-[11px] font-mono bg-rose-50 text-rose-800 border border-rose-200">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="blueprint-card p-4">
            <div className="flex items-center space-x-1.5 mb-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span className="mono-tag text-stone-700 font-semibold uppercase">ATS Hygiene Guardrails</span>
            </div>
            <ul className="space-y-1.5 text-xs text-stone-600">
              {atsScore.hygieneFeedback.map((fb, idx) => (
                <li key={idx} className="flex items-start space-x-1.5">
                  <span className="text-stone-400 font-mono">•</span>
                  <span>{fb}</span>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
}
