import { Concept, Question } from '../types';

export const INITIAL_CONCEPTS: Concept[] = [
  {
    id: 'two-pointers',
    name: 'Two Pointers',
    description: 'Converging or parallel pointers moving across arrays or strings to solve pair/interval problems.',
    color: '#38bdf8', // Sky Blue
    icon: 'ChevronsLeftRight',
  },
  {
    id: 'sliding-window',
    name: 'Sliding Window',
    description: 'Dynamic or fixed size window moving across sequences to optimize contiguous subarray/substring queries.',
    color: '#a855f7', // Purple
    icon: 'Maximize2',
  },
  {
    id: 'fast-slow-pointers',
    name: 'Fast & Slow Pointers',
    description: 'Hare & Tortoise algorithm for cycle detection, finding midpoints in linked lists.',
    color: '#ec4899', // Pink
    icon: 'Activity',
  },
  {
    id: 'binary-search',
    name: 'Binary Search',
    description: 'Logarithmic O(log N) search on sorted arrays, search spaces, and monotonic functions.',
    color: '#06b6d4', // Cyan
    icon: 'Search',
  },
  {
    id: 'monotonic-stack',
    name: 'Monotonic Stack / Queue',
    description: 'Maintains elements in strict increasing/decreasing order for next-greater / prev-smaller queries.',
    color: '#f97316', // Orange
    icon: 'Layers',
  },
  {
    id: 'dynamic-programming',
    name: 'Dynamic Programming',
    description: 'Breaking problems into overlapping subproblems with memoization (top-down) or tabulation (bottom-up).',
    color: '#ef4444', // Red
    icon: 'Cpu',
  },
  {
    id: 'trees-traversal',
    name: 'Trees & DFS / BFS',
    description: 'Recursive tree traversal (pre/in/post-order), lowest common ancestors, and level-order BFS.',
    color: '#22c55e', // Green
    icon: 'GitCommit',
  },
  {
    id: 'graph-algorithms',
    name: 'Graph BFS, DFS & Topo Sort',
    description: 'Connected components, shortest paths (BFS / Dijkstra), cycle detection, and topological sorting.',
    color: '#14b8a6', // Teal
    icon: 'Network',
  },
  {
    id: 'backtracking',
    name: 'Backtracking',
    description: 'Systematic state-space exploration for permutations, combinations, subsets, and constraint puzzles.',
    color: '#eab308', // Yellow
    icon: 'CornerUpLeft',
  },
  {
    id: 'heap-priority-queue',
    name: 'Heap / Priority Queue',
    description: 'Min/Max heap for Top-K elements, streaming medians, and K-way merges.',
    color: '#8b5cf6', // Violet
    icon: 'BarChart2',
  },
  {
    id: 'intervals',
    name: 'Intervals & Sweepline',
    description: 'Merging, inserting, and finding intersections among overlapping time ranges.',
    color: '#f43f5e', // Rose
    icon: 'Sliders',
  },
  {
    id: 'greedy',
    name: 'Greedy Algorithms',
    description: 'Locally optimal choices at each stage that lead to a globally optimal solution.',
    color: '#10b981', // Emerald
    icon: 'Compass',
  },
  {
    id: 'trie',
    name: 'Trie (Prefix Tree)',
    description: 'Tree data structure used to efficiently store and retrieve keys in a dataset of strings.',
    color: '#6366f1', // Indigo
    icon: 'FolderTree',
  },
  {
    id: 'union-find',
    name: 'Union-Find (DSU)',
    description: 'Disjoint-set data structure with path compression and union by rank for dynamic connectivity.',
    color: '#d946ef', // Fuchsia
    icon: 'Share2',
  }
];

