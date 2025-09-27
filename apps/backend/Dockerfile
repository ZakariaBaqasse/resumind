# syntax=docker/dockerfile:1.7

# Builder — install with uv
FROM ghcr.io/astral-sh/uv:python3.12-bookworm-slim AS builder
WORKDIR /app

# Copy only dependency manifests first for better layer caching
COPY pyproject.toml uv.lock ./
RUN --mount=type=cache, id=fastapi-cache, target=/root/.cache/uv,id=uv-cache \
    uv sync --locked --no-install-project --no-dev

# Copy the rest of the app
COPY . .
RUN --mount=type=cache, id=fastapi-cache, target=/root/.cache/uv,id=uv-cache \
    uv sync --locked --no-dev

# Runtime
FROM python:3.12-slim-bookworm
RUN apt-get update && apt-get install -y libpq-dev gcc && rm -rf /var/lib/apt/lists/*
COPY --from=builder /app /app
ENV PATH="/app/.venv/bin:$PATH"
RUN groupadd -r fastapi && useradd -r -g fastapi fastapi && chown -R fastapi:fastapi /app
USER fastapi
WORKDIR /app
EXPOSE 8000
CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8000"]