import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Plus, Zap, X } from 'lucide-react';
import { Concept } from '../../types';

interface ConceptNodeData {
  concept: Concept;
  questionCount: number;
  onAddQuestion?: () => void;
  onRandomBlitz?: () => void;
  onDelete?: () => void;
}

// Node is a 140×140 circle
const SIZE = 140;

export const ConceptNode = memo(({ data }: { data: ConceptNodeData }) => {
  const { concept, questionCount, onAddQuestion, onRandomBlitz, onDelete } = data;
  const color = concept.color || '#38bdf8';

  return (
    <div
      className="select-none group"
      style={{ width: SIZE, height: SIZE, position: 'relative' }}
    >
      {/* Invisible handles at all 4 sides so edges connect from the border */}
      <Handle type="target" position={Position.Top}
        style={{ background: 'transparent', border: 'none', width: 1, height: 1, top: SIZE / 2, left: SIZE / 2 }} />
      <Handle type="source" position={Position.Bottom}
        style={{ background: 'transparent', border: 'none', width: 1, height: 1, top: SIZE / 2, left: SIZE / 2 }} />
      <Handle type="source" position={Position.Left} id="left"
        style={{ background: 'transparent', border: 'none', width: 1, height: 1, top: SIZE / 2, left: SIZE / 2 }} />
      <Handle type="source" position={Position.Right} id="right"
        style={{ background: 'transparent', border: 'none', width: 1, height: 1, top: SIZE / 2, left: SIZE / 2 }} />

      {/* Circle body */}
      <div
        style={{
          width: SIZE,
          height: SIZE,
          borderRadius: '50%',
          background: `radial-gradient(circle at 35% 35%, ${color}28 0%, #12121280 60%, #0a0a0a90 100%)`,
          border: `2px solid ${color}60`,
          boxShadow: `0 0 32px ${color}20, inset 0 0 24px ${color}0a`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 4,
          transition: 'box-shadow 0.25s, border-color 0.25s',
          cursor: 'default',
          position: 'relative',
          overflow: 'hidden',
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLElement).style.boxShadow = `0 0 48px ${color}35, inset 0 0 28px ${color}15`;
          (e.currentTarget as HTMLElement).style.borderColor = `${color}90`;
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLElement).style.boxShadow = `0 0 32px ${color}20, inset 0 0 24px ${color}0a`;
          (e.currentTarget as HTMLElement).style.borderColor = `${color}60`;
        }}
      >


        {/* Concept name */}
        <span
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: '#f0f4fc',
            fontFamily: "'Outfit', sans-serif",
            textAlign: 'center',
            lineHeight: 1.2,
            maxWidth: 110,
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            padding: '0 6px',
          }}
        >
          {concept.name}
        </span>

        {/* Question count badge */}
        <div
          style={{
            fontSize: 10,
            fontWeight: 700,
            fontFamily: 'Fira Code, monospace',
            color: color,
            background: `${color}18`,
            border: `1px solid ${color}40`,
            borderRadius: 99,
            padding: '1px 8px',
            marginTop: 2,
          }}
        >
          {questionCount} {questionCount === 1 ? 'problem' : 'problems'}
        </div>
      </div>

      {/* Delete button (top-right, on hover) */}
      {onDelete && (
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(); }}
          title="Delete concept node"
          className="opacity-0 group-hover:opacity-100 transition-opacity"
          style={{
            position: 'absolute',
            top: 6,
            right: 6,
            width: 22,
            height: 22,
            borderRadius: '50%',
            background: 'rgba(239,68,68,0.15)',
            border: '1px solid rgba(239,68,68,0.4)',
            color: '#f87171',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 10,
          }}
        >
          <X size={11} />
        </button>
      )}

      {/* Action buttons floating below the circle — shown on hover */}
      <div
        className="opacity-0 group-hover:opacity-100 transition-opacity"
        style={{
          position: 'absolute',
          bottom: -34,
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: 6,
          whiteSpace: 'nowrap',
          pointerEvents: 'auto',
          zIndex: 20,
        }}
      >
        <button
          onClick={(e) => { e.stopPropagation(); onAddQuestion?.(); }}
          style={{
            fontSize: 10,
            fontWeight: 600,
            color: '#94a3b8',
            background: 'rgba(18,18,18,0.95)',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: 8,
            padding: '3px 9px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 3,
          }}
        >
          <Plus size={9} /> Add
        </button>
        {questionCount > 0 && (
          <button
            onClick={(e) => { e.stopPropagation(); onRandomBlitz?.(); }}
            style={{
              fontSize: 10,
              fontWeight: 600,
              color: color,
              background: `${color}15`,
              border: `1px solid ${color}45`,
              borderRadius: 8,
              padding: '3px 9px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 3,
            }}
          >
            <Zap size={9} /> Blitz
          </button>
        )}
      </div>
    </div>
  );
});
