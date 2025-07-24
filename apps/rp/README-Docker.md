# DHT11 Sensor Docker Container

This directory contains Docker configuration for running the DHT11 temperature and humidity sensor application in a container on Raspberry Pi.

## Prerequisites

- Docker installed on Raspberry Pi
- DHT11 sensor connected to GPIO pin 4
- Docker Compose (optional, for easier deployment)

## Files

- `Dockerfile` - Container definition
- `docker-compose.yml` - Service configuration with GPIO access
- `.dockerignore` - Files to exclude from build context

## Building the Container

### Option 1: Using Docker Compose (Recommended)
```bash
docker-compose up --build
```

### Option 2: Using Docker directly
```bash
# Build the image
docker build -t dht11-sensor .

# Run the container with GPIO access
docker run --privileged \
  --device /dev/gpiomem:/dev/gpiomem \
  --device /dev/mem:/dev/mem \
  -v /sys:/sys:ro \
  --name dht11-sensor-app \
  dht11-sensor
```

## GPIO Access Requirements

The container requires privileged access to GPIO pins:
- `--privileged` flag for full system access
- Device mappings for `/dev/gpiomem` and `/dev/mem`
- Read-only access to `/sys` for system information

## Container Features

- Based on Python 3.11 slim image
- Optimized for ARM64 (Raspberry Pi)
- Non-root user execution for security
- Health checks to verify sensor connectivity
- Automatic restart on failure
- Log rotation configured

## Monitoring

The container includes a health check that verifies the application can import required modules. Check container health with:

```bash
docker ps
docker logs dht11-sensor-app
```

## Stopping the Container

```bash
# Using docker-compose
docker-compose down

# Using docker directly
docker stop dht11-sensor-app
docker rm dht11-sensor-app
```

## Troubleshooting

1. **Permission denied errors**: Ensure the container runs with `--privileged` flag
2. **GPIO access issues**: Verify device mappings are correct
3. **Import errors**: Check that all dependencies are installed correctly
4. **Sensor reading failures**: Verify DHT11 sensor wiring to GPIO pin 4

## Optional Enhancements

The docker-compose.yml includes commented configuration for adding Grafana monitoring. Uncomment those sections to add a web-based dashboard for sensor data visualization. 