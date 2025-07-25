FROM oven/bun:1 AS base

FROM base AS builder

# Declare ARGs after FROM (they need to be redeclared in each stage)
ARG PUBLIC_INFLUXDB_URL
ARG PUBLIC_INFLUXDB_TOKEN
ARG PUBLIC_INFLUXDB_ORG
ARG PUBLIC_INFLUXDB_BUCKET
ARG PUBLIC_INFLUXDB_MEASUREMENT
ARG PUBLIC_ORIGIN

RUN echo "PUBLIC_INFLUXDB_URL: $PUBLIC_INFLUXDB_URL"
RUN echo "PUBLIC_INFLUXDB_TOKEN: $PUBLIC_INFLUXDB_TOKEN"
RUN echo "PUBLIC_INFLUXDB_ORG: $PUBLIC_INFLUXDB_ORG"
RUN echo "PUBLIC_INFLUXDB_BUCKET: $PUBLIC_INFLUXDB_BUCKET"
RUN echo "PUBLIC_INFLUXDB_MEASUREMENT: $PUBLIC_INFLUXDB_MEASUREMENT"
RUN echo "PUBLIC_ORIGIN: $PUBLIC_ORIGIN"

# Set working directory
WORKDIR /app

COPY . .

# Install dependencies
RUN bun install

# Copy private environment variables 
# These will be overridden by the environment variables in the production container, but .env file is needed for $env/static/public
RUN cp /app/apps/web/.env.example /app/apps/web/.env

# Set environment variables from build args
ENV PUBLIC_INFLUXDB_URL=$PUBLIC_INFLUXDB_URL
ENV PUBLIC_INFLUXDB_TOKEN=$PUBLIC_INFLUXDB_TOKEN
ENV PUBLIC_INFLUXDB_ORG=$PUBLIC_INFLUXDB_ORG
ENV PUBLIC_INFLUXDB_BUCKET=$PUBLIC_INFLUXDB_BUCKET
ENV PUBLIC_INFLUXDB_MEASUREMENT=$PUBLIC_INFLUXDB_MEASUREMENT
ENV PUBLIC_ORIGIN=$PUBLIC_ORIGIN

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