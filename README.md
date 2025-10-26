# AI Wireframer

A full-stack monorepo for AI-powered wireframe generation with React, Fastify, and FastAPI.

## Structure

```
/web     - React + Vite + Tailwind + Clerk frontend
/api     - Fastify + Drizzle + Postgres backend
/ai      - FastAPI + LiteLLM AI service
```

## Prerequisites

- Docker & Docker Compose
- Node.js 20+ (for local development)
- Python 3.11+ (for local development)

## Quick Start

### Development Mode

```bash
# Start all services in dev mode with hot-reload
docker compose --profile dev up --build
```

Services will be available at:
- **Web**: http://localhost:3000
- **API**: http://localhost:4000
- **AI**: http://localhost:5000
- **Postgres**: localhost:5432
- **Redis**: localhost:6379

### Production Mode

```bash
# Start all services in production mode
docker compose --profile prod up --build
```

## Configuration

1. Copy environment files:
```bash
cp web/.env.example web/.env
cp api/.env.example api/.env
cp ai/.env.example ai/.env
```

2. Update the `.env` files with your actual values:
   - Clerk publishable key and JWT configuration
   - OpenAI API key
   - Sentry DSN (optional)

## Development

### Web (React)
```bash
cd web
pnpm install
pnpm dev
```

### API (Node/Fastify)
```bash
cd api
pnpm install
pnpm dev
```

### AI (Python/FastAPI)
```bash
cd ai
pip install -r requirements.txt
uvicorn app.main:app --reload
```

## Tech Stack

### Frontend (`/web`)
- React 18
- Vite
- Tailwind CSS
- Clerk (Authentication)
- React Router
- TanStack Query
- Zustand

### Backend (`/api`)
- Fastify
- Drizzle ORM
- PostgreSQL (with pgvector)
- Redis
- Clerk JWT Auth
- Zod validation

### AI Service (`/ai`)
- FastAPI
- LiteLLM (Multi-LLM support)
- Pydantic
- Tenacity (Retries)

### Infrastructure
- Docker & Docker Compose
- PostgreSQL with pgvector
- Redis
- Sentry (Error tracking)

## API Endpoints

### API Service (port 4000)
- `GET /health` - Health check
- `POST /figma/export` - Export wireframe to Figma format

### AI Service (port 5000)
- `GET /health` - Health check
- `POST /generate` - Generate wireframe from prompt

## Database Migrations

```bash
cd api
pnpm drizzle-kit generate
pnpm drizzle-kit migrate
```

## License

MIT

