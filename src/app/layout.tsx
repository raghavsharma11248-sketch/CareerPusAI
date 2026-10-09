import type { Metadata } from 'next';
import { Suspense } from 'react';
import './globals.css';
import { CandidateProvider } from '@/lib/context/CandidateContext';
import Navbar from '@/components/Navbar';

export const metadata: Metadata = {
  title: 'CareerPulse AI — Autonomous Hiring Readiness Copilot',
  description: 'Multi-agent hiring readiness platform powered by Google Gemini. Semantic ATS audits, Google XYZ bullet tailor, voice mock interviews, recruiter outreach & live portfolios.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-stone-900 font-sans antialiased flex flex-col">
        <CandidateProvider>
          <Suspense fallback={<div className="h-16 border-b border-stone-200 bg-white" />}>
            <Navbar />
          </Suspense>
          <main className="flex-1">
            <Suspense fallback={<div className="p-8 text-center text-xs font-mono text-stone-500">Loading module...</div>}>
              {children}
            </Suspense>
          </main>
        </CandidateProvider>
      </body>
    </html>
  );
}
