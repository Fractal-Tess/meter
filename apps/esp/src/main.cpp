#include <Arduino.h>
#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <WiFiClientSecure.h>
#include <DHT.h>
#include "credentials.h"
#include "config.h"
#include <user_interface.h> // For ESP8266 deep sleep

// Sleep configuration (configurable via environment or default)
#ifndef MEASUREMENT_INTERVAL
#define MEASUREMENT_INTERVAL 30  // Default 30 seconds (like Python version)
#endif

#define SLEEP_TIME_SECONDS MEASUREMENT_INTERVAL
#define uS_TO_S_FACTOR 1000000ULL

// WiFi credentials from credentials.h
const char *ssid = WIFI_SSID;
const char *password = WIFI_PASSWORD;

// Sensor configuration
#define DHTPIN D1
#define DHTTYPE DHT11
DHT dht(DHTPIN, DHTTYPE);

// Location configuration (like Python version)
#ifndef SENSOR_LOCATION
#define SENSOR_LOCATION "living-room"
#endif

// Function prototypes
void setupWiFi();
bool sendToInfluxDB(float temperature, float humidity);
String createInfluxDBPayload(float temperature, float humidity);
void goToSleep();
bool readSensor(float &temperature, float &humidity);
float celsiusToFahrenheit(float celsius);

void setupWiFi() {
  Serial.print("Connecting to WiFi network: ");
  Serial.println(WIFI_SSID);
  
  // Set WiFi to station mode
  WiFi.mode(WIFI_STA);
  
  // Begin WiFi connection
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  
  // Wait for connection
  int attempt = 0;
  
  while (WiFi.status() != WL_CONNECTED && attempt < MAX_RETRIES) {
    delay(WIFI_CONNECT_TIMEOUT);
    Serial.print(".");
    attempt++;
  }

  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("");
    Serial.println("WiFi connected");
    Serial.print("IP address: ");
    Serial.println(WiFi.localIP());
    Serial.print("Signal strength (RSSI): ");
    Serial.print(WiFi.RSSI());
    Serial.println(" dBm");
  } else {
    Serial.println("");
    Serial.println("WiFi connection failed after maximum attempts");
    Serial.println("WiFi status: " + String(WiFi.status()));
  }
}

bool readSensor(float &temperature, float &humidity) {
  // Try multiple times to read sensor (like Python version)
  for (int attempt = 1; attempt <= SENSOR_MAX_RETRIES; attempt++) {
    Serial.print("Reading sensor (attempt ");
    Serial.print(attempt);
    Serial.print("/");
    Serial.print(SENSOR_MAX_RETRIES);
    Serial.println(")...");
    
    humidity = dht.readHumidity();
    temperature = dht.readTemperature();
    
    if (!isnan(humidity) && !isnan(temperature)) {
      Serial.println("✓ Sensor read successful");
      return true;
    } else {
      Serial.print("✗ Sensor read failed (attempt ");
      Serial.print(attempt);
      Serial.println(")");
      
      if (attempt < SENSOR_MAX_RETRIES) {
        delay(SENSOR_RETRY_DELAY); // Wait before retry
      }
    }
  }
  
  Serial.println("✗ Failed to read sensor after all attempts");
  return false;
}

float celsiusToFahrenheit(float celsius) {
  return (celsius * 9.0 / 5.0) + 32.0;
}

