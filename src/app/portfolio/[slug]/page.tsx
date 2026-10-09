'use client';

import React from 'react';
import { useCandidate } from '@/lib/context/CandidateContext';
import { 
  Globe, 
  Mail, 
  ExternalLink, 
  Briefcase, 
  GraduationCap, 
  Code, 
  ArrowLeft,
  Sparkles
} from 'lucide-react';
import Link from 'next/link';

export default function PortfolioPage() {
  const { state } = useCandidate();
  const { portfolioData } = state;

  return (
    <div className="min-h-screen bg-[#fafaf9] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Top Back Navigation Bar */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center space-x-1.5 text-xs font-mono text-stone-600 hover:text-stone-900 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to CareerPulse AI Dashboard</span>
          </Link>

          <span className="inline-flex items-center space-x-1 text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
            <Sparkles className="w-3 h-3 text-emerald-600" />
            <span>Agent 5 Generated Live Portfolio</span>
          </span>
        </div>

        {/* Hero Profile Card */}
        <div className="blueprint-card p-8 bg-white space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
                {portfolioData.name}
              </h1>
              <p className="text-sm font-medium text-stone-600 mt-1 font-mono">
                {portfolioData.headline}
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <a
                href={`mailto:${portfolioData.contactEmail}`}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-stone-900 text-white hover:bg-stone-800 transition-colors shadow-xs"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Contact</span>
              </a>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-stone-700 leading-relaxed pt-2 border-t border-stone-100">
            {portfolioData.about}
          </p>
        </div>

        {/* Skills Section */}
        <div className="blueprint-card p-6 bg-white space-y-3">
          <div className="flex items-center space-x-2 pb-2 border-b border-stone-100">
            <Code className="w-4 h-4 text-stone-700" />
            <h2 className="text-sm font-semibold text-stone-900">Technical Expertise</h2>
          </div>

          <div className="flex flex-wrap gap-1.5 pt-1">
            {portfolioData.skills.map((skill) => (
              <span
                key={skill}
                className="px-2.5 py-1 rounded text-xs font-mono bg-stone-100 text-stone-800 border border-stone-200"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Featured Projects */}
        <div className="blueprint-card p-6 bg-white space-y-4">
          <div className="flex items-center space-x-2 pb-2 border-b border-stone-100">
            <Globe className="w-4 h-4 text-stone-700" />
            <h2 className="text-sm font-semibold text-stone-900">Featured Engineering Projects</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
            {portfolioData.projects.map((proj, idx) => (
              <div
                key={idx}
                className="p-4 rounded-lg bg-stone-50 border border-stone-200 flex flex-col justify-between space-y-3"
              >
                <div>
                  <h3 className="font-semibold text-stone-900 text-xs sm:text-sm">
                    {proj.title}
                  </h3>
                  <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                    {proj.description}
                  </p>
                </div>

                <div>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {proj.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-white text-stone-700 border border-stone-200"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center space-x-3 text-xs font-mono text-sky-700 pt-1">
                    {proj.githubLink && (
                      <a
                        href={proj.githubLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline flex items-center space-x-1"
                      >
                        <span>GitHub</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                    {proj.liveLink && (
                      <a
                        href={proj.liveLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline flex items-center space-x-1"
                      >
                        <span>Live Demo</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Experience Section */}
        <div className="blueprint-card p-6 bg-white space-y-4">
          <div className="flex items-center space-x-2 pb-2 border-b border-stone-100">
            <Briefcase className="w-4 h-4 text-stone-700" />
            <h2 className="text-sm font-semibold text-stone-900">Work Experience</h2>
          </div>

          <div className="space-y-4 pt-1">
            {portfolioData.experience.map((exp, idx) => (
              <div key={idx} className="space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs">
                  <div>
                    <span className="font-semibold text-stone-900">{exp.role}</span>
                    <span className="text-stone-500 font-mono"> — {exp.company}</span>
                  </div>
                  <span className="font-mono text-stone-500">{exp.duration}</span>
                </div>

                <ul className="space-y-1.5 text-xs text-stone-700 pl-4 list-disc">
                  {exp.bullets.map((b, bIdx) => (
                    <li key={bIdx} className="leading-relaxed">
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Education Section */}
        <div className="blueprint-card p-6 bg-white space-y-3">
          <div className="flex items-center space-x-2 pb-2 border-b border-stone-100">
            <GraduationCap className="w-4 h-4 text-stone-700" />
            <h2 className="text-sm font-semibold text-stone-900">Education</h2>
          </div>

          <div className="space-y-2 pt-1">
            {portfolioData.education.map((edu, idx) => (
              <div key={idx} className="flex justify-between items-center text-xs">
                <div>
                  <span className="font-semibold text-stone-900">{edu.degree}</span>
                  <span className="text-stone-500"> — {edu.institution}</span>
                </div>
                <span className="font-mono text-stone-500">{edu.year}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-xs font-mono text-stone-500 pt-4 pb-8">
          Powered by CareerPulse AI · HackNowa Global Hackathon 2026
        </div>

      </div>
    </div>
  );
}
