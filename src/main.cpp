#include <Arduino.h>
#include <DHT.h>

// Pin definitions
#define DHTPIN 2      // Digital pin connected to the DHT sensor
#define DHTTYPE DHT11 // DHT 11
#define MQ9_AOUT A0   // Analog pin connected to the MQ-9 AOUT
#define MQ9_DOUT 12 // Digital pin connected to the MQ-9 DOUT (change as needed)

// MQ-9 Constants
const float RL =
    10.0; // Load resistance in kΩ (check your module's specification)
const float V_REF = 3.3;       // ESP8266 reference voltage
const float ADC_BITS = 1023.0; // 10-bit ADC

// Initialize DHT sensor
DHT dht(DHTPIN, DHTTYPE);

struct SensorData {
  float temperature;
  float humidity;
  float gasValue;
  bool gasThreshold;
  bool validDHT;
};

void setup() {
  Serial.begin(115200);
  Serial.println("\nESP8266 DHT11 and MQ-9 Module Test Starting...");

  // Initialize sensors
  dht.begin();
  pinMode(MQ9_AOUT, INPUT);
  pinMode(MQ9_DOUT, INPUT);

  Serial.println("Warming up MQ-9 sensor...");
  // Module handles the heating, but still needs warmup
  delay(20000); // 20 second initial warmup
}

float getMQ9Reading() {
  // Read the analog value
  int sensorValue = analogRead(MQ9_AOUT);

  // Convert to voltage (ESP8266 ADC is 0-1V with internal divider)
  float voltage = (sensorValue * V_REF) / ADC_BITS;

  // Convert to resistance ratio
  float rs = ((V_REF / voltage) - 1) * RL;

  return rs;
}

bool getMQ9DigitalReading() {
  return digitalRead(MQ9_DOUT) == LOW; // Usually LOW means gas detected
}

SensorData readSensors() {
  SensorData data;

  // Read DHT11 data
  data.temperature = dht.readTemperature();
  data.humidity = dht.readHumidity();
  data.validDHT = !isnan(data.temperature) && !isnan(data.humidity);

  // Read MQ-9 data
  data.gasValue = getMQ9Reading();
  data.gasThreshold = getMQ9DigitalReading();

  // Temperature compensation
  if (data.validDHT) {
    float tempFactor = 1.0;
    if (data.temperature < 20) {
      tempFactor = 1.2; // Approximate compensation for lower temperatures
    } else if (data.temperature > 30) {
      tempFactor = 0.8; // Approximate compensation for higher temperatures
    }
    data.gasValue *= tempFactor;
  }

  return data;
}

void printSensorData(const SensorData &data) {
  // Print timestamp
  Serial.print("Time: ");
  Serial.print(millis() / 1000);
  Serial.println("s");

  // Print DHT11 data
  if (data.validDHT) {
    Serial.print("Temperature: ");
    Serial.print(data.temperature);
    Serial.print("°C, Humidity: ");
    Serial.print(data.humidity);
    Serial.println("%");
  } else {
    Serial.println("Failed to read from DHT sensor!");
  }

  // Print MQ-9 data
  Serial.print("MQ-9 Gas Value: ");
  Serial.print(data.gasValue);
  Serial.print(" kΩ, Threshold: ");
  Serial.println(data.gasThreshold ? "TRIGGERED" : "Normal");

  // Basic gas detection alert
  if (data.gasThreshold) {
    Serial.println("WARNING: Gas level above threshold!");
  }

  Serial.println("-------------------");
}

void loop() {
  // Read all sensor data
  SensorData data = readSensors();

  // Print the data
  printSensorData(data);

  // Wait before next reading
  delay(1000);
}
