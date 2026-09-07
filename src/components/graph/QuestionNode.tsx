import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Question } from '../../types';

interface QuestionNodeData {
  question: Question;
  onClick: (question: Question) => void;
}

const DIFF_COLOR: Record<string, string> = {
  Easy:   '#22c55e',
  Medium: '#f59e0b',
  Hard:   '#ef4444',
};

// The circle itself is 52×52, label floats outside
const CIRCLE = 52;

export const QuestionNode = memo(({ data }: { data: QuestionNodeData }) => {
  const { question, onClick } = data;
  const color = DIFF_COLOR[question.difficulty] || DIFF_COLOR.Medium;
  const isDue = question.nextReviewDue ? question.nextReviewDue <= Date.now() : false;
  const isMastered = question.masteryStatus === 'mastered';

  return (
    <div
      onClick={() => onClick(question)}
      // overflow visible so label can spill out
      style={{ width: CIRCLE, height: CIRCLE, position: 'relative', overflow: 'visible', cursor: 'pointer' }}
      className="select-none group"
    >
      {/* Central handle — invisible, sits at circle center */}
      <Handle type="target" position={Position.Top}
        style={{ background: 'transparent', border: 'none', width: 1, height: 1, top: CIRCLE / 2, left: CIRCLE / 2 }} />
      <Handle type="source" position={Position.Bottom}
        style={{ background: 'transparent', border: 'none', width: 1, height: 1, top: CIRCLE / 2, left: CIRCLE / 2 }} />

      {/* ── Circle ── */}
      <div
        style={{
          width: CIRCLE,
          height: CIRCLE,
          borderRadius: '50%',
          background: `radial-gradient(circle at 40% 35%, ${color}30 0%, #121212 65%)`,
          border: `2px solid ${color}55`,
          boxShadow: `0 0 14px ${color}20`,
          transition: 'all 0.18s ease',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: 1,
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLElement).style.border = `2px solid ${color}cc`;
          (e.currentTarget as HTMLElement).style.boxShadow = `0 0 22px ${color}40`;
          (e.currentTarget as HTMLElement).style.transform = 'scale(1.12)';
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLElement).style.border = `2px solid ${color}55`;
          (e.currentTarget as HTMLElement).style.boxShadow = `0 0 14px ${color}20`;
          (e.currentTarget as HTMLElement).style.transform = 'scale(1)';
        }}
      >
        {/* Problem number inside circle */}
        <span style={{
          fontSize: 10,
          fontWeight: 800,
          fontFamily: 'Fira Code, monospace',
          color,
          lineHeight: 1,
        }}>
          {question.id}
        </span>
        {/* Mastery dot */}
        {isMastered && (
          <span style={{ fontSize: 8, color: '#4ade80', lineHeight: 1 }}>✓</span>
        )}
        {isDue && !isMastered && (
          <span style={{ fontSize: 7, color: '#fbbf24', lineHeight: 1 }}>DUE</span>
        )}
      </div>

      {/* ── Label: floats below the circle ── */}
      <div
        style={{
          position: 'absolute',
          top: CIRCLE + 6,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 160,
          textAlign: 'center',
          pointerEvents: 'none',
        }}
      >
        <p style={{
          fontSize: 10.5,
          fontWeight: 500,
          color: 'rgba(226,232,240,0.85)',
          lineHeight: 1.3,
          fontFamily: 'Inter, sans-serif',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}>
          {question.title}
        </p>
      </div>
    </div>
  );
});
