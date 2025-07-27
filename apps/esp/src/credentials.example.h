#ifndef CREDENTIALS_H
#define CREDENTIALS_H

// WiFi credentials
#define WIFI_SSID "your_wifi_ssid"
#define WIFI_PASSWORD "your_wifi_password"

// InfluxDB configuration
#define INFLUXDB_HOST "your_influxdb_host"  // InfluxDB host
#define INFLUXDB_PORT 443                   // HTTPS port
#define INFLUXDB_ORG "your_org_id"          // Organization ID
#define INFLUXDB_TOKEN "your_api_token"     // API token
#define INFLUXDB_BUCKET "your_bucket_name"  // Bucket name

// Device configuration
#define DEVICE_ID "your_device_id"          // Unique identifier for this device

// Optional: Override default measurement interval (in seconds)
// #define MEASUREMENT_INTERVAL 60  // Uncomment and set to override default 30 seconds

// Optional: Override default location
// #define SENSOR_LOCATION "bedroom"  // Uncomment and set to override default "living-room"

#endif // CREDENTIALS_H 