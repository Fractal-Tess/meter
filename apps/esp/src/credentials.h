#ifndef CREDENTIALS_H
#define CREDENTIALS_H

// WiFi credentials
#define WIFI_SSID "krasimir"
#define WIFI_PASSWORD "6901264486"

// InfluxDB configuration
#define INFLUXDB_HOST "us-east-1-1.aws.cloud2.influxdata.com"  // InfluxDB host
#define INFLUXDB_PORT 443                                      // HTTPS port
#define INFLUXDB_ORG "1395e6e574f8a16e"                        // Organization ID
#define INFLUXDB_TOKEN "_HXkqNItKAa5Yt0HT5YUmLYnRn_EgTkKYI-eDY9dvDVhncx2xrGMBVRIzrWzmugf4v0pXBd4kVy6mSvLSg7dhw=="  // API token
#define INFLUXDB_BUCKET "greenhouse_1"                         // Bucket name

// Device configuration
#define DEVICE_ID "esp_dht11_01"           // Unique identifier for this device

#endif // CREDENTIALS_H 