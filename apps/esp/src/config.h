#ifndef CONFIG_H
#define CONFIG_H

/**
 * Configuration file for ESP8266 sensor project
 * Updated to align with Python implementation
 */

// =============================================
// Sensor Configuration
// =============================================
#define DHT_PIN D1     // GPIO pin connected to DHT sensor
#define DHT_TYPE DHT11 // DHT sensor type (DHT11 or DHT22)

// =============================================
// Measurement Configuration
// =============================================
#define MEASUREMENT_INTERVAL 30  // Measurement interval in seconds (like Python version)
#define SLEEP_TIME_SECONDS MEASUREMENT_INTERVAL
#define uS_TO_S_FACTOR 1000000ULL

// =============================================
// Location Configuration
// =============================================
#define SENSOR_LOCATION "living-room"  // Location tag for InfluxDB (like Python version)

// =============================================
// Sleep Configuration
// =============================================
// Note: SLEEP_TIME_SECONDS is now defined above based on MEASUREMENT_INTERVAL

// =============================================
// Debug Configuration
// =============================================
#define DEBUG_SERIAL true   // Enable serial debug output
#define DEBUG_WIFI true     // Enable WiFi debug messages
#define DEBUG_INFLUXDB true // Enable InfluxDB debug messages
#define DEBUG_SENSOR true   // Enable sensor debug messages

// =============================================
// Network Configuration
// =============================================
#define WIFI_CONNECT_TIMEOUT 1000 // 1 second between connection attempts
#define WIFI_RECONNECT_INTERVAL                                                \
  30000                     // 30 seconds between WiFi reconnection attempts
#define RETRY_INTERVAL 5000 // 5 seconds between retries
#define MAX_RETRIES 30      // Maximum number of retries for WiFi connection

// =============================================
// InfluxDB Configuration
// =============================================
#define INFLUXDB_TIMEOUT 5000 // 5 seconds timeout for InfluxDB operations
#define INFLUXDB_BATCH_SIZE 1 // Number of points to batch before sending

// =============================================
// Sensor Reading Configuration
// =============================================
#define SENSOR_MAX_RETRIES 3  // Maximum number of retries for sensor reading
#define SENSOR_RETRY_DELAY 2000 // Delay between sensor read retries (ms)

#endif // CONFIG_H
