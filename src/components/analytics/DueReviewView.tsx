import React from 'react';
import { Zap, Clock, CheckCircle, RotateCcw, Calendar } from 'lucide-react';
import { Question, SupportedLanguage } from '../../types';

interface DueReviewViewProps {
  questions: Question[];
  onLaunchBlitz: (question: Question, language: SupportedLanguage) => void;
}

const DIFF_DOT: Record<string, string> = {
  Easy:   '#22c55e',
  Medium: '#f59e0b',
  Hard:   '#ef4444',
};

export const DueReviewView: React.FC<DueReviewViewProps> = ({ questions, onLaunchBlitz }) => {
  const now = Date.now();
  const dueQuestions = questions
    .filter(q => !q.nextReviewDue || q.nextReviewDue <= now)
    .sort((a, b) => (a.nextReviewDue || 0) - (b.nextReviewDue || 0));

  const upcomingQuestions = questions
    .filter(q => q.nextReviewDue && q.nextReviewDue > now)
    .sort((a, b) => (a.nextReviewDue || 0) - (b.nextReviewDue || 0))
    .slice(0, 5);

  const formatDaysUntil = (ts: number) => {
    const diff = Math.ceil((ts - now) / (1000 * 60 * 60 * 24));
    if (diff <= 1) return 'Tomorrow';
    return `In ${diff} days`;
  };

  return (
    <div className="w-full h-full overflow-y-auto" style={{ background: '#121212' }}>
      <div className="max-w-3xl mx-auto px-6 py-6">

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.3)' }}
          >
            <Clock size={20} className="text-amber-400" />
          </div>
          <div>
            <h2 className="font-bold text-[17px] text-slate-100 font-heading flex items-center gap-2">
              Spaced Recall Queue
              {dueQuestions.length > 0 && (
                <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-full badge-medium">
                  {dueQuestions.length} due
                </span>
              )}
            </h2>
            <p className="text-[12px] text-slate-500 mt-0.5">
              Recall from memory — testing yourself resets your forgetting curve
            </p>
          </div>
        </div>

        {dueQuestions.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center py-16 rounded-2xl text-center"
            style={{ border: '1px dashed rgba(34,197,94,0.2)', background: 'rgba(34,197,94,0.03)' }}
          >
            <CheckCircle size={36} className="text-emerald-400 mb-3" />
            <p className="font-bold text-slate-200 text-[15px] font-heading">All caught up! 🎉</p>
            <p className="text-[12px] text-slate-500 mt-1 max-w-xs">
              No problems due for review today. Keep it up!
            </p>
            {upcomingQuestions.length > 0 && (
              <div className="mt-6 w-full max-w-sm space-y-2">
                <p className="section-label mb-3 flex items-center gap-1.5 justify-center">
                  <Calendar size={10} className="text-sky-400" />
                  Coming up soon
                </p>
                {upcomingQuestions.map(q => (
                  <div key={q.id} className="flex items-center justify-between px-3 py-2 rounded-xl"
                    style={{ background: '#121212', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div className="flex items-center gap-2 text-[12px]">
                      <span className="font-mono text-slate-600">#{q.id}</span>
                      <span className="text-slate-300 font-medium truncate max-w-[160px]">{q.title}</span>
                    </div>
                    <span className="text-[11px] text-slate-500">{formatDaysUntil(q.nextReviewDue!)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            {dueQuestions.map((q) => {
              const overdueDays = q.nextReviewDue
                ? Math.max(0, Math.floor((now - q.nextReviewDue) / (1000 * 60 * 60 * 24)))
                : 0;

              return (
                <div
                  key={q.id}
                  className="rounded-xl flex items-center gap-4 px-4 py-3.5 transition-all"
                  style={{
                    background: 'rgba(245,158,11,0.04)',
                    border: '1px solid rgba(245,158,11,0.2)',
                  }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(245,158,11,0.07)'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'rgba(245,158,11,0.04)'}
                >
                  {/* ID */}
                  <span className="font-mono text-[11px] font-bold text-slate-600 w-9 text-right flex-shrink-0">
                    #{q.id}
                  </span>

                  {/* Diff dot */}
                  <span
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: DIFF_DOT[q.difficulty] || DIFF_DOT.Medium }}
                  />

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-[13.5px] text-slate-200 truncate">{q.title}</p>
                    <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-500">
                      <span>{q.difficulty}</span>
                      <span>·</span>
                      <div className="flex items-center gap-1">
                        <RotateCcw size={9} />
                        <span>Interval: {q.intervalDays || 1}d</span>
                      </div>
                      {overdueDays > 0 && (
                        <>
                          <span>·</span>
                          <span className="text-amber-400 font-semibold">{overdueDays}d overdue</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => onLaunchBlitz(q, 'cpp')}
                      className="btn-primary !text-[11px] !py-1.5"
                    >
                      <Zap size={12} />
                      Python
                    </button>
                    <button
                      onClick={() => onLaunchBlitz(q, 'cpp')}
                      className="btn-ghost !text-[11px] !py-1.5"
                    >
                      <Zap size={12} />
                      C++
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