export const INITIAL_QUESTIONS: Question[] = [
  {
    id: '1',
    title: 'Two Sum',
    titleSlug: 'two-sum',
    difficulty: 'Easy',
    content: `<p>Given an array of integers <code>nums</code>&nbsp;and an integer <code>target</code>, return <em>indices of the two numbers such that they add up to <code>target</code></em>.</p>
<p>You may assume that each input would have <strong><em>exactly</em> one solution</strong>, and you may not use the <em>same</em> element twice.</p>
<p>You can return the answer in any order.</p>
<p>&nbsp;</p>
<p><strong>Example 1:</strong></p>
<pre><strong>Input:</strong> nums = [2,7,11,15], target = 9
<strong>Output:</strong> [0,1]
<strong>Explanation:</strong> Because nums[0] + nums[1] == 9, we return [0, 1].</pre>
<p><strong>Example 2:</strong></p>
<pre><strong>Input:</strong> nums = [3,2,4], target = 6
<strong>Output:</strong> [1,2]</pre>
<p>&nbsp;</p>
<p><strong>Constraints:</strong></p>
<ul>
	<li><code>2 &lt;= nums.length &lt;= 10<sup>4</sup></code></li>
	<li><code>-10<sup>9</sup> &lt;= nums[i] &lt;= 10<sup>9</sup></code></li>
	<li><code>-10<sup>9</sup> &lt;= target &lt;= 10<sup>9</sup></code></li>
	<li><strong>Only one valid answer exists.</strong></li>
</ul>`,
    topicTags: ['Array', 'Hash Table'],
    conceptIds: ['two-pointers'],
    userTags: ['Blind 75', 'NeetCode 150', 'Warmup'],
    starterCode: {
      python: `class Solution:
    def twoSum(self, nums: list[int], target: int) -> list[int]:
        pass`,
      cpp: `#include <vector>
#include <unordered_map>

class Solution {
public:
    std::vector<int> twoSum(std::vector<int>& nums, int target) {
        
    }
};`
    },
    solutions: [
      {
        id: 'two-sum-py-hash',
        name: 'Approach 1: One-Pass Hash Map (Optimal)',
        language: 'python',
        code: `class Solution:
    def twoSum(self, nums: list[int], target: int) -> list[int]:
        seen = {}
        for i, num in enumerate(nums):
            complement = target - num
            if complement in seen:
                return [seen[complement], i]
            seen[num] = i
        return []`,
        timeComplexity: 'O(N)',
        spaceComplexity: 'O(N)',
        notes: 'Iterate through array while recording elements in a dictionary mapping `value -> index`. For each number, check if `target - num` already exists in O(1) time.',
        createdAt: Date.now() - 86400000 * 3,
        updatedAt: Date.now() - 86400000 * 3
      },
      {
        id: 'two-sum-cpp-hash',
        name: 'Approach 1: Hash Map in C++',
        language: 'cpp',
        code: `#include <vector>
#include <unordered_map>

class Solution {
public:
    std::vector<int> twoSum(std::vector<int>& nums, int target) {
        std::unordered_map<int, int> seen;
        for (int i = 0; i < nums.size(); ++i) {
            int complement = target - nums[i];
            if (seen.find(complement) != seen.end()) {
                return {seen[complement], i};
            }
            seen[nums[i]] = i;
        }
        return {};
    }
};`,
        timeComplexity: 'O(N)',
        spaceComplexity: 'O(N)',
        notes: 'Using `std::unordered_map` for average O(1) lookups.',
        createdAt: Date.now() - 86400000 * 2,
        updatedAt: Date.now() - 86400000 * 2
      }
    ],
    hints: [
      'A really brute force way would be to search for all possible pairs of numbers but that would be too slow. Again, it\'s best to try out brute force solutions for just for completeness.',
      'So, if we check sub-arrays of length 2, we\'d get O(n^2) time complexity. Can we improve using a Hash Table?'
    ],
    masteryStatus: 'mastered',
    intervalDays: 14,
    lastTestedAt: Date.now() - 86400000 * 2,
    nextReviewDue: Date.now() + 86400000 * 12,
    attemptsCount: 3,
    createdAt: Date.now() - 86400000 * 5,
    updatedAt: Date.now() - 86400000 * 2
  },
  {
    id: '3',
    title: 'Longest Substring Without Repeating Characters',
    titleSlug: 'longest-substring-without-repeating-characters',
    difficulty: 'Medium',
    content: `<p>Given a string <code>s</code>, find the length of the <strong>longest</strong> <span data-keyword="substring-nonempty"><strong>substring</strong></span> without repeating characters.</p>
<p>&nbsp;</p>
<p><strong>Example 1:</strong></p>
<pre><strong>Input:</strong> s = "abcabcbb"
<strong>Output:</strong> 3
<strong>Explanation:</strong> The answer is "abc", with the length of 3.</pre>
<p><strong>Example 2:</strong></p>
<pre><strong>Input:</strong> s = "bbbbb"
<strong>Output:</strong> 1
<strong>Explanation:</strong> The answer is "b", with the length of 1.</pre>
<p>&nbsp;</p>
<p><strong>Constraints:</strong></p>
<ul>
	<li><code>0 &lt;= s.length &lt;= 5 * 10<sup>4</sup></code></li>
	<li><code>s</code> consists of English letters, digits, symbols and spaces.</li>
</ul>`,
    topicTags: ['Hash Table', 'String', 'Sliding Window'],
    conceptIds: ['sliding-window'],
    userTags: ['Blind 75', 'NeetCode 150'],
    starterCode: {
      python: `class Solution:
    def lengthOfLongestSubstring(self, s: str) -> int:
        pass`,
      cpp: `#include <string>
#include <unordered_map>
#include <algorithm>

class Solution {
public:
    int lengthOfLongestSubstring(std::string s) {
        
    }
};`
    },
    solutions: [
      {
        id: 'longest-sub-py-opt',
        name: 'Approach 1: Sliding Window with Last Seen Index',
        language: 'python',
        code: `class Solution:
    def lengthOfLongestSubstring(self, s: str) -> int:
        char_index = {}
        left = 0
        max_len = 0
        
        for right, ch in enumerate(s):
            if ch in char_index and char_index[ch] >= left:
                left = char_index[ch] + 1
            char_index[ch] = right
            max_len = max(max_len, right - left + 1)
            
        return max_len`,
        timeComplexity: 'O(N)',
        spaceComplexity: 'O(min(M, N)) where M is alphabet size',
        notes: 'Maintain `left` and `right` window pointers. When repeating character `ch` is seen inside `[left, right]`, jump `left` directly past `char_index[ch]`.',
        createdAt: Date.now() - 86400000 * 2,
        updatedAt: Date.now() - 86400000 * 2
      },
      {
        id: 'longest-sub-cpp-opt',
        name: 'Approach 1: Sliding Window in C++',
        language: 'cpp',
        code: `#include <string>
#include <vector>
#include <algorithm>

class Solution {
public:
    int lengthOfLongestSubstring(std::string s) {
        std::vector<int> lastIndex(128, -1);
        int left = 0;
        int maxLen = 0;
        
        for (int right = 0; right < s.length(); ++right) {
            if (lastIndex[s[right]] >= left) {
                left = lastIndex[s[right]] + 1;
            }
            lastIndex[s[right]] = right;
            maxLen = std::max(maxLen, right - left + 1);
        }
        return maxLen;
    }
};`,
        timeComplexity: 'O(N)',
        spaceComplexity: 'O(1) - fixed 128 ASCII array',
        notes: 'Using a fixed 128-element array for direct character indexing is faster than hash map in C++.',
        createdAt: Date.now() - 86400000,
        updatedAt: Date.now() - 86400000
      }
    ],
    hints: [
      'Generate all possible substrings & check for uniqueness is O(n^3).',
      'Use a sliding window with two pointers to expand right and contract left whenever a duplicate is found.'
    ],
    masteryStatus: 'reviewing',
    intervalDays: 3,
    lastTestedAt: Date.now() - 86400000 * 3,
    nextReviewDue: Date.now() - 86400000 * 1, // Due for review!
    attemptsCount: 2,
    createdAt: Date.now() - 86400000 * 4,
    updatedAt: Date.now() - 86400000 * 2
  },
  {
    id: '42',
    title: 'Trapping Rain Water',
    titleSlug: 'trapping-rain-water',
    difficulty: 'Hard',
    content: `<p>Given <code>n</code> non-negative integers representing an elevation map where the width of each bar is <code>1</code>, compute how much water it can trap after raining.</p>
<p>&nbsp;</p>
<p><strong>Example 1:</strong></p>
<pre><strong>Input:</strong> height = [0,1,0,2,1,0,1,3,2,1,2,1]
<strong>Output:</strong> 6
<strong>Explanation:</strong> The elevation map (black section) is represented by array [0,1,0,2,1,0,1,3,2,1,2,1]. In this case, 6 units of rain water (blue section) are being trapped.</pre>
<p>&nbsp;</p>
<p><strong>Constraints:</strong></p>
<ul>
	<li><code>n == height.length</code></li>
	<li><code>1 &lt;= n &lt;= 2 * 10<sup>4</sup></code></li>
	<li><code>0 &lt;= height[i] &lt;= 10<sup>5</sup></code></li>
</ul>`,
    topicTags: ['Array', 'Two Pointers', 'Dynamic Programming', 'Monotonic Stack'],
    conceptIds: ['two-pointers', 'monotonic-stack'],
    userTags: ['Blind 75', 'Hard Core', 'Classic'],
    starterCode: {
      python: `class Solution:
    def trap(self, height: list[int]) -> int:
        pass`,
      cpp: `#include <vector>
#include <algorithm>

class Solution {
public:
    int trap(std::vector<int>& height) {
        
    }
};`
    },
    solutions: [
      {
        id: 'trap-py-two-ptrs',
        name: 'Approach 1: Two Pointers O(1) Space (Optimal)',
        language: 'python',
        code: `class Solution:
    def trap(self, height: list[int]) -> int:
        if not height:
            return 0
            
        left, right = 0, len(height) - 1
        left_max, right_max = height[left], height[right]
        water = 0
        
        while left < right:
            if left_max < right_max:
                left += 1
                left_max = max(left_max, height[left])
                water += left_max - height[left]
            else:
                right -= 1
                right_max = max(right_max, height[right])
                water += right_max - height[right]
                
        return water`,
        timeComplexity: 'O(N)',
        spaceComplexity: 'O(1)',
        notes: 'Water trapped at position i is `min(max_left, max_right) - height[i]`. By moving the pointer with the smaller max, we know for sure that its limiting factor is that smaller boundary.',
        createdAt: Date.now() - 86400000 * 5,
        updatedAt: Date.now() - 86400000 * 5
      },
      {
        id: 'trap-cpp-two-ptrs',
        name: 'Approach 1: Two Pointers in C++',
        language: 'cpp',
        code: `#include <vector>
#include <algorithm>

class Solution {
public:
    int trap(std::vector<int>& height) {
        int left = 0, right = height.size() - 1;
        int leftMax = 0, rightMax = 0;
        int water = 0;
        
        while (left < right) {
            if (height[left] < height[right]) {
                if (height[left] >= leftMax) {
                    leftMax = height[left];
                } else {
                    water += leftMax - height[left];
                }
                left++;
            } else {
                if (height[right] >= rightMax) {
                    rightMax = height[right];
                } else {
                    water += rightMax - height[right];
                }
                right--;
            }
        }
        return water;
    }
};`,
        timeComplexity: 'O(N)',
        spaceComplexity: 'O(1)',
        notes: 'Classic two pointer approach in C++.',
        createdAt: Date.now() - 86400000 * 4,
        updatedAt: Date.now() - 86400000 * 4
      }
    ],
    hints: [
      'For each element in the array, we find the maximum level of water it can trap.',
      'The water level above bar i is min(max_left, max_right) - height[i].'
    ],
    masteryStatus: 'learning',
    intervalDays: 1,
    lastTestedAt: Date.now() - 86400000 * 2,
    nextReviewDue: Date.now() - 86400000 * 1,
    attemptsCount: 1,
    createdAt: Date.now() - 86400000 * 4,
    updatedAt: Date.now() - 86400000 * 2
  }
];
