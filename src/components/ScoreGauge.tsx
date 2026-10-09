'use client';

import React, { useState } from 'react';
import { useCandidate } from '@/lib/context/CandidateContext';
import { CheckCircle2, AlertTriangle, Info, ChevronDown, ChevronUp, ShieldCheck, Sparkles, FileSearch } from 'lucide-react';

export default function ScoreGauge() {
  const { state } = useCandidate();
  const { atsScore, targetJob, candidateProfile, weakBullets } = state;
  const isAnalyzed = weakBullets.length > 0;
  const [showFormula, setShowFormula] = useState(!isAnalyzed); // expanded by default in guide mode

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

        <p className="text-xs text-stone-600 mt-1">
          {isAnalyzed
            ? 'Hiring Readiness Index based on Harvard Business School ATS research.'
            : 'Audits resumes against 5 explainable dimensions instead of black-box guessing.'}
        </p>

        {/* Toggle Formula Breakdown */}
        <button
          onClick={() => setShowFormula(!showFormula)}
          className="mt-3 inline-flex items-center space-x-1 text-xs font-mono text-sky-700 hover:text-sky-900 font-medium"
        >
          <Info className="w-3.5 h-3.5" />
          <span>{showFormula ? 'Hide Weighted Formula' : 'View Explainable Breakdown'}</span>
          {showFormula ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>

        {/* Explainable Formula Dimensions */}
        {showFormula && (
          <div className="mt-4 pt-3 border-t border-stone-100 text-left space-y-2.5">
            <div className="flex justify-between text-xs">
              <span className="text-stone-600">Keyword Alignment (40%)</span>
              <span className="font-mono font-semibold text-stone-900">
                {isAnalyzed ? `${atsScore.keywordAlignment}%` : 'Required skills in JD'}
              </span>
            </div>
            <div className="w-full bg-stone-100 h-1.5 rounded-full overflow-hidden">
              <div className="bg-sky-600 h-full rounded-full" style={{ width: `${isAnalyzed ? atsScore.keywordAlignment : 40}%` }} />
            </div>

            <div className="flex justify-between text-xs">
              <span className="text-stone-600">Semantic Cosine Distance (25%)</span>
              <span className="font-mono font-semibold text-stone-900">
                {isAnalyzed ? `${atsScore.semanticRelevance}%` : 'Vector similarity'}
              </span>
            </div>
            <div className="w-full bg-stone-100 h-1.5 rounded-full overflow-hidden">
              <div className="bg-purple-600 h-full rounded-full" style={{ width: `${isAnalyzed ? atsScore.semanticRelevance : 25}%` }} />
            </div>

            <div className="flex justify-between text-xs">
              <span className="text-stone-600">Experience Level Match (15%)</span>
              <span className="font-mono font-semibold text-stone-900">
                {isAnalyzed ? `${atsScore.experienceRelevance}%` : 'Years & seniority'}
              </span>
            </div>
            <div className="w-full bg-stone-100 h-1.5 rounded-full overflow-hidden">
              <div className="bg-amber-500 h-full rounded-full" style={{ width: `${isAnalyzed ? atsScore.experienceRelevance : 15}%` }} />
            </div>

            <div className="flex justify-between text-xs">
              <span className="text-stone-600">Google XYZ Evidence (10%)</span>
              <span className="font-mono font-semibold text-stone-900">
                {isAnalyzed ? `${atsScore.achievementEvidence}%` : 'Quantified metrics'}
              </span>
            </div>
            <div className="w-full bg-stone-100 h-1.5 rounded-full overflow-hidden">
              <div className="bg-emerald-600 h-full rounded-full" style={{ width: `${isAnalyzed ? atsScore.achievementEvidence : 10}%` }} />
            </div>

            <div className="flex justify-between text-xs">
              <span className="text-stone-600">ATS Hygiene Completeness (10%)</span>
              <span className="font-mono font-semibold text-stone-900">
                {isAnalyzed ? `${atsScore.hygieneCompleteness}%` : 'Single-column layout'}
              </span>
            </div>
            <div className="w-full bg-stone-100 h-1.5 rounded-full overflow-hidden">
              <div className="bg-stone-700 h-full rounded-full" style={{ width: `${isAnalyzed ? atsScore.hygieneCompleteness : 10}%` }} />
            </div>
          </div>
        )}
      </div>

      {/* Skill Gap Analysis Card */}
      <div className="blueprint-card p-4 space-y-3">
        <span className="mono-tag text-stone-500 uppercase tracking-wider block">Skill Gap Analysis</span>
        
        {isAnalyzed ? (
          <>
            {/* Matched Skills */}
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

            {/* Missing Skills */}
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
          </>
        ) : (
          <div className="text-xs text-stone-600 space-y-1.5 bg-stone-50 p-3 rounded border border-stone-200">
            <p className="font-medium text-stone-800 flex items-center">
              <FileSearch className="w-3.5 h-3.5 text-sky-600 mr-1.5" />
              How Gap Detection Works:
            </p>
            <p className="text-[11px] text-stone-600 leading-relaxed">
              Agent 1 extracts required and nice-to-have skills from the target job opening, compares them with your resume, and marks matches in green and gaps in red.
            </p>
          </div>
        )}
      </div>

      {/* Hygiene & Security Guardrail Card */}
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

    </div>
  );
}
