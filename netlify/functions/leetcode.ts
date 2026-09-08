import type { Config, Context } from "@netlify/functions";

export default async (req: Request, context: Context) => {
  const url = new URL(req.url);
  const query = url.searchParams.get('query')?.trim();

  if (!query) {
    return new Response(JSON.stringify({ error: 'Query parameter is required' }), { status: 400 });
  }

  try {
    let titleSlug = query.toLowerCase();
    if (query.includes('leetcode.com/problems/')) {
      const match = query.match(/problems\/([^\/\?#]+)/);
      if (match) titleSlug = match[1];
    } else if (!isNaN(Number(query))) {
      // It's a question number, search via GraphQL
      const searchRes = await fetch('https://leetcode.com/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
          'Referer': 'https://leetcode.com/problemset/all/',
        },
        body: JSON.stringify({
          query: `
            query problemsetQuestionList($categorySlug: String, $limit: Int, $skip: Int, $filters: QuestionListFilterInput) {
              problemsetQuestionList: questionList(
                categorySlug: $categorySlug
                limit: $limit
                skip: $skip
                filters: $filters
              ) {
                questions: data {
                  frontendQuestionId: questionFrontendId
                  title
                  titleSlug
                  difficulty
                }
              }
            }
          `,
          variables: {
            categorySlug: '',
            skip: 0,
            limit: 100,
            filters: { searchKeywords: query }
          }
        })
      });

      if (searchRes.ok) {
        const searchData = await searchRes.json();
        const questions = searchData.data?.problemsetQuestionList?.questions || [];
        const exactMatch = questions.find((q: any) => q.frontendQuestionId === query || q.titleSlug === query || q.title.toLowerCase() === query.toLowerCase());
        if (exactMatch) {
          titleSlug = exactMatch.titleSlug;
        } else if (questions.length > 0) {
          titleSlug = questions[0].titleSlug;
        }
      }
    }

    // Fetch full problem details via GraphQL
    const detailRes = await fetch('https://leetcode.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        'Referer': `https://leetcode.com/problems/${titleSlug}/`,
      },
      body: JSON.stringify({
        query: `
          query questionData($titleSlug: String!) {
            question(titleSlug: $titleSlug) {
              questionId
              questionFrontendId
              title
              titleSlug
              content
              difficulty
              topicTags {
                name
                slug
              }
              hints
              exampleTestcases
              codeSnippets {
                lang
                langSlug
                code
              }
            }
          }
        `,
        variables: { titleSlug }
      })
    });

    if (!detailRes.ok) {
      return new Response(JSON.stringify({ error: `LeetCode API responded with status ${detailRes.status}` }), { status: detailRes.status });
    }

    const data = await detailRes.json();
    const question = data?.data?.question;
    if (!question) {
      return new Response(JSON.stringify({ error: `Problem "${query}" not found on LeetCode.` }), { status: 404 });
    }

    // Filter code snippets to only Python and C++
    const filteredSnippets = (question.codeSnippets || []).filter((s: any) => 
      ['python3', 'python', 'cpp'].includes(s.langSlug)
    );

    return new Response(JSON.stringify({
      id: question.questionFrontendId,
      title: question.title,
      titleSlug: question.titleSlug,
      difficulty: question.difficulty,
      content: question.content,
      topicTags: (question.topicTags || []).map((t: any) => t.name),
      hints: question.hints || [],
      exampleTestcases: question.exampleTestcases || '',
      codeSnippets: filteredSnippets,
    }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (err: any) {
    console.error('LeetCode proxy error:', err);
    return new Response(JSON.stringify({ error: err.message || 'Internal proxy error' }), { status: 500 });
  }
};

export const config: Config = {
  path: "/api/leetcode/fetch"
};
