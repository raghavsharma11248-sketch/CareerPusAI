'use client';

import React, { useState } from 'react';
import { useCandidate } from '@/lib/context/CandidateContext';
import { 
  Send, 
  Copy, 
  Check, 
  RotateCw, 
  Sparkles, 
  Mail, 
  UserCheck 
} from 'lucide-react';

export default function OutreachPage() {
  const { state, setState, addTerminalLog, isProcessing, setIsProcessing, apiKey } = useCandidate();
  const { outreachDrafts, targetJob, candidateProfile, atsScore } = state;

  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
    addTerminalLog('Agent 4 (Outreach)', `Copied ${key} to clipboard.`, 'info');
  };

  const handleRegenerate = async () => {
    setIsProcessing(true);
    addTerminalLog('Agent 4 (Outreach)', `Generating personalized outreach for ${targetJob.companyName}...`, 'info');

    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (apiKey) headers['x-gemini-key'] = apiKey;

    try {
      const res = await fetch('/api/outreach', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          candidateProfile,
          targetJob,
          matchedSkills: atsScore.matchedSkills,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setState((prev) => ({
          ...prev,
          outreachDrafts: data.drafts,
        }));
        addTerminalLog('Agent 4 (Outreach)', `Custom recruiter outreach drafts generated.`, 'success');
      }
    } catch (err) {
      addTerminalLog('Agent 4 (Outreach)', `Generation failed: ${String(err)}`, 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const noteChars = outreachDrafts.linkedInConnectionNote.length;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header */}
      <div className="blueprint-card p-5 bg-white">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="mono-tag text-stone-500 uppercase tracking-wider">Agent 4 · Outreach Strategist</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-sky-50 text-sky-800 border border-sky-200">
                Cold Outreach Suite
              </span>
            </div>
            <h1 className="text-lg font-semibold text-stone-900 mt-1">
              Recruiter DM & Cold Email Generator
            </h1>
            <p className="text-xs text-stone-500">
              Tailored for <span className="font-semibold text-stone-800">{targetJob.roleTitle} @ {targetJob.companyName}</span> hiring managers.
            </p>
          </div>

          <button
            onClick={handleRegenerate}
            disabled={isProcessing}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-md text-xs font-medium bg-stone-900 hover:bg-stone-800 text-white transition-colors disabled:opacity-50 shadow-xs"
          >
            {isProcessing ? (
              <>
                <RotateCw className="w-3.5 h-3.5 animate-spin" />
                <span>Generating...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>Regenerate Drafts</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        
        {/* LinkedIn Connection Note */}
        <div className="blueprint-card p-5 bg-white space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-stone-100">
            <div className="flex items-center space-x-2">
              <div className="p-1.5 rounded bg-sky-50 text-sky-700">
                <Send className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-stone-900">LinkedIn Connection Note</h3>
                <p className="text-[11px] text-stone-500">Maximum 300 characters allowed by LinkedIn</p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <span className={`text-xs font-mono px-2 py-0.5 rounded ${
                noteChars <= 300 ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
              }`}>
                {noteChars} / 300 chars
              </span>

              <button
                onClick={() => copyToClipboard(outreachDrafts.linkedInConnectionNote, 'linkedinNote')}
                className="flex items-center space-x-1 px-2.5 py-1 rounded text-xs font-mono bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-200 transition-colors"
              >
                {copiedKey === 'linkedinNote' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'linkedinNote' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>

          <div className="p-3.5 rounded-lg bg-stone-50 border border-stone-200 font-sans text-xs text-stone-800 leading-relaxed whitespace-pre-wrap">
            {outreachDrafts.linkedInConnectionNote}
          </div>
        </div>

        {/* Cold Email */}
        <div className="blueprint-card p-5 bg-white space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-stone-100">
            <div className="flex items-center space-x-2">
              <div className="p-1.5 rounded bg-purple-50 text-purple-700">
                <Mail className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-stone-900">Direct Recruiter Cold Email</h3>
                <p className="text-[11px] text-stone-500">Subject line + concise value-proposition pitch</p>
              </div>
            </div>

            <button
              onClick={() => copyToClipboard(`Subject: ${outreachDrafts.coldEmailSubject}\n\n${outreachDrafts.coldEmailBody}`, 'coldEmail')}
              className="flex items-center space-x-1 px-2.5 py-1 rounded text-xs font-mono bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-200 transition-colors"
            >
              {copiedKey === 'coldEmail' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedKey === 'coldEmail' ? 'Copied' : 'Copy Email'}</span>
            </button>
          </div>

          <div className="space-y-2">
            <div className="p-2.5 rounded bg-stone-50 border border-stone-200 font-mono text-xs text-stone-800">
              <span className="text-stone-400 select-none">Subject: </span>
              {outreachDrafts.coldEmailSubject}
            </div>

            <div className="p-3.5 rounded-lg bg-stone-50 border border-stone-200 font-sans text-xs text-stone-800 leading-relaxed whitespace-pre-wrap">
              {outreachDrafts.coldEmailBody}
            </div>
          </div>
        </div>

        {/* Profile About Section */}
        <div className="blueprint-card p-5 bg-white space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-stone-100">
            <div className="flex items-center space-x-2">
              <div className="p-1.5 rounded bg-emerald-50 text-emerald-700">
                <UserCheck className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-stone-900">Optimized LinkedIn About Section</h3>
                <p className="text-[11px] text-stone-500">Keyword-enriched summary for recruiter discovery</p>
              </div>
            </div>

            <button
              onClick={() => copyToClipboard(outreachDrafts.linkedInAboutSection, 'aboutSection')}
              className="flex items-center space-x-1 px-2.5 py-1 rounded text-xs font-mono bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-200 transition-colors"
            >
              {copiedKey === 'aboutSection' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedKey === 'aboutSection' ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          <div className="p-3.5 rounded-lg bg-stone-50 border border-stone-200 font-sans text-xs text-stone-800 leading-relaxed whitespace-pre-wrap">
            {outreachDrafts.linkedInAboutSection}
          </div>
        </div>

      </div>

    </div>
  );
}
