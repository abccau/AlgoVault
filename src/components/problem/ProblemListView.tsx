import React from 'react';
import {
  Zap,
  BookOpen,
  Code2,
  Layers,
  Tag,
  Clock,
  CheckCircle,
  Circle,
  RotateCcw,
} from 'lucide-react';
import { Question, SupportedLanguage } from '../../types';

interface ProblemListViewProps {
  questions: Question[];
  searchQuery: string;
  selectedConceptId?: string | null;
  onSelectQuestion: (question: Question) => void;
  onLaunchBlitz: (question: Question, lang: SupportedLanguage) => void;
}

const DIFF_BADGE: Record<string, string> = {
  Easy:   'badge-easy',
  Medium: 'badge-medium',
  Hard:   'badge-hard',
};

const DIFF_DOT: Record<string, string> = {
  Easy:   '#22c55e',
  Medium: '#f59e0b',
  Hard:   '#ef4444',
};

const MASTERY_ICON: Record<string, React.ReactNode> = {
  new:       <Circle size={13} className="text-slate-600" />,
  learning:  <RotateCcw size={13} className="text-sky-400" />,
  reviewing: <Clock size={13} className="text-amber-400" />,
  mastered:  <CheckCircle size={13} className="text-emerald-400" />,
};

export const ProblemListView: React.FC<ProblemListViewProps> = ({
  questions,
  searchQuery,
  selectedConceptId,
  onSelectQuestion,
  onLaunchBlitz,
}) => {
  const filtered = questions.filter((q) => {
    const matchesSearch =
      !searchQuery ||
      q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.id.includes(searchQuery) ||
      (q.userTags || []).some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (q.topicTags || []).some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesConcept = !selectedConceptId || q.conceptIds.includes(selectedConceptId);
    return matchesSearch && matchesConcept;
  });

  // Sort: due first, then by ID numerically
  const sorted = [...filtered].sort((a, b) => {
    const aDue = a.nextReviewDue && a.nextReviewDue <= Date.now();
    const bDue = b.nextReviewDue && b.nextReviewDue <= Date.now();
    if (aDue && !bDue) return -1;
    if (!aDue && bDue) return 1;
    return parseInt(a.id) - parseInt(b.id);
  });

  return (
    <div className="w-full h-full overflow-y-auto" style={{ background: '#080b12' }}>
      <div className="max-w-5xl mx-auto px-6 py-6">

        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="font-bold text-[17px] text-slate-100 font-heading">Problem Catalog</h2>
            <p className="text-[12px] text-slate-500 mt-0.5">
              {sorted.length} problem{sorted.length !== 1 ? 's' : ''}
              {searchQuery && ` matching "${searchQuery}"`}
            </p>
          </div>
          {/* Stats row */}
          <div className="flex items-center gap-3 text-[11px] text-slate-500">
            {(['Easy', 'Medium', 'Hard'] as const).map(d => {
              const count = filtered.filter(q => q.difficulty === d).length;
              return (
                <div key={d} className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: DIFF_DOT[d] }} />
                  <span className={`font-semibold ${d === 'Easy' ? 'text-emerald-400' : d === 'Medium' ? 'text-amber-400' : 'text-red-400'}`}>{count}</span>
                  <span className="text-slate-600">{d}</span>
                </div>
              );
            })}
          </div>
        </div>

        {sorted.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center py-20 rounded-2xl text-center"
            style={{ border: '1px dashed rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.02)' }}
          >
            <Code2 size={32} className="text-slate-700 mb-3" />
            <p className="text-slate-500 text-sm font-medium">No problems found</p>
            <p className="text-slate-600 text-xs mt-1">Add one with the "Add" button in the sidebar</p>
          </div>
        ) : (
          <div className="space-y-1.5">
            {sorted.map((q) => {
              const hasCpp = q.solutions?.some(s => s.language === 'cpp');
              const isDue = q.nextReviewDue && q.nextReviewDue <= Date.now();

              return (
                <div
                  key={q.id}
                  className="rounded-xl transition-all flex items-center gap-4 px-4 py-3 group"
                  style={{
                    background: isDue ? 'rgba(245,158,11,0.04)' : 'rgba(13,17,23,0.8)',
                    border: isDue ? '1px solid rgba(245,158,11,0.18)' : '1px solid rgba(255,255,255,0.06)',
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.background = 'rgba(22,32,53,0.8)';
                    (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.12)';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.background = isDue ? 'rgba(245,158,11,0.04)' : 'rgba(13,17,23,0.8)';
                    (e.currentTarget as HTMLElement).style.borderColor = isDue ? 'rgba(245,158,11,0.18)' : 'rgba(255,255,255,0.06)';
                  }}
                >
                  {/* Mastery icon */}
                  <div className="flex-shrink-0">
                    {MASTERY_ICON[q.masteryStatus || 'new']}
                  </div>

                  {/* Problem # */}
                  <span
                    className="font-mono text-[11px] font-bold text-slate-500 w-10 flex-shrink-0 text-right"
                  >
                    {q.id}
                  </span>

                  {/* Diff dot */}
                  <span
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: DIFF_DOT[q.difficulty] || DIFF_DOT.Medium }}
                  />

                  {/* Title + tags */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <button
                        onClick={() => onSelectQuestion(q)}
                        className="font-semibold text-[13px] text-slate-200 hover:text-sky-400 transition-colors text-left truncate"
                      >
                        {q.title}
                      </button>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${DIFF_BADGE[q.difficulty] || DIFF_BADGE.Medium}`}>
                        {q.difficulty}
                      </span>
                      {isDue && (
                        <span className="flex items-center gap-1 text-[10px] font-bold badge-medium px-1.5 py-0.5 rounded">
                          <Clock size={9} />
                          DUE
                        </span>
                      )}
                    </div>
                    {/* Concept / tag pills */}
                    <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                      {q.conceptIds.slice(0, 3).map(c => (
                        <span key={c} className="flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded font-mono"
                          style={{ background: 'rgba(56,189,248,0.08)', color: '#38bdf8', border: '1px solid rgba(56,189,248,0.18)' }}>
                          <Layers size={9} />
                          {c}
                        </span>
                      ))}
                      {(q.userTags || []).slice(0, 2).map(t => (
                        <span key={t} className="flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded font-mono"
                          style={{ background: 'rgba(168,85,247,0.08)', color: '#c084fc', border: '1px solid rgba(168,85,247,0.18)' }}>
                          <Tag size={9} />
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Solutions count */}
                  <div className="flex items-center gap-1 text-[11px] text-slate-600 font-mono flex-shrink-0 w-16 justify-end">
                    <Code2 size={11} />
                    <span>{q.solutions?.length || 0}</span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <button
                      onClick={() => onSelectQuestion(q)}
                      className="btn-ghost !px-2.5 !py-1.5 !text-[11px]"
                    >
                      <BookOpen size={12} />
                      View
                    </button>
                    <button
                      onClick={() => onLaunchBlitz(q, hasCpp ? 'cpp' : 'python')}
                      className="btn-primary !px-2.5 !py-1.5 !text-[11px]"
                    >
                      <Zap size={11} />
                      Blitz
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
