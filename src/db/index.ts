import Dexie, { type Table } from 'dexie';
import { Question, Concept, BlitzAttempt } from '../types';

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
