# AlgoVault

AlgoVault is a personal, local-first LeetCode tracking application. It allows you to track your LeetCode problem-solving progress, review due problems using spaced repetition, and visualize your problem knowledge as an interactive Concept Graph.

## Features

- **Concept Graph**: Visual map of all data structures and algorithms concepts you are learning.
- **Problem Tracking**: Keep track of the problems you've solved, with support for fetching problem details directly from LeetCode.
- **Spaced Repetition**: "Blitz" test yourself on problems and grade your memory. The app schedules your next review.
- **Local-First**: All your data is securely stored directly in your browser using IndexedDB (via Dexie). No backend database required.
- **Export & Import**: Easily backup and restore your database as a JSON file, or export problems as Markdown.

## How to Run Locally

1. Clone the repository.
2. Run `npm install` to install dependencies.
3. Run `npm run dev` to start the local development server.

## Deployment

AlgoVault can be easily deployed to Netlify as a static site. Since all data is stored locally in the browser, there is no need for a database or backend server.