void setup()
{
  Serial.begin(115200);
  delay(1000);
  
  Serial.println("\nDHT11 Temperature and Humidity Sensor Reader for ESP8266");
  Serial.println("Connected to GPIO D1 with InfluxDB data storage");
  Serial.print("Measurement interval: ");
  Serial.print(MEASUREMENT_INTERVAL);
  Serial.println(" seconds");
  Serial.print("Location: ");
  Serial.println(SENSOR_LOCATION);
  Serial.println("Press reset to exit\n");
  
  // Initialize DHT sensor
  dht.begin();
  
  // Start WiFi connection
  setupWiFi();
  
  // Only proceed if WiFi is connected
  if (WiFi.status() == WL_CONNECTED) {
    // Read sensor data with retry logic
    float humidity, temperature;
    
    if (readSensor(temperature, humidity)) {
      // Convert to Fahrenheit for display (like Python version)
      float temp_fahrenheit = celsiusToFahrenheit(temperature);
      
      Serial.println("=== Sensor Reading ===");
      Serial.print("Temperature: ");
      Serial.print(temperature, 1);
      Serial.print("°C (");
      Serial.print(temp_fahrenheit, 1);
      Serial.println("°F)");
      Serial.print("Humidity: ");
      Serial.print(humidity, 1);
      Serial.println("%");
      Serial.println("=====================");
      
      // Send data to InfluxDB
      if (sendToInfluxDB(temperature, humidity)) {
        Serial.println("✓ Data written to InfluxDB");
      } else {
        Serial.println("✗ Failed to write to InfluxDB");
      }
    } else {
      Serial.println("✗ Failed to read sensor data");
    }
  } else {
    Serial.println("Skipping sensor read and InfluxDB upload due to WiFi connection failure");
  }
  
  // Disconnect WiFi to save power
  WiFi.disconnect(true);
  Serial.println("WiFi disconnected");
  
  // Go to sleep
  Serial.print("Going to sleep for ");
  Serial.print(SLEEP_TIME_SECONDS);
  Serial.println(" seconds...");
  
  // Wait for serial to finish sending
  Serial.flush();

  // Enter deep sleep mode
  goToSleep();
}

String createInfluxDBPayload(float temperature, float humidity) {
  // Format: measurement,tag_key=tag_value field_key=field_value
  // Updated to match Python version with location and sensor_type tags
  String payload = "dht11_reading,location=";
  payload += SENSOR_LOCATION;
  payload += ",sensor_type=DHT11,device=";
  payload += DEVICE_ID;
  payload += " temperature=";
  payload += String(temperature, 2);  // Format to 2 decimal places
  payload += ",humidity=";
  payload += String(humidity, 2);     // Format to 2 decimal places
  
  return payload;
}

bool sendToInfluxDB(float temperature, float humidity) {
  // Check WiFi connection status
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("WiFi not connected. Cannot send data.");
    return false;
  }
  
  HTTPClient http;
  WiFiClientSecure client;
  
  // Skip SSL certificate verification (not recommended for production)
  client.setInsecure();
  
  // Prepare the URL (HTTP API v2)
  String url = "https://";
  url += INFLUXDB_HOST;
  url += "/api/v2/write?org=";
  url += INFLUXDB_ORG;
  url += "&bucket=";
  url += INFLUXDB_BUCKET;
  
  // Create payload
  String payload = createInfluxDBPayload(temperature, humidity);
  
  http.begin(client, url);
  http.addHeader("Content-Type", "text/plain; charset=utf-8");
  http.addHeader("Authorization", "Token " + String(INFLUXDB_TOKEN));
  
  Serial.println("Sending data to InfluxDB...");
  Serial.println("URL: " + url);
  Serial.println("Payload: " + payload);
  
  // Make the POST request
  int httpResponseCode = http.POST(payload);
  
  // Check response
  if (httpResponseCode > 0) {
    String response = http.getString();
    Serial.println("HTTP Response code: " + String(httpResponseCode));
    Serial.println("Response: " + response);
    http.end();
    return httpResponseCode == 204; // InfluxDB returns 204 No Content on success
  } else {
    Serial.print("Error on sending POST: ");
    Serial.println(httpResponseCode);
    String response = http.getString();
    Serial.println("Error response: " + response);
    http.end();
    return false;
  }
}

void goToSleep() {
  // ESP8266 deep sleep (in microseconds)
  ESP.deepSleep(SLEEP_TIME_SECONDS * uS_TO_S_FACTOR);
}

// Required by Arduino framework, even though we're using deep sleep
void loop() {
  // This will never run as we're using deep sleep
}
