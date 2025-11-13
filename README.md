# AI Wireframer

AI-powered design tool that generates complete HTML designs from text descriptions.

## 📹 Demo

<p>
  <a href="https://www.loom.com/share/7b54d97592d84fe39f53a00c893b027d">
    Cloverly | Parahat Iljanov - Watch Video
  </a>
</p>

<a href="https://www.loom.com/share/7b54d97592d84fe39f53a00c893b027d">
  <img src="https://cdn.loom.com/sessions/thumbnails/7b54d97592d84fe39f53a00c893b027d-557bf27c0f02eb84-full-play.gif">
</a>


## Quick Start

```bash
# Start all services with Docker
docker compose --profile dev up --build
```

**Services:**
- Web: http://localhost:3000
- API: http://localhost:4000
- AI: http://localhost:5566

## Setup

1. **Configure environment variables:**
```bash
cp web/.env.example web/.env
cp api/.env.example api/.env
cp ai/.env.example ai/.env
```

2. **Add your API keys** to the `.env` files:
   - `OPENAI_API_KEY` in `ai/.env`
   - Clerk credentials in `api/.env` and `web/.env`

## Local Development

**Frontend:**
```bash
cd web
yarn install
yarn dev
```

**Backend:**
```bash
cd api
yarn install
yarn dev
```

**AI Service:**
```bash
cd ai
pip install -r requirements.txt
uvicorn app.main:app --reload --port 5566
```

## Tech Stack

- **Frontend:** React, Vite, Tailwind CSS, Clerk Auth
- **Backend:** Fastify, PostgreSQL, Drizzle ORM
- **AI Service:** FastAPI, LiteLLM, OpenAI
- **Infrastructure:** Docker, Redis

## License

MIT

