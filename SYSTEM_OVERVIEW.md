# System Overview

## Monorepo Layout
- `web/`: React + Vite frontend with Tailwind, shadcn/ui, and Clerk auth.
- `api/`: Fastify service used for auth-protected APIs, Figma export plumbing, and future persistence via Drizzle ORM.
- `ai/`: FastAPI service that orchestrates LiteLLM tool-calling to turn prompts into structured wireframes and optional HTML snapshots.

## Frontend (`web/`)
- Boots via `App.tsx` with a `ClerkProvider`, routing handled by `router.tsx` and `react-router`.
- Landing flow (`pages/Landing.tsx`) gathers a prompt, seeds `/file/:id`, and prompts the AI service through `generateWireframe` in `services/api.ts`.
- `Chat.tsx`, `Toolbar.tsx`, and `CanvasRenderer.tsx` compose the workspace: chat captures conversation, toolbar houses export actions, and canvas renders using `WireframeRenderer` + pan/zoom workspace utilities.
- Rendering pipeline normalizes responses (`utils/wireframeValidator.ts`) and draws structured pages/sections/elements through `SectionRenderer`, `ElementRenderer`, and layout primitives.
- Authenticated area (`components/Layout.tsx`, `pages/Account.tsx`) relies on Clerk; Sentry browser SDK initializes when `VITE_SENTRY_DSN` is provided.

## API Service (`api/`)
- `src/index.ts` wires Fastify with CORS, sensible defaults, Sentry, and a `requireAuth` decorator from `plugins/auth.ts` (validates Clerk-issued JWTs).
- Routes: `routes/health.ts` for liveness and `routes/figma.ts` for exporting wireframe JSON—currently a stub returning echo counts for future Figma/React/HTML pipelines.
- Database layer uses Drizzle (`db/schema.ts`, `db/client.ts`) with optional Postgres backing; `env` schema gates config such as Clerk keys, Sentry DSN, Redis, and database URL.

## AI Service (`ai/`)
- `app/main.py` sets up FastAPI with permissive CORS and mounts routers from `routes/` (`/health`, `/generate`).
- Generation controller delegates to `services/generation.py`, which prefers a multi-turn LiteLLM flow with four mandatory tools (`discuss_layout`, `decide_theme`, `configure_motion`, `build_wireframe`).
- Tool invocations are defined in `services/tools.py`, each persisting staged decisions in shared context; `build_wireframe` enriches metadata and captures the final artifact.
- If tool calling fails, the service falls back to a single-shot JSON response while enforcing schema normalization via `process_wireframe_data`.
- Utilities include HTML export helpers (`html_converter.py`) and extensive system prompts (`services/prompts.py`, `tool_prompts.py`).

## End-to-End Flow
1. User enters a prompt on the landing page; the app infers platform/viewport and calls `POST http://localhost:5566/generate` with prior conversation when available.
2. AI service runs staged reasoning, returning structured wireframe JSON plus conversation history; failures degrade to single-shot generation.
3. Frontend normalizes the payload and renders boards inside a pan/zoom canvas; chat UI replays tool steps (currently mocked) and persists prompt history.
4. Future exports route through the API service (`/figma/export`), which will transform the wireframe for downstream tools once implemented.

## Observability & Ops
- Sentry hooks exist across services (browser SDK in `web`, `@sentry/node` in `api`, helper in `ai/lib/sentry.py`) but initialization depends on environment variables.
- Docker and top-level `docker-compose.yml` profile modes coordinate local dev (web 3000, api 4000, ai 5566/5000 per env) alongside Postgres and Redis.


