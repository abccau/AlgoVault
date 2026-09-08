import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import {
  X,
  Zap,
  Copy,
  Check,
  Download,
  Edit3,
  Trash2,
  Plus,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Sparkles,
  Layers,
  Tag,
  RefreshCw,
  Loader2,
} from 'lucide-react';
import { Question, Solution, SupportedLanguage } from '../../types';
import { exportQuestionToMarkdown } from '../../services/exportService';
import { fetchLeetCodeProblem, extractStarterCode } from '../../services/leetcodeApi';
import { useToast } from '../common/Toast';
import { useConfirm } from '../common/ConfirmDialog';

interface ProblemDetailViewProps {
  question: Question;
  onClose: () => void;
  onStartBlitz: (question: Question, language: SupportedLanguage) => void;
  onUpdateQuestion: (updated: Question) => void;
  onDeleteQuestion: (id: string) => void;
}

const DIFF_BADGE: Record<string, string> = {
  Easy:   'badge-easy',
  Medium: 'badge-medium',
  Hard:   'badge-hard',
};

export const ProblemDetailView: React.FC<ProblemDetailViewProps> = ({
  question,
  onClose,
  onStartBlitz,
  onUpdateQuestion,
  onDeleteQuestion,
}) => {
  const toast = useToast();
  const { confirm } = useConfirm();
  const [activeSolutionIdx, setActiveSolutionIdx] = useState(0);
  const [copied, setCopied] = useState(false);
  const [showHints, setShowHints] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isRefetching, setIsRefetching] = useState(false);

  const isMissingContent = !question.content || question.content.includes('not retrieved automatically');

  const handleRefetch = async () => {
    setIsRefetching(true);
    try {
      const data = await fetchLeetCodeProblem(question.titleSlug || question.id);
      const starters = extractStarterCode(data.codeSnippets);
      const updated: Question = {
        ...question,
        title: data.title,
        titleSlug: data.titleSlug,
        difficulty: data.difficulty,
        content: data.content,
        topicTags: data.topicTags.length > 0 ? data.topicTags : question.topicTags,
        hints: data.hints.length > 0 ? data.hints : question.hints,
        starterCode: starters,
        updatedAt: Date.now(),
      };
      onUpdateQuestion(updated);
      toast.success(`Refreshed problem #${question.id} successfully!`);
    } catch (err: any) {
      toast.error(err.message || 'Failed to re-fetch from LeetCode');
    } finally {
      setIsRefetching(false);
    }
  };

  const solutions = question.solutions || [];
  const currentSolution = solutions[activeSolutionIdx] || null;

  const handleCopyCode = () => {
    if (!currentSolution) return;
    navigator.clipboard.writeText(currentSolution.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAddNewSolution = () => {
    const newSolution: Solution = {
      id: `sol-${Date.now()}`,
      name: `Approach ${solutions.length + 1}`,
      language: 'cpp',
      code: question.starterCode?.cpp || '#include <vector>\n\nclass Solution {\npublic:\n    void solve() {\n        \n    }\n};',
      timeComplexity: 'O(N)',
      spaceComplexity: 'O(1)',
      notes: '',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    onUpdateQuestion({ ...question, solutions: [...solutions, newSolution], updatedAt: Date.now() });
    setActiveSolutionIdx(solutions.length);
    setIsEditing(true);
  };

  const handleUpdateCurrentSolution = (field: keyof Solution, val: any) => {
    if (!currentSolution) return;
    const updatedSols = [...solutions];
    updatedSols[activeSolutionIdx] = { ...currentSolution, [field]: val, updatedAt: Date.now() };
    onUpdateQuestion({ ...question, solutions: updatedSols, updatedAt: Date.now() });
  };

  const handleDeleteCurrentSolution = () => {
    if (solutions.length <= 1) { toast.warning('Keep at least one solution.'); return; }
    const updatedSols = solutions.filter((_, i) => i !== activeSolutionIdx);
    onUpdateQuestion({ ...question, solutions: updatedSols, updatedAt: Date.now() });
    setActiveSolutionIdx(0);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)' }}
    >
      <div
        className="w-full h-full max-w-[98vw] max-h-[98vh] rounded-2xl flex flex-col overflow-hidden shadow-2xl"
        style={{
          background: '#121212',
          border: '1px solid rgba(255,255,255,0.1)',
          boxShadow: '0 32px 80px rgba(0,0,0,0.8)',
        }}
      >
        {/* ── Header Bar ── */}
        <div
          className="h-14 px-5 flex items-center justify-between gap-4 flex-shrink-0"
          style={{ background: '#171717', borderBottom: '1px solid rgba(255,255,255,0.08)' }}
        >
          <div className="flex items-center gap-3 min-w-0">
            <span
              className="font-mono text-[12px] font-bold px-2 py-1 rounded-md text-slate-400 flex-shrink-0"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
            >
              #{question.id}
            </span>
            <h2 className="font-bold text-[17px] text-slate-100 font-heading truncate">{question.title}</h2>
            <span className={`text-[11.5px] font-bold px-2 py-0.5 rounded-md flex-shrink-0 ${DIFF_BADGE[question.difficulty] || DIFF_BADGE.Medium}`}>
              {question.difficulty}
            </span>
            <a
              href={`https://leetcode.com/problems/${question.titleSlug || question.id}/`}
              target="_blank" rel="noreferrer"
              className="text-slate-600 hover:text-sky-400 flex items-center gap-1 text-[11px] transition-colors flex-shrink-0"
            >
              <ExternalLink size={12} />
            </a>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={() => onStartBlitz(question, currentSolution?.language || 'cpp')}
              className="btn-primary !text-[11.5px]"
            >
              <Zap size={13} />
              5-Min Blitz
            </button>
            <button
              onClick={() => exportQuestionToMarkdown(question)}
              className="btn-ghost !text-[11.5px]"
            >
              <Download size={13} />
              Export
            </button>
            <button
              onClick={async () => {
                const ok = await confirm({
                  title: 'Delete Problem',
                  message: `Are you sure you want to delete #${question.id} ${question.title}?`,
                  variant: 'danger'
                });
                if (ok) { onDeleteQuestion(question.id); onClose(); }
              }}
              className="btn-icon"
            >
              <Trash2 size={15} className="text-slate-500 hover:text-rose-400 transition-colors" />
            </button>
            <button onClick={onClose} className="btn-icon">
              <X size={17} className="text-slate-500 hover:text-slate-200 transition-colors" />
            </button>
          </div>
        </div>

        {/* ── Split Panes ── */}
        <div className="flex-1 grid grid-cols-12 overflow-hidden">

          {/* LEFT: Problem statement */}
          <div
            className="col-span-5 overflow-y-auto p-5 space-y-4"
            style={{ background: 'rgba(5,8,16,0.6)', borderRight: '1px solid rgba(255,255,255,0.07)' }}
          >
            {/* Concepts & tags */}
            <div className="space-y-2">
              <p className="section-label flex items-center gap-1.5">
                <Layers size={10} className="text-sky-400" />
                Concepts & Tags
              </p>
              <div className="flex flex-wrap gap-1.5">
                {question.conceptIds?.map(c => (
                  <span key={c} className="flex items-center gap-1 text-[12px] px-2 py-0.5 rounded-md font-mono"
                    style={{ background: 'rgba(56,189,248,0.1)', color: '#38bdf8', border: '1px solid rgba(56,189,248,0.22)' }}>
                    <Layers size={9} />{c}
                  </span>
                ))}
                {question.userTags?.map(t => (
                  <span key={t} className="flex items-center gap-1 text-[12px] px-2 py-0.5 rounded-md font-mono"
                    style={{ background: 'rgba(168,85,247,0.1)', color: '#c084fc', border: '1px solid rgba(168,85,247,0.22)' }}>
                    <Tag size={9} />{t}
                  </span>
                ))}
                {question.topicTags?.map(t => (
                  <span key={t} className="text-[11.5px] px-1.5 py-0.5 rounded text-slate-500"
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Problem description */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="section-label">Problem Statement</p>
                <button
                  onClick={handleRefetch}
                  disabled={isRefetching}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all disabled:opacity-50"
                  style={{
                    background: isMissingContent ? 'rgba(56,189,248,0.15)' : 'rgba(255,255,255,0.05)',
                    color: isMissingContent ? '#38bdf8' : '#94a3b8',
                    border: isMissingContent ? '1px solid rgba(56,189,248,0.3)' : '1px solid rgba(255,255,255,0.08)',
                  }}
                >
                  {isRefetching ? <Loader2 size={11} className="animate-spin" /> : <RefreshCw size={11} />}
                  {isRefetching ? 'Fetching…' : isMissingContent ? 'Fetch from LeetCode' : 'Re-fetch'}
                </button>
              </div>
              <div
                className="lc-content p-4 rounded-xl"
                style={{ background: 'rgba(13,17,23,0.8)', border: '1px solid rgba(255,255,255,0.07)' }}
                dangerouslySetInnerHTML={{ __html: question.content || '<p>No description provided.</p>' }}
              />
            </div>

            {/* Hints */}
            {question.hints && question.hints.length > 0 && (
              <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.07)' }}>
                <button
                  onClick={() => setShowHints(!showHints)}
                  className="w-full px-4 py-2.5 flex items-center justify-between text-[12px] font-semibold text-slate-300 hover:text-white transition-colors"
                  style={{ background: 'rgba(13,17,23,0.7)' }}
                >
                  <div className="flex items-center gap-2">
                    <HelpCircle size={13} className="text-amber-400" />
                    Hints ({question.hints.length})
                  </div>
                  {showHints ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                </button>
                {showHints && (
                  <div
                    className="p-4 space-y-2"
                    style={{ background: 'rgba(10,14,24,0.8)', borderTop: '1px solid rgba(255,255,255,0.07)' }}
                  >
                    {question.hints.map((h, i) => (
                      <div key={i} className="p-3 rounded-lg text-[12px] text-slate-300 leading-relaxed"
                        style={{ background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.15)' }}>
                        <span className="text-amber-400 font-bold mr-1.5">Hint {i + 1}:</span>
                        <span dangerouslySetInnerHTML={{ __html: h }} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="col-span-7 flex flex-col overflow-hidden" style={{ background: '#0a0a0a' }}>

            <div
              className="px-4 pt-2.5 flex items-center justify-between gap-3 flex-shrink-0"
              style={{ background: '#171717', borderBottom: '1px solid rgba(255,255,255,0.07)' }}
            >
              <div className="flex items-center gap-1 overflow-x-auto pb-2">
                {solutions.map((sol, idx) => (
                  <button
                    key={sol.id || idx}
                    onClick={() => { setActiveSolutionIdx(idx); setIsEditing(false); }}
                    className={`px-3 py-1.5 rounded-lg text-[13px] font-medium flex items-center gap-1.5 whitespace-nowrap transition-all ${
                      activeSolutionIdx === idx
                        ? 'text-sky-400 font-semibold'
                        : 'text-slate-500 hover:text-slate-300'
                    }`}
                    style={activeSolutionIdx === idx ? {
                      background: 'rgba(56,189,248,0.1)',
                      border: '1px solid rgba(56,189,248,0.25)',
                    } : {}}
                  >
                    <span
                      className="text-[10.5px] font-mono px-1.5 py-0.5 rounded font-bold"
                      style={{ background: 'rgba(255,255,255,0.07)', color: sol.language === 'cpp' ? '#fb923c' : '#4ade80' }}
                    >
                      {sol.language === 'cpp' ? 'C++' : 'Py3'}
                    </span>
                    <span className="truncate max-w-[120px]">{sol.name || `Approach ${idx + 1}`}</span>
                  </button>
                ))}
                <button
                  onClick={handleAddNewSolution}
                  className="px-2.5 py-1.5 rounded-lg text-[12px] text-slate-600 hover:text-sky-400 border border-dashed transition-all flex items-center gap-1 whitespace-nowrap mb-2"
                  style={{ borderColor: 'rgba(255,255,255,0.1)' }}
                >
                  <Plus size={12} />
                  New
                </button>
              </div>

              {/* Toolbar */}
              <div className="flex items-center gap-1.5 pb-2 flex-shrink-0">
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                    isEditing
                      ? 'text-amber-300 border border-amber-500/40'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                  style={isEditing ? { background: 'rgba(245,158,11,0.12)' } : {}}
                >
                  <Edit3 size={12} />
                  {isEditing ? 'Editing' : 'Edit'}
                </button>
                <button onClick={handleCopyCode} className="btn-icon !p-1.5">
                  {copied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                </button>
                {solutions.length > 1 && (
                  <button onClick={handleDeleteCurrentSolution} className="btn-icon !p-1.5">
                    <Trash2 size={13} className="text-slate-600 hover:text-rose-400 transition-colors" />
                  </button>
                )}
              </div>
            </div>

            {/* Solution meta bar */}
            {currentSolution && (
              <div
                className="px-4 py-2.5 flex items-center justify-between gap-4 flex-shrink-0 text-[13px]"
                style={{ background: 'rgba(13,17,23,0.5)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}
              >
                {isEditing ? (
                  <div className="w-full grid grid-cols-4 gap-2">
                    <input
                      type="text"
                      value={currentSolution.name}
                      onChange={e => handleUpdateCurrentSolution('name', e.target.value)}
                      placeholder="Approach name..."
                      className="input-base col-span-2"
                    />
                    <select
                      value={currentSolution.language}
                      onChange={e => handleUpdateCurrentSolution('language', e.target.value as SupportedLanguage)}
                      className="input-base"
                    >
                      <option value="cpp">C++</option>
                      <option value="python">Python 3</option>
                    </select>
                    <div className="flex gap-1.5">
                      <input
                        type="text"
                        value={currentSolution.timeComplexity || ''}
                        onChange={e => handleUpdateCurrentSolution('timeComplexity', e.target.value)}
                        placeholder="O(N)"
                        className="input-base text-amber-300 font-mono w-1/2"
                      />
                      <input
                        type="text"
                        value={currentSolution.spaceComplexity || ''}
                        onChange={e => handleUpdateCurrentSolution('spaceComplexity', e.target.value)}
                        placeholder="O(1)"
                        className="input-base text-purple-300 font-mono w-1/2"
                      />
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="font-semibold text-slate-200 truncate text-[13px]">{currentSolution.name}</span>
                      <span
                        className="text-[11px] font-mono font-bold px-1.5 py-0.5 rounded flex-shrink-0"
                        style={{
                          background: 'rgba(255,255,255,0.07)',
                          color: currentSolution.language === 'cpp' ? '#fb923c' : '#4ade80',
                        }}
                      >
                        {currentSolution.language === 'cpp' ? 'C++17' : 'Python 3'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 font-mono font-semibold text-[12px]">
                      {currentSolution.timeComplexity && (
                        <span className="px-2 py-0.5 rounded-md"
                          style={{ background: 'rgba(245,158,11,0.12)', color: '#fbbf24', border: '1px solid rgba(245,158,11,0.25)' }}>
                          T: {currentSolution.timeComplexity}
                        </span>
                      )}
                      {currentSolution.spaceComplexity && (
                        <span className="px-2 py-0.5 rounded-md"
                          style={{ background: 'rgba(168,85,247,0.12)', color: '#c084fc', border: '1px solid rgba(168,85,247,0.25)' }}>
                          S: {currentSolution.spaceComplexity}
                        </span>
                      )}
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Code editor */}
            <div className="flex-1 min-h-[200px]" style={{ background: '#080b12' }}>
              {currentSolution && (
                <Editor
                  height="100%"
                  language={currentSolution.language === 'cpp' ? 'cpp' : 'python'}
                  theme="vs-dark"
                  value={currentSolution.code}
                  onChange={(val) => { if (isEditing && val !== undefined) handleUpdateCurrentSolution('code', val); }}
                  options={{
                    readOnly: !isEditing,
                    fontSize: 13.5,
                    fontFamily: "'Fira Code', monospace",
                    fontLigatures: true,
                    minimap: { enabled: false },
                    scrollBeyondLastLine: false,
                    padding: { top: 14, bottom: 14 },
                    lineNumbersMinChars: 3,
                    renderLineHighlight: isEditing ? 'all' : 'none',
                  }}
                />
              )}
            </div>

            {/* Notes footer */}
            {currentSolution && (
              <div
                className="px-4 py-3 flex-shrink-0"
                style={{ background: '#0d1117', borderTop: '1px solid rgba(255,255,255,0.07)' }}
              >
                <p className="section-label flex items-center gap-1.5 mb-2">
                  <Sparkles size={10} className="text-amber-400" />
                  Intuition & Notes
                </p>
                {isEditing ? (
                  <textarea
                    value={currentSolution.notes || ''}
                    onChange={e => handleUpdateCurrentSolution('notes', e.target.value)}
                    placeholder="Key logic, edge cases, step-by-step walkthrough..."
                    rows={2}
                    className="input-base !rounded-lg resize-none"
                  />
                ) : (
                  <p className="text-[13px] text-slate-400 leading-relaxed">
                    {currentSolution.notes || (
                      <span className="text-slate-600 italic">No notes — click Edit to add intuition notes.</span>
                    )}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
