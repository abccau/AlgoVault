# Changelog & Development Guide

This document tracks major changes made to AlgoVault and provides a brief guide on how to approach development.

## Today's Changes

- **Removed Dummy Data Initialization**: Modified the database initialization to start completely blank. The `seedInitialDataIfNeeded` function was removed, and the `initialData.ts` file was deleted. This ensures that any data you add is entirely yours, and no dummy data will override or pollute your database on fresh deployments or local builds.
- **Removed Node Icons**: Removed the emoji and icon feature from the Concept Nodes in the interactive Concept Graph to simplify the visualization.
- **App Name Update**: Changed the app name to **AlgoVault** across the UI and document title.
- **Git Initialization**: Initialized Git repository, added `.gitignore`, and pushed the source code to GitHub (`abccau/AlgoVault`).
- **Documentation**: Added `README.md` and this `CHANGELOG.md` file.

## General Development Workflow

1. **Local Development**: Run `npm run dev`. The database uses your browser's IndexedDB.
2. **Making Changes**: All UI components are in `src/components`. Database logic is in `src/db`.
3. **Deploying**:
   - Run `npm run build` to generate the production build.
   - Pushing code to the `main` branch on GitHub will automatically trigger a Netlify deployment (if Continuous Deployment is configured).
   - Your local browser data will persist across builds and reloads.
