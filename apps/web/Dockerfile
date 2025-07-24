FROM oven/bun:1 AS base

FROM base AS builder
# Set working directory
WORKDIR /app
COPY . .

# Install dependencies
RUN bun install

# Copy private environment variables 
# These will be overridden by the environment variables in the production container, but .env file is needed for $env/static/public
# RUN cp /app/apps/web/.env.example /app/apps/web/.env
RUN cd /app/apps/web && bun run build-env

# Build the project
RUN bun run build --filter=web

# Production stage with nginx
FROM nginx:alpine AS runner

# Install curl for health checks
RUN apk add --no-cache curl

# Copy built application from builder stage
COPY --from=builder /app/apps/web/build /usr/share/nginx/html

# Copy nginx configuration
COPY apps/web/nginx.conf /etc/nginx/nginx.conf

# Use existing nginx user (already exists in alpine nginx image)

# Set proper permissions
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chmod -R 755 /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost/health || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"] 