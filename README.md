# Modern Full-Stack Monorepo Template

A comprehensive monorepo template for building full-stack applications with TypeScript, React, Next.js, Python, and PostgreSQL with pgvector. Powered by Turborepo and pnpm for efficient workspace management.

## Project Structure

## Using this example

monorepo-template/
├── apps/
│ ├── backend/ # Python backend service
│ └── web/ # Next.js frontend application
├── packages/
│ ├── eslint-config/ # Shared ESLint configurations
│ ├── infrastructure/ # Docker-based infrastructure (PostgreSQL, Redis)
│ ├── typescript-config/ # Shared TypeScript configurations
│ └── ui/ # Shared React component library
├── .env.example # Example environment variables
├── turbo.json # Turborepo configuration
└── package.json # Root workspace configuration

## Technologies

- **Monorepo Management**

  - Turborepo for task orchestration
  - pnpm for package management

- **Frontend**

  - Next.js
  - React
  - TypeScript
  - Tailwind CSS

- **Backend**

  - Python
  - FastAPI

- **Infrastructure**
  - PostgreSQL with pgvector extension for vector embeddings
  - Redis for caching
  - Docker and Docker Compose

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm 10+
- Python 3.11+
- Docker and Docker Compose

### Initial Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/monorepo-template.git
   cd monorepo-template
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Set up environment variables:

   ```bash
   cp .env.example .envrc
   # Edit .env with your project-specific values
   ```

4. Use [direnv](https://direnv.net/) (MacOS & Linux) or `source` (Windows) to sync env variables:
   ```bash
   direnv allow
   ```
   or
   ```bash
   source .envrc
   ```

5. Start the development environment:
   ```bash
   pnpm dev

This will:

- Start the infrastructure services (PostgreSQL, Redis)
- Start the web application on http://localhost:3000
- Start the backend service

## Development Workflow

### Starting Development Environment

```bash
pnpm dev
```

This starts all services in parallel, including Docker infrastructure.

### Managing Infrastructure

```bash
# Start infrastructure only
pnpm infra:start

# Stop infrastructure
pnpm infra:stop
```

### Working with Specific Apps

```bash
# Run only the web app
pnpm --filter web dev

# Run only the backend
pnpm --filter backend dev
```

## Infrastructure Details

The infrastructure package provides:

- **PostgreSQL**: Running on port 54321 with pgvector extension for vector similarity search

  - Useful for AI applications, semantic search, or embeddings
  - Initialize with your own schema by editing `packages/infrastructure/init-db.sql.template`

- **Redis**: Running on port 63790 with password authentication
  - Useful for caching, session management, and pub/sub messaging

Environment variables control database names, users, and passwords to avoid conflicts between projects.

## Adding New Components

```bash
# Add a new component to the UI package
cd packages/ui
pnpm generate:component
```

## Notes for Customization

1. When starting a new project, update the database name in the `.envrc` file
2. The init-db.sql file is generated from the template on first run
3. Each project gets its own named volumes to prevent data conflicts

## Contributing

Contributions, issues, and feature requests are welcome!

## License

[MIT](LICENSE)
