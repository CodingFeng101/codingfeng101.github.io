# Project GitHub Stats Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Show live GitHub star and fork counts for the three repository-backed project cards with a per-browser 12-hour cache.

**Architecture:** Add a small browser utility that reads and writes each repo's counts in localStorage and refreshes via GitHub's public REST API after 12 hours. ProjectSection renders the cached/refreshed counts beside the repository links, retaining cached data when refresh fails.

**Tech Stack:** React 19, Vite, browser Fetch API/localStorage, `@phosphor-icons/react`, Node built-in test runner.

**Spec:** `docs/superpowers/specs/2026-11-05-project-github-stats-design.md`

## Global Constraints

- Cache TTL is exactly 12 hours.
- Do not add a backend or runtime dependency.
- Only the three public GitHub repositories receive statistics.
- Failed or rate-limited refreshes must not erase previously cached counts.

## Review Focus

- Cache is fresh: must not call GitHub before TTL expiry.
- Cache expires: must refresh after 12 hours.
- Fetch fails/rate limited: must return the prior count if one exists.
- Malformed API response: must not save invalid counts.
- No prior cache and API unavailable: card must render without counts or errors.

### Task 1: Add and test cached GitHub repository stats

**Files:**
- Create: `src/githubStats.js`
- Create: `src/githubStats.test.js`
- Modify: `package.json`

**Interfaces:**
- Produces: `getGithubRepoStats(owner, repo)` resolves to `{ stars: number, forks: number }` or `null`.

- [x] Write Node built-in tests for cache hit without fetch, expired-cache refresh, fallback to stale cached data after failed fetch, malformed/failed response with no cache, and valid fresh response.
- [x] Run `node --test src/githubStats.test.js`; confirm tests fail because the function is not implemented.
- [x] Implement `getGithubRepoStats` with a 12-hour localStorage cache and GitHub REST API fields `stargazers_count` and `forks_count`; add the `test` script.
- [x] Run `node --test src/githubStats.test.js`; all cases pass.

### Task 2: Show counts on repository-backed project cards

**Files:**
- Modify: `src/App.jsx`
- Modify: `src/styles.css`

**Interfaces:**
- Consumes: `getGithubRepoStats(owner, repo)` from Task 1.

- [x] Add the `owner` and `repo` fields for UniGraph, CanvasAnvil, and Slide Alchemy and load counts for each card.
- [x] Render accessible Star and Fork icons with formatted counts next to each card's existing project links; omit counts until available.
- [x] Add compact styles consistent with current project-link styling.
- [x] Run `npm test` and `npm run build`; both pass.
