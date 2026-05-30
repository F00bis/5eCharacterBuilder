# ClassicSheet 5e

A local-first Dungeons and Dragons 5th Edition character management app built with React and TypeScript.
The long-term goal is to provide a character sheet platform comparable in depth and usability to tools like D&D Beyond, while prioritizing homebrew flexibility and user privacy.

## Project Goals

- Build a full-featured 5e character creation, leveling, and sheet workflow.
- Support high freedom for homebrew content and progression rules.
- Keep core functionality fully local, with no required cloud dependency.
- Preserve user data ownership by storing character data on-device.
- Maintain a type-safe, test-driven codebase that is easy to extend.

## Current Status

This project is currently in **pre-alpha**.
The implementation is actively evolving and does **not** yet represent the final vision or final feature set.

## Architecture at a Glance

- **Routing and app shell**: `src/App.tsx`, `src/main.tsx`
- **Pages and user flows**: `src/pages`
  - Character list
  - Character creation and level-up wizard
  - Character view sheet
- **Builder step system**: `src/pages/builder/steps`
  - Race, class, background, ability scores, proficiencies, equipment, spells, ASIs/feats, progression choices, and review
- **Character sheet panels**: `src/components`
  - Ability scores, skills, saving throws, combat stats, features, inventory, spells, status effects, and passives
- **State and context**: `src/contexts`
- **Persistence layer**: `src/db` (Dexie + IndexedDB)
- **Rules and domain logic**: `src/utils`
- **Reference data and SRD seeds**: `src/data`
  - Classes, subclasses, races, backgrounds, feats, spells, equipment, maneuvers, invocations, metamagic, and status effects
- **Domain and shared types**: `src/types`
- **Reusable UI components**: `src/components`
- **Custom hooks**: `src/hooks`
- **Library helpers**: `src/lib`

## Tech Stack

- React 19
- TypeScript
- Vite (with PWA support via `vite-plugin-pwa`)
- Tailwind CSS with Radix UI/shadcn patterns
- `react-router-dom` for client-side routing
- Dexie (IndexedDB wrapper)
- Vitest + React Testing Library + jsdom

## Development Setup

```bash
npm install
npm run dev
```

Then open the local Vite URL shown in your terminal (usually `http://localhost:5173`).

## Scripts

- `npm run dev`
  Run the Vite development server with HMR.
- `npm run typecheck`
  Run TypeScript project checks (`tsc -b`) without production build output.
- `npm run test`
  Run the Vitest suite in run mode.
- `npm run lint`
  Run ESLint across the project.
- `npm run build`
  Run TypeScript build and Vite production build.
- `npm run preview`
  Preview the production build locally.

## Testing Strategy

- Follow a test-first/TDD approach when implementing behavior.
- Favor pure, isolated utility logic where possible and test it directly.
- Add component tests for page and builder-step behavior.
- Mock persistence and external dependencies in unit/component tests.
- Run targeted tests for changed areas during development.
- Use `npm run typecheck` for fast TypeScript validation during iteration.

## Project Structure

```text
src/
  components/        Reusable UI and sheet panels
  components/ui/     shadcn-based UI primitives (button, card, dialog, etc.)
  contexts/          Context state, hooks, and providers
  data/              SRD/reference datasets and seeds
  db/                Dexie database and persistence helpers
  hooks/             Custom React hooks (e.g., spellbook, spell preparation)
  lib/               Shared library utilities (e.g., shadcn cn helper)
  pages/             Route-level screens and builder flows
  test/              Shared test setup
  types/             Core domain types
  utils/             Rules logic, calculations, and helpers
```

## Privacy and Local-First Model

- Character and app data are persisted locally in browser IndexedDB.
- Core usage is designed to work without a hosted backend.
- This architecture is intended to maximize privacy and user control of data.

## Contributing

Contributing standards and workflow are documented in `CONTRIBUTORS.md`.

## License

MIT - see `LICENSE`.
