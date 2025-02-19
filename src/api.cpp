#include "api.h"
#include "wiring_private.h"

// Define LED control variables
const int LED_BLINK_INTERVAL = 500;  // Blink every 500ms
unsigned long lastLedToggle = 0;
bool ledState = false;

void pbCreateRecord(const char* collection, const char* payload)
{
  // Check WiFi connection status
  if (WiFi.status() == WL_CONNECTED)
  {
    WiFiClient client;
    HTTPClient http;

    // Construct full URL by combining server base URL with endpoint
    String fullUrl = String("http://192.168.12.116:8080/api/collections/") + collection + "/records";
    
    Serial.print("Making HTTP request to: ");
    Serial.println(fullUrl);

    // Begin HTTP connection
    http.begin(client, fullUrl);

    // Add headers if needed
    http.addHeader("Content-Type", "application/json");

    // Send HTTP POST request
    int httpResponseCode = http.POST(payload);

    if (httpResponseCode > 0)
    {
      Serial.print("HTTP Response code: "); Serial.println(httpResponseCode);
      String payload = http.getString();
      Serial.println("Response payload:");
      Serial.println(payload);

      // Blink LED if request was successful
      digitalWrite(LED_BUILTIN, LOW);  // Turn LED on
      delay(500);                      // Wait 500ms
      digitalWrite(LED_BUILTIN, HIGH); // Turn LED off
    } else
    {
      Serial.print("Error code: ");
      Serial.println(httpResponseCode);
    }

    // Free resources
    http.end();
  }
  else
  {
    Serial.println("WiFi Disconnected");
  }
}

void blinkRedLed() {
  unsigned long currentMillis = millis();
  
  if (currentMillis - lastLedToggle >= LED_BLINK_INTERVAL) {
    ledState = !ledState;  // Toggle LED state
    digitalWrite(ALARM_PIN, ledState);
    lastLedToggle = currentMillis;
  }
}