'use client';

import React from 'react';
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
  Zap
} from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const { loadDemo, state } = useCandidate();

  const navLinks = [
    { href: '/', label: 'Auditor & Tailor', icon: LayoutDashboard },
    { href: '/interview', label: 'Voice Mock Room', icon: Mic },
    { href: '/outreach', label: 'Recruiter DMs', icon: Send },
    { href: `/portfolio/${state.portfolioData?.slug || 'alex-chen-stripe-2026'}`, label: 'Live Portfolio', icon: Globe },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#fafaf9]/90 backdrop-blur-md border-b border-stone-200">
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
          <div className="flex items-center space-x-2.5">
            {/* 1-Click Demo Button */}
            <button
              onClick={loadDemo}
              className="flex items-center space-x-1.5 px-2.5 py-1.5 text-xs font-mono font-medium rounded-md bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-300 transition-all active:scale-95"
              title="Preload Stripe Senior Frontend Engineer Candidate Demo"
            >
              <RotateCcw className="w-3.5 h-3.5 text-stone-600" />
              <span className="hidden sm:inline">1-Click Demo</span>
            </button>

            {/* Model Badge */}
            <div className="hidden sm:flex items-center space-x-1 px-2 py-1 rounded bg-sky-50 border border-sky-200 text-[11px] font-mono text-sky-800">
              <Zap className="w-3 h-3 text-sky-600 fill-sky-600" />
              <span>Gemini 2.5</span>
            </div>

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
    </header>
  );
}
