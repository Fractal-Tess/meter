# Docker Deployment for Meter Dashboard PWA

This directory contains Docker configuration for deploying the SvelteKit PWA with nginx.

## Files

- `Dockerfile` - Multi-stage build with Bun and nginx
- `nginx.conf` - Optimized nginx configuration for PWA
- `docker-compose.yml` - Easy deployment with docker-compose
- `.dockerignore` - Excludes unnecessary files from build

## Quick Start

### Using Docker Compose (Recommended)

```bash
# Build and start the container
docker-compose up -d

# View logs
docker-compose logs -f

# Stop the container
docker-compose down
```

The app will be available at `http://localhost:8080`

### Using Docker directly

```bash
# Build the image
docker build -t meter-dashboard .

# Run the container
docker run -d -p 8080:80 --name meter-web meter-dashboard

# View logs
docker logs meter-web

# Stop and remove container
docker stop meter-web && docker rm meter-web
```

## Features

### Multi-stage Build

- **Builder stage**: Uses Bun to install dependencies and build the app
- **Production stage**: Uses nginx:alpine for minimal image size

### Nginx Configuration

- **PWA optimized**: Proper caching for service workers and manifests
- **SPA routing**: Handles client-side routing with fallback to index.html
- **Compression**: Gzip compression for better performance
- **Security headers**: XSS protection, content type sniffing prevention
- **Caching strategies**:
  - Static assets: 1 year cache
  - HTML files: 1 hour cache
  - PWA files: No cache (always fresh)
  - API routes: No cache

### Health Checks

- Built-in health check endpoint at `/health`
- Docker health check with curl
- Automatic restart on failure

## Environment Variables

- `NODE_ENV=production` - Ensures production optimizations

## Ports

- **80** - Internal nginx port
- **8080** - External port (configurable in docker-compose.yml)

## Volumes

No persistent volumes are required as this is a static SPA.

## Production Deployment

### With Traefik (docker-compose.yml includes labels)

```bash
# Deploy with Traefik reverse proxy
docker-compose up -d

# Access via: http://meter.local (add to /etc/hosts)
```

### With Custom Domain

```bash
# Build and tag for your registry
docker build -t your-registry/meter-dashboard:latest .

# Push to registry
docker push your-registry/meter-dashboard:latest

# Deploy to your server
docker run -d -p 80:80 your-registry/meter-dashboard:latest
```

## Monitoring

### Health Check

```bash
# Check container health
docker ps

# Test health endpoint
curl http://localhost:8080/health
```

### Logs

```bash
# View nginx access logs
docker exec meter-web tail -f /var/log/nginx/access.log

# View nginx error logs
docker exec meter-web tail -f /var/log/nginx/error.log
```

## Troubleshooting

### Build Issues

```bash
# Clean build
docker-compose build --no-cache

# Check build context
docker build --progress=plain .
```

### Runtime Issues

```bash
# Check container status
docker-compose ps

# View detailed logs
docker-compose logs meter-web

# Access container shell
docker exec -it meter-web sh
```

### PWA Issues

- Ensure HTTPS in production (PWA requires secure context)
- Check service worker registration in browser dev tools
- Verify manifest.json is accessible at `/manifest.webmanifest`

## Performance

The Docker setup is optimized for:

- **Fast builds**: Multi-stage with layer caching
- **Small images**: Alpine-based nginx
- **Efficient serving**: Static file serving with proper caching
- **Security**: Non-root user, security headers
- **Monitoring**: Health checks and logging
