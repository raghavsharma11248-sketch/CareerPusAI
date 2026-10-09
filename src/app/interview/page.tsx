'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useCandidate } from '@/lib/context/CandidateContext';
import type { STAREvaluation } from '@/lib/types';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  Sparkles, 
  RotateCcw, 
  Award
} from 'lucide-react';

interface SpeechResultList {
  [index: number]: {
    [index: number]: {
      transcript: string;
    };
  };
  length: number;
}

interface SpeechRecognitionEventLike {
  results: SpeechResultList;
}

interface SpeechRecognitionErrorLike {
  error: string;
}

interface SpeechRecognitionLike {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: (event: SpeechRecognitionEventLike) => void;
  onerror: (event: SpeechRecognitionErrorLike) => void;
  start: () => void;
  stop: () => void;
}

export default function InterviewRoomPage() {
  const { state, addTerminalLog, apiKey } = useCandidate();
  const { interviewGaps, targetJob } = state;

  const [selectedGapIndex, setSelectedGapIndex] = useState<number>(0);
  const [isVoiceMode, setIsVoiceMode] = useState<boolean>(true);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [userTranscript, setUserTranscript] = useState<string>('');
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [evaluation, setEvaluation] = useState<STAREvaluation | null>(null);
  const [speechSupported, setSpeechSupported] = useState<boolean>(true);

  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const currentGap = interviewGaps[selectedGapIndex] || {
    id: 'default',
    skillOrExperience: 'System Architecture',
    questionType: 'technical',
    question: 'How do you design scalable frontend applications with TypeScript and React?',
  };

  // Setup Web Speech API
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const windowWithSpeech = window as unknown as {
        SpeechRecognition?: new () => SpeechRecognitionLike;
        webkitSpeechRecognition?: new () => SpeechRecognitionLike;
      };
      const SpeechRecognitionClass = windowWithSpeech.SpeechRecognition || windowWithSpeech.webkitSpeechRecognition;

      if (SpeechRecognitionClass) {
        const recognition = new SpeechRecognitionClass();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onresult = (event: SpeechRecognitionEventLike) => {
          let current = '';
          for (let i = 0; i < event.results.length; i++) {
            current += event.results[i][0].transcript + ' ';
          }
          setUserTranscript(current);
        };

        recognition.onerror = (event: SpeechRecognitionErrorLike) => {
          console.warn('Speech recognition error:', event.error);
          setIsRecording(false);
        };

        recognitionRef.current = recognition;
      } else {
        setTimeout(() => {
          setSpeechSupported(false);
          setIsVoiceMode(false);
        }, 0);
      }
    }
  }, []);

  const toggleRecording = () => {
    if (!recognitionRef.current) return;
    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
      addTerminalLog('Agent 3 (Voice)', 'User voice recording stopped. Ready for STAR evaluation.', 'info');
    } else {
      setUserTranscript('');
      try {
        recognitionRef.current.start();
        setIsRecording(true);
        addTerminalLog('Agent 3 (Voice)', `Listening to candidate response on "${currentGap.skillOrExperience}"...`, 'info');
      } catch (err) {
        console.error('Mic start error:', err);
      }
    }
  };

  const speakQuestion = (text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
      addTerminalLog('Agent 3 (Voice)', 'Interviewer asking question via audio synthesis.', 'info');
    }
  };

  const handleEvaluate = async () => {
    if (!userTranscript.trim()) {
      alert('Please speak or type your answer before submitting.');
      return;
    }

    setIsEvaluating(true);
    addTerminalLog('Agent 3 (Evaluator)', `Evaluating candidate answer with STAR Rubric...`, 'info');

    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (apiKey) headers['x-gemini-key'] = apiKey;

    try {
      const res = await fetch('/api/interview', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          action: 'evaluate',
          question: currentGap.question,
          userAnswer: userTranscript,
          skillContext: currentGap.skillOrExperience,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setEvaluation(data.evaluation);
        addTerminalLog(
          'Agent 3 (Evaluator)',
          `STAR Rubric Score: ${data.evaluation.overall}/10. S:${data.evaluation.situation} T:${data.evaluation.task} A:${data.evaluation.action} R:${data.evaluation.result}`,
          'success'
        );
      }
    } catch (err) {
      addTerminalLog('Agent 3 (Evaluator)', `Evaluation failed: ${String(err)}`, 'error');
    } finally {
      setIsEvaluating(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Room Header */}
      <div className="blueprint-card p-5 bg-white">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="mono-tag text-stone-500 uppercase tracking-wider">Agent 3 · Voice Mock Room</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-50 text-emerald-800 border border-emerald-200">
                STAR Rubric Evaluation
              </span>
            </div>
            <h1 className="text-lg font-semibold text-stone-900 mt-1">
              Autonomous Technical & Behavioral Simulation
            </h1>
            <p className="text-xs text-stone-500">
              Target Opening: <span className="font-semibold text-stone-800">{targetJob.roleTitle} @ {targetJob.companyName}</span>
            </p>
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsVoiceMode(!isVoiceMode)}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-mono font-medium border transition-colors ${
                isVoiceMode
                  ? 'bg-stone-900 text-white border-stone-900'
                  : 'bg-stone-100 text-stone-800 border-stone-300'
              }`}
            >
              {isVoiceMode ? <Mic className="w-3.5 h-3.5 text-emerald-400" /> : <MicOff className="w-3.5 h-3.5" />}
              <span>{isVoiceMode ? 'Voice Mode Active' : 'Text Fallback Mode'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Question Navigator (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="blueprint-card p-4">
            <span className="mono-tag text-stone-500 uppercase tracking-wider block mb-3">
              Identified Skill Gaps ({interviewGaps.length})
            </span>

            <div className="space-y-2">
              {interviewGaps.map((gap, idx) => {
                const isSelected = idx === selectedGapIndex;
                return (
                  <button
                    key={gap.id}
                    onClick={() => {
                      setSelectedGapIndex(idx);
                      setUserTranscript('');
                      setEvaluation(null);
                    }}
                    className={`w-full text-left p-3 rounded-lg border transition-all ${
                      isSelected
                        ? 'border-stone-900 bg-stone-900 text-white shadow-xs'
                        : 'border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-800'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-mono uppercase font-semibold text-[11px] opacity-80">
                        {gap.skillOrExperience}
                      </span>
                      <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                        isSelected ? 'bg-stone-800 text-stone-300' : 'bg-stone-200 text-stone-700'
                      }`}>
                        {gap.questionType}
                      </span>
                    </div>
                    <p className={`text-xs line-clamp-2 ${isSelected ? 'text-stone-300' : 'text-stone-600'}`}>
                      {gap.question}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tips Card */}
          <div className="blueprint-card p-4 text-xs text-stone-600 space-y-2">
            <span className="font-semibold text-stone-800 flex items-center">
              <Sparkles className="w-3.5 h-3.5 text-amber-500 mr-1.5" />
              STAR Method Tip
            </span>
            <p>
              Structure your response: <strong>Situation</strong> (context), <strong>Task</strong> (your role), <strong>Action</strong> (what you engineered), and <strong>Result</strong> (metrics & impact).
            </p>
          </div>
        </div>

        {/* Right Column: Active Simulation & Evaluation (8 cols) */}
        <div className="lg:col-span-8 space-y-5">
          
          {/* Active Question Display */}
          <div className="blueprint-card p-5 bg-white space-y-4">
            <div className="flex items-center justify-between">
              <span className="mono-tag text-stone-500 uppercase">
                Targeting: {currentGap.skillOrExperience}
              </span>
              <button
                onClick={() => speakQuestion(currentGap.question)}
                className="flex items-center space-x-1.5 px-2.5 py-1 rounded text-xs font-mono text-stone-700 bg-stone-100 hover:bg-stone-200 border border-stone-200 transition-colors"
                title="Play Audio Question"
              >
                <Volume2 className="w-3.5 h-3.5 text-stone-600" />
                <span>Play Voice</span>
              </button>
            </div>

            <div className="p-4 rounded-lg bg-stone-50 border border-stone-200 text-stone-900 text-sm font-medium leading-relaxed">
              &ldquo;{currentGap.question}&rdquo;
            </div>

            {/* Answer Input Area */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-stone-700">
                  {isVoiceMode ? 'Live Voice Recording / Transcript:' : 'Type Your Answer:'}
                </span>

                {isVoiceMode && (
                  <span className={`text-[11px] font-mono px-2 py-0.5 rounded-full ${
                    isRecording ? 'bg-rose-100 text-rose-700 animate-pulse' : 'bg-stone-100 text-stone-600'
                  }`}>
                    {isRecording ? 'RECORDING IN PROGRESS' : 'MIC READY'}
                  </span>
                )}
              </div>

              {/* Live Audio Waveform Visualizer */}
              {isVoiceMode && isRecording && (
                <div className="p-3 bg-stone-900 rounded-lg flex items-center justify-center space-x-1.5 h-12 overflow-hidden shadow-inner">
                  {[24, 40, 16, 32, 48, 20, 36, 44, 28, 52, 18, 38, 46, 22, 34, 42, 26, 50, 16, 30, 48, 24, 38, 20].map((h, i) => (
                    <div
                      key={i}
                      className="w-1 bg-gradient-to-t from-emerald-500 to-sky-400 rounded-full animate-pulse"
                      style={{
                        height: `${h}px`,
                        animationDuration: `${0.4 + (i % 5) * 0.15}s`,
                        animationDelay: `${(i % 4) * 0.1}s`,
                      }}
                    />
                  ))}
                </div>
              )}

              {/* Textarea for transcript / typing */}
              <textarea
                value={userTranscript}
                onChange={(e) => setUserTranscript(e.target.value)}
                placeholder={
                  isVoiceMode
                    ? 'Click "Start Mic" below and speak your answer. Your speech will transcribe here in real time...'
                    : 'Type your STAR structured response here...'
                }
                rows={5}
                className="w-full text-xs p-3 rounded-lg border border-stone-300 focus:outline-none focus:ring-1 focus:ring-stone-900 bg-white font-sans leading-relaxed"
              />

              {/* Action Controls */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                <div>
                  {isVoiceMode && speechSupported && (
                    <button
                      onClick={toggleRecording}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-md text-xs font-mono font-medium transition-all shadow-xs ${
                        isRecording
                          ? 'bg-rose-600 hover:bg-rose-700 text-white animate-pulse'
                          : 'bg-stone-900 hover:bg-stone-800 text-white'
                      }`}
                    >
                      {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4 text-emerald-400" />}
                      <span>{isRecording ? 'Stop Recording' : 'Start Mic Recording'}</span>
                    </button>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setUserTranscript('')}
                    className="px-3 py-1.5 rounded text-xs font-mono text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors"
                  >
                    Clear
                  </button>

                  <button
                    onClick={handleEvaluate}
                    disabled={isEvaluating || !userTranscript.trim()}
                    className="flex items-center space-x-1.5 px-4 py-2 rounded-md text-xs font-medium bg-emerald-600 hover:bg-emerald-700 text-white transition-colors disabled:opacity-50 shadow-xs"
                  >
                    {isEvaluating ? (
                      <>
                        <RotateCcw className="w-3.5 h-3.5 animate-spin" />
                        <span>Grading STAR Rubric...</span>
                      </>
                    ) : (
                      <>
                        <Award className="w-3.5 h-3.5" />
                        <span>Submit for STAR Grading</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* STAR Rubric Evaluation Card */}
          {evaluation && (
            <div className="blueprint-card p-5 bg-white border-emerald-200 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <div className="flex items-center space-x-2">
                  <Award className="w-5 h-5 text-emerald-600" />
                  <h3 className="font-semibold text-stone-900 text-sm">
                    STAR Rubric Feedback Scorecard
                  </h3>
                </div>
                <div className="flex items-baseline space-x-1">
                  <span className="text-2xl font-bold font-mono text-stone-900">{evaluation.overall}</span>
                  <span className="text-xs font-mono text-stone-500">/ 10</span>
                </div>
              </div>

              {/* STAR 4-Dimension Breakdown */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                <div className="p-2.5 rounded bg-stone-50 border border-stone-200">
                  <span className="text-stone-500 font-mono block text-[10px] uppercase">Situation</span>
                  <span className="text-base font-bold font-mono text-stone-900">{evaluation.situation}/5</span>
                </div>
                <div className="p-2.5 rounded bg-stone-50 border border-stone-200">
                  <span className="text-stone-500 font-mono block text-[10px] uppercase">Task</span>
                  <span className="text-base font-bold font-mono text-stone-900">{evaluation.task}/5</span>
                </div>
                <div className="p-2.5 rounded bg-stone-50 border border-stone-200">
                  <span className="text-stone-500 font-mono block text-[10px] uppercase">Action</span>
                  <span className="text-base font-bold font-mono text-stone-900">{evaluation.action}/5</span>
                </div>
                <div className="p-2.5 rounded bg-stone-50 border border-stone-200">
                  <span className="text-stone-500 font-mono block text-[10px] uppercase">Result</span>
                  <span className="text-base font-bold font-mono text-stone-900">{evaluation.result}/5</span>
                </div>
              </div>

              {/* Feedback */}
              <div className="p-3.5 rounded bg-sky-50/70 border border-sky-200 text-xs space-y-1">
                <span className="font-semibold text-sky-900 block">Auditor Feedback:</span>
                <p className="text-sky-800 leading-relaxed">{evaluation.feedback}</p>
              </div>

              {/* Model Ideal Answer */}
              <div className="p-3.5 rounded bg-stone-50 border border-stone-200 text-xs space-y-1">
                <span className="font-semibold text-stone-800 block">Recommended Model Answer:</span>
                <p className="text-stone-700 italic leading-relaxed">{evaluation.modelAnswer}</p>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
