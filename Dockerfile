# ==============================================================================
# US-SPURS AI Agent Swarm Orchestrator - Production Dockerfile
# Multi-stage build optimized for size, security, and performance
# ==============================================================================

# Stage 1: Dependencies
FROM node:20-alpine AS deps
LABEL maintainer="US-SPURS <contact@us-spurs.gov>"
LABEL classification="OFFICIAL USE ONLY"

RUN apk add --no-cache libc6-compat python3 make g++
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
# Install all dependencies (including devDependencies for build)
RUN npm ci && \
    npm cache clean --force

# Stage 2: Builder
FROM node:20-alpine AS builder
WORKDIR /app

# Copy dependencies from deps stage (includes devDependencies needed for build)
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build application with standalone output for optimized production bundle
ENV NEXT_TELEMETRY_DISABLED=1
ENV STANDALONE_OUTPUT=true
RUN npm run build

# Stage 3: Runner
FROM node:20-alpine AS runner
WORKDIR /app

# Security: Run as non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Copy built application
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Create runtime directories
RUN mkdir -p /app/artifacts /app/execution-history /app/logs && \
    chown -R nextjs:nodejs /app/artifacts /app/execution-history /app/logs

# Switch to non-root user
USER nextjs

# Expose port
EXPOSE 3000

# Environment variables
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api/health/live', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)}).on('error', () => process.exit(1))"

# Start application with dumb-init
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "server.js"]
