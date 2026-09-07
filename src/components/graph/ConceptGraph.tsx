import React, { useMemo } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  BackgroundVariant,
  useNodesState,
  useEdgesState,
  Node,
  Edge,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { Concept, Question } from '../../types';
import { ConceptNode } from './ConceptNode';
import { QuestionNode } from './QuestionNode';

interface ConceptGraphProps {
  concepts: Concept[];
  questions: Question[];
  searchQuery: string;
  selectedConceptId?: string | null;
  onSelectQuestion: (question: Question) => void;
  onRandomBlitz: (conceptId: string) => void;
  onAddQuestionToConcept: (conceptId: string) => void;
  onDeleteConcept: (conceptId: string) => void;
}

const nodeTypes = {
  conceptHub: ConceptNode,
  questionLeaf: QuestionNode,
};

// Fixed radial radius — ALL edges are exactly this long (px)
const ORBIT_RADIUS = 200;

// Concept hub node dimensions
const HUB_SIZE = 140;  // diameter of concept circle
const CHILD_SIZE = 52; // diameter of question circle

// Grid spacing between concept hubs (must be > 2 * ORBIT_RADIUS + buffer)
const HUB_COLS      = 3;
const HUB_X_SPACING = 560;
const HUB_Y_SPACING = 560;

export const ConceptGraph: React.FC<ConceptGraphProps> = ({
  concepts,
  questions,
  searchQuery,
  selectedConceptId,
  onSelectQuestion,
  onRandomBlitz,
  onAddQuestionToConcept,
  onDeleteConcept,
}) => {
  const filteredQuestions = useMemo(() => {
    return questions.filter((q) => {
      const matchesSearch =
        !searchQuery ||
        q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.id.includes(searchQuery) ||
        (q.userTags || []).some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (q.topicTags || []).some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesConcept = !selectedConceptId || q.conceptIds.includes(selectedConceptId);
      return matchesSearch && matchesConcept;
    });
  }, [questions, searchQuery, selectedConceptId]);

  const activeConcepts = useMemo(() => {
    if (!selectedConceptId) return concepts;
    return concepts.filter(c => c.id === selectedConceptId);
  }, [concepts, selectedConceptId]);

  const { initialNodes, initialEdges } = useMemo(() => {
    const nodes: Node[] = [];
    const edges: Edge[] = [];
    const placedQuestionIds = new Set<string>();

    activeConcepts.forEach((concept, index) => {
      const col = index % HUB_COLS;
      const row = Math.floor(index / HUB_COLS);

      // Center of the concept circle in graph coordinates
      const hubCX = col * HUB_X_SPACING + 80;
      const hubCY = row * HUB_Y_SPACING + 80;

      // ReactFlow node position = top-left corner
      const hubX = hubCX - HUB_SIZE / 2;
      const hubY = hubCY - HUB_SIZE / 2;

      const attachedQuestions = filteredQuestions.filter(q => q.conceptIds.includes(concept.id));
      const N = attachedQuestions.length;

      nodes.push({
        id: `concept-${concept.id}`,
        type: 'conceptHub',
        position: { x: hubX, y: hubY },
        data: {
          concept,
          questionCount: N,
          onAddQuestion: () => onAddQuestionToConcept(concept.id),
          onRandomBlitz: () => onRandomBlitz(concept.id),
          onDelete: () => onDeleteConcept(concept.id),
        },
      });

      attachedQuestions.forEach((question, qIdx) => {
        const questionNodeId = `q-${question.id}`;

        // Radial angle: distribute children evenly, start from top (-90°)
        const angle = ((2 * Math.PI) / Math.max(N, 1)) * qIdx - Math.PI / 2;

        const childCX = hubCX + ORBIT_RADIUS * Math.cos(angle);
        const childCY = hubCY + ORBIT_RADIUS * Math.sin(angle);

        // Top-left of the child node (centered on the circle)
        const childX = childCX - CHILD_SIZE / 2;
        const childY = childCY - CHILD_SIZE / 2;

        if (!placedQuestionIds.has(questionNodeId)) {
          placedQuestionIds.add(questionNodeId);
          nodes.push({
            id: questionNodeId,
            type: 'questionLeaf',
            position: { x: childX, y: childY },
            data: {
              question,
              onClick: () => onSelectQuestion(question),
            },
          });
        }

        edges.push({
          id: `edge-${concept.id}-${question.id}`,
          source: `concept-${concept.id}`,
          target: questionNodeId,
          type: 'straight',
          style: {
            stroke: concept.color || '#38bdf8',
            strokeWidth: 1.2,
            opacity: 0.45,
          },
        });
      });
    });

    return { initialNodes: nodes, initialEdges: edges };
  }, [activeConcepts, filteredQuestions, onAddQuestionToConcept, onDeleteConcept, onRandomBlitz, onSelectQuestion]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  React.useEffect(() => {
    setNodes(initialNodes);
    setEdges(initialEdges);
  }, [initialNodes, initialEdges, setNodes, setEdges]);

  return (
    <div className="w-full h-full relative" style={{ background: '#0a0a0a' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        defaultViewport={{ x: 300, y: 200, zoom: 0.85 }}
        minZoom={0.15}
        maxZoom={2.0}
        proOptions={{ hideAttribution: true }}
      >
        <Background
          color="#171717"
          gap={32}
          size={1.5}
          variant={BackgroundVariant.Dots}
        />
        <Controls
          className="!bottom-5 !left-5"
          showInteractive={false}
        />
        <MiniMap
          nodeColor={(n) => {
            if (n.type === 'conceptHub') {
              const c = activeConcepts.find(c => `concept-${c.id}` === n.id);
              return c?.color || '#404040';
            }
            return '#262626';
          }}
          maskColor="rgba(10,10,10,0.88)"
          className="!bottom-5 !right-5"
        />
      </ReactFlow>
    </div>
  );
};
