# -----------------------------
# Stage 1: Base image
# -----------------------------
    FROM --platform=linux/amd64 node:20-alpine AS base

    WORKDIR /app
    
    # Install required system packages
    RUN apk add --no-cache libc6-compat bash
    
    # Enable Corepack for pnpm
    RUN corepack enable && corepack prepare pnpm@10.15.1 --activate
    
    # -----------------------------
    # Stage 2: Dependencies
    # -----------------------------
    FROM base AS deps
    
    # Copy package files
    COPY package.json pnpm-lock.yaml* ./
    
    # Install dependencies
    RUN pnpm install --frozen-lockfile
    
    # -----------------------------
    # Stage 3: Builder
    # -----------------------------
    FROM base AS builder
    
    WORKDIR /app
    
    # Copy node_modules from deps stage
    COPY --from=deps /app/node_modules ./node_modules
    
    # Copy all source code
    COPY . .
    
    # Enable Corepack (pnpm)
    RUN corepack enable && corepack prepare pnpm@10.15.1 --activate
    
    # Set environment for build
    ENV NEXT_TELEMETRY_DISABLED=1
    ENV NODE_ENV=production
    
    # Build the Next.js application
    RUN pnpm run build
    
    # -----------------------------
    # Stage 4: Runner / Production
    # -----------------------------
    FROM base AS runner
    
    WORKDIR /app
    
    ENV NODE_ENV=production
    ENV NEXT_TELEMETRY_DISABLED=1
    ENV PORT=3000
    ENV HOSTNAME="0.0.0.0"
    
    # Create non-root user
    RUN addgroup --system --gid 1001 nodejs \
        && adduser --system --uid 1001 nextjs
    
    # Copy built application from builder
    COPY --from=builder /app/public ./public
    COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
    COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
    
    # Ensure .next directory exists and set permissions
    RUN mkdir -p .next && chown -R nextjs:nodejs .next
    
    # Run as non-root user
    USER nextjs
    
    # Expose port
    EXPOSE 3000
    
    # Start the app
    CMD ["node", "server.js"]
    