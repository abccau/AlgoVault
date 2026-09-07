import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  Trophy, 
  Clock, 
  RotateCcw, 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  Check, 
  Code2
} from 'lucide-react';
import { Question, SupportedLanguage, Solution } from '../../types';

interface BlitzResultDiffProps {
  question: Question;
  language: SupportedLanguage;
  writtenCode: string;
  timeSpentSeconds: number;
  isTimedOut: boolean;
  onRetry: () => void;
  onFinish: (grade: 'mastered' | 'hesitant' | 'failed') => void;
}

export const BlitzResultDiff: React.FC<BlitzResultDiffProps> = ({
  question,
  language,
  writtenCode,
  timeSpentSeconds,
  isTimedOut,
  onRetry,
  onFinish,
}) => {
  const savedSolution: Solution | undefined = 
    question.solutions.find(s => s.language === language) || question.solutions[0];

  const targetCode = savedSolution ? savedSolution.code : '';

  useEffect(() => {
    if (!isTimedOut) {
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.6 }
      });
    }
  }, [isTimedOut]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="w-full h-full flex flex-col overflow-hidden bg-slate-900 text-slate-100 p-6 text-xs">
      {/* Top Results Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3.5">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center border font-bold ${
            isTimedOut 
              ? 'bg-rose-500/20 text-rose-400 border-rose-500/40' 
              : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
          }`}>
            {isTimedOut ? <Clock size={20} /> : <Trophy size={20} />}
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-100 flex items-center gap-2 font-heading">
              <span>{isTimedOut ? 'Time Expired!' : 'Recall Blitz Completed!'}</span>
              <span className="font-mono text-xs font-normal px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                #{question.id} {question.title}
              </span>
            </h2>
            <div className="flex items-center gap-2 text-xs text-slate-400 font-mono mt-0.5">
              <span>Time: <strong className="text-amber-400">{formatTime(timeSpentSeconds)}</strong></span>
              <span>•</span>
              <span>Language: <strong className="text-sky-400">{language === 'cpp' ? 'C++' : 'Python 3'}</strong></span>
            </div>
          </div>
        </div>

        {/* Self-Rating Grades */}
        <div className="flex items-center gap-2">
          <span className="text-slate-400 font-medium mr-1 hidden sm:inline">Recall Grade:</span>

          <button
            onClick={() => onFinish('mastered')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 font-bold transition-all active:scale-95 shadow-sm"
            title="Clean recall without hesitation (Next review in 14-30 days)"
          >
            <CheckCircle size={14} />
            <span>Mastered (Easy)</span>
          </button>

          <button
            onClick={() => onFinish('hesitant')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 font-bold transition-all active:scale-95 shadow-sm"
            title="Recalled with slight friction (Next review in 3 days)"
          >
            <AlertTriangle size={14} />
            <span>Hesitant</span>
          </button>

          <button
            onClick={() => onFinish('failed')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 font-bold transition-all active:scale-95 shadow-sm"
            title="Stuck or got logic wrong (Review tomorrow)"
          >
            <XCircle size={14} />
            <span>Needs Practice</span>
          </button>
        </div>
      </div>

      {/* Side-by-Side Comparison */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 my-4 overflow-hidden">
        
        {/* Left: Your Blitz Code */}
        <div className="flex flex-col rounded-xl border border-slate-800 bg-slate-950/80 overflow-hidden">
          <div className="px-4 py-2.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-200 flex items-center gap-1.5">
              <Code2 size={13} className="text-amber-400" />
              Your Written Recall Code
            </span>
            <span className="font-mono text-[11px] text-slate-400">
              {writtenCode.split('\n').length} lines
            </span>
          </div>
          <pre className="flex-1 p-4 font-mono text-xs overflow-auto text-slate-200 leading-relaxed">
            {writtenCode || '// No code was written'}
          </pre>
        </div>

        {/* Right: Saved Optimal Solution */}
        <div className="flex flex-col rounded-xl border border-slate-800 bg-slate-950/80 overflow-hidden">
          <div className="px-4 py-2.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-xs">
            <span className="font-semibold text-sky-300 flex items-center gap-1.5">
              <Check size={13} className="text-sky-400" />
              Saved Reference ({savedSolution?.name || 'Optimal Approach'})
            </span>
            <div className="flex items-center gap-2 font-mono text-[11px]">
              {savedSolution?.timeComplexity && (
                <span className="text-amber-400 font-semibold">{savedSolution.timeComplexity}</span>
              )}
              {savedSolution?.spaceComplexity && (
                <span className="text-purple-400 font-semibold">{savedSolution.spaceComplexity}</span>
              )}
            </div>
          </div>
          <pre className="flex-1 p-4 font-mono text-xs overflow-auto text-slate-200 leading-relaxed">
            {targetCode || '// No saved solution found'}
          </pre>
        </div>
      </div>

      {/* Intuition Note */}
      {savedSolution?.notes && (
        <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 leading-relaxed">
          <strong className="text-amber-400 mr-1.5 font-semibold">Key Intuition:</strong>
          {savedSolution.notes}
        </div>
      )}

      {/* Footer */}
      <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
        <button
          onClick={onRetry}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium transition-colors"
        >
          <RotateCcw size={13} />
          <span>Try Again (Reset 5m Timer)</span>
        </button>
      </div>
    </div>
  );
};
