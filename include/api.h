#ifndef API_H
#define API_H

#include <Arduino.h>
#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <WiFiClient.h>

// LED control variables
extern const int LED_BLINK_INTERVAL;
extern unsigned long lastLedToggle;
extern bool ledState;

// Function to create a record in PocketBase
void pbCreateRecord(const char* collection, const char* payload);

// Function to blink the built-in LED
void blinkRedLed();

#endif // API_H 