export type SupportedLanguage = 'python' | 'cpp';

export interface CodeSnippet {
  lang: string;
  langSlug: string;
  code: string;
}

export interface Solution {
  id: string;
  name: string; // e.g. "Approach 1: Hash Map (Optimal)", "Approach 2: Two Pointers"
  language: SupportedLanguage;
  code: string;
  timeComplexity: string; // e.g. "O(N)"
  spaceComplexity: string; // e.g. "O(1)"
  notes: string; // Intuition, edge cases, step-by-step logic
  createdAt: number;
  updatedAt: number;
}

export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export type MasteryStatus = 'new' | 'learning' | 'reviewing' | 'mastered';

export interface Question {
  id: string; // Frontend question number, e.g. "1", "42"
  title: string; // "Two Sum"
  titleSlug: string; // "two-sum"
  difficulty: Difficulty;
  content: string; // HTML description from LeetCode
  topicTags: string[]; // LeetCode official topics: ["Array", "Hash Table"]
  conceptIds: string[]; // Assigned concept hub IDs: ["two-pointers", "hash-map", "sliding-window"]
  userTags: string[]; // Custom tags: ["Blind 75", "Google", "Must Revise"]
  solutions: Solution[];
  hints: string[];
  starterCode?: {
    python?: string;
    cpp?: string;
  };
  masteryStatus: MasteryStatus;
  intervalDays: number; // For spaced repetition (e.g. 1, 3, 7, 14, 30)
  lastTestedAt?: number;
  nextReviewDue?: number;
  attemptsCount: number;
  createdAt: number;
  updatedAt: number;
}

export interface Concept {
  id: string; // e.g. "two-pointers"
  name: string; // "Two Pointers"
  description: string; // "Technique using two index pointers to traverse linear data structures"
  color: string; // Hex color for glow and nodes
  icon?: string;
  isCustom?: boolean;
}

export interface BlitzAttempt {
  id: string;
  questionId: string;
  language: SupportedLanguage;
  writtenCode: string;
  timeSpentSeconds: number;
  isTimedOut: boolean;
  selfRating?: 'mastered' | 'hesitant' | 'failed';
  notes?: string;
  timestamp: number;
}
