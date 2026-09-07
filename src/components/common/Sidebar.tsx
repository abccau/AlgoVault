import React, { useRef } from 'react';
import {
  Network,
  List,
  Clock,
  Plus,
  Download,
  Upload,
  Search,
  X,
  Layers,
  FolderPlus,
  ChevronRight,
} from 'lucide-react';
import { Concept } from '../../types';
import { exportDatabaseToJson, importDatabaseFromJson } from '../../services/exportService';
import { useToast } from '../common/Toast';

interface SidebarProps {
  concepts: Concept[];
  searchQuery: string;
  onSearchChange: (q: string) => void;
  activeView: 'graph' | 'list' | 'due';
  onViewChange: (view: 'graph' | 'list' | 'due') => void;
  selectedConceptId: string | null;
  onSelectConcept: (id: string | null) => void;
  totalQuestions: number;
  dueCount: number;
  onOpenAddProblem: () => void;
  onOpenAddConcept: () => void;
  onRefresh: () => void;
}

const NavItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  active: boolean;
  badge?: number;
  badgeVariant?: 'amber' | 'sky';
  onClick: () => void;
}> = ({ icon, label, active, badge, badgeVariant = 'sky', onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all group ${
      active
        ? 'bg-[#262626] text-white border border-white/10'
        : 'text-slate-400 hover:text-slate-200 hover:bg-[#1a1a1a]'
    }`}
  >
    <div className="flex items-center gap-2.5">
      <span className={active ? 'text-sky-400' : 'text-slate-500 group-hover:text-slate-400'}>{icon}</span>
      <span>{label}</span>
    </div>
    {badge !== undefined && badge > 0 && (
      <span
        className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full font-mono ${
          badgeVariant === 'amber'
            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
            : 'bg-sky-500/15 text-sky-400 border border-sky-500/25'
        }`}
      >
        {badge}
      </span>
    )}
  </button>
);

export const Sidebar: React.FC<SidebarProps> = ({
  concepts,
  searchQuery,
  onSearchChange,
  activeView,
  onViewChange,
  selectedConceptId,
  onSelectConcept,
  totalQuestions,
  dueCount,
  onOpenAddProblem,
  onOpenAddConcept,
  onRefresh,
}) => {
  const toast = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const res = await importDatabaseFromJson(file);
      toast.success(`Imported ${res.questionsCount} problems & ${res.conceptsCount} concepts.`);
      onRefresh();
    } catch (err: any) {
      toast.error(`Import failed: ${err.message}`);
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <aside
      className="h-screen flex flex-col select-none z-30 border-r"
      style={{ width: 280, minWidth: 280, background: '#121212', borderColor: 'rgba(255,255,255,0.07)' }}
    >
      {/* ── Brand Header ── */}
      <div
        className="h-14 px-4 flex items-center justify-between border-b"
        style={{ borderColor: 'rgba(255,255,255,0.07)' }}
      >
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center font-black text-xs font-mono text-slate-950 shadow-lg"
            style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' }}>
            LC
          </div>
          <div>
            <h1 className="font-bold text-[13px] text-slate-100 font-heading leading-tight">AlgoVault</h1>
            <p className="text-[10px] text-slate-500 font-mono leading-tight">Personal Studio</p>
          </div>
        </div>
        <button
          onClick={onOpenAddProblem}
          className="btn-primary !px-2.5 !py-1.5 !text-[11px] !gap-1"
          title="Add problem"
        >
          <Plus size={12} />
          Add
        </button>
      </div>

      {/* ── Search ── */}
      <div className="px-3 py-2.5 border-b" style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
        <div className="relative">
          <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search problems, tags..."
            className="input-base !pl-8 !pr-7 !py-1.5 !text-[11.5px]"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
            >
              <X size={11} />
            </button>
          )}
        </div>
      </div>

      {/* ── Primary Nav ── */}
      <div className="px-2.5 pt-2.5 pb-1 space-y-0.5">
        <NavItem
          icon={<Network size={14} />}
          label="Concept Graph"
          active={activeView === 'graph' && !selectedConceptId}
          onClick={() => { onViewChange('graph'); onSelectConcept(null); }}
        />
        <NavItem
          icon={<List size={14} />}
          label="Problem Catalog"
          active={activeView === 'list' && !selectedConceptId}
          badge={totalQuestions}
          onClick={() => { onViewChange('list'); onSelectConcept(null); }}
        />
        <NavItem
          icon={<Clock size={14} />}
          label="Due for Recall"
          active={activeView === 'due'}
          badge={dueCount}
          badgeVariant="amber"
          onClick={() => onViewChange('due')}
        />
      </div>

      {/* ── DSA Concepts List ── */}
      <div className="flex-1 overflow-y-auto mt-3">
        <div
          className="px-3 py-1.5 flex items-center justify-between border-b"
          style={{ borderColor: 'rgba(255,255,255,0.05)' }}
        >
          <div className="flex items-center gap-1.5 section-label">
            <Layers size={11} className="text-purple-400" />
            DSA Concepts
          </div>
          <button
            onClick={onOpenAddConcept}
            className="btn-icon !p-1"
            title="Add concept"
          >
            <FolderPlus size={12} />
          </button>
        </div>

        <div className="px-2 py-1.5 space-y-0.5">
          {concepts.map((concept) => {
            const isSelected = selectedConceptId === concept.id;
            return (
              <button
                key={concept.id}
                onClick={() => onSelectConcept(isSelected ? null : concept.id)}
                className={`w-full px-2.5 py-1.5 rounded-md flex items-center justify-between text-left text-[11.5px] transition-all group ${
                  isSelected
                    ? 'text-white font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                style={isSelected ? {
                  background: `${concept.color}18`,
                  border: `1px solid ${concept.color}35`,
                } : {}}
              >
                <div className="flex items-center gap-2 truncate">
                  <span
                    className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: concept.color || '#38bdf8' }}
                  />
                  <span className="truncate font-medium">{concept.name}</span>
                </div>
                {isSelected && <ChevronRight size={11} className="flex-shrink-0 text-slate-400" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Footer ── */}
      <div
        className="px-3 py-2.5 border-t flex items-center justify-between"
        style={{ borderColor: 'rgba(255,255,255,0.07)' }}
      >
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <span className="text-[10px] text-slate-500 font-mono">Py · C++</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={exportDatabaseToJson}
            className="btn-icon !p-1.5"
            title="Export JSON backup"
          >
            <Download size={13} />
          </button>
          <input type="file" ref={fileInputRef} onChange={handleImportFile} accept=".json" className="hidden" />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="btn-icon !p-1.5"
            title="Import JSON backup"
          >
            <Upload size={13} />
          </button>
        </div>
      </div>
    </aside>
  );
};
