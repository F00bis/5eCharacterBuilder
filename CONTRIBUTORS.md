# Contributing Guide

Thanks for contributing to 5e Character Builder.

## Project Stage

This project is currently **pre-alpha**.
Expect active iteration, incomplete workflows, and evolving internal APIs.

## Core Development Principles

- Prefer pure functions and isolated logic over side effects.
- Keep side effects narrowly scoped when they are required.
- Use explicit TypeScript interfaces/types.
- Avoid `any` and avoid unnecessary type assertions.
- Keep implementation modular and easy to test.

## Testing Expectations

- Follow a TDD-style workflow:
  1. write or update tests for behavior,
  2. implement logic,
  3. refactor safely.
- Cover happy-path and relevant edge cases.
- Mock dependencies where appropriate.
- Prefer targeted test execution for touched areas.

### Test Commands

- `npm run test` - run test suite.
- `npm run typecheck` - run TypeScript checks (`tsc -b`).

## Build and Lint

- `npm run lint` - run ESLint.
- `npm run build` - production build.

Use `npm run typecheck` during development for faster TypeScript feedback; reserve `npm run build` for production-build validation.

## Architecture Conventions

### Context Files

To preserve Vite fast refresh behavior:

- Keep context hooks, functions, and types in files ending with `Context`.
- Export provider React components from separate provider files.

### Panel Layout Sizing

For panel-based layouts:

- Panel components should use `w-full h-full` on root elements.
- Parent containers define width and height bounds and proportions.
- Keep layout sizing decisions in parent layout containers.

## Working in This Repository

- Keep changes scoped to a clear behavior or feature slice.
- Update or add tests alongside code changes.
- Preserve existing conventions in touched areas.
- Avoid broad refactors unless they are necessary for the task.

## Commit Message Format

Use a Conventional Commits style subject line:

`type(scope): concise summary`

Accepted `type` values in this repository: `feat`, `fix`, `refactor`, `test`, `docs`, `chore`.

- Use present tense and imperative voice (for example: "add", "fix", "remove").
- Keep the subject focused on the primary change.
- Prefer a scope that matches the affected area (for example: `builder`, `db`, `ui`, `tests`).

For non-trivial changes, include a body with bullet points that explain key behavior changes and test coverage:

- What changed in user-visible or developer-visible behavior.
- Why the change was needed (intent and outcome).
- What tests were added or updated.

Example:

`fix(builder): streamline single-package background equipment presentation and summary`

- Remove package radio rendering in `BackgroundStep` when a background provides only one equipment package, and show package contents directly.
- Derive an effective background equipment package index for single-package flows to keep equipment choice keying and validation stable.
- Default background equipment package state to A when selecting a background with equipment so package-dependent logic is deterministic.
- Hide the "Equipment Package" summary line when only one package exists, while preserving existing summary behavior for multi-package backgrounds.
- Add `BackgroundStep` tests to cover single-package rendering, option select visibility, and summary suppression.

## Documentation

When behavior or architecture changes, update relevant docs (including `README.md`) in the same change set.
