import { db } from '../db';
import { Question, Concept, BlitzAttempt } from '../types';

export interface BackupData {
  version: number;
  exportedAt: string;
  questions: Question[];
  concepts: Concept[];
  attempts: BlitzAttempt[];
}

export async function exportDatabaseToJson(): Promise<void> {
  const questions = await db.questions.toArray();
  const concepts = await db.concepts.toArray();
  const attempts = await db.attempts.toArray();

  const backup: BackupData = {
    version: 1,
    exportedAt: new Date().toISOString(),
    questions,
    concepts,
    attempts
  };

  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `leetcode-db-backup-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export async function importDatabaseFromJson(file: File): Promise<{ questionsCount: number; conceptsCount: number }> {
  const text = await file.text();
  const data: BackupData = JSON.parse(text);

  if (!data.questions || !Array.isArray(data.questions)) {
    throw new Error('Invalid backup file format: missing questions array.');
  }

  // Import / merge questions
  if (data.concepts && Array.isArray(data.concepts)) {
    for (const c of data.concepts) {
      await db.concepts.put(c);
    }
  }

  for (const q of data.questions) {
    await db.questions.put(q);
  }

  if (data.attempts && Array.isArray(data.attempts)) {
    for (const att of data.attempts) {
      await db.attempts.put(att);
    }
  }

  return {
    questionsCount: data.questions.length,
    conceptsCount: data.concepts?.length || 0
  };
}

export async function exportQuestionToMarkdown(question: Question): Promise<void> {
  let md = `# [LeetCode #${question.id}] ${question.title}\n\n`;
  md += `**Difficulty:** \`${question.difficulty}\`  \n`;
  md += `**Mastery Status:** \`${question.masteryStatus}\`  \n`;
  md += `**Concepts:** ${question.conceptIds.join(', ')}  \n`;
  md += `**Tags:** ${question.userTags.join(', ')}  \n\n`;
  md += `---\n\n## Problem Description\n\n`;
  
  // Clean HTML to approximate markdown
  const textContent = question.content
    .replace(/<pre>/g, '\n```\n')
    .replace(/<\/pre>/g, '\n```\n')
    .replace(/<code>(.*?)<\/code>/g, '`$1`')
    .replace(/<strong>(.*?)<\/strong>/g, '**$1**')
    .replace(/<em>(.*?)<\/em>/g, '*$1*')
    .replace(/<p>/g, '')
    .replace(/<\/p>/g, '\n\n')
    .replace(/<li>/g, '- ')
    .replace(/<\/li>/g, '\n')
    .replace(/<ul>/g, '\n')
    .replace(/<\/ul>/g, '\n')
    .replace(/&nbsp;/g, ' ')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/<sup>(.*?)<\/sup>/g, '^$1');

  md += textContent + '\n\n';

  if (question.solutions && question.solutions.length > 0) {
    md += `---\n\n## Solutions\n\n`;
    question.solutions.forEach((sol, idx) => {
      md += `### ${sol.name || `Approach ${idx + 1}`}\n\n`;
      md += `- **Language:** \`${sol.language}\`\n`;
      if (sol.timeComplexity) md += `- **Time Complexity:** \`${sol.timeComplexity}\`\n`;
      if (sol.spaceComplexity) md += `- **Space Complexity:** \`${sol.spaceComplexity}\`\n`;
      if (sol.notes) md += `\n**Intuition & Notes:**\n${sol.notes}\n`;
      md += `\n\`\`\`${sol.language === 'cpp' ? 'cpp' : 'python'}\n${sol.code}\n\`\`\`\n\n`;
    });
  }

  const blob = new Blob([md], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${question.id.padStart(4, '0')}-${question.titleSlug || 'problem'}.md`;
  a.click();
  URL.revokeObjectURL(url);
}
