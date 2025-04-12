#include <Arduino.h>
#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <WiFiClientSecure.h>
#include <DHT.h>
#include "credentials.h"
#include <user_interface.h> // For ESP8266 deep sleep

// Sleep configuration (15 minutes)
#define SLEEP_TIME_SECONDS 1800  // 15 minutes = 900 seconds
#define uS_TO_S_FACTOR 1000000ULL

// WiFi credentials from credentials.h
const char *ssid = WIFI_SSID;
const char *password = WIFI_PASSWORD;

#define DHTPIN D1
#define DHTTYPE DHT11
DHT dht(DHTPIN, DHTTYPE);

// Function prototypes
void setupWiFi();
bool sendToInfluxDB(float temperature, float humidity);
String createInfluxDBPayload(float temperature, float humidity);
void goToSleep();

void setupWiFi() {
  Serial.print("Connecting to WiFi network: ");
  Serial.println(WIFI_SSID);
  
  // Set WiFi to station mode
  WiFi.mode(WIFI_STA);
  
  // Begin WiFi connection
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  
  // Wait for connection
  int attempt = 0;
  const int maxAttempts = 30;
  
  while (WiFi.status() != WL_CONNECTED && attempt < maxAttempts) {
    delay(1000);
    Serial.print(".");
    attempt++;
    
    // Blink LED to show connection attempt
    digitalWrite(LED_BUILTIN, LOW);
    delay(100);
    digitalWrite(LED_BUILTIN, HIGH);
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

void setup()
{
  pinMode(LED_BUILTIN, OUTPUT);
  digitalWrite(LED_BUILTIN, HIGH);

  Serial.begin(115200);
  delay(1000);
  
  Serial.println("\nDHT11 to InfluxDB Logger (Low Power Mode)");
  
  // Initialize DHT sensor
  dht.begin();
  
  // Start WiFi connection
  setupWiFi();
  
  // Only proceed if WiFi is connected
  if (WiFi.status() == WL_CONNECTED) {
    // Turn LED off
    digitalWrite(LED_BUILTIN, LOW);

    // Read sensor data
    Serial.println("Reading sensor data...");
    float humidity = dht.readHumidity();
    float temperature = dht.readTemperature();
    
    if (isnan(humidity) || isnan(temperature)) {
      Serial.println("Failed to read from DHT sensor!");
    } else {
      Serial.print("Temperature: ");
      Serial.print(temperature);
      Serial.print(" °C, Humidity: ");
      Serial.print(humidity);
      Serial.println(" %");
      
      // Send data to InfluxDB
      if (sendToInfluxDB(temperature, humidity)) {
        Serial.println("Data sent to InfluxDB successfully");
      } else {
        Serial.println("Failed to send data to InfluxDB");
      }
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

  // Turn LED off
  digitalWrite(LED_BUILTIN, LOW);
  
  // Enter deep sleep mode
  goToSleep();
}

String createInfluxDBPayload(float temperature, float humidity) {
  // Format: measurement,tag_key=tag_value field_key=field_value
  String payload = "dht11_data,device=";
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
