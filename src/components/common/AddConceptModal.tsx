import React, { useState } from 'react';
import { X, Check, Layers } from 'lucide-react';
import { Concept } from '../../types';

interface AddConceptModalProps {
  onClose: () => void;
  onSave: (concept: Concept) => void;
}

const PRESET_COLORS = [
  '#38bdf8', // Sky
  '#4ade80', // Green
  '#f59e0b', // Amber
  '#a78bfa', // Violet
  '#f87171', // Red
  '#34d399', // Emerald
  '#fb923c', // Orange
  '#e879f9', // Fuchsia
];

const PRESET_ICONS = ['⚡', '🔍', '🧮', '🌳', '🔗', '📊', '🎯', '🔄', '🗂', '⏱', '📐', '🧠'];

export const AddConceptModal: React.FC<AddConceptModalProps> = ({ onClose, onSave }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState(PRESET_COLORS[0]);
  const [icon, setIcon] = useState(PRESET_ICONS[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    const id = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const newConcept: Concept = {
      id: id || `concept-${Date.now()}`,
      name: name.trim(),
      description: description.trim(),
      color,
      icon,
      isCustom: true,
    };
    onSave(newConcept);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)' }}
    >
      <div
        className="w-full max-w-md rounded-2xl overflow-hidden shadow-2xl"
        style={{
          background: '#121212',
          border: '1px solid rgba(255,255,255,0.1)',
          boxShadow: '0 32px 80px rgba(0,0,0,0.8)',
        }}
      >
        {/* Header */}
        <div
          className="h-14 px-6 flex items-center justify-between flex-shrink-0"
          style={{ background: '#171717', borderBottom: '1px solid rgba(255,255,255,0.08)' }}
        >
          <div className="flex items-center gap-2.5">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: 'rgba(168,85,247,0.15)', border: '1px solid rgba(168,85,247,0.3)' }}
            >
              <Layers size={14} className="text-purple-400" />
            </div>
            <div>
              <h2 className="font-bold text-[14px] text-slate-100 font-heading leading-tight">New DSA Concept</h2>
              <p className="text-[10.5px] text-slate-500">Create a new concept hub node</p>
            </div>
          </div>
          <button onClick={onClose} className="btn-icon">
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Name */}
          <div>
            <label className="section-label block mb-1.5">Concept Name</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Bitmask DP, Segment Tree, KMP..."
              required
              autoFocus
              className="input-base"
            />
          </div>

          {/* Description */}
          <div>
            <label className="section-label block mb-1.5">Description <span className="text-slate-600 normal-case">(optional)</span></label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Short summary of this algorithmic pattern..."
              rows={2}
              className="input-base resize-none"
            />
          </div>

          {/* Icon picker */}
          <div>
            <label className="section-label block mb-2">Node Icon</label>
            <div className="flex flex-wrap gap-2">
              {PRESET_ICONS.map(ic => (
                <button
                  key={ic}
                  type="button"
                  onClick={() => setIcon(ic)}
                  className={`w-9 h-9 rounded-xl text-lg flex items-center justify-center transition-all ${
                    icon === ic ? 'ring-2 ring-offset-1 ring-offset-[#0d1117]' : ''
                  }`}
                  style={{
                    background: icon === ic ? `${color}25` : 'rgba(255,255,255,0.05)',
                    border: icon === ic ? `1.5px solid ${color}60` : '1px solid rgba(255,255,255,0.08)',
                    boxShadow: icon === ic ? `0 0 0 2px ${color}50` : 'none',
                  }}
                >
                  {ic}
                </button>
              ))}
            </div>
          </div>

          {/* Color picker */}
          <div>
            <label className="section-label block mb-2">Accent Color</label>
            <div className="flex gap-2.5 flex-wrap">
              {PRESET_COLORS.map(c => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className="w-7 h-7 rounded-full flex items-center justify-center transition-all"
                  style={{
                    backgroundColor: c,
                    boxShadow: color === c ? `0 0 0 2px #0d1117, 0 0 0 4px ${c}` : 'none',
                    transform: color === c ? 'scale(1.15)' : 'scale(1)',
                  }}
                >
                  {color === c && <Check size={12} style={{ color: '#0a0e18' }} strokeWidth={3} />}
                </button>
              ))}
            </div>
          </div>

          {/* Preview */}
          <div
            className="flex items-center gap-3 p-3 rounded-xl"
            style={{ background: `${color}0d`, border: `1px solid ${color}25` }}
          >
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-base"
              style={{ background: `${color}18`, border: `1px solid ${color}35` }}
            >
              {icon}
            </div>
            <div>
              <p className="font-bold text-[13px] font-heading" style={{ color }}>
                {name || 'Concept Name'}
              </p>
              <p className="text-[11px] text-slate-500 line-clamp-1">
                {description || 'No description yet'}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div
            className="flex items-center justify-end gap-2.5 pt-1"
            style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
          >
            <button type="button" onClick={onClose} className="btn-ghost">Cancel</button>
            <button type="submit" className="btn-primary">
              <Check size={14} />
              Create Concept
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
