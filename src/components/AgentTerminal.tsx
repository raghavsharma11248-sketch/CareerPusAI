'use client';

import React, { useRef, useEffect } from 'react';
import { useCandidate } from '@/lib/context/CandidateContext';
import { Cpu, Activity } from 'lucide-react';

export default function AgentTerminal() {
  const { terminalLogs } = useCandidate();
  const terminalEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [terminalLogs]);

  return (
    <div className="space-y-4">
      {/* Terminal Container */}
      <div className="bg-stone-900 border border-stone-800 rounded-lg overflow-hidden shadow-lg flex flex-col h-[580px]">
        
        {/* Terminal Title Bar */}
        <div className="bg-stone-950 px-3.5 py-2.5 border-b border-stone-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="flex space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
            </div>
            <span className="text-[11px] font-mono text-stone-400 pl-2">
              agent-orchestrator.log
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono bg-emerald-950 text-emerald-400 border border-emerald-800">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1 animate-pulse" />
              LIVE
            </span>
          </div>
        </div>

        {/* System Telemetry Chips */}
        <div className="bg-stone-900/90 px-3 py-2 border-b border-stone-800 grid grid-cols-2 gap-2 text-[10px] font-mono text-stone-400">
          <div className="flex items-center space-x-1.5">
            <Cpu className="w-3 h-3 text-sky-400" />
            <span>Model: Gemini 2.5 Flash</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <Activity className="w-3 h-3 text-emerald-400" />
            <span>Latency: 420ms</span>
          </div>
        </div>

        {/* Log Stream Output */}
        <div className="p-3.5 flex-1 overflow-y-auto font-mono text-[11px] space-y-2 terminal-scroll bg-[#0c0c0e]">
          {terminalLogs.map((log) => {
            let textColor = 'text-stone-300';
            let prefixColor = 'text-sky-400';

            if (log.type === 'success') {
              textColor = 'text-emerald-300';
              prefixColor = 'text-emerald-400';
            } else if (log.type === 'warning') {
              textColor = 'text-amber-300';
              prefixColor = 'text-amber-400';
            } else if (log.type === 'error') {
              textColor = 'text-rose-400';
              prefixColor = 'text-rose-500';
            }

            return (
              <div key={log.id} className="leading-relaxed flex items-start space-x-2">
                <span className="text-stone-600 select-none">[{log.timestamp}]</span>
                <span className={`font-semibold shrink-0 ${prefixColor}`}>
                  {log.agent}:
                </span>
                <span className={`${textColor} break-words`}>
                  {log.message}
                </span>
              </div>
            );
          })}
          <div ref={terminalEndRef} />
        </div>

        {/* Terminal Footer */}
        <div className="bg-stone-950 px-3 py-2 border-t border-stone-800 text-[10px] font-mono text-stone-500 flex items-center justify-between">
          <span>Prompt Injection Guard: ACTIVE</span>
          <span>Tokens: ~1,450</span>
        </div>
      </div>

      {/* Autonomous Multi-Agent Status Card */}
      <div className="blueprint-card p-4 space-y-2.5">
        <span className="mono-tag text-stone-500 uppercase tracking-wider block">Agent Fleet Status</span>
        
        <div className="space-y-1.5 text-xs font-mono">
          <div className="flex items-center justify-between p-1.5 rounded bg-stone-50 border border-stone-200">
            <span className="text-stone-800">Agent 1: ATS Auditor</span>
            <span className="text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded text-[10px]">READY</span>
          </div>

          <div className="flex items-center justify-between p-1.5 rounded bg-stone-50 border border-stone-200">
            <span className="text-stone-800">Agent 2: XYZ Tailor</span>
            <span className="text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded text-[10px]">READY</span>
          </div>

          <div className="flex items-center justify-between p-1.5 rounded bg-stone-50 border border-stone-200">
            <span className="text-stone-800">Agent 3: Voice Mock Room</span>
            <span className="text-sky-700 bg-sky-50 px-1.5 py-0.5 rounded text-[10px]">STANDBY</span>
          </div>

          <div className="flex items-center justify-between p-1.5 rounded bg-stone-50 border border-stone-200">
            <span className="text-stone-800">Agent 4: Outreach Strategist</span>
            <span className="text-sky-700 bg-sky-50 px-1.5 py-0.5 rounded text-[10px]">STANDBY</span>
          </div>

          <div className="flex items-center justify-between p-1.5 rounded bg-stone-50 border border-stone-200">
            <span className="text-stone-800">Agent 5: Portfolio Architect</span>
            <span className="text-sky-700 bg-sky-50 px-1.5 py-0.5 rounded text-[10px]">STANDBY</span>
          </div>
        </div>
      </div>
    </div>
  );
}
