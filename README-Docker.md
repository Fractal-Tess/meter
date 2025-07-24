# DHT11 Sensor Docker Container with InfluxDB & Grafana

This directory contains Docker configuration for running the DHT11 temperature and humidity sensor application with data storage and visualization.

## Architecture

- **DHT11 Sensor App**: Reads sensor data and stores it in InfluxDB
- **InfluxDB**: Time-series database optimized for sensor data
- **Grafana**: Web-based dashboard for data visualization

## Prerequisites

- Docker installed on Raspberry Pi
- DHT11 sensor connected to GPIO pin 4
- Docker Compose (recommended for easy deployment)

## Files

- `Dockerfile` - Container definition for sensor app
- `docker-compose.yml` - Complete stack with InfluxDB and Grafana
- `.dockerignore` - Files to exclude from build context
- `grafana/` - Grafana provisioning configuration
- `main.py` - Updated sensor app with InfluxDB integration

## Quick Start

1. **Start the complete stack:**
```bash
docker-compose up --build -d
```

2. **Access the services:**
   - **Grafana Dashboard**: http://localhost:3000 (admin/admin)
   - **InfluxDB API**: http://localhost:8086

3. **View sensor data:**
   - Open Grafana at http://localhost:3000
   - Login with admin/admin
   - The DHT11 Sensor Dashboard will be automatically loaded

## Manual Docker Commands

### Build and run sensor app only:
```bash
# Build the image
docker build -t dht11-sensor .

# Run with InfluxDB connection
docker run --privileged \
  --device /dev/gpiomem:/dev/gpiomem \
  --device /dev/mem:/dev/mem \
  -v /sys:/sys:ro \
  -e INFLUXDB_URL=http://influxdb:8086 \
  -e INFLUXDB_TOKEN=your-super-secret-auth-token \
  -e INFLUXDB_ORG=my-org \
  -e INFLUXDB_BUCKET=sensor-data \
  --name dht11-sensor-app \
  dht11-sensor
```

## Data Storage

### InfluxDB Configuration
- **Database**: InfluxDB 2.7
- **Organization**: my-org
- **Bucket**: sensor-data
- **Measurement**: dht11_reading
- **Fields**: temperature_celsius, temperature_fahrenheit, humidity_percent
- **Tags**: location, sensor_type

### Data Retention
InfluxDB automatically manages data retention. You can configure retention policies:
- Default: 30 days
- Customizable via InfluxDB UI or API

## Visualization

### Grafana Dashboard Features
- Real-time temperature and humidity displays
- Time-series graphs (1h, 6h views)
- Color-coded thresholds
- Auto-refresh every 5 seconds
- Dark theme optimized

### Dashboard Panels
1. **Current Temperature** - Latest reading with color thresholds
2. **Current Humidity** - Latest reading with color thresholds  
3. **Temperature Over Time** - 1-hour trend
4. **Humidity Over Time** - 1-hour trend
5. **Combined View** - 6-hour temperature and humidity comparison

## Data Analysis Examples

### InfluxDB Flux Queries

**Latest temperature:**
```flux
from(bucket: "sensor-data")
  |> range(start: -1h)
  |> filter(fn: (r) => r["_measurement"] == "dht11_reading")
  |> filter(fn: (r) => r["_field"] == "temperature_celsius")
  |> last()
```

**Average temperature by hour:**
```flux
from(bucket: "sensor-data")
  |> range(start: -24h)
  |> filter(fn: (r) => r["_measurement"] == "dht11_reading")
  |> filter(fn: (r) => r["_field"] == "temperature_celsius")
  |> aggregateWindow(every: 1h, fn: mean, createEmpty: false)
```

**Humidity statistics:**
```flux
from(bucket: "sensor-data")
  |> range(start: -7d)
  |> filter(fn: (r) => r["_measurement"] == "dht11_reading")
  |> filter(fn: (r) => r["_field"] == "humidity_percent")
  |> aggregateWindow(every: 1d, fn: {min: min, max: max, mean: mean}, createEmpty: false)
```

## GPIO Access Requirements

The container requires privileged access to GPIO pins:
- `--privileged` flag for full system access
- Device mappings for `/dev/gpiomem` and `/dev/mem`
- Read-only access to `/sys` for system information

## Container Features

- Based on Python 3.11 slim image
- Optimized for ARM64 (Raspberry Pi)
- Root user execution for GPIO access
- Health checks to verify sensor connectivity
- Automatic restart on failure
- Log rotation configured
- InfluxDB integration for data persistence

## Monitoring

### Container Health
```bash
docker ps
docker logs dht11-sensor-app
docker logs influxdb
docker logs grafana
```

### Data Verification
```bash
# Check InfluxDB data
curl -G "http://localhost:8086/query" \
  --data-urlencode "org=my-org" \
  --data-urlencode "token=your-super-secret-auth-token" \
  --data-urlencode "q=from(bucket:\"sensor-data\") |> range(start: -1h) |> count()"
```

## Stopping the Stack

```bash
# Stop all services
docker-compose down

# Stop and remove volumes (WARNING: This deletes all data)
docker-compose down -v
```

## Troubleshooting

1. **Permission denied errors**: Ensure the container runs with `--privileged` flag
2. **GPIO access issues**: Verify device mappings are correct
3. **Import errors**: Check that all dependencies are installed correctly
4. **Sensor reading failures**: Verify DHT11 sensor wiring to GPIO pin 4
5. **InfluxDB connection errors**: Check network connectivity and token configuration
6. **Grafana login issues**: Default credentials are admin/admin

## Performance Considerations

- **Data retention**: Configure appropriate retention policies for your storage
- **Sampling rate**: DHT11 max rate is 1Hz, current setting is 2 seconds
- **Memory usage**: Monitor container resource usage on Raspberry Pi
- **Storage**: InfluxDB data grows over time, plan storage accordingly

## Security Notes

- Default passwords should be changed in production
- Consider using Docker secrets for sensitive data
- Restrict network access to InfluxDB and Grafana ports
- Regular security updates for all containers 