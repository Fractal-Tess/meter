# -----------------------------------------------------------------------------
# This Dockerfile is optimized for Turborepo monorepos using Bun
# Uses turbo prune to only include necessary dependencies
# Based on the official Turborepo Docker example
# -----------------------------------------------------------------------------

FROM oven/bun:1.3.5 AS base

WORKDIR /app

# ---
FROM base AS prepare

RUN bun add -g turbo@^2

COPY . .

RUN turbo prune web --docker

# ---
FROM base AS builder

# First install the dependencies (as they change less often)
COPY --from=prepare /app/out/json/ .
COPY --from=prepare /app/out/bun.lockb* ./
RUN bun install

# Build the project
COPY --from=prepare /app/out/full/ .

# Reinstall to ensure workspace links and all dependencies are properly established
RUN bun install

# Uncomment and use build args to enable remote caching
# ARG TURBO_TEAM
# ENV TURBO_TEAM=$TURBO_TEAM
# ARG TURBO_TOKEN
# ENV TURBO_TOKEN=$TURBO_TOKEN

RUN bun run turbo build

# ---
FROM nginx:alpine AS runtime

# Copy NGINX configuration
COPY apps/web/nginx.conf /etc/nginx/nginx.conf

# Copy built files to NGINX html directory
COPY --from=builder /app/apps/web/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]