import React, { useState, useEffect, useCallback } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from './db';
import { Concept, Question, SupportedLanguage, BlitzAttempt } from './types';
import { Sidebar } from './components/common/Sidebar';
import { ConceptGraph } from './components/graph/ConceptGraph';
import { ProblemListView } from './components/problem/ProblemListView';
import { DueReviewView } from './components/analytics/DueReviewView';
import { ProblemDetailView } from './components/problem/ProblemDetailView';
import { ProblemAddModal } from './components/problem/ProblemAddModal';
import { AddConceptModal } from './components/common/AddConceptModal';
import { BlitzTestModal } from './components/test-mode/BlitzTestModal';
import { useToast } from './components/common/Toast';
import { useConfirm } from './components/common/ConfirmDialog';

export const App: React.FC = () => {
  const toast = useToast();
  const { confirm } = useConfirm();
  const questions = useLiveQuery(() => db.questions.toArray(), []) || [];
  const concepts = useLiveQuery(() => db.concepts.toArray(), []) || [];

  useEffect(() => {
  }, []);

  const [searchQuery, setSearchQuery] = useState('');
  const [activeView, setActiveView] = useState<'graph' | 'list' | 'due'>('graph');
  const [selectedConceptId, setSelectedConceptId] = useState<string | null>(null);

  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [testState, setTestState] = useState<{ question: Question; language: SupportedLanguage } | null>(null);
  const [isAddProblemOpen, setIsAddProblemOpen] = useState(false);
  const [preselectedConceptId, setPreselectedConceptId] = useState<string | undefined>(undefined);
  const [isAddConceptOpen, setIsAddConceptOpen] = useState(false);

  const dueCount = questions.filter(
    (q) => !q.nextReviewDue || q.nextReviewDue <= Date.now()
  ).length;

  const handleSelectQuestion = useCallback((q: Question) => {
    setSelectedQuestion(q);
  }, []);

  const handleStartBlitz = useCallback((q: Question, lang: SupportedLanguage) => {
    setSelectedQuestion(null);
    setTestState({ question: q, language: lang });
  }, []);

  const handleRandomBlitz = useCallback((conceptId: string) => {
    const attached = questions.filter((q) => q.conceptIds.includes(conceptId));
    if (attached.length === 0) {
      toast.warning('No problems under this concept yet. Add one first!');
      return;
    }
    const randomQ = attached[Math.floor(Math.random() * attached.length)];
    const hasPython = randomQ.solutions?.some(s => s.language === 'python');
    handleStartBlitz(randomQ, hasPython ? 'python' : 'cpp');
  }, [questions, handleStartBlitz, toast]);

  const handleAddQuestionToConcept = useCallback((conceptId: string) => {
    setPreselectedConceptId(conceptId);
    setIsAddProblemOpen(true);
  }, []);

  const handleSaveQuestion = async (newQ: Question) => {
    await db.questions.put(newQ);
    setIsAddProblemOpen(false);
    setPreselectedConceptId(undefined);
  };

  const handleUpdateQuestion = async (updatedQ: Question) => {
    await db.questions.put(updatedQ);
    if (selectedQuestion?.id === updatedQ.id) {
      setSelectedQuestion(updatedQ);
    }
  };

  const handleDeleteQuestion = async (id: string) => {
    await db.questions.delete(id);
    if (selectedQuestion?.id === id) setSelectedQuestion(null);
  };

  const handleSaveConcept = async (concept: Concept) => {
    await db.concepts.put(concept);
    setIsAddConceptOpen(false);
  };

  const handleDeleteConcept = async (conceptId: string) => {
    const concept = concepts.find(c => c.id === conceptId);
    const ok = await confirm({
      title: 'Delete Concept Node',
      message: `Remove "${concept?.name || conceptId}"? Problems assigned to it will remain in your DB but lose this concept tag.`,
      confirmLabel: 'Delete',
      variant: 'danger',
    });
    if (!ok) return;
    await db.concepts.delete(conceptId);
    if (selectedConceptId === conceptId) setSelectedConceptId(null);
    toast.success(`Concept "${concept?.name || conceptId}" deleted.`);
  };

  const handleRecordAttempt = async (
    questionId: string,
    language: SupportedLanguage,
    writtenCode: string,
    timeSpentSeconds: number,
    isTimedOut: boolean,
    grade: 'mastered' | 'hesitant' | 'failed'
  ) => {
    const targetQ = questions.find((q) => q.id === questionId);
    if (!targetQ) return;

    let nextInterval = targetQ.intervalDays || 1;
    let newMastery = targetQ.masteryStatus;

    if (grade === 'mastered') {
      nextInterval = Math.round(nextInterval * 2.5) || 3;
      newMastery = 'mastered';
    } else if (grade === 'hesitant') {
      nextInterval = Math.round(nextInterval * 1.5) || 2;
      newMastery = 'reviewing';
    } else {
      nextInterval = 1;
      newMastery = 'learning';
    }

    const nextDueDate = Date.now() + nextInterval * 24 * 60 * 60 * 1000;

    const updatedQ: Question = {
      ...targetQ,
      intervalDays: nextInterval,
      lastTestedAt: Date.now(),
      nextReviewDue: nextDueDate,
      masteryStatus: newMastery,
      attemptsCount: (targetQ.attemptsCount || 0) + 1,
      updatedAt: Date.now(),
    };

    const attempt: BlitzAttempt = {
      id: `attempt-${Date.now()}`,
      questionId,
      language,
      writtenCode,
      timeSpentSeconds,
      isTimedOut,
      selfRating: grade,
      timestamp: Date.now(),
    };

    await db.questions.put(updatedQ);
    await db.attempts.add(attempt);
  };

  return (
    <div
      className="flex h-screen overflow-hidden text-slate-100 font-sans"
      style={{ background: 'linear-gradient(135deg, #050505 0%, #0a0a0a 100%)' }}
    >
      {/* Left Modern Studio Sidebar */}
      <Sidebar
        concepts={concepts}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        activeView={activeView}
        onViewChange={setActiveView}
        selectedConceptId={selectedConceptId}
        onSelectConcept={setSelectedConceptId}
        totalQuestions={questions.length}
        dueCount={dueCount}
        onOpenAddProblem={() => {
          setPreselectedConceptId(undefined);
          setIsAddProblemOpen(true);
        }}
        onOpenAddConcept={() => setIsAddConceptOpen(true)}
        onRefresh={() => {}}
      />

      {/* Main Studio Workspace */}
      <main className="flex-1 h-full relative overflow-hidden bg-slate-950">
        {activeView === 'graph' ? (
          <ConceptGraph
            concepts={concepts}
            questions={questions}
            searchQuery={searchQuery}
            selectedConceptId={selectedConceptId}
            onSelectQuestion={handleSelectQuestion}
            onRandomBlitz={handleRandomBlitz}
            onAddQuestionToConcept={handleAddQuestionToConcept}
            onDeleteConcept={handleDeleteConcept}
          />
        ) : activeView === 'list' ? (
          <ProblemListView
            questions={questions}
            searchQuery={searchQuery}
            selectedConceptId={selectedConceptId}
            onSelectQuestion={handleSelectQuestion}
            onLaunchBlitz={handleStartBlitz}
          />
        ) : (
          <DueReviewView
            questions={questions}
            onLaunchBlitz={handleStartBlitz}
          />
        )}
      </main>

      {/* Problem Studio Detail View */}
      {selectedQuestion && (
        <ProblemDetailView
          question={selectedQuestion}
          onClose={() => setSelectedQuestion(null)}
          onStartBlitz={handleStartBlitz}
          onUpdateQuestion={handleUpdateQuestion}
          onDeleteQuestion={handleDeleteQuestion}
        />
      )}

      {/* 5-Min Blitz Arena */}
      {testState && (
        <BlitzTestModal
          question={testState.question}
          initialLanguage={testState.language}
          onClose={() => setTestState(null)}
          onRecordAttempt={handleRecordAttempt}
        />
      )}

      {/* Add Problem Modal */}
      {isAddProblemOpen && (
        <ProblemAddModal
          concepts={concepts}
          preselectedConceptId={preselectedConceptId}
          onClose={() => setIsAddProblemOpen(false)}
          onSave={handleSaveQuestion}
        />
      )}

      {/* Add Concept Modal */}
      {isAddConceptOpen && (
        <AddConceptModal
          onClose={() => setIsAddConceptOpen(false)}
          onSave={handleSaveConcept}
        />
      )}
    </div>
  );
};

export default App;
