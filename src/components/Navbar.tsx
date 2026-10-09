'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCandidate } from '@/lib/context/CandidateContext';
import { 
  Sparkles, 
  Mic, 
  Send, 
  Globe, 
  LayoutDashboard, 
  RotateCcw,
  Zap,
  Key,
  User,
  ShieldCheck,
  X,
  Check
} from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const { loadDemo, state, apiKey, setApiKey, userEmail, isAuthenticated, loginWithEmail, logout } = useCandidate();

  const [showKeyModal, setShowKeyModal] = useState<boolean>(false);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [keyInput, setKeyInput] = useState<string>(apiKey);
  const [emailInput, setEmailInput] = useState<string>('');
  const [authError, setAuthError] = useState<string>('');
  const [authSuccess, setAuthSuccess] = useState<string>('');

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

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccess('');
    const result = loginWithEmail(emailInput);
    if (!result.success) {
      setAuthError(result.error || 'Authentication rejected');
    } else {
      setAuthSuccess('Verified and authenticated!');
      setTimeout(() => setShowAuthModal(false), 1200);
    }
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

            {/* Verified Candidate Auth Pill */}
            <button
              onClick={() => setShowAuthModal(true)}
              className="hidden md:flex items-center space-x-1.5 px-2.5 py-1.5 rounded-md text-xs font-mono bg-stone-100 hover:bg-stone-200 border border-stone-200 text-stone-800"
              title="Verified Candidate Authentication"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span className="max-w-[110px] truncate">{userEmail || 'Sign In'}</span>
            </button>

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

      {/* Trusted Auth Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-lg shadow-xl border border-stone-200 max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-stone-100">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <h3 className="font-semibold text-stone-900 text-sm">Trusted Candidate Authentication</h3>
              </div>
              <button onClick={() => setShowAuthModal(false)} className="text-stone-400 hover:text-stone-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 rounded bg-amber-50 border border-amber-200 text-xs text-amber-800 space-y-1">
              <span className="font-semibold block">Candidate Security Policy:</span>
              <p>
                To protect candidate PII and prevent fake submissions, only verified domains (<code className="font-mono bg-white px-1 py-0.5 rounded">@gmail.com</code>, <code className="font-mono bg-white px-1 py-0.5 rounded">@outlook.com</code>, <code className="font-mono bg-white px-1 py-0.5 rounded">@yahoo.com</code>, <code className="font-mono bg-white px-1 py-0.5 rounded">@icloud.com</code>) are permitted.
              </p>
            </div>

            {isAuthenticated && userEmail && (
              <div className="p-3 rounded bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center justify-between">
                <div>
                  <span className="font-semibold block">Currently Authenticated:</span>
                  <span className="font-mono">{userEmail}</span>
                </div>
                <button
                  onClick={logout}
                  className="px-2 py-1 text-[11px] font-mono rounded bg-white text-rose-700 hover:bg-rose-50 border border-rose-200"
                >
                  Sign Out
                </button>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-3 pt-1">
              <div>
                <label className="block text-xs font-mono text-stone-600 mb-1">Enter Your Trusted Email</label>
                <input
                  type="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="yourname@gmail.com"
                  className="w-full text-xs font-mono p-2.5 rounded border border-stone-300 focus:outline-none focus:ring-1 focus:ring-stone-900"
                  required
                />
              </div>

              {authError && (
                <p className="text-xs text-rose-600 font-mono leading-relaxed bg-rose-50 p-2 rounded border border-rose-200">
                  {authError}
                </p>
              )}

              {authSuccess && (
                <p className="text-xs text-emerald-600 font-mono leading-relaxed bg-emerald-50 p-2 rounded border border-emerald-200 flex items-center space-x-1">
                  <Check className="w-3.5 h-3.5" />
                  <span>{authSuccess}</span>
                </p>
              )}

              <div className="flex justify-end space-x-2 pt-2 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setShowAuthModal(false)}
                  className="px-3 py-1.5 text-xs font-mono rounded bg-stone-100 text-stone-700 hover:bg-stone-200"
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-mono font-medium rounded bg-stone-900 text-white hover:bg-stone-800"
                >
                  Verify & Sign In
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </header>
  );
}
