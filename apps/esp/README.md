# DHT11 Temperature and Humidity Sensor Reader for ESP8266

Connected to GPIO D1 with InfluxDB data storage

## Features

- **DHT11 sensor support** connected to GPIO D1
- **InfluxDB integration** for data storage
- **Low power operation** using deep sleep mode
- **Configurable measurement intervals** (default: 30 seconds)
- **Location tagging** for multiple sensor deployments
- **Robust error handling** with retry logic
- **Temperature conversion** (Celsius and Fahrenheit display)
- **WiFi connection management** with automatic reconnection

## Requirements

- ESP8266 development board (NodeMCU, Wemos D1 Mini, etc.)
- DHT11 temperature and humidity sensor
- WiFi network access
- InfluxDB instance (cloud or local)

## Hardware Setup

1. Connect DHT11 sensor to ESP8266:
   - VCC → 3.3V
   - GND → GND
   - DATA → GPIO D1 (GPIO 5)

## Software Setup

### 1. Install Dependencies

The following libraries are required:

- `DHT sensor library` by Adafruit
- `ESP8266WiFi`
- `ESP8266HTTPClient`
- `WiFiClientSecure`

### 2. Configuration

1. Copy `credentials.example.h` to `credentials.h`:

   ```bash
   cp src/credentials.example.h src/credentials.h
   ```

2. Edit `src/credentials.h` with your settings:

   ```cpp
   // WiFi credentials
   #define WIFI_SSID "your_wifi_ssid"
   #define WIFI_PASSWORD "your_wifi_password"

   // InfluxDB configuration
   #define INFLUXDB_HOST "your_influxdb_host"
   #define INFLUXDB_ORG "your_org_id"
   #define INFLUXDB_TOKEN "your_api_token"
   #define INFLUXDB_BUCKET "your_bucket_name"

   // Device configuration
   #define DEVICE_ID "esp_dht11_01"

   // Optional: Override defaults
   // #define MEASUREMENT_INTERVAL 60  // Override default 30 seconds
   // #define SENSOR_LOCATION "bedroom"  // Override default "living-room"
   ```

### 3. Configuration Options

#### Measurement Interval

- Default: 30 seconds (like Python version)
- Override: Define `MEASUREMENT_INTERVAL` in `credentials.h`
- Range: 10-3600 seconds (10 seconds to 1 hour)

#### Location Tagging

- Default: "living-room"
- Override: Define `SENSOR_LOCATION` in `credentials.h`
- Used for InfluxDB tagging to distinguish multiple sensors

#### Sensor Retry Logic

- Max retries: 3 attempts
- Retry delay: 2 seconds between attempts
- Configurable in `config.h`

## Data Format

The ESP8266 sends data to InfluxDB in the following format:

```
dht11_reading,location=living-room,sensor_type=DHT11,device=esp_dht11_01 temperature=23.50,humidity=45.20
```

### InfluxDB Tags

- `location`: Sensor location (configurable)
- `sensor_type`: Always "DHT11"
- `device`: Unique device identifier

### InfluxDB Fields

- `temperature`: Temperature in Celsius
- `humidity`: Humidity percentage

## Operation

1. **Power on**: ESP8266 connects to WiFi
2. **Sensor reading**: Reads DHT11 with retry logic
3. **Data display**: Shows temperature (C/F) and humidity
4. **InfluxDB upload**: Sends data to configured InfluxDB instance
5. **Deep sleep**: Enters low-power sleep mode
6. **Wake up**: Automatically wakes after configured interval

## Serial Output Example

```
DHT11 Temperature and Humidity Sensor Reader for ESP8266
Connected to GPIO D1 with InfluxDB data storage
Measurement interval: 30 seconds
Location: living-room
Press reset to exit

Connecting to WiFi network: your_wifi_ssid
WiFi connected
IP address: 192.168.1.100
Signal strength (RSSI): -45 dBm

Reading sensor (attempt 1/3)...
✓ Sensor read successful

=== Sensor Reading ===
Temperature: 23.5°C (74.3°F)
Humidity: 45.2%
=====================

Sending data to InfluxDB...
URL: https://your_influxdb_host/api/v2/write?org=your_org_id&bucket=your_bucket_name
Payload: dht11_reading,location=living-room,sensor_type=DHT11,device=esp_dht11_01 temperature=23.50,humidity=45.20
HTTP Response code: 204
Response:
✓ Data written to InfluxDB

WiFi disconnected
Going to sleep for 30 seconds...
```

## Power Consumption

- **Active mode**: ~80mA during WiFi and sensor operations
- **Deep sleep**: ~20μA (very low power)
- **Battery life**: Several months with 18650 battery (depending on measurement interval)

## Troubleshooting

### WiFi Connection Issues

- Check SSID and password in `credentials.h`
- Verify WiFi signal strength
- Increase `MAX_RETRIES` in `config.h` if needed

### Sensor Reading Failures

- Check DHT11 wiring (VCC, GND, DATA)
- Verify sensor is not damaged
- Check power supply stability

### InfluxDB Upload Failures

- Verify InfluxDB host, org, token, and bucket
- Check network connectivity
- Verify SSL certificate (if using HTTPS)

### Compilation Issues

- Ensure all required libraries are installed
- Check Arduino IDE board settings (ESP8266)
- Verify file paths and includes

## Comparison with Python Version

This ESP8266 implementation provides the same core functionality as the Python version:

| Feature                | Python | ESP8266 |
| ---------------------- | ------ | ------- |
| DHT11 sensor reading   | ✓      | ✓       |
| InfluxDB integration   | ✓      | ✓       |
| Location tagging       | ✓      | ✓       |
| Temperature conversion | ✓      | ✓       |
| Error handling         | ✓      | ✓       |
| Retry logic            | ✓      | ✓       |
| Configurable intervals | ✓      | ✓       |
| Low power operation    | ✗      | ✓       |
| WiFi management        | ✗      | ✓       |

## License

Same as the main project license.
