'use client';

import React, { useState, useRef } from 'react';
import { useCandidate } from '@/lib/context/CandidateContext';
import { 
  Sparkles, 
  Check, 
  X, 
  Edit3, 
  Download, 
  ArrowRight, 
  FileText, 
  RotateCw, 
  PlusCircle,
  Upload,
  FileCheck,
  FileDown,
  RotateCcw,
  BookOpen,
  Target,
  Shield,
  Layers,
  Award
} from 'lucide-react';
import Link from 'next/link';

export default function ResumeTailor() {
  const { 
    state, 
    updateBulletStatus, 
    addTerminalLog, 
    isProcessing, 
    setIsProcessing, 
    setState, 
    apiKey, 
    loadDemo, 
    resetToGuide 
  } = useCandidate();
  const { weakBullets, targetJob, candidateProfile } = state;

  const [editingId, setEditingId] = useState<string | null>(null);
  const [customText, setCustomText] = useState<string>('');
  const [showInputModal, setShowInputModal] = useState<boolean>(false);
  const [resumeInput, setResumeInput] = useState<string>('');
  const [roleInput, setRoleInput] = useState<string>('Senior Frontend Engineer');
  const [companyInput, setCompanyInput] = useState<string>('Stripe');
  const [jdInput, setJdInput] = useState<string>('');
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const isAnalyzed = weakBullets.length > 0;
  const pendingCount = weakBullets.filter((b) => b.status === 'pending').length;
  const acceptedCount = weakBullets.filter((b) => b.status === 'accepted' || b.status === 'customized').length;

  const handleStartEdit = (id: string, currentText: string) => {
    setEditingId(id);
    setCustomText(currentText);
  };

  const handleSaveEdit = (id: string) => {
    updateBulletStatus(id, 'customized', customText);
    setEditingId(null);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    addTerminalLog('System', `Parsing uploaded resume file: ${file.name}...`, 'info');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        setResumeInput(data.text);
        setUploadedFileName(data.fileName);
        addTerminalLog('System', `Successfully extracted ${data.characterCount} characters from ${data.fileName}`, 'success');
      } else {
        addTerminalLog('System', `Failed to parse file: ${data.error}`, 'error');
        alert(data.error);
      }
    } catch (err) {
      addTerminalLog('System', `File upload error: ${String(err)}`, 'error');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRunAudit = async () => {
    if (!resumeInput.trim() || !jdInput.trim()) {
      alert('Please provide both resume text and job description.');
      return;
    }

    setIsProcessing(true);
    addTerminalLog('Agent 1 (Auditor)', `Analyzing resume against ${roleInput} @ ${companyInput}...`, 'info');

    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (apiKey) headers['x-gemini-key'] = apiKey;

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          resumeText: resumeInput,
          targetJob: {
            ...targetJob,
            roleTitle: roleInput,
            companyName: companyInput,
            rawDescription: jdInput,
          },
        }),
      });

      const data = await res.json();
      if (data.success) {
        setState((prev) => ({
          ...prev,
          rawResumeText: resumeInput,
          uploadedFileName: uploadedFileName || prev.uploadedFileName,
          targetJob: {
            ...prev.targetJob,
            roleTitle: roleInput,
            companyName: companyInput,
            rawDescription: jdInput,
          },
          atsScore: data.score,
          weakBullets: data.weakBullets,
        }));
        addTerminalLog('Agent 1 (Auditor)', `Audit complete. Score: ${data.score.overall}/100. Identified ${data.weakBullets.length} weak achievement bullets.`, 'success');
        setShowInputModal(false);
      } else {
        addTerminalLog('Agent 1 (Auditor)', `Audit failed: ${data.error}`, 'error');
      }
    } catch (err) {
      addTerminalLog('Agent 1 (Auditor)', `Audit network error: ${String(err)}`, 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  // Download ATS-Formatted Clean Resume (.txt)
  const handleDownloadATSResume = () => {
    const formattedBullets = weakBullets
      .filter((b) => b.status === 'accepted' || b.status === 'customized')
      .map((b) => `• ${b.customText || b.suggestedXYZ || b.originalText}`)
      .join('\n');

    const content = `${candidateProfile.fullName.toUpperCase()}
${candidateProfile.email} | ${candidateProfile.location || 'San Francisco, CA'}
${candidateProfile.linkedin ? `LinkedIn: ${candidateProfile.linkedin}` : ''} | ${candidateProfile.github ? `GitHub: ${candidateProfile.github}` : ''}

TARGET OPENING: ${targetJob.roleTitle} — ${targetJob.companyName}

PROFESSIONAL SUMMARY
${candidateProfile.summary}

KEY TECHNICAL SKILLS (ATS MATCHED)
${state.atsScore.matchedSkills.join(', ')}

OPTIMIZED PROFESSIONAL EXPERIENCE (GOOGLE XYZ FORMULA)
${targetJob.companyName} Candidate Profile
${formattedBullets || weakBullets.map((b) => `• ${b.suggestedXYZ || b.originalText}`).join('\n')}

ATS PARSING HYGIENE GUARANTEE:
- Single-Column Strict Layout (Passes Workday / Greenhouse sequential parsers)
- Standardized Section Headers (Experience, Skills, Education)
- Quantified Achievement Bullets (Google XYZ Formula)
`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${candidateProfile.fullName.toLowerCase().replace(/\s+/g, '_')}_tailored_ats_resume.txt`;
    link.click();
    URL.revokeObjectURL(url);
    addTerminalLog('System', 'Downloaded clean single-column ATS resume (.txt)', 'success');
  };

  return (
    <div className="space-y-4">
      {/* Panel Header & Action Bar */}
      <div className="blueprint-card p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center space-x-2">
              <span className="mono-tag text-stone-500 uppercase tracking-wider">Agent 2 · Resume Tailor</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-sky-50 text-sky-700 border border-sky-200">
                Google XYZ Formula
              </span>
            </div>
            <h2 className="text-base font-semibold text-stone-900 mt-0.5">
              Side-by-Side Bullet Optimizer
            </h2>
            <p className="text-xs text-stone-500">
              Transform passive descriptions into quantified accomplishments: <code className="text-stone-700 font-mono bg-stone-100 px-1 py-0.5 rounded">[Accomplished X by Y resulting in Z]</code>
            </p>
          </div>

          <div className="flex items-center space-x-2">
            {isAnalyzed && (
              <button
                onClick={resetToGuide}
                className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-md text-xs font-mono bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-200 transition-colors"
                title="Return to Feature Guide"
              >
                <BookOpen className="w-3.5 h-3.5 text-stone-500" />
                <span className="hidden sm:inline">View Guide</span>
              </button>
            )}

            <button
              onClick={() => setShowInputModal(true)}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-stone-900 text-white hover:bg-stone-800 transition-colors shadow-xs"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>{isAnalyzed ? 'New Audit' : 'Upload Resume & Audit'}</span>
            </button>

            {isAnalyzed && (
              <button
                onClick={handleDownloadATSResume}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-mono font-medium bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-300 transition-colors shadow-xs"
                title="Download ATS-Formatted Plain Text Resume"
              >
                <FileDown className="w-3.5 h-3.5 text-stone-600" />
                <span>Download Resume</span>
              </button>
            )}
          </div>
        </div>

        {/* Status Counter (shown only when analyzed) */}
        {isAnalyzed && (
          <div className="flex items-center space-x-4 mt-3 pt-3 border-t border-stone-100 text-xs font-mono">
            <div className="flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span className="text-stone-600">Pending Diffs:</span>
              <span className="font-semibold text-stone-900">{pendingCount}</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-stone-600">Accepted:</span>
              <span className="font-semibold text-stone-900">{acceptedCount}</span>
            </div>
            <div className="flex items-center space-x-1.5 text-stone-400">
              <span>Total:</span>
              <span>{weakBullets.length}</span>
            </div>
          </div>
        )}
      </div>

      {/* VIEW 1: CLEAN GUIDED MODE (when no bullets are loaded) */}
      {!isAnalyzed ? (
        <div className="space-y-4">
          
          {/* Hero Explainer Card */}
          <div className="blueprint-card p-6 bg-white space-y-4">
            <div className="flex items-center space-x-2 text-xs font-mono text-sky-700">
              <Layers className="w-4 h-4 text-sky-600" />
              <span className="font-semibold uppercase tracking-wider">How Agent 2 Solves The ATS Filter Trap</span>
            </div>

            <h3 className="text-base font-semibold text-stone-900 leading-snug">
              88% of resumes are dropped because bullets describe passive duties rather than quantified impact.
            </h3>

            <p className="text-xs text-stone-600 leading-relaxed">
              Applicant Tracking Systems (Workday, Greenhouse, Taleo) and hiring managers look for evidence of scale, performance metrics, and ownership. Agent 2 scans your resume experience and automatically rewrites every bullet using the Google XYZ Formula:
            </p>

            <div className="p-3.5 rounded-lg bg-stone-900 text-stone-100 font-mono text-xs space-y-1">
              <div className="text-amber-400 font-semibold">Google XYZ Formula (Laszlo Bock):</div>
              <div className="text-stone-300">
                &ldquo;Accomplished <span className="text-emerald-400 font-bold">[X]</span>, as measured by <span className="text-sky-400 font-bold">[Y]</span>, by doing <span className="text-amber-300 font-bold">[Z]</span>&rdquo;
              </div>
            </div>
          </div>

          {/* Interactive Before & After Transformation Showcase */}
          <div className="blueprint-card p-5 bg-white space-y-3">
            <span className="mono-tag text-stone-500 uppercase tracking-wider block">
              Transformation Example: Passive vs Google XYZ
            </span>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              {/* Traditional Weak Bullet */}
              <div className="p-3.5 rounded bg-rose-50/70 border border-rose-200 space-y-2">
                <div className="flex items-center justify-between text-[11px] font-mono text-rose-700 font-semibold">
                  <span>TRADITIONAL RESUME (FILTERED OUT)</span>
                  <span className="text-rose-600 bg-rose-100 px-1.5 py-0.5 rounded">High Risk</span>
                </div>
                <p className="text-stone-800 font-sans leading-relaxed">
                  &ldquo;Worked on frontend features using React and helped team members improve application performance.&rdquo;
                </p>
                <div className="space-y-1 pt-1 text-[11px] font-mono text-rose-600 border-t border-rose-200/60">
                  <div>✗ Passive verbs: &ldquo;worked on&rdquo;, &ldquo;helped&rdquo;</div>
                  <div>✗ Zero measurable metrics (% or $)</div>
                  <div>✗ Unclear specific contribution</div>
                </div>
              </div>

              {/* Google XYZ Formula Rewritten Bullet */}
              <div className="p-3.5 rounded bg-emerald-50/70 border border-emerald-200 space-y-2">
                <div className="flex items-center justify-between text-[11px] font-mono text-emerald-800 font-semibold">
                  <span className="flex items-center space-x-1">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                    <span>AGENT 2 REWRITE (INTERVIEW READY)</span>
                  </span>
                  <span className="text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">+25% HRI</span>
                </div>
                <p className="text-stone-900 font-sans font-medium leading-relaxed">
                  &ldquo;Architected 12 modular React & TypeScript UI components, reducing checkout latency by 38% and saving $45k in monthly transaction drop-off.&rdquo;
                </p>
                <div className="space-y-1 pt-1 text-[11px] font-mono text-emerald-700 border-t border-emerald-200/60">
                  <div>✓ Strong action verb: &ldquo;Architected&rdquo;</div>
                  <div>✓ Quantified outcomes: &ldquo;38% latency&rdquo;, &ldquo;$45k saved&rdquo;</div>
                  <div>✓ Matched key JD tech: React, TypeScript</div>
                </div>
              </div>
            </div>
          </div>

          {/* 4 Core Pillars of Agent 2 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="blueprint-card p-4 bg-white space-y-1.5">
              <div className="flex items-center space-x-1.5 text-stone-900 font-semibold">
                <Target className="w-4 h-4 text-sky-600" />
                <span>1. Passive Verb Detection</span>
              </div>
              <p className="text-stone-600 text-[11px] leading-relaxed">
                Flags weak phrases (&ldquo;assisted with&rdquo;, &ldquo;responsible for&rdquo;) and replaces them with active engineering verbs.
              </p>
            </div>

            <div className="blueprint-card p-4 bg-white space-y-1.5">
              <div className="flex items-center space-x-1.5 text-stone-900 font-semibold">
                <Award className="w-4 h-4 text-emerald-600" />
                <span>2. Metric Quantification</span>
              </div>
              <p className="text-stone-600 text-[11px] leading-relaxed">
                Identifies missing impact numbers and inserts realistic metric brackets ([X]%, $[Y]k, [Z]ms) for you to refine.
              </p>
            </div>

            <div className="blueprint-card p-4 bg-white space-y-1.5">
              <div className="flex items-center space-x-1.5 text-stone-900 font-semibold">
                <Check className="w-4 h-4 text-purple-600" />
                <span>3. Human-in-the-Loop Diff</span>
              </div>
              <p className="text-stone-600 text-[11px] leading-relaxed">
                You maintain 100% control. Every suggested rewrite offers Accept, Customize, or Reject actions.
              </p>
            </div>

            <div className="blueprint-card p-4 bg-white space-y-1.5">
              <div className="flex items-center space-x-1.5 text-stone-900 font-semibold">
                <Shield className="w-4 h-4 text-amber-600" />
                <span>4. ATS Layout Hygiene</span>
              </div>
              <p className="text-stone-600 text-[11px] leading-relaxed">
                Export clean, single-column formatted plain text guaranteed to parse properly in Workday and Greenhouse.
              </p>
            </div>
          </div>

          {/* Action Callout */}
          <div className="blueprint-card p-5 bg-gradient-to-r from-stone-50 via-sky-50/40 to-emerald-50/40 border-stone-300">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h4 className="text-sm font-semibold text-stone-900">Ready to audit and tailor your resume?</h4>
                <p className="text-xs text-stone-600 mt-0.5">
                  Upload your resume (.pdf, .txt) or test with our pre-built Stripe engineer sample.
                </p>
              </div>

              <div className="flex items-center space-x-2 shrink-0">
                <button
                  onClick={loadDemo}
                  className="flex items-center space-x-1.5 px-3 py-2 rounded-md text-xs font-mono font-medium bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-300 transition-colors shadow-xs"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-stone-600" />
                  <span>1-Click Sample Demo</span>
                </button>

                <button
                  onClick={() => setShowInputModal(true)}
                  className="flex items-center space-x-1.5 px-4 py-2 rounded-md text-xs font-medium bg-stone-900 hover:bg-stone-800 text-white transition-colors shadow-xs"
                >
                  <Upload className="w-3.5 h-3.5 text-sky-300" />
                  <span>Upload Resume</span>
                </button>
              </div>
            </div>
          </div>

        </div>
      ) : (
        /* VIEW 2: ACTIVE DIFF VIEW (when weakBullets are populated) */
        <div className="space-y-3">
          {weakBullets.map((bullet, index) => {
            const isPending = bullet.status === 'pending';
            const isAccepted = bullet.status === 'accepted';
            const isCustomized = bullet.status === 'customized';
            const isRejected = bullet.status === 'rejected';

            return (
              <div
                key={bullet.id}
                className={`blueprint-card p-4 transition-all ${
                  isAccepted || isCustomized
                    ? 'border-emerald-200 bg-emerald-50/20'
                    : isRejected
                    ? 'opacity-60 border-stone-200 bg-stone-50'
                    : 'border-amber-200/80 bg-white'
                }`}
              >
                {/* Card Meta Header */}
                <div className="flex items-center justify-between text-xs mb-2.5">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-stone-400">#{index + 1}</span>
                    <span className="font-medium text-stone-800">{bullet.company || 'Experience'}</span>
                    <span className="mono-tag px-1.5 py-0.5 rounded bg-stone-100 text-stone-600">
                      {bullet.section}
                    </span>
                  </div>

                  {/* Status Badges */}
                  <div>
                    {isAccepted && (
                      <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[11px] font-mono bg-emerald-100 text-emerald-800">
                        <Check className="w-3 h-3" />
                        <span>ACCEPTED</span>
                      </span>
                    )}
                    {isCustomized && (
                      <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[11px] font-mono bg-emerald-100 text-emerald-800">
                        <Check className="w-3 h-3" />
                        <span>CUSTOMIZED</span>
                      </span>
                    )}
                    {isRejected && (
                      <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[11px] font-mono bg-stone-200 text-stone-600">
                        <X className="w-3 h-3" />
                        <span>REJECTED</span>
                      </span>
                    )}
                    {isPending && (
                      <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[11px] font-mono bg-amber-100 text-amber-800">
                        <span>PENDING HUMAN REVIEW</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Diff View */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  {/* Original Weak Bullet */}
                  <div className="p-3 rounded bg-rose-50/60 border border-rose-200/60 space-y-1">
                    <div className="flex items-center justify-between text-[11px] font-mono text-rose-700">
                      <span>BEFORE (ATS RISKY)</span>
                      <span className="text-rose-600">Missing Metrics</span>
                    </div>
                    <p className="text-stone-800 font-sans leading-relaxed">
                      {bullet.originalText}
                    </p>
                    {bullet.passiveVerbs.length > 0 && (
                      <div className="text-[10px] font-mono text-rose-600 pt-1">
                        Passive verbs flagged: {bullet.passiveVerbs.join(', ')}
                      </div>
                    )}
                  </div>

                  {/* Suggested Google XYZ Bullet */}
                  <div className="p-3 rounded bg-emerald-50/60 border border-emerald-200/60 space-y-1">
                    <div className="flex items-center justify-between text-[11px] font-mono text-emerald-700">
                      <span className="flex items-center space-x-1">
                        <Sparkles className="w-3 h-3" />
                        <span>AFTER (GOOGLE XYZ FORMULA)</span>
                      </span>
                      <span className="text-emerald-700 font-medium">+10% HRI</span>
                    </div>

                    {editingId === bullet.id ? (
                      <div className="space-y-2 pt-1">
                        <textarea
                          value={customText}
                          onChange={(e) => setCustomText(e.target.value)}
                          className="w-full text-xs p-2 rounded border border-emerald-300 bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 font-sans"
                          rows={3}
                        />
                        <div className="flex justify-end space-x-1.5">
                          <button
                            onClick={() => setEditingId(null)}
                            className="px-2 py-1 text-[11px] font-mono rounded bg-stone-200 text-stone-700 hover:bg-stone-300"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleSaveEdit(bullet.id)}
                            className="px-2 py-1 text-[11px] font-mono rounded bg-emerald-600 text-white hover:bg-emerald-700"
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-stone-900 font-sans font-medium leading-relaxed">
                        {bullet.customText || bullet.suggestedXYZ || 'Generating Google XYZ rewrite...'}
                      </p>
                    )}
                  </div>
                </div>

                {/* Human-In-The-Loop Action Bar */}
                {editingId !== bullet.id && (
                  <div className="flex items-center justify-end space-x-2 mt-3 pt-2.5 border-t border-stone-100 text-xs">
                    <button
                      onClick={() => handleStartEdit(bullet.id, bullet.customText || bullet.suggestedXYZ || '')}
                      className="flex items-center space-x-1 px-2.5 py-1 rounded text-stone-600 hover:text-stone-900 hover:bg-stone-100 font-mono transition-colors"
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>Customize</span>
                    </button>

                    <button
                      onClick={() => updateBulletStatus(bullet.id, 'rejected')}
                      className="flex items-center space-x-1 px-2.5 py-1 rounded text-rose-600 hover:text-rose-800 hover:bg-rose-50 font-mono transition-colors"
                    >
                      <X className="w-3 h-3" />
                      <span>Reject</span>
                    </button>

                    <button
                      onClick={() => updateBulletStatus(bullet.id, 'accepted')}
                      className={`flex items-center space-x-1 px-3 py-1 rounded font-mono font-medium transition-all ${
                        isAccepted
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-600 hover:text-white border border-emerald-300'
                      }`}
                    >
                      <Check className="w-3 h-3" />
                      <span>{isAccepted ? 'Applied' : 'Accept (Apply)'}</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Next Step Callout */}
      <div className="blueprint-card p-4 bg-gradient-to-r from-stone-50 to-sky-50/50 border-sky-200">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-xs font-semibold text-stone-900">Next Recommended Action</h4>
            <p className="text-xs text-stone-600 mt-0.5">
              Practice interview responses for missing skills in the Mock Room.
            </p>
          </div>
          <Link
            href="/interview"
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-sky-700 text-white hover:bg-sky-800 transition-colors shadow-xs"
          >
            <span>Launch Mock Room</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Input Modal for Custom Audit with PDF Drag & Drop */}
      {showInputModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-lg shadow-xl border border-stone-200 max-w-2xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-sky-600" />
                <h3 className="text-base font-semibold text-stone-900">Run Autonomous ATS Audit</h3>
              </div>
              <button
                onClick={() => setShowInputModal(false)}
                className="text-stone-400 hover:text-stone-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Target Role & Company */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-mono text-stone-600 mb-1">Target Role</label>
                <input
                  type="text"
                  value={roleInput}
                  onChange={(e) => setRoleInput(e.target.value)}
                  className="w-full text-xs p-2 rounded border border-stone-300 focus:outline-none focus:ring-1 focus:ring-stone-900"
                  placeholder="e.g. Senior Frontend Engineer"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-stone-600 mb-1">Company</label>
                <input
                  type="text"
                  value={companyInput}
                  onChange={(e) => setCompanyInput(e.target.value)}
                  className="w-full text-xs p-2 rounded border border-stone-300 focus:outline-none focus:ring-1 focus:ring-stone-900"
                  placeholder="e.g. Stripe"
                />
              </div>
            </div>

            {/* Drag & Drop File Upload Area */}
            <div>
              <label className="block text-xs font-mono text-stone-600 mb-1">
                Upload Resume File (PDF / TXT / MD)
              </label>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept=".pdf,.txt,.md"
                className="hidden"
              />
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-stone-300 hover:border-stone-500 rounded-lg p-4 text-center cursor-pointer transition-colors bg-stone-50 hover:bg-stone-100"
              >
                {isUploading ? (
                  <div className="flex items-center justify-center space-x-2 text-xs font-mono text-stone-600">
                    <RotateCw className="w-4 h-4 animate-spin text-stone-900" />
                    <span>Extracting resume text...</span>
                  </div>
                ) : uploadedFileName ? (
                  <div className="flex items-center justify-center space-x-2 text-xs font-mono text-emerald-700">
                    <FileCheck className="w-4 h-4 text-emerald-600" />
                    <span>Uploaded: {uploadedFileName} (Click to change)</span>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <Upload className="w-5 h-5 mx-auto text-stone-400" />
                    <p className="text-xs font-mono text-stone-700">
                      Click to upload resume (.pdf, .txt, .md)
                    </p>
                    <p className="text-[11px] text-stone-400">
                      Automatically extracted and sanitized against prompt injections
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Raw Resume Textarea */}
            <div>
              <label className="block text-xs font-mono text-stone-600 mb-1">Or Paste Resume Text Below</label>
              <textarea
                value={resumeInput}
                onChange={(e) => setResumeInput(e.target.value)}
                rows={5}
                className="w-full text-xs p-2.5 rounded border border-stone-300 focus:outline-none focus:ring-1 focus:ring-stone-900 font-sans"
                placeholder="Paste experience bullets, summary, skills..."
              />
            </div>

            {/* Job Description Textarea */}
            <div>
              <label className="block text-xs font-mono text-stone-600 mb-1">Target Job Description</label>
              <textarea
                value={jdInput}
                onChange={(e) => setJdInput(e.target.value)}
                rows={4}
                className="w-full text-xs p-2.5 rounded border border-stone-300 focus:outline-none focus:ring-1 focus:ring-stone-900 font-sans"
                placeholder="Paste job requirements and qualifications..."
              />
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end space-x-2 pt-2 border-t border-stone-100">
              <button
                onClick={() => setShowInputModal(false)}
                className="px-3 py-1.5 text-xs font-mono rounded bg-stone-100 text-stone-700 hover:bg-stone-200"
              >
                Cancel
              </button>
              <button
                onClick={handleRunAudit}
                disabled={isProcessing}
                className="flex items-center space-x-1.5 px-4 py-1.5 text-xs font-medium rounded bg-stone-900 text-white hover:bg-stone-800 disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <RotateCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Auditing with Gemini...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Run Gemini Audit</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
