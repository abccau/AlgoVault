import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import {
  X,
  Search,
  Loader2,
  Plus,
  Check,
  Code2,
  Sparkles,
  Layers,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { Concept, Question, Solution, SupportedLanguage } from '../../types';
import { fetchLeetCodeProblem, extractStarterCode } from '../../services/leetcodeApi';
import { useToast } from '../common/Toast';

interface ProblemAddModalProps {
  concepts: Concept[];
  preselectedConceptId?: string;
  onClose: () => void;
  onSave: (question: Question) => void;
}

export const ProblemAddModal: React.FC<ProblemAddModalProps> = ({
  concepts,
  preselectedConceptId,
  onClose,
  onSave,
}) => {
  const toast = useToast();
  const [query, setQuery] = useState('');
  const [isFetching, setIsFetching] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [fetchSuccess, setFetchSuccess] = useState(false);

  const [problemId, setProblemId] = useState('');
  const [title, setTitle] = useState('');
  const [titleSlug, setTitleSlug] = useState('');
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Medium');
  const [content, setContent] = useState('');
  const [topicTags, setTopicTags] = useState<string[]>([]);
  const [hints, setHints] = useState<string[]>([]);
  const [starterCode, setStarterCode] = useState<{ python: string; cpp: string }>({
    cpp: '#include <vector>\n#include <iostream>\n\nclass Solution {\npublic:\n    void solve() {\n        \n    }\n};',
    python: 'class Solution:\n    def solve(self):\n        pass',
  });

  const [selectedConceptIds, setSelectedConceptIds] = useState<string[]>(
    preselectedConceptId ? [preselectedConceptId] : []
  );
  const [customTagInput, setCustomTagInput] = useState('');
  const [userTags, setUserTags] = useState<string[]>(['Blind 75']);

  const [solutions, setSolutions] = useState<Solution[]>([
    {
      id: `sol-${Date.now()}`,
      name: 'Approach 1: Optimal',
      language: 'cpp',
      code: 'class Solution:\n    def solve(self):\n        pass',
      timeComplexity: 'O(N)',
      spaceComplexity: 'O(1)',
      notes: '',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
  ]);
  const [activeSolIdx, setActiveSolIdx] = useState(0);

  const handleFetch = async () => {
    if (!query.trim()) return;
    setIsFetching(true);
    setFetchError(null);
    setFetchSuccess(false);
    try {
      const data = await fetchLeetCodeProblem(query);
      setProblemId(data.id);
      setTitle(data.title);
      setTitleSlug(data.titleSlug);
      setDifficulty(data.difficulty);
      setContent(data.content);
      setTopicTags(data.topicTags);
      setHints(data.hints);
      const starters = extractStarterCode(data.codeSnippets);
      setStarterCode(starters);

      const autoConceptIds: string[] = [...selectedConceptIds];
      data.topicTags.forEach(topic => {
        const found = concepts.find(c =>
          c.name.toLowerCase().includes(topic.toLowerCase()) ||
          topic.toLowerCase().includes(c.name.toLowerCase())
        );
        if (found && !autoConceptIds.includes(found.id)) autoConceptIds.push(found.id);
      });
      setSelectedConceptIds(autoConceptIds);

      setSolutions([{
        id: `sol-py-${Date.now()}`,
        name: 'Approach 1 (Python)',
        language: 'cpp',
        code: starters.cpp,
        timeComplexity: 'O(N)',
        spaceComplexity: 'O(1)',
        notes: '',
        createdAt: Date.now(),
        updatedAt: Date.now(),
      }]);
      setFetchSuccess(true);
    } catch (err: any) {
      setFetchError(err.message || 'Failed to fetch');
    } finally {
      setIsFetching(false);
    }
  };

  const toggleConcept = (id: string) =>
    setSelectedConceptIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );

  const handleAddTag = () => {
    const t = customTagInput.trim();
    if (t && !userTags.includes(t)) { setUserTags([...userTags, t]); setCustomTagInput(''); }
  };

  const handleAddSolution = () => {
    const lang: SupportedLanguage = solutions[activeSolIdx]?.language === 'cpp' ? 'python' : 'cpp';
    const newSol: Solution = {
      id: `sol-${Date.now()}-${solutions.length}`,
      name: `Approach ${solutions.length + 1} (${lang === 'cpp' ? 'C++' : 'Python'})`,
      language: lang,
      code: lang === 'cpp' ? starterCode.cpp : starterCode.python,
      timeComplexity: 'O(N)',
      spaceComplexity: 'O(1)',
      notes: '',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setSolutions([...solutions, newSol]);
    setActiveSolIdx(solutions.length);
  };

  const updateActiveSolution = (field: keyof Solution, val: any) => {
    const updated = [...solutions];
    updated[activeSolIdx] = { ...updated[activeSolIdx], [field]: val, updatedAt: Date.now() };
    setSolutions(updated);
  };

  const removeSolution = (idx: number) => {
    if (solutions.length <= 1) return;
    setSolutions(solutions.filter((_, i) => i !== idx));
    setActiveSolIdx(Math.max(0, idx - 1));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!problemId.trim() || !title.trim()) { toast.warning('Problem number and title are required.'); return; }
    const newQuestion: Question = {
      id: problemId.trim(),
      title: title.trim(),
      titleSlug: titleSlug.trim() || title.toLowerCase().replace(/\s+/g, '-'),
      difficulty,
      content,
      topicTags,
      conceptIds: selectedConceptIds.length > 0 ? selectedConceptIds : ['two-pointers'],
      userTags,
      starterCode,
      solutions,
      hints,
      masteryStatus: 'new',
      intervalDays: 1,
      attemptsCount: 0,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    onSave(newQuestion);
  };

  const currentSol = solutions[activeSolIdx] || solutions[0];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)' }}
    >
      <div
        className="w-full h-full max-w-[1100px] max-h-[92vh] rounded-2xl flex flex-col overflow-hidden shadow-2xl"
        style={{
          background: '#121212',
          border: '1px solid rgba(255,255,255,0.1)',
          boxShadow: '0 32px 80px rgba(0,0,0,0.8)',
        }}
      >
        {/* Header */}
        <div
          className="h-14 px-6 flex items-center justify-between gap-4 flex-shrink-0"
          style={{ background: '#171717', borderBottom: '1px solid rgba(255,255,255,0.08)' }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.3)' }}
            >
              <Plus size={15} className="text-amber-400" />
            </div>
            <div>
              <h2 className="font-bold text-[14px] text-slate-100 font-heading leading-tight">Add LeetCode Problem</h2>
              <p className="text-[10.5px] text-slate-500">Auto-fetch & attach to concept graph</p>
            </div>
          </div>
          <button onClick={onClose} className="btn-icon"><X size={17} /></button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          <div className="p-5 space-y-5">

            {/* ── Step 1: Fetch ── */}
            <div className="p-4 space-y-3" style={{ background: '#171717', borderRadius: 12, border: '1px solid rgba(255,255,255,0.06)' }}>
              <p className="section-label flex items-center gap-1.5">
                <Search size={10} className="text-sky-400" />
                Step 1 — Auto-fetch from LeetCode
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleFetch(); } }}
                  placeholder='Enter problem number (e.g. "1"), slug ("two-sum"), or paste LeetCode URL…'
                  className="input-base flex-1"
                />
                <button
                  type="button"
                  onClick={handleFetch}
                  disabled={isFetching || !query.trim()}
                  className="btn-sky !text-[12px] !font-bold disabled:opacity-50 flex-shrink-0"
                >
                  {isFetching ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
                  Fetch
                </button>
              </div>

              {fetchSuccess && (
                <div className="flex items-center gap-2 text-[11.5px] text-emerald-400 px-3 py-2 rounded-lg"
                  style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)' }}>
                  <CheckCircle2 size={14} />
                  Fetched <strong className="font-semibold mx-0.5">#{problemId} {title}</strong> ({difficulty})
                </div>
              )}
              {fetchError && (
                <div className="flex items-center gap-2 text-[11.5px] text-rose-400 px-3 py-2 rounded-lg"
                  style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
                  <AlertCircle size={14} />
                  {fetchError}
                </div>
              )}
            </div>

            {/* ── Step 2: Problem meta ── */}
            <div className="grid grid-cols-12 gap-3">
              <div className="col-span-2">
                <label className="section-label block mb-1.5"># Number</label>
                <input type="text" value={problemId} onChange={e => setProblemId(e.target.value)} placeholder="1" required className="input-base font-mono" />
              </div>
              <div className="col-span-7">
                <label className="section-label block mb-1.5">Problem Title</label>
                <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Two Sum" required className="input-base" />
              </div>
              <div className="col-span-3">
                <label className="section-label block mb-1.5">Difficulty</label>
                <select
                  value={difficulty}
                  onChange={e => setDifficulty(e.target.value as any)}
                  className="input-base appearance-none"
                >
                  <option value="Easy">🟢 Easy</option>
                  <option value="Medium">🟡 Medium</option>
                  <option value="Hard">🔴 Hard</option>
                </select>
              </div>
            </div>

            {/* ── Step 3: Concepts ── */}
            <div className="space-y-2">
              <p className="section-label flex items-center gap-1.5">
                <Layers size={10} className="text-purple-400" />
                Step 2 — Assign to Concept Hubs
              </p>
              <div
                className="flex flex-wrap gap-1.5 p-3 rounded-xl max-h-28 overflow-y-auto"
                style={{ background: 'rgba(13,17,23,0.8)', border: '1px solid rgba(255,255,255,0.07)' }}
              >
                {concepts.map(concept => {
                  const isSelected = selectedConceptIds.includes(concept.id);
                  return (
                    <button
                      key={concept.id}
                      type="button"
                      onClick={() => toggleConcept(concept.id)}
                      className="px-2.5 py-1 rounded-lg text-[11.5px] font-medium transition-all"
                      style={isSelected ? {
                        background: `${concept.color}20`,
                        color: concept.color,
                        border: `1.5px solid ${concept.color}50`,
                      } : {
                        background: 'rgba(255,255,255,0.04)',
                        color: '#64748b',
                        border: '1px solid rgba(255,255,255,0.07)',
                      }}
                    >
                      {isSelected && <Check size={11} className="inline mr-1" />}
                      {concept.name}
                    </button>
                  );
                })}
              </div>
              {/* Custom tags */}
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={customTagInput}
                  onChange={e => setCustomTagInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddTag(); } }}
                  placeholder='Add custom tag (e.g. "Blind 75", "NeetCode 150") and press Enter'
                  className="input-base flex-1"
                />
                <div className="flex flex-wrap gap-1">
                  {userTags.map(t => (
                    <span key={t} className="px-2 py-0.5 rounded-md text-[11px] flex items-center gap-1 font-medium"
                      style={{ background: 'rgba(168,85,247,0.12)', color: '#c084fc', border: '1px solid rgba(168,85,247,0.25)' }}>
                      {t}
                      <button type="button" onClick={() => setUserTags(userTags.filter(x => x !== t))} className="hover:text-rose-400">
                        <X size={10} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* ── Step 4: Solutions ── */}
            <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.07)' }}>
              <div
                className="px-4 py-3 flex items-center justify-between"
                style={{ background: 'rgba(13,17,23,0.8)', borderBottom: '1px solid rgba(255,255,255,0.07)' }}
              >
                <p className="section-label flex items-center gap-1.5">
                  <Code2 size={10} className="text-sky-400" />
                  Step 3 — Solutions & Code ({solutions.length})
                </p>
                <button type="button" onClick={handleAddSolution} className="btn-sky !py-1 !px-2.5 !text-[11px]">
                  <Plus size={12} />
                  Add Approach
                </button>
              </div>

              {/* Solution tabs */}
              <div
                className="px-3 pt-2 flex items-center gap-1 overflow-x-auto"
                style={{ background: '#080b12', borderBottom: '1px solid rgba(255,255,255,0.06)' }}
              >
                {solutions.map((sol, idx) => (
                  <div key={sol.id || idx} className="flex items-center flex-shrink-0">
                    <button
                      type="button"
                      onClick={() => setActiveSolIdx(idx)}
                      className={`px-3 py-1.5 text-[11.5px] font-medium rounded-t-lg transition-all ${
                        activeSolIdx === idx
                          ? 'text-sky-400 bg-[#0d1117] border-t border-x border-sky-500/25 font-semibold'
                          : 'text-slate-500 hover:text-slate-300'
                      }`}
                    >
                      {sol.name || `Approach ${idx + 1}`}
                    </button>
                    {solutions.length > 1 && (
                      <button type="button" onClick={() => removeSolution(idx)} className="text-slate-600 hover:text-rose-400 px-1">
                        <X size={11} />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {currentSol && (
                <div className="p-4 space-y-3" style={{ background: '#0d1117' }}>
                  <div className="grid grid-cols-4 gap-2">
                    <input type="text" value={currentSol.name} onChange={e => updateActiveSolution('name', e.target.value)} placeholder="Approach title..." className="input-base col-span-2" />
                    <select value={currentSol.language} onChange={e => {
                      const l = e.target.value as SupportedLanguage;
                      updateActiveSolution('language', l);
                      if (currentSol.code === starterCode.python || currentSol.code === starterCode.cpp) {
                        updateActiveSolution('code', l === 'cpp' ? starterCode.cpp : starterCode.python);
                      }
                    }} className="input-base font-mono">
                      <option value="cpp">C++</option>
                      <option value="python">Python 3</option>
                    </select>
                    <div className="flex gap-1.5">
                      <input type="text" value={currentSol.timeComplexity} onChange={e => updateActiveSolution('timeComplexity', e.target.value)} placeholder="O(N)" className="input-base text-amber-300 font-mono w-1/2" />
                      <input type="text" value={currentSol.spaceComplexity} onChange={e => updateActiveSolution('spaceComplexity', e.target.value)} placeholder="O(1)" className="input-base text-purple-300 font-mono w-1/2" />
                    </div>
                  </div>

                  <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
                    <Editor
                      height="260px"
                      language={currentSol.language === 'cpp' ? 'cpp' : 'python'}
                      theme="vs-dark"
                      value={currentSol.code}
                      onChange={(val) => updateActiveSolution('code', val || '')}
                      options={{
                        fontSize: 13,
                        fontFamily: "'Fira Code', monospace",
                        fontLigatures: true,
                        minimap: { enabled: false },
                        padding: { top: 12, bottom: 12 },
                        lineNumbersMinChars: 3,
                        scrollBeyondLastLine: false,
                      }}
                    />
                  </div>

                  <textarea
                    value={currentSol.notes}
                    onChange={e => updateActiveSolution('notes', e.target.value)}
                    placeholder="Notes, intuition, edge cases..."
                    rows={2}
                    className="input-base resize-none"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div
            className="px-5 py-3.5 flex items-center justify-end gap-3 flex-shrink-0"
            style={{ background: '#0d1117', borderTop: '1px solid rgba(255,255,255,0.07)' }}
          >
            <button type="button" onClick={onClose} className="btn-ghost">Cancel</button>
            <button type="submit" className="btn-primary !text-[12px]">
              <Check size={14} />
              Save Problem
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
