export interface LeetCodeFetchedData {
  id: string;
  title: string;
  titleSlug: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  content: string;
  topicTags: string[];
  hints: string[];
  exampleTestcases?: string;
  codeSnippets: Array<{
    lang: string;
    langSlug: string;
    code: string;
  }>;
}

export async function fetchLeetCodeProblem(query: string): Promise<LeetCodeFetchedData> {
  const trimmed = query.trim();
  if (!trimmed) {
    throw new Error('Please enter a LeetCode problem number, title, or URL.');
  }

  try {
    const res = await fetch(`/api/leetcode/fetch?query=${encodeURIComponent(trimmed)}`);
    if (!res.ok) {
      const errJson = await res.json().catch(() => ({}));
      throw new Error(errJson.error || `Failed to fetch problem (HTTP ${res.status})`);
    }

    const data: LeetCodeFetchedData = await res.json();
    return data;
  } catch (err: any) {
    // If backend proxy fails or offline, provide a fallback draft template
    console.warn('API fetch error, falling back to local generator if number was provided:', err);
    
    // Check if it's a number
    if (!isNaN(Number(trimmed))) {
      return {
        id: trimmed,
        title: `Problem #${trimmed}`,
        titleSlug: `problem-${trimmed}`,
        difficulty: 'Medium',
        content: `<p>Problem #${trimmed} description was not retrieved automatically. You can paste the description or edit it manually.</p>`,
        topicTags: [],
        hints: [],
        codeSnippets: [
          {
            lang: 'Python3',
            langSlug: 'python3',
            code: `class Solution:\n    def solve(self) -> None:\n        pass`
          },
          {
            lang: 'C++',
            langSlug: 'cpp',
            code: `#include <vector>\n\nclass Solution {\npublic:\n    void solve() {\n        \n    }\n};`
          }
        ]
      };
    }

    throw err;
  }
}

export function extractStarterCode(snippets: Array<{ langSlug: string; code: string }>) {
  const pythonSnippet = snippets.find(s => s.langSlug === 'python3' || s.langSlug === 'python')?.code || 
`class Solution:
    def solve(self):
        pass`;

  const cppSnippet = snippets.find(s => s.langSlug === 'cpp')?.code ||
`#include <vector>
#include <iostream>

class Solution {
public:
    void solve() {
        
    }
};`;

  return {
    python: pythonSnippet,
    cpp: cppSnippet
  };
}
