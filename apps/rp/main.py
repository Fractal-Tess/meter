#!/usr/bin/env python3
"""
DHT11 Temperature and Humidity Sensor Reader for Raspberry Pi
Connected to GPIO pin 4 with InfluxDB data storage

Requirements:
- DHT11 sensor connected to GPIO 4
- Adafruit CircuitPython DHT library
- InfluxDB client library
- Install with: pip3 install adafruit-circuitpython-dht influxdb-client
- Also install: sudo apt-get install libgpiod2
"""

import time
import board
import adafruit_dht
from datetime import datetime
import os
from influxdb_client import InfluxDBClient, Point
from influxdb_client.client.write_api import SYNCHRONOUS

class DHT11Reader:
    def __init__(self, pin=board.D4):
        """
        Initialize DHT11 sensor
        
        Args:
            pin: GPIO pin (default: board.D4 for GPIO 4)
        """
        self.dht = adafruit_dht.DHT11(pin)
        self.pin = pin
        
    def read_sensor(self):
        """
        Read temperature and humidity from DHT11 sensor
        
        Returns:
            tuple: (temperature_celsius, humidity_percent) or (None, None) if error
        """
        try:
            temperature = self.dht.temperature
            humidity = self.dht.humidity
            
            if humidity is not None and temperature is not None:
                return temperature, humidity
            else:
                return None, None
                
        except RuntimeError as e:
            # DHT sensors can be finicky, errors are common
            print(f"Reading error: {e}")
            return None, None
        except Exception as e:
            print(f"Unexpected error: {e}")
            return None, None
    
    def cleanup(self):
        """Clean up the sensor"""
        self.dht.exit()

class InfluxDBWriter:
    def __init__(self):
        """Initialize InfluxDB client"""
        self.url = os.getenv('INFLUXDB_URL', 'http://localhost:8086')
        self.token = os.getenv('INFLUXDB_TOKEN', 'your-super-secret-auth-token')
        self.org = os.getenv('INFLUXDB_ORG', 'my-org')
        self.bucket = os.getenv('INFLUXDB_BUCKET', 'sensor-data')
        
        try:
            self.client = InfluxDBClient(url=self.url, token=self.token, org=self.org)
            self.write_api = self.client.write_api(write_options=SYNCHRONOUS)
            print(f"Connected to InfluxDB at {self.url}")
        except Exception as e:
            print(f"Failed to connect to InfluxDB: {e}")
            self.client = None
            self.write_api = None
    
    def write_data(self, temperature, humidity, location="living-room"):
        """Write sensor data to InfluxDB"""
        if self.write_api is None:
            print("InfluxDB not connected, skipping data write")
            return False
            
        try:
            point = Point("dht11_reading") \
                .tag("location", location) \
                .tag("sensor_type", "DHT11") \
                .field("temperature_celsius", temperature) \
                .field("temperature_fahrenheit", (temperature * 9/5) + 32) \
                .field("humidity_percent", humidity)
            
            self.write_api.write(bucket=self.bucket, record=point)
            return True
        except Exception as e:
            print(f"Failed to write to InfluxDB: {e}")
            return False
    
    def close(self):
        """Close InfluxDB connection"""
        if self.client:
            self.client.close()

def main():
    """Main function to continuously read and display sensor data"""
    print("DHT11 Sensor Reader with InfluxDB Storage")
    print("Connected to GPIO 4")
    print("Press Ctrl+C to exit\n")
    
    # Initialize sensor and database
    sensor = DHT11Reader()
    db_writer = InfluxDBWriter()
    
    try:
        while True:
            # Read sensor data
            temperature, humidity = sensor.read_sensor()
            
            # Get current timestamp
            timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            
            if temperature is not None and humidity is not None:
                # Convert to Fahrenheit for display (optional)
                temp_fahrenheit = (temperature * 9/5) + 32
                
                print(f"[{timestamp}]")
                print(f"Temperature: {temperature:.1f}°C ({temp_fahrenheit:.1f}°F)")
                print(f"Humidity: {humidity:.1f}%")
                
                # Write to InfluxDB
                if db_writer.write_data(temperature, humidity):
                    print("✓ Data written to InfluxDB")
                else:
                    print("✗ Failed to write to InfluxDB")
                
                print("-" * 40)
                
            else:
                print(f"[{timestamp}] Failed to read sensor data")
            
            # Wait 2 seconds between readings (DHT11 max rate is 1Hz)
            time.sleep(2)
            
    except KeyboardInterrupt:
        print("\nProgram interrupted by user")
    except Exception as e:
        print(f"Program error: {e}")
    finally:
        # Clean up
        sensor.cleanup()
        db_writer.close()
        print("Cleanup completed")

def single_reading():
    """Function to take a single reading (useful for testing)"""
    sensor = DHT11Reader()
    db_writer = InfluxDBWriter()
    
    try:
        temperature, humidity = sensor.read_sensor()
        
        if temperature is not None and humidity is not None:
            temp_fahrenheit = (temperature * 9/5) + 32
            print(f"Temperature: {temperature:.1f}°C ({temp_fahrenheit:.1f}°F)")
            print(f"Humidity: {humidity:.1f}%")
            
            if db_writer.write_data(temperature, humidity):
                print("✓ Data written to InfluxDB")
            else:
                print("✗ Failed to write to InfluxDB")
                
            return temperature, humidity
        else:
            print("Failed to read sensor")
            return None, None
    finally:
        sensor.cleanup()
        db_writer.close()

if __name__ == "__main__":
    # Run continuous monitoring
    main()
    
    # For single reading, uncomment the line below and comment out main()
    # single_reading()