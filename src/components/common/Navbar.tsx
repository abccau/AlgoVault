import React, { useRef } from 'react';
import { 
  Search, 
  Plus, 
  Layers, 
  Clock, 
  Download, 
  Upload, 
  Network, 
  List
} from 'lucide-react';
import { exportDatabaseToJson, importDatabaseFromJson } from '../../services/exportService';
import { useToast } from '../common/Toast';

interface NavbarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedDifficulty: string;
  onDifficultyChange: (d: string) => void;
  activeView: 'graph' | 'list';
  onViewChange: (v: 'graph' | 'list') => void;
  dueCount: number;
  totalQuestions: number;
  onOpenAddProblem: () => void;
  onOpenAddConcept: () => void;
  onOpenReviewSchedule: () => void;
  onRefreshData: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  searchQuery,
  onSearchChange,
  selectedDifficulty,
  onDifficultyChange,
  activeView,
  onViewChange,
  dueCount,
  totalQuestions,
  onOpenAddProblem,
  onOpenAddConcept,
  onOpenReviewSchedule,
  onRefreshData,
}) => {
  const toast = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const res = await importDatabaseFromJson(file);
      toast.success(`Import successful: ${res.questionsCount} problems imported.`);
      onRefreshData();
    } catch (err: any) {
      toast.error(`Import failed: ${err.message}`);
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <header className="h-16 px-4 md:px-6 bg-[#121212]/90 backdrop-blur-md border-b border-slate-800/80 flex items-center justify-between gap-4 z-40 relative">
      
      {/* Brand Title */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-slate-950 flex items-center justify-center shadow-md shadow-amber-500/20 font-black text-sm">
          LC
        </div>
        <div className="hidden sm:block">
          <h1 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <span>AlgoVault</span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
              Graph Edition
            </span>
          </h1>
          <p className="text-[11px] text-slate-400 font-mono">
            {totalQuestions} problems indexed · Python & C++
          </p>
        </div>
      </div>

      {/* Center Search & Difficulty Filters */}
      <div className="flex-1 max-w-xl flex items-center gap-2.5">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search problems, #ID, concepts, tags..."
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-700/80 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500 transition-colors"
          />
        </div>

        {/* Difficulty filter buttons */}
        <div className="hidden md:flex bg-slate-900/90 rounded-xl p-0.5 border border-slate-800 text-xs font-medium">
          {['ALL', 'Easy', 'Medium', 'Hard'].map((diff) => (
            <button
              key={diff}
              onClick={() => onDifficultyChange(diff)}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                selectedDifficulty === diff
                  ? 'bg-slate-800 text-white font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {diff === 'Easy' ? '🟢 Easy' : diff === 'Medium' ? '🟡 Med' : diff === 'Hard' ? '🔴 Hard' : 'All'}
            </button>
          ))}
        </div>
      </div>

      {/* Right Controls & CTAs */}
      <div className="flex items-center gap-2.5">
        
        {/* View Switcher (Graph vs List) */}
        <div className="flex bg-slate-900/90 rounded-xl p-0.5 border border-slate-800">
          <button
            onClick={() => onViewChange('graph')}
            className={`p-1.5 rounded-lg text-xs flex items-center gap-1.5 transition-all ${
              activeView === 'graph'
                ? 'bg-sky-500 text-slate-950 font-bold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Interactive Concept Graph View"
          >
            <Network size={14} />
            <span className="hidden lg:inline text-[11px]">Graph</span>
          </button>
          <button
            onClick={() => onViewChange('list')}
            className={`p-1.5 rounded-lg text-xs flex items-center gap-1.5 transition-all ${
              activeView === 'list'
                ? 'bg-sky-500 text-slate-950 font-bold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Table / List View"
          >
            <List size={14} />
            <span className="hidden lg:inline text-[11px]">List</span>
          </button>
        </div>

        {/* Spaced Repetition Due Badge */}
        <button
          onClick={onOpenReviewSchedule}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
            dueCount > 0
              ? 'bg-amber-500/15 text-amber-300 border-amber-500/40 shadow-sm shadow-amber-500/20 hover:bg-amber-500/25'
              : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:text-slate-200'
          }`}
          title="Spaced Repetition & Recall Queue"
        >
          <Clock size={13} className={dueCount > 0 ? 'animate-bounce text-amber-400' : ''} />
          <span className="hidden sm:inline">Due:</span>
          <span className="font-mono font-bold">{dueCount}</span>
        </button>

        {/* Backup / Export Menu */}
        <div className="flex items-center gap-1">
          <button
            onClick={exportDatabaseToJson}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 transition-colors"
            title="Backup Database (JSON Export)"
          >
            <Download size={15} />
          </button>
          
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImportFile}
            accept=".json"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 transition-colors"
            title="Restore / Import Database (JSON)"
          >
            <Upload size={15} />
          </button>
        </div>

        {/* Add Concept Node */}
        <button
          onClick={onOpenAddConcept}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors"
          title="Add new concept graph hub"
        >
          <Layers size={13} className="text-purple-400" />
          <span>+ Concept</span>
        </button>

        {/* Add Problem CTA */}
        <button
          onClick={onOpenAddProblem}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 active:scale-95 transition-all"
        >
          <Plus size={15} />
          <span>Add Problem</span>
        </button>
      </div>
    </header>
  );
};
