# Resumind

Resumind is an advanced, AI-powered resume builder and analyzer designed to help users craft professional, ATS-friendly resumes. It leverages modern web technologies and powerful LLMs to provide intelligent feedback, content generation, and resume optimization.

## 🚀 Tech Stack

### Frontend (`apps/web`)

- **Framework:** [Next.js 15](https://nextjs.org/) (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS, Radix UI, Framer Motion
- **State Management:** Zustand
- **Authentication:** NextAuth.js
- **PDF Generation:** @react-pdf/renderer

### Backend (`apps/backend`)

- **Framework:** [FastAPI](https://fastapi.tiangolo.com/)
- **Language:** Python 3.12+
- **Package Manager:** [uv](https://github.com/astral-sh/uv)
- **Database ORM:** SQLModel (SQLAlchemy)
- **Migrations:** Alembic
- **AI/LLM:** LangChain, LangGraph, Google GenAI (Gemini), Mistral AI
- **Observability:** Langfuse
- **Background Tasks:** Celery with Redis
- **Tools:** Tavily (Search), Firecrawl (Web Scraping)

### Infrastructure

- **Database:** PostgreSQL 16 (with `pgvector` for embeddings)
- **Caching/Queue:** Redis 7
- **Containerization:** Docker Compose (production) + `docker compose watch` (local dev)
- **Deployment:** [Dokploy](https://dokploy.com/) on a self-hosted VPS

---

## 📂 Project Structure

```bash
.
├── apps/
│   ├── backend/        # FastAPI application (AI logic, API, Celery workers)
│   │   ├── src/
│   │   ├── migrations/ # Alembic migrations
│   │   ├── Dockerfile
│   │   ├── Dockerfile.celery
│   │   └── pyproject.toml
│   └── web/            # Next.js frontend (UI, Auth, PDF rendering)
│       ├── app/
│       ├── components/
│       └── Dockerfile  # Multi-stage: dev + production
├── docker-compose.yaml          # Production config (used by Dokploy)
├── docker-compose.override.yml  # Local dev overrides (auto-merged)
└── envrc.example                # Environment variable template
```

---

## 🛠️ Getting Started

### Prerequisites

- **Python** 3.12+
- **uv** (Python package manager) → `curl -LsSf https://astral.sh/uv/install.sh | sh`
- **Node.js** 18+ and **pnpm** 10+ (for running the frontend outside Docker)
- **Docker** & **Docker Compose**

### 1. Clone the Repository

```bash
git clone https://github.com/ZakariaBaqasse/resumind.git
cd resumind
```

### 2. Environment Setup

```bash
cp envrc.example .env
# Fill in the required values in .env
```

Key variables:

| Variable                            | Description            |
| ----------------------------------- | ---------------------- |
| `DB_PASSWORD`, `DB_USER`, `DB_NAME` | PostgreSQL credentials |
| `JWT_SECRET`                        | Backend auth secret    |
| `AUTH_SECRET`                       | NextAuth.js secret     |
| `GOOGLE_CLIENT_ID/SECRET`           | OAuth credentials      |
| `GOOGLE_API_KEY`                    | Gemini model access    |
| `MISTRAL_API_KEY`                   | Mistral model access   |
| `TAVILY_API_KEY`                    | Web search tool        |
| `FIRECRAWL_API_KEY`                 | Web scraping tool      |
| `LANGFUSE_*`                        | LLM observability      |

### 3. Start Local Development

The full stack (Frontend + Backend + Celery + DB + Redis) with live reload:

```bash
docker compose watch
```

- **Frontend:** [http://localhost:3003](http://localhost:3003)
- **Backend API:** [http://localhost:8000](http://localhost:8000)
- **API Docs:** [http://localhost:8000/docs](http://localhost:8000/docs)
- **Flower (Celery Monitor):** [http://localhost:5555](http://localhost:5555)

`docker compose watch` uses `docker-compose.override.yml` to automatically sync source file changes into running containers — no rebuild required for most edits.

### Running Services Outside Docker

**Backend:**

```bash
cd apps/backend
uv sync
uv run uvicorn src.main:app --reload --port 8000
```

**Frontend:**

```bash
cd apps/web
pnpm install
pnpm dev
```

---

## 🗄️ Database Migrations

```bash
cd apps/backend

# Create a new migration
uv run alembic revision --autogenerate -m "Description of changes"

# Apply migrations
uv run alembic upgrade head
```

---

## 🧪 Running Tests

```bash
cd apps/backend
uv run pytest
```

Test environment variables are loaded automatically from `apps/backend/.env.test`.

---

## 🚀 Deployment

This project is deployed via **Dokploy** pointing at this repository. Dokploy reads `docker-compose.yaml` directly — `docker-compose.override.yml` is ignored in production.

Set all required environment variables in Dokploy's UI, then trigger a deploy. To deploy manually on any server:

```bash
docker compose up -d --build
```

### CI/CD (GitHub Actions)

- **Lint workflow** — runs Ruff, mypy, and formatting checks on every push/PR touching `apps/backend` or `apps/web`
- **Migrations workflow** — runs `alembic upgrade head` automatically on push to `main`
