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

- **Monorepo:** Turborepo
- **Package Manager:** pnpm
- **Database:** PostgreSQL 16 (with `pgvector` for embeddings)
- **Caching/Queue:** Redis 7
- **Deployment:** Docker Compose, Dokploy

---

## 📂 Project Structure

```bash
.
├── apps/
│   ├── backend/        # FastAPI application (AI logic, API, Workers)
│   └── web/            # Next.js frontend (UI, Auth, PDF rendering)
├── packages/
│   ├── infrastructure/ # Docker Compose for local DB/Redis
│   └── ui/             # Shared UI components
├── docker-compose.yaml # Production/Staging deployment config
└── turbo.json          # Turborepo pipeline config
```

---

## 🛠️ Getting Started

### Prerequisites

- **Node.js** 18+
- **pnpm** 10+
- **Python** 3.12+
- **uv** (Python package manager) -> `curl -LsSf https://astral.sh/uv/install.sh | sh`
- **Docker** & **Docker Compose**

### 1. Clone the Repository

```bash
git clone https://github.com/ZakariaBaqasse/resumind.git
cd resumind
```

### 2. Install Dependencies

**Frontend & Shared Packages:**

```bash
pnpm install
```

**Backend:**

```bash
cd apps/backend
uv sync
cd ../..
```

### 3. Environment Setup

Copy the example environment file and configure it:

```bash
cp .env.example .envrc
# Or manually create .envrc / .env based on .env.example
```

> **Note:** This project uses `direnv` to manage environment variables. If you have `direnv` installed, run `direnv allow`. Otherwise, ensure your variables are exported in your shell or `.env` files.

**Key Environment Variables:**

- `DATABASE_URL`: PostgreSQL connection string
- `GOOGLE_API_KEY`: For Gemini models
- `MISTRAL_API_KEY`: For Mistral models
- `LANGFUSE_*`: For LLM observability
- `NEXTAUTH_SECRET`: For frontend auth

### 4. Start Local Development

Start the entire stack (Frontend + Backend + DB + Redis):

```bash
pnpm dev
```

- **Frontend:** [http://localhost:3000](http://localhost:3000)
- **Backend API:** [http://localhost:8000](http://localhost:8000)
- **API Docs:** [http://localhost:8000/docs](http://localhost:8000/docs)
- **Flower (Celery Monitor):** [http://localhost:5555](http://localhost:5555)

### Running Services Individually

**Infrastructure Only (DB & Redis):**

```bash
pnpm infra:start
```

**Backend Only:**

```bash
pnpm --filter backend dev
```

**Frontend Only:**

```bash
pnpm --filter web dev
```

---

## 🗄️ Database Migrations

The backend uses Alembic for database migrations.

```bash
cd apps/backend

# Create a new migration
uv run alembic revision --autogenerate -m "Description of changes"

# Apply migrations
uv run alembic upgrade head
```

---

## 🚀 Deployment

This project is configured for deployment using **Dokploy** or standard **Docker Compose**.

### Docker Compose Deployment

The root `docker-compose.yaml` is production-ready.

1. Ensure all environment variables are set on your server.
2. Run:
   ```bash
   docker compose up -d --build
   ```

### CI/CD

- **GitHub Actions:**
  - Automatically runs database migrations on push to `main`.
  - Checks types and lints code.

---

## 🤝 Contributing

1. Fork the repo
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
