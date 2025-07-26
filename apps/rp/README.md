# Raspberry Pi DHT11 Sensor

A Python application for reading temperature and humidity data from a DHT11 sensor connected to a Raspberry Pi and sending it to InfluxDB.

## Requirements

- Raspberry Pi with GPIO access
- DHT11 sensor connected to GPIO 4
- Python 3.7+
- Required Python packages (see `pyproject.toml`)

## Installation

```bash
# Install dependencies
pip install -r requirements.txt
# or with uv
uv sync
```

## Configuration

### Environment Variables

- `INFLUXDB_URL`: InfluxDB connection URL (default: http://localhost:8086)
- `INFLUXDB_TOKEN`: Authentication token (default: your-super-secret-auth-token)
- `INFLUXDB_ORG`: Organization name (default: my-org)
- `INFLUXDB_BUCKET`: Data bucket name (default: sensor-data)
- `INFLUXDB_MEASUREMENT`: Measurement name (default: dht11_reading)
- `MEASUREMENT_INTERVAL`: Time interval between sensor readings in seconds (default: 30)

### Hardware Setup

1. Connect DHT11 sensor to GPIO 4
2. Ensure proper power supply (3.3V)
3. Connect data pin to GPIO 4

## Usage

### Development

```bash
# Run with default settings
python main.py

# Run with custom interval
MEASUREMENT_INTERVAL=60 python main.py
```

### Docker

```bash
# Build and run with Docker
docker build -t dht11-sensor .
docker run --privileged -e MEASUREMENT_INTERVAL=30 dht11-sensor
```

### Docker Compose

```bash
# Start with docker-compose
docker-compose up dht11-sensor
```

## Features

- Continuous temperature and humidity monitoring
- Automatic data transmission to InfluxDB
- Configurable measurement intervals
- Error handling and retry logic
- Clean shutdown on interrupt

## Troubleshooting

### GPIO Access Issues

```bash
# Check GPIO permissions
ls -la /dev/gpiomem

# Add user to gpio group
sudo usermod -a -G gpio $USER
```

### Sensor Reading Errors

- Ensure proper wiring
- Check power supply (3.3V)
- Verify sensor is not damaged
- DHT11 sensors can be finicky - errors are normal

### InfluxDB Connection Issues

- Verify InfluxDB is running
- Check network connectivity
- Validate authentication token
- Ensure bucket exists
