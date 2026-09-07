import Dexie, { type Table } from 'dexie';
import { Question, Concept, BlitzAttempt } from '../types';
import { INITIAL_CONCEPTS, INITIAL_QUESTIONS } from './initialData';

export class LeetCodeDatabase extends Dexie {
  questions!: Table<Question, string>;
  concepts!: Table<Concept, string>;
  attempts!: Table<BlitzAttempt, string>;

  constructor() {
    super('MyLeetCodeDB');
    this.version(1).stores({
      questions: 'id, title, titleSlug, difficulty, masteryStatus, nextReviewDue, createdAt, *conceptIds, *userTags, *topicTags',
      concepts: 'id, name, color, isCustom',
      attempts: 'id, questionId, timestamp, language, isTimedOut'
    });
  }
}

export const db = new LeetCodeDatabase();

// Seed initial data if database is empty
export async function seedInitialDataIfNeeded(): Promise<void> {
  const conceptCount = await db.concepts.count();
  if (conceptCount === 0) {
    await db.concepts.bulkAdd(INITIAL_CONCEPTS);
  }

  const questionCount = await db.questions.count();
  if (questionCount === 0) {
    await db.questions.bulkAdd(INITIAL_QUESTIONS);
  }
}
