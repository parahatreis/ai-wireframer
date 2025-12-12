# AI Wireframer

AI-powered design tool that generates complete HTML designs from text descriptions.

## 📹 Demo

<p>
  <a href="https://www.loom.com/share/f69734c458734faba473d912e2c8b7cd">
    Cloverly | Parahat Iljanov - Watch Video
  </a>
</p>

<a href="https://www.loom.com/share/f69734c458734faba473d912e2c8b7cd">
  <img src="https://cdn.loom.com/sessions/thumbnails/f69734c458734faba473d912e2c8b7cd-8fb74f3ab959704a-full-play.gif">
</a>
<div>

## Quick Start

```bash
# Start all services with Docker
docker compose up --build
```

**Services:**
- Web: http://localhost:3333
- AI: http://localhost:5566

## Setup

**Configure environment variables:**
```bash
cp web/.env.example web/.env
cp ai/.env.example ai/.env
```

## Local Development

**Frontend:**
```bash
cd web
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
- **AI Service:** FastAPI, LiteLLM, OpenAI
- **Infrastructure:** Docker, Redis

## License

MIT

