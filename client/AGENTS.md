# Repository Guidelines

## Project Structure & Module Organization
- `src/` holds all application code. Entry points are `src/index.tsx` and `src/index.css`.
- `src/components/` contains reusable UI and feature components (files are kebab-case, e.g. `room-connection-card.tsx`).
- `src/pages/` hosts route-level screens; `src/hooks/` for custom hooks (use `useX` naming), `src/stores/` for MobX state, `src/types/` for shared types, `src/@providers/` for context providers, and `src/pixels/` for API/IO helpers.
- `public/` contains static assets.
- Tooling/config lives at the repo root: `webpack.config.js`, `tailwind.config.js`, `postcss.config.js`, `tsconfig.json`, `components.json`.

## Build, Test, and Development Commands
- `pnpm install` (preferred; lockfile present) or `npm install`.
- `pnpm dev`: runs the webpack dev server for local development.
- `pnpm build`: creates a production bundle via webpack.
- `pnpm start`: CRA dev server (legacy path; use `dev` unless you need CRA behavior).
- `pnpm test`: Jest + React Testing Library in watch mode.
- `pnpm eject`: CRA eject (avoid unless absolutely necessary).

## Coding Style & Naming Conventions
- TypeScript + React with 2‑space indentation, double quotes, and semicolons (match existing files).
- Component files use kebab-case (`room-list-sidebar.tsx`), component names are PascalCase.
- Hooks are named `useX` and live in `src/hooks/`.
- Styling is Tailwind CSS with shared styles in `src/index.css`.
- Linting uses the CRA ESLint presets (`react-app`, `react-app/jest`).

## Testing Guidelines
- Frameworks: Jest + React Testing Library (via `react-scripts`).
- Place tests next to components or in `__tests__/` and use `*.test.tsx` or `*.spec.tsx`.
- There is no documented coverage target; add tests for new behavior and regressions.

## Commit & Pull Request Guidelines
- Existing commits are short, imperative, and lower‑case (e.g. “move stuff around”). Keep messages concise and descriptive.
- PRs should include a summary, testing notes (`pnpm test` or “not run”), and screenshots for UI changes.
- Link any relevant issues and call out config/env changes.

## Configuration & Environment
- Environment values are loaded from `.env`; use `.env.example` as the template.
- Do not commit secrets. Update `.env.example` when adding required variables (e.g., `LIVEKIT_URL`).
