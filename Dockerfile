# ─────────────────────────────────────────────────────────────────────────────
# CarMarket / PMGXmedia – Multi-stage Dockerfile
#
# Build:   docker build -t carmarket .
# Run:     docker run -p 5000:5000 -e DATABASE_URL=... carmarket
# ─────────────────────────────────────────────────────────────────────────────

# ── Stage 1: install dependencies ────────────────────────────────────────────
FROM node:20-alpine AS deps
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts

# ── Stage 2: build client + server ───────────────────────────────────────────
FROM node:20-alpine AS builder
WORKDIR /app

# Copy installed modules from the deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy source files
COPY . .

# Build both the React frontend (→ dist/public/) and the Express server (→ dist/index.cjs)
RUN npm run build

# ── Stage 3: production runtime ───────────────────────────────────────────────
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=5000

# Only copy what the server needs at runtime
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 5000

CMD ["node", "dist/index.cjs"]
