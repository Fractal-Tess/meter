#include <Arduino.h>
#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <WiFiClient.h>
#include <DHT.h>
#include "api.h"
#include "credentials.h"

// WiFi credentials from credentials.h
const char *ssid = WIFI_SSID;
const char *password = WIFI_PASSWORD;

// Door sensor pin
const int DOOR_SENSOR_PIN = D3; // Magnetic door sensor connected to D4
bool lastDoorState = false;     // Track previous door state

// Alarm enabled
const int ALARM_PIN = D2;
bool alarmEnabled = true;

// DHT11 configuration
#define DHTPIN D1
#define DHTTYPE DHT11
DHT dht(DHTPIN, DHTTYPE);


void setup()
{
  pinMode(DOOR_SENSOR_PIN, INPUT_PULLUP); // Enable internal pullup resistor
  pinMode(ALARM_PIN, OUTPUT);
  pinMode(LED_BUILTIN, OUTPUT);           // LED for visual feedback


  Serial.begin(115200);
  Serial.println("\nESP8266 HTTP Client Example Starting...");

  // Get initial door state
  lastDoorState = digitalRead(DOOR_SENSOR_PIN);
  Serial.print("Initial door state: ");
  Serial.println(lastDoorState ? "OPEN" : "CLOSED");

  // Connect to WiFi
  WiFi.begin(ssid, password);
  Serial.print("Connecting to WiFi");

  while (WiFi.status() != WL_CONNECTED)
  {
    delay(500);
    Serial.print(".");
  }

  Serial.println();
  Serial.print("Connected to WiFi network with IP Address: ");
  Serial.println(WiFi.localIP());

  dht.begin();  // Initialize DHT sensor
  Serial.println("DHT11 sensor initialized");
}

void doorState()
{
  bool currentDoorState = digitalRead(DOOR_SENSOR_PIN);

  // Check if door state has changed
  if (currentDoorState != lastDoorState)
  {
    Serial.print("Door is now: ");
    Serial.println(currentDoorState ? "OPEN" : "CLOSED");

    if (currentDoorState == true)
    {
      pbCreateRecord("door", "{}");
    }

    // Update last state
    lastDoorState = currentDoorState;
  }
}

void alarmState()
{
  blinkRedLed();
}

void measureDHT() {
  float humidity = dht.readHumidity();
  float temperature = dht.readTemperature();

  if (isnan(humidity) || isnan(temperature)) {
    Serial.println("Failed to read from DHT sensor!");
    return;
  }

  Serial.print("Temperature: ");
  Serial.print(temperature);
  Serial.print("°C, Humidity: ");
  Serial.print(humidity);
  Serial.println("%");

  // Create JSON string with temperature and humidity
  char jsonBuffer[64];
  snprintf(jsonBuffer, sizeof(jsonBuffer), "{\"temp\":%.1f,\"humidity\":%.1f}", temperature, humidity);
  pbCreateRecord("dht_data", jsonBuffer);
}

void loop()
{
  // Check door state every 100ms (debounce)
  static unsigned long lastDoorCheck = 0;
  if (millis() - lastDoorCheck >= 100) {
    doorState();
    lastDoorCheck = millis();
  }

  if (alarmEnabled) {
    alarmState();
  }


  // Check DHT sensor every 30 seconds
  static unsigned long lastDHTCheck = 0;
  if (millis() - lastDHTCheck >= 30000) {
    measureDHT();
    lastDHTCheck = millis();
  }
}
