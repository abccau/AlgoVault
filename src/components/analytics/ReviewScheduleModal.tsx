import React from 'react';
import { X, Clock, Zap, Calendar } from 'lucide-react';
import { Question, SupportedLanguage } from '../../types';

interface ReviewScheduleModalProps {
  questions: Question[];
  onClose: () => void;
  onLaunchBlitz: (question: Question, language: SupportedLanguage) => void;
}

export const ReviewScheduleModal: React.FC<ReviewScheduleModalProps> = ({
  questions,
  onClose,
  onLaunchBlitz,
}) => {
  const now = Date.now();

  const dueQuestions = questions.filter(
    (q) => !q.nextReviewDue || q.nextReviewDue <= now
  );

  const upcomingQuestions = questions
    .filter((q) => q.nextReviewDue && q.nextReviewDue > now)
    .sort((a, b) => (a.nextReviewDue || 0) - (b.nextReviewDue || 0));

  const formatDueIn = (timestamp?: number) => {
    if (!timestamp || timestamp <= now) return 'Due Now';
    const diffHours = Math.round((timestamp - now) / (1000 * 60 * 60));
    if (diffHours < 24) return `In ${diffHours} hours`;
    const diffDays = Math.round(diffHours / 24);
    return `In ${diffDays} days`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full h-full max-w-4xl max-h-[88vh] rounded-2xl flex flex-col overflow-hidden text-slate-100 shadow-2xl border border-slate-800"
        style={{ background: 'linear-gradient(175deg, #111827 0%, #0b0f19 100%)' }}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <Clock size={20} />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
                Spaced Repetition & Recall Queue
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {dueQuestions.length} Due Today
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Active recall testing prevents memory decay and builds rock-solid intuition
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content list */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Due Questions Section */}
          <div>
            <h3 className="text-xs font-semibold text-amber-400 uppercase tracking-wider flex items-center gap-1.5 mb-3">
              <Zap size={14} className="animate-pulse" />
              Ready for 5-Minute Recall ({dueQuestions.length})
            </h3>

            {dueQuestions.length === 0 ? (
              <div className="p-8 rounded-xl border border-slate-800 bg-slate-900/30 text-center text-slate-400 text-sm">
                🎉 Awesome work! All your problems are up to date in the spaced recall cycle.
              </div>
            ) : (
              <div className="space-y-2.5">
                {dueQuestions.map((q) => (
                  <div
                    key={q.id}
                    className="p-4 rounded-xl border border-amber-500/30 bg-slate-900/60 flex items-center justify-between gap-4 hover:border-amber-500/60 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono font-bold px-2 py-1 rounded bg-slate-800 text-slate-300">
                        #{q.id}
                      </span>
                      <div>
                        <h4 className="font-semibold text-sm text-slate-100">
                          {q.title}
                        </h4>
                        <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                          <span className="text-amber-400 font-semibold">{q.difficulty}</span>
                          <span>•</span>
                          <span>{q.conceptIds.join(', ')}</span>
                          <span>•</span>
                          <span>Interval: {q.intervalDays || 1}d</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          onLaunchBlitz(q, 'python');
                          onClose();
                        }}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-all shadow-md active:scale-95"
                      >
                        <Zap size={13} />
                        <span>Blitz (PY)</span>
                      </button>
                      <button
                        onClick={() => {
                          onLaunchBlitz(q, 'cpp');
                          onClose();
                        }}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs transition-all active:scale-95"
                      >
                        <Zap size={13} />
                        <span>Blitz (C++)</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Upcoming Reviews */}
          {upcomingQuestions.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 mb-3">
                <Calendar size={14} className="text-sky-400" />
                Upcoming Reviews ({upcomingQuestions.length})
              </h3>
              <div className="space-y-2">
                {upcomingQuestions.map((q) => (
                  <div
                    key={q.id}
                    className="p-3 rounded-xl border border-slate-800 bg-slate-900/30 flex items-center justify-between text-xs text-slate-300"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono text-slate-400">#{q.id}</span>
                      <span className="font-medium text-slate-200">{q.title}</span>
                      <span className="text-[11px] text-slate-500">({q.difficulty})</span>
                    </div>
                    <span className="text-sky-400 font-mono text-[11px] bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/20">
                      {formatDueIn(q.nextReviewDue)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
