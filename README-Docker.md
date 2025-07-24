# Docker Deployment for Meter System

This project includes a complete Docker setup for the meter monitoring system with PWA dashboard.

## Services

The `docker-compose.yml` includes the following services:

### 1. **Web Dashboard** (`web`)

- **Port**: 8080
- **Description**: SvelteKit PWA dashboard for monitoring sensor data
- **Features**:
  - Progressive Web App with offline support
  - Real-time data visualization
  - Responsive design
  - Service worker for caching

### 2. **DHT11 Sensor** (`dht11-sensor`)

- **Port**: N/A (internal)
- **Description**: Raspberry Pi sensor application collecting temperature and humidity data
- **Features**:
  - GPIO access for sensor reading
  - Data collection and transmission to InfluxDB
  - Automatic restart on failure

### 3. **InfluxDB** (`influxdb`)

- **Port**: 8086
- **Description**: Time-series database for storing sensor data
- **Features**:
  - Persistent data storage
  - Time-series optimization
  - Web interface for data exploration

### 4. **Grafana** (`grafana`)

- **Port**: 3000
- **Description**: Data visualization and monitoring platform
- **Features**:
  - Pre-configured dashboards
  - Real-time monitoring
  - Alerting capabilities

## Quick Start

### Prerequisites

- Docker and Docker Compose installed
- At least 2GB of available RAM

### Start All Services

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

### Start Individual Services

```bash
# Start only the web dashboard
docker-compose up -d web

# Start sensor and database
docker-compose up -d dht11-sensor influxdb

# Start monitoring stack
docker-compose up -d influxdb grafana
```

## Access Points

- **Web Dashboard**: http://localhost:8080
- **InfluxDB UI**: http://localhost:8086
  - Username: `admin`
  - Password: `adminpassword`
- **Grafana**: http://localhost:3000
  - Username: `admin`
  - Password: `admin`

## Development

### Rebuild Web Service

```bash
# Rebuild only the web service
docker-compose build web

# Rebuild and restart
docker-compose up -d --build web
```

### View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f web
docker-compose logs -f dht11-sensor
docker-compose logs -f influxdb
docker-compose logs -f grafana
```

### Health Checks

```bash
# Check service status
docker-compose ps

# Test web service health
curl http://localhost:8080/health
```

## Configuration

### Environment Variables

- `INFLUXDB_URL`: InfluxDB connection URL
- `INFLUXDB_TOKEN`: Authentication token
- `INFLUXDB_ORG`: Organization name
- `INFLUXDB_BUCKET`: Data bucket name

### Volumes

- `influxdb-data`: Persistent InfluxDB data
- `influxdb-config`: InfluxDB configuration
- `grafana-data`: Persistent Grafana data

## Production Deployment

### With Traefik

The web service includes Traefik labels for reverse proxy integration:

```yaml
labels:
  - 'traefik.enable=true'
  - 'traefik.http.routers.meter-web.rule=Host(`meter.local`)'
```

### Custom Domain

Update the Traefik labels in `docker-compose.yml`:

```yaml
labels:
  - 'traefik.http.routers.meter-web.rule=Host(`your-domain.com`)'
```

## Troubleshooting

### Web Service Issues

```bash
# Check web service logs
docker-compose logs web

# Rebuild web service
docker-compose build --no-cache web

# Access container shell
docker-compose exec web sh
```

### Database Issues

```bash
# Check InfluxDB logs
docker-compose logs influxdb

# Reset InfluxDB data
docker-compose down
docker volume rm meter_influxdb-data
docker-compose up -d influxdb
```

### Sensor Issues

```bash
# Check sensor logs
docker-compose logs dht11-sensor

# Test GPIO access
docker-compose exec dht11-sensor python -c "import RPi.GPIO as GPIO; print('GPIO access OK')"
```

## Performance

### Resource Requirements

- **Minimum**: 2GB RAM, 2 CPU cores
- **Recommended**: 4GB RAM, 4 CPU cores
- **Storage**: 10GB for data persistence

### Optimization

- Use SSD storage for better I/O performance
- Increase Docker memory limits for large datasets
- Configure log rotation to prevent disk space issues

## Security

### Default Credentials

- **InfluxDB**: admin/adminpassword
- **Grafana**: admin/admin

### Recommendations

- Change default passwords in production
- Use environment variables for sensitive data
- Enable HTTPS with reverse proxy
- Restrict network access to services

## Monitoring

### Health Checks

All services include health checks:

- Web: HTTP endpoint at `/health`
- InfluxDB: Built-in health endpoint
- Grafana: Built-in health endpoint

### Logging

- JSON format logs with rotation
- 10MB max file size
- 3 files retention
