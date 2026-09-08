import React, { useState } from 'react';
import { Zap, BookOpen, X, Clock, Tag, Layers, ChevronRight } from 'lucide-react';
import { Question, SupportedLanguage } from '../../types';

interface ProblemModeSelectModalProps {
  question: Question | null;
  onClose: () => void;
  onEnterViewMode: (question: Question) => void;
  onEnterTestMode: (question: Question, language: SupportedLanguage) => void;
}

export const ProblemModeSelectModal: React.FC<ProblemModeSelectModalProps> = ({
  question,
  onClose,
  onEnterViewMode,
  onEnterTestMode,
}) => {
  const [selectedLanguage, setSelectedLanguage] = useState<SupportedLanguage>('cpp');

  if (!question) return null;

  const difficultyColors = {
    Easy: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    Medium: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    Hard: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-xl rounded-2xl p-6 relative text-slate-100 shadow-2xl border border-slate-800"
        style={{
          background: 'linear-gradient(145deg, #111827, #0b0f19)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 40px -10px rgba(56, 189, 248, 0.15)'
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X size={20} />
        </button>

        {/* Problem Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
              LeetCode #{question.id}
            </span>
            <span className={`text-xs font-semibold px-2 py-0.5 rounded border ${difficultyColors[question.difficulty] || difficultyColors.Medium}`}>
              {question.difficulty}
            </span>
            <span className="text-xs text-slate-400 font-mono ml-auto">
              {question.solutions?.length || 0} saved solutions
            </span>
          </div>

          <h2 className="text-xl font-bold text-slate-100 tracking-tight">
            {question.title}
          </h2>

          {/* Tags preview */}
          {(question.userTags?.length > 0 || question.conceptIds?.length > 0) && (
            <div className="flex flex-wrap gap-1.5 mt-2.5">
              {question.conceptIds.map(c => (
                <span key={c} className="text-[11px] px-2 py-0.5 rounded-md bg-sky-500/10 text-sky-400 border border-sky-500/20 flex items-center gap-1">
                  <Layers size={10} />
                  {c}
                </span>
              ))}
              {question.userTags.map(tag => (
                <span key={tag} className="text-[11px] px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center gap-1">
                  <Tag size={10} />
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Mode Options Container */}
        <div className="space-y-3.5">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Choose Action Mode
          </div>

          {/* Test Mode Card */}
          <div className="group relative overflow-hidden rounded-xl border border-amber-500/30 bg-gradient-to-br from-amber-500/10 to-transparent p-5 hover:border-amber-500/60 transition-all">
            <div className="flex items-start justify-between gap-4 mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30 shadow-inner">
                  <Zap size={22} className="animate-pulse" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-100 flex items-center gap-2">
                    5-Minute Blitz Test Mode
                    <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      Active Recall
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Timed 5-minute distraction-free scratchpad. Test your muscle memory and logic from memory.
                  </p>
                </div>
              </div>
            </div>

            {/* Language Picker & Start */}
            <div className="flex items-center justify-between pt-3 border-t border-amber-500/20 gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 font-medium">Language:</span>
                <div className="flex bg-slate-900/90 rounded-lg p-0.5 border border-slate-700/80">
                  <button
                    onClick={() => setSelectedLanguage('python')}
                    className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                      selectedLanguage === 'python'
                        ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Python 3
                  </button>
                  <button
                    onClick={() => setSelectedLanguage('cpp')}
                    className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                      selectedLanguage === 'cpp'
                        ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    C++
                  </button>
                </div>
              </div>

              <button
                onClick={() => onEnterTestMode(question, selectedLanguage)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-all shadow-lg shadow-amber-500/20 active:scale-95"
              >
                <Clock size={14} />
                <span>Start 5-Min Blitz</span>
                <ChevronRight size={14} />
              </button>
            </div>
          </div>

          {/* View Mode Card */}
          <div 
            onClick={() => onEnterViewMode(question)}
            className="group cursor-pointer rounded-xl border border-slate-800 bg-slate-900/60 p-5 hover:border-sky-500/40 hover:bg-slate-900 transition-all flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center border border-sky-500/20">
                <BookOpen size={20} />
              </div>
              <div>
                <h3 className="font-bold text-slate-100 group-hover:text-sky-300 transition-colors">
                  View Mode (Solutions & Notes)
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Browse full problem statement, all your saved approaches, time/space complexities, and intuition.
                </p>
              </div>
            </div>

            <div className="p-2 rounded-xl text-slate-400 group-hover:text-sky-400 group-hover:translate-x-1 transition-all">
              <ChevronRight size={20} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
