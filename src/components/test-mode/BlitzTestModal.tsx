import React, { useState, useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import {
  X,
  Clock,
  RotateCcw,
  Play,
  Pause,
  Check,
  FileText,
  Zap,
} from 'lucide-react';
import { Question, SupportedLanguage } from '../../types';
import { BlitzResultDiff } from './BlitzResultDiff';

interface BlitzTestModalProps {
  question: Question;
  initialLanguage: SupportedLanguage;
  onClose: () => void;
  onRecordAttempt: (
    questionId: string,
    language: SupportedLanguage,
    writtenCode: string,
    timeSpentSeconds: number,
    isTimedOut: boolean,
    grade: 'mastered' | 'hesitant' | 'failed'
  ) => void;
}

const DEFAULT_BLITZ_SECONDS = 300;

export const BlitzTestModal: React.FC<BlitzTestModalProps> = ({
  question,
  initialLanguage,
  onClose,
  onRecordAttempt,
}) => {
  const [language, setLanguage] = useState<SupportedLanguage>(initialLanguage);

  const getInitialCode = (lang: SupportedLanguage) => {
    if (lang === 'cpp') {
      return question.starterCode?.cpp ||
`#include <vector>
#include <iostream>

class Solution {
public:
    void solve() {
        
    }
};`;
    }
    return question.starterCode?.python ||
`class Solution:
    def solve(self):
        pass`;
  };

  const [code, setCode] = useState<string>(getInitialCode(initialLanguage));
  const [timeLeft, setTimeLeft] = useState(DEFAULT_BLITZ_SECONDS);
  const [isRunning, setIsRunning] = useState(true);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isTimedOut, setIsTimedOut] = useState(false);
  const timerRef = useRef<any>(null);

  useEffect(() => {
    if (isRunning && !isCompleted && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setIsRunning(false);
            setIsTimedOut(true);
            setIsCompleted(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isRunning, isCompleted, timeLeft]);

  const handleLanguageChange = (lang: SupportedLanguage) => {
    setLanguage(lang);
    setCode(getInitialCode(lang));
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleFinish = () => { setIsRunning(false); setIsTimedOut(false); setIsCompleted(true); };
  const handleRetry = () => {
    setTimeLeft(DEFAULT_BLITZ_SECONDS);
    setCode(getInitialCode(language));
    setIsCompleted(false);
    setIsTimedOut(false);
    setIsRunning(true);
  };
  const handleRecordGrade = (grade: 'mastered' | 'hesitant' | 'failed') => {
    onRecordAttempt(question.id, language, code, DEFAULT_BLITZ_SECONDS - timeLeft, isTimedOut, grade);
    onClose();
  };

  const isUrgent = timeLeft <= 60;
  const progressPct = (timeLeft / DEFAULT_BLITZ_SECONDS) * 100;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)' }}
    >
      <div
        className="w-full h-full max-w-[1280px] max-h-[94vh] rounded-2xl flex flex-col overflow-hidden shadow-2xl"
        style={{
          background: '#121212',
          border: isUrgent ? '1px solid rgba(239,68,68,0.35)' : '1px solid rgba(255,255,255,0.1)',
          boxShadow: isUrgent
            ? '0 32px 80px rgba(239,68,68,0.1), 0 0 0 1px rgba(239,68,68,0.1)'
            : '0 32px 80px rgba(0,0,0,0.8)',
          transition: 'border-color 0.5s, box-shadow 0.5s',
        }}
      >
        {isCompleted ? (
          <BlitzResultDiff
            question={question}
            language={language}
            writtenCode={code}
            timeSpentSeconds={DEFAULT_BLITZ_SECONDS - timeLeft}
            isTimedOut={isTimedOut}
            onRetry={handleRetry}
            onFinish={handleRecordGrade}
          />
        ) : (
          <>
            {/* Timer Progress Bar */}
            <div className="h-[3px] w-full flex-shrink-0" style={{ background: 'rgba(255,255,255,0.05)' }}>
              <div
                className={isUrgent ? 'timer-bar-urgent' : 'timer-bar'}
                style={{ width: `${progressPct}%`, height: '100%', borderRadius: 0, transition: 'width 1s linear, background 0.5s' }}
              />
            </div>

            {/* Header */}
            <div
              className="h-14 px-5 flex items-center justify-between gap-4 flex-shrink-0"
              style={{ background: '#171717', borderBottom: '1px solid rgba(255,255,255,0.08)' }}
            >
              {/* Problem info */}
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg"
                  style={{ background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.25)' }}>
                  <Zap size={12} className="text-amber-400" />
                  <span className="text-[11px] font-bold text-amber-400">BLITZ MODE</span>
                </div>
                <span className="font-mono text-[11.5px] font-bold text-slate-500">#{question.id}</span>
                <span className="font-semibold text-[14px] text-slate-200 truncate">{question.title}</span>
              </div>

              {/* Timer */}
              <div className="flex items-center gap-2.5 flex-shrink-0">
                <div
                  className={`font-mono text-[18px] font-black px-4 py-1.5 rounded-xl flex items-center gap-2 transition-all ${
                    isUrgent ? 'text-red-400' : 'text-sky-400'
                  }`}
                  style={{
                    background: isUrgent ? 'rgba(239,68,68,0.12)' : 'rgba(56,189,248,0.10)',
                    border: isUrgent ? '1px solid rgba(239,68,68,0.3)' : '1px solid rgba(56,189,248,0.25)',
                  }}
                >
                  <Clock size={15} />
                  {formatTime(timeLeft)}
                </div>
                <button
                  onClick={() => setIsRunning(!isRunning)}
                  className="btn-icon !p-2"
                  title={isRunning ? 'Pause' : 'Resume'}
                >
                  {isRunning ? <Pause size={15} /> : <Play size={15} />}
                </button>
                <button onClick={handleRetry} className="btn-icon !p-2" title="Reset">
                  <RotateCcw size={14} />
                </button>
              </div>

              {/* Language + Finish */}
              <div className="flex items-center gap-2.5 flex-shrink-0">
                <div
                  className="flex rounded-xl p-0.5"
                  style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
                >
                  {(['python', 'cpp'] as SupportedLanguage[]).map(lang => (
                    <button
                      key={lang}
                      onClick={() => handleLanguageChange(lang)}
                      className={`px-3 py-1 rounded-lg text-[11.5px] font-semibold transition-all ${
                        language === lang ? 'text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
                      }`}
                      style={language === lang ? {
                        background: lang === 'python' ? '#4ade80' : '#fb923c',
                      } : {}}
                    >
                      {lang === 'python' ? 'Python 3' : 'C++'}
                    </button>
                  ))}
                </div>
                <button onClick={handleFinish} className="btn-primary !text-[12px]">
                  <Check size={13} />
                  Finish
                </button>
                <button onClick={onClose} className="btn-icon">
                  <X size={17} className="text-slate-500 hover:text-slate-200 transition-colors" />
                </button>
              </div>
            </div>

            {/* Split panes */}
            <div className="flex-1 grid grid-cols-12 overflow-hidden">
              {/* Left: Problem statement */}
              <div
                className="col-span-5 overflow-y-auto p-5"
                style={{ background: 'rgba(5,8,16,0.6)', borderRight: '1px solid rgba(255,255,255,0.07)' }}
              >
                <div className="flex items-center gap-2 mb-3 pb-2.5" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  <FileText size={13} className="text-sky-400" />
                  <span className="section-label">Problem Statement</span>
                </div>
                <div
                  className="lc-content"
                  dangerouslySetInnerHTML={{ __html: question.content || '<p>No description provided.</p>' }}
                />
              </div>

              {/* Right: Scratchpad editor */}
              <div className="col-span-7 flex flex-col overflow-hidden" style={{ background: '#060910' }}>
                <div
                  className="px-4 py-2 flex items-center justify-between text-[11px] font-mono flex-shrink-0"
                  style={{ background: '#0d1117', borderBottom: '1px solid rgba(255,255,255,0.07)' }}
                >
                  <span className="text-slate-500">⚡ Recall Scratchpad — type from memory</span>
                  <span className="text-slate-600">{language === 'cpp' ? 'C++17' : 'Python 3.11'}</span>
                </div>
                <div className="flex-1" style={{ background: '#060910' }}>
                  <Editor
                    height="100%"
                    language={language === 'cpp' ? 'cpp' : 'python'}
                    theme="vs-dark"
                    value={code}
                    onChange={(val) => setCode(val || '')}
                    options={{
                      fontSize: 14,
                      fontFamily: "'Fira Code', monospace",
                      fontLigatures: true,
                      minimap: { enabled: false },
                      padding: { top: 14, bottom: 14 },
                      lineNumbersMinChars: 3,
                      scrollBeyondLastLine: false,
                    }}
                  />
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
