# AGENTS.md

## Overview

This repository is a Next.js frontend for PMAPP. It uses the App Router in
`src/app`, shared UI components in `src/components`, and API service modules in
`src/api`.

Use this file as the default operating guide for coding agents working in this
repository. Keep changes scoped, preserve existing conventions, and verify the
affected area before finishing.

## Directory Guide

- `src/app`: route segments, layouts, pages, server actions, and page-specific
  UI.
- `src/components`: reusable UI components and their tests.
- `src/api`: API client, service modules, transformers, and service tests.
- `src/lib`: shared application logic such as auth and authorization helpers.
- `public`: static assets.

## Environment Notes

- Node modules are already checked in locally; use `npm` for project commands.
- Path alias `@/*` maps to `src/*`.
- TypeScript strict mode is enabled. Keep new code fully typed.
- Never commit secrets from `.env`. If environment variables are needed for
  documentation, update `.env.example` instead of exposing real values.

## Working Rules

- Prefer minimal, targeted edits over broad refactors.
- Implement changes with TDD when practical: start by adding or updating a
  failing test, then change the production code, then rerun the relevant
  checks until they pass.
- Follow existing file placement and naming patterns before introducing new
  structure.
- When editing a page or feature, check for nearby `__tests__` directories and
  existing patterns in the same area first.
- Preserve App Router conventions. New routes, layouts, loading states, and
  error boundaries should live under `src/app`.
- Reuse existing helpers and components before adding new abstractions.
- Do not rename or move files unless the task requires it.

## Code Style

- Use TypeScript for all new code.
- Follow Prettier settings in `.prettierrc`:
  - `singleQuote: true`
  - `semi: true`
  - `tabWidth: 2`
  - `printWidth: 80`
- Follow ESLint rules from `next/core-web-vitals` and `next/typescript`.
- Prefer the `@/` import alias for internal imports when it matches existing
  usage in the edited area.
- Match local conventions for server and client components. Only add
  `'use client'` when the component actually needs client-side behavior.

## Next.js Workflow

- Use `npm run dev` for interactive development.
- Avoid running `npm run build` during routine agent iteration unless the task
  specifically requires a production build. In Next.js projects this can leave
  `.next` in a production state and disrupt local dev behavior.
- If dependencies change, update `package-lock.json` in the same change.

## Validation

Run the smallest relevant checks first, then broaden only if needed.

- Full lint: `npm run lint`
- Full test suite: `npm run test`
- Coverage: `npm run test:coverage`
- Single Jest test examples:
  - `npx jest src/api/services/auth/__tests__/authService.test.ts`
  - `npx jest src/components/__tests__/ToggleButton.test.tsx`

Validation expectations:

- For behavior changes, prefer a TDD flow: write or update the test first,
  confirm it fails for the expected reason, then implement the fix.
- Run `npm run lint` after meaningful code changes.
- Run focused Jest tests for the files or feature area you touched.
- Run `npm run test` when the change affects shared logic, routing behavior, or
  multiple feature areas.
- If you cannot run a required check, state that clearly in the final report.

## Testing Conventions

- Place tests alongside the current structure:
  - component tests usually live in `__tests__`
  - service tests usually live near the service module
- Treat TDD as the default implementation style for new behavior and bug fixes
  unless the task is documentation-only or the existing code is not practically
  testable in the current scope.
- Prefer extending existing test files when behavior changes in the same unit.
- When changing logic, add or update assertions rather than leaving behavior
  unverified.

## API Layer Notes

- Keep API access inside `src/api` service modules instead of calling the HTTP
  client directly from page components when an existing service pattern already
  exists.
- Reuse shared transformers and response guards where applicable.
- Keep request/response typing explicit. Avoid introducing `any`.

## Final Check Before Finishing

- Confirm formatting is consistent with Prettier.
- Confirm lint and relevant tests pass, or report what could not be verified.
- Summarize user-visible behavior changes and any remaining risks.
