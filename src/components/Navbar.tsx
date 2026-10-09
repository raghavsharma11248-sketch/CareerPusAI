'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCandidate } from '@/lib/context/CandidateContext';
import { 
  Mic, 
  Send, 
  Globe, 
  LayoutDashboard, 
  RotateCcw,
  Key,
  User,
  X,
  LogOut,
  ChevronDown,
  Cpu
} from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const { loadDemo, state, apiKey, setApiKey, userName, userEmail, isAuthenticated, logout } = useCandidate();

  const [showKeyModal, setShowKeyModal] = useState<boolean>(false);
  const [showJudgeModal, setShowJudgeModal] = useState<boolean>(false);
  const [userMenuOpen, setUserMenuOpen] = useState<boolean>(false);
  const [keyInput, setKeyInput] = useState<string>(apiKey);

  const navLinks = [
    { href: '/', label: 'Auditor & Tailor', icon: LayoutDashboard },
    { href: '/interview', label: 'Voice Mock Room', icon: Mic },
    { href: '/outreach', label: 'Recruiter DMs', icon: Send },
    { href: `/portfolio/${state.portfolioData?.slug || 'alex-chen-stripe-2026'}`, label: 'Live Portfolio', icon: Globe },
  ];

  const handleSaveKey = () => {
    setApiKey(keyInput.trim());
    setShowKeyModal(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Hackathon Badge */}
          <div className="flex items-center space-x-3">
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="w-8 h-8 rounded-lg bg-stone-900 text-white flex items-center justify-center font-bold text-sm tracking-tight shadow-sm group-hover:scale-105 transition-transform">
                CP
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <span className="font-semibold text-stone-900 text-base tracking-tight">CareerPulse AI</span>
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono uppercase bg-stone-200/80 text-stone-700">
                    v2.5
                  </span>
                </div>
                <p className="text-[11px] text-stone-500 font-mono hidden sm:block">
                  Autonomous Hiring Readiness Copilot
                </p>
              </div>
            </Link>

            <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse" />
              HackNowa 2026
            </span>
          </div>

          {/* Nav Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-stone-900 text-white shadow-xs'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center space-x-2">
            
            {/* Judge Mode / Architecture Guide */}
            <button
              onClick={() => setShowJudgeModal(true)}
              className="flex items-center space-x-1.5 px-2.5 py-1.5 text-xs font-mono font-medium rounded-md bg-stone-900 text-white hover:bg-stone-800 transition-all shadow-xs"
              title="Hackathon Judge Mode: Architecture & Guardrails Walkthrough"
            >
              <Cpu className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">Judge Deep Dive</span>
            </button>

            {/* 1-Click Demo Button */}
            <button
              onClick={loadDemo}
              className="flex items-center space-x-1.5 px-2.5 py-1.5 text-xs font-mono font-medium rounded-md bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-300 transition-all active:scale-95"
              title="Preload Stripe Senior Frontend Engineer Candidate Demo"
            >
              <RotateCcw className="w-3.5 h-3.5 text-stone-600" />
              <span className="hidden sm:inline">1-Click Demo</span>
            </button>

            {/* API Key Modal Button */}
            <button
              onClick={() => {
                setKeyInput(apiKey);
                setShowKeyModal(true);
              }}
              className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-md text-xs font-mono border transition-colors ${
                apiKey
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
              }`}
              title="Configure Google Gemini API Key"
            >
              <Key className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{apiKey ? 'Gemini Key Configured' : 'Set Gemini Key'}</span>
            </button>

            {/* User Auth: Profile Dropdown or Sign In / Sign Up */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-md text-xs font-mono bg-stone-100 hover:bg-stone-200 border border-stone-200 text-stone-800 transition-colors"
                  title="Candidate Account"
                >
                  <div className="w-5 h-5 rounded-full bg-stone-900 text-white flex items-center justify-center text-[10px] font-bold">
                    {(userName || userEmail || 'U').slice(0, 2).toUpperCase()}
                  </div>
                  <span className="max-w-[100px] truncate hidden sm:inline">{userName || userEmail}</span>
                  <ChevronDown className="w-3 h-3 text-stone-500" />
                </button>

                {userMenuOpen && (
                  <div 
                    className="absolute right-0 mt-1.5 w-56 bg-white border border-stone-200 rounded-xl shadow-lg p-2 z-50 animate-in fade-in zoom-in-95"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    <div className="px-3 py-2 border-b border-stone-100">
                      <span className="font-semibold text-xs text-stone-900 block truncate">{userName || 'Candidate'}</span>
                      <span className="text-[11px] font-mono text-stone-500 block truncate">{userEmail}</span>
                    </div>

                    <div className="py-1">
                      <Link
                        href={`/portfolio/${state.portfolioData?.slug || 'alex-chen-stripe-2026'}`}
                        className="flex items-center space-x-2 px-3 py-1.5 text-xs text-stone-700 hover:bg-stone-100 rounded-md transition-colors"
                      >
                        <Globe className="w-3.5 h-3.5 text-stone-500" />
                        <span>View Live Portfolio</span>
                      </Link>
                      <Link
                        href="/login"
                        className="flex items-center space-x-2 px-3 py-1.5 text-xs text-stone-700 hover:bg-stone-100 rounded-md transition-colors"
                      >
                        <User className="w-3.5 h-3.5 text-stone-500" />
                        <span>Account & Switch User</span>
                      </Link>
                    </div>

                    <div className="pt-1 border-t border-stone-100">
                      <button
                        type="button"
                        onClick={logout}
                        className="w-full flex items-center space-x-2 px-3 py-1.5 text-xs text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-1.5">
                <Link
                  href="/login"
                  className="px-2.5 py-1.5 text-xs font-mono text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-md transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/login"
                  className="px-2.5 py-1.5 text-xs font-mono font-medium rounded-md bg-stone-900 hover:bg-stone-800 text-white transition-colors shadow-xs"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* GitHub Repo */}
            <a
              href="https://github.com/raghavsharma11248-sketch/CareerPusAI"
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-md transition-colors"
              title="View on GitHub"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
            </a>
          </div>

        </div>
      </div>

      {/* API Key Modal */}
      {showKeyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-lg shadow-xl border border-stone-200 max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-stone-100">
              <div className="flex items-center space-x-2">
                <Key className="w-4 h-4 text-sky-600" />
                <h3 className="font-semibold text-stone-900 text-sm">Google Gemini API Key</h3>
              </div>
              <button onClick={() => setShowKeyModal(false)} className="text-stone-400 hover:text-stone-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed">
              Enter your Gemini API key from <a href="https://aistudio.google.com/" target="_blank" rel="noopener noreferrer" className="text-sky-700 underline font-medium">Google AI Studio</a>. It is stored only in your local browser session.
            </p>

            <div>
              <input
                type="password"
                value={keyInput}
                onChange={(e) => setKeyInput(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full text-xs font-mono p-2.5 rounded border border-stone-300 focus:outline-none focus:ring-1 focus:ring-stone-900"
              />
            </div>

            <div className="flex justify-end space-x-2 pt-2 border-t border-stone-100">
              <button
                onClick={() => setShowKeyModal(false)}
                className="px-3 py-1.5 text-xs font-mono rounded bg-stone-100 text-stone-700 hover:bg-stone-200"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveKey}
                className="px-4 py-1.5 text-xs font-mono font-medium rounded bg-stone-900 text-white hover:bg-stone-800"
              >
                Save Key
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Judge Mode & Architecture Modal */}
      {showJudgeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/40 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-xl border border-stone-200 max-w-2xl w-full p-6 space-y-5 animate-in fade-in zoom-in-95 my-8">
            <div className="flex items-start justify-between pb-3 border-b border-stone-100">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="mono-tag text-emerald-800 bg-emerald-50 border border-emerald-200 uppercase font-semibold">
                    HackNowa Global 2026 Evaluation Suite
                  </span>
                  <span className="text-[11px] font-mono text-stone-500">Track: Future of Work & Automation</span>
                </div>
                <h3 className="text-base font-bold text-stone-900 mt-1">
                  CareerPulse AI &mdash; 5-Agent Autonomous Architecture
                </h3>
              </div>
              <button 
                onClick={() => setShowJudgeModal(false)}
                className="text-stone-400 hover:text-stone-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 5-Agent Closed Loop Flow */}
            <div className="space-y-2">
              <span className="text-xs font-mono font-semibold text-stone-700 uppercase tracking-wider block">
                1. Autonomous Agent Fleet Execution
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-lg bg-stone-50 border border-stone-200">
                  <div className="font-semibold text-stone-900 font-mono">Agent 1 &middot; ATS Auditor</div>
                  <p className="text-[11px] text-stone-600 mt-0.5">Calculates explainable 0&ndash;100 HRI score and extracts skill gaps.</p>
                </div>
                <div className="p-2.5 rounded-lg bg-stone-50 border border-stone-200">
                  <div className="font-semibold text-stone-900 font-mono">Agent 2 &middot; Google XYZ Tailor</div>
                  <p className="text-[11px] text-stone-600 mt-0.5">Infuses metrics using Google hiring formula with human-in-the-loop diffs.</p>
                </div>
                <div className="p-2.5 rounded-lg bg-stone-50 border border-stone-200">
                  <div className="font-semibold text-stone-900 font-mono">Agent 3 &middot; Voice Mock Room</div>
                  <p className="text-[11px] text-stone-600 mt-0.5">Simulates live spoken interviews with STAR rubric scoring & text fallback.</p>
                </div>
                <div className="p-2.5 rounded-lg bg-stone-50 border border-stone-200">
                  <div className="font-semibold text-stone-900 font-mono">Agent 4 & 5 &middot; Outreach & Portfolio</div>
                  <p className="text-[11px] text-stone-600 mt-0.5">Drafts LinkedIn DMs and deploys live web portfolio at /portfolio/[slug].</p>
                </div>
              </div>
            </div>

            {/* Explainable Scoring Math Formula */}
            <div className="p-3.5 rounded-xl bg-stone-900 text-stone-100 font-mono text-xs space-y-1.5">
              <div className="flex items-center justify-between text-sky-400 font-semibold text-[11px]">
                <span>EXPLAINABLE HIRING READINESS INDEX (HRI) FORMULA</span>
                <span>NON-BLACK-BOX</span>
              </div>
              <p className="text-[11px] text-stone-300 leading-relaxed">
                HRI = (Keyword_Match &times; 40%) + (Cosine_Semantic &times; 25%) + (Experience_Level &times; 15%) + (XYZ_Achievements &times; 10%) + (Layout_Hygiene &times; 10%)
              </p>
              <div className="text-[10px] text-stone-400 pt-1 border-t border-stone-800">
                Live Dynamic Math: Accepting an XYZ rewrite recalculates the XYZ evidence component in real time.
              </div>
            </div>

            {/* Security Guardrails */}
            <div className="space-y-1.5 text-xs">
              <span className="font-mono font-semibold text-stone-700 uppercase tracking-wider block">
                2. Enterprise Security & Anti-Hallucination
              </span>
              <ul className="text-[11px] text-stone-600 space-y-1 font-mono">
                <li className="flex items-start space-x-1.5">
                  <span className="text-emerald-600 font-bold">&#10003;</span>
                  <span><strong>Adversarial Prompt-Injection Sanitizer:</strong> Strips delimiters and system override prompts.</span>
                </li>
                <li className="flex items-start space-x-1.5">
                  <span className="text-emerald-600 font-bold">&#10003;</span>
                  <span><strong>Workday ATS Guardrails:</strong> Verifies single-column layout without tables or graphics.</span>
                </li>
                <li className="flex items-start space-x-1.5">
                  <span className="text-emerald-600 font-bold">&#10003;</span>
                  <span><strong>Zero 500-Error Architecture:</strong> All 5 agents feature resilient heuristic fallbacks.</span>
                </li>
              </ul>
            </div>

            <div className="flex justify-end pt-2 border-t border-stone-100">
              <button
                type="button"
                onClick={() => setShowJudgeModal(false)}
                className="px-4 py-1.5 text-xs font-mono font-medium rounded-lg bg-stone-900 text-white hover:bg-stone-800"
              >
                Close Deep Dive
              </button>
            </div>
          </div>
        </div>
      )}

    </header>
  );
}
