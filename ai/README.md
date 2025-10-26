# AI Service

FastAPI service for generating wireframes using LLM (LiteLLM).

## Features

- Generate wireframe designs from text prompts
- Support for multiple platforms and viewport sizes
- Health check endpoint

## Project Structure

```
app/
├── main.py              # FastAPI app initialization
├── schemas.py           # Pydantic models
├── routes/              # API route definitions
│   ├── health.py
│   └── generation.py
├── controllers/         # Request handling logic
│   └── generation.py
├── services/            # Business logic
│   └── generation.py
└── lib/                 # Utilities
    └── sentry.py
```

## Prerequisites

- Docker & Docker Compose
- OpenAI API key

## Setup

1. **Copy environment file**
   ```bash
   cp .env.example .env
   ```

2. **Configure environment variables**
   
   Edit `.env` and set required variables:
   ```
   PORT=5566
   OPENAI_API_KEY=your_actual_key_here
   ```

## Running

### Development mode (with hot reload)

```bash
docker-compose up
```

The service will be available at `http://localhost:5566` (or whatever PORT you set)

## Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `PORT` | No | `5566` | Port for the service |
| `OPENAI_API_KEY` | Yes | - | OpenAI API key for LiteLLM |
| `AI_MODEL` | No | `gpt-4o-mini` | AI model to use |
| `SENTRY_DSN` | No | - | Sentry DSN for error tracking |

## Stopping

```bash
docker-compose down
```

## Logs

View logs:
```bash
docker-compose logs -f ai
```

## Development Tools

### Linting & Formatting

The project uses [Ruff](https://docs.astral.sh/ruff/) for linting and formatting with **2-space indentation**.

**Quick commands (using Makefile):**
```bash
make lint    # Check code
make format  # Format code
make check   # Lint and format
```

**Or directly:**
```bash
docker-compose exec ai ruff check app/        # Check
docker-compose exec ai ruff format app/       # Format
docker-compose exec ai ruff check --fix app/  # Fix
```

### Configuration Files

- `.editorconfig` - Editor indentation rules
- `ruff.toml` - Linting and formatting rules

