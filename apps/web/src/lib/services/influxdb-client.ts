import { InfluxDB } from '@influxdata/influxdb-client';
import { browser } from '$app/environment';
import {
  PUBLIC_INFLUXDB_URL,
  PUBLIC_INFLUXDB_TOKEN,
  PUBLIC_INFLUXDB_ORG,
  PUBLIC_INFLUXDB_BUCKET,
  PUBLIC_INFLUXDB_MEASUREMENT,
} from '$env/static/public';

export interface SensorReading {
  timestamp: string;
  temperature_celsius: number;
  temperature_fahrenheit: number;
  humidity_percent: number;
  location: string;
}

export interface ChartDataPoint {
  time: Date;
  temperature: number;
  humidity: number;
}

class InfluxDBClientService {
  private client: InfluxDB | null = null;
  private queryApi: any = null;

  private bucket = PUBLIC_INFLUXDB_BUCKET;
  private measurement = PUBLIC_INFLUXDB_MEASUREMENT;
  private url = PUBLIC_INFLUXDB_URL;
  private token = PUBLIC_INFLUXDB_TOKEN;
  private org = PUBLIC_INFLUXDB_ORG;

  constructor() {
    if (browser) {
      this.initialize();
    }
  }

  private initialize() {
    try {
      this.client = new InfluxDB({ url: this.url, token: this.token });
      this.queryApi = this.client.getQueryApi(this.org);
      console.log('InfluxDB client initialized');
    } catch (error) {
      console.error('Failed to initialize InfluxDB client:', error);
    }
  }

  async getLatestReading(): Promise<SensorReading | null> {
    if (!browser || !this.queryApi) {
      console.warn('InfluxDB not available (server-side or not initialized)');
      return null;
    }

    const query = `
			from(bucket: "${this.bucket}")
				|> range(start: -1h)
				|> filter(fn: (r) => r._measurement == "${this.measurement}")
				|> filter(fn: (r) => r._field == "temperature_celsius" or r._field == "humidity_percent")
				|> last()
				|> pivot(rowKey:["_time"], columnKey: ["_field"], valueColumn: "_value")
		`;

    try {
      const result = await this.queryApi.collectRows(query);

      if (result && result.length > 0) {
        const row = result[0];
        return {
          timestamp: row._time,
          temperature_celsius: row.temperature_celsius || 0,
          temperature_fahrenheit: ((row.temperature_celsius || 0) * 9) / 5 + 32,
          humidity_percent: row.humidity_percent || 0,
          location: row.location || 'unknown',
        };
      }

      return null;
    } catch (error) {
      console.error('Error fetching latest reading:', error);
      return null;
    }
  }

  async getChartData(hours: number = 24): Promise<ChartDataPoint[]> {
    if (!browser || !this.queryApi) {
      console.warn('InfluxDB not available (server-side or not initialized)');
      return [];
    }

    const query = `
			from(bucket: "${this.bucket}")
				|> range(start: -${hours}h)
				|> filter(fn: (r) => r._measurement == "${this.measurement}")
				|> filter(fn: (r) => r._field == "temperature_celsius" or r._field == "humidity_percent")
				|> aggregateWindow(every: 5m, fn: mean, createEmpty: false)
				|> pivot(rowKey:["_time"], columnKey: ["_field"], valueColumn: "_value")
		`;

    try {
      const result = await this.queryApi.collectRows(query);

      return result.map((row: any) => ({
        time: new Date(row._time),
        temperature: row.temperature_celsius || 0,
        humidity: row.humidity_percent || 0,
      }));
    } catch (error) {
      console.error('Error fetching chart data:', error);
      return [];
    }
  }

  async getStats(hours: number = 24): Promise<{
    avgTemperature: number;
    avgHumidity: number;
    minTemperature: number;
    maxTemperature: number;
    minHumidity: number;
    maxHumidity: number;
    totalReadings: number;
  } | null> {
    if (!browser || !this.queryApi) {
      console.warn('InfluxDB not available (server-side or not initialized)');
      return null;
    }

    const query = `
			from(bucket: "${this.bucket}")
				|> range(start: -${hours}h)
				|> filter(fn: (r) => r._measurement == "${this.measurement}")
				|> filter(fn: (r) => r._field == "temperature_celsius" or r._field == "humidity_percent")
		`;

    try {
      const result = await this.queryApi.collectRows(query);

      const tempReadings = result
        .filter((r: any) => r._field === 'temperature_celsius')
        .map((r: any) => r._value);
      const humidityReadings = result
        .filter((r: any) => r._field === 'humidity_percent')
        .map((r: any) => r._value);

      if (tempReadings.length === 0 || humidityReadings.length === 0) {
        return null;
      }

      return {
        avgTemperature:
          tempReadings.reduce((a: number, b: number) => a + b, 0) /
          tempReadings.length,
        avgHumidity:
          humidityReadings.reduce((a: number, b: number) => a + b, 0) /
          humidityReadings.length,
        minTemperature: Math.min(...tempReadings),
        maxTemperature: Math.max(...tempReadings),
        minHumidity: Math.min(...humidityReadings),
        maxHumidity: Math.max(...humidityReadings),
        totalReadings: Math.max(tempReadings.length, humidityReadings.length),
      };
    } catch (error) {
      console.error('Error fetching stats:', error);
      return null;
    }
  }
}

export const influxDBService = new InfluxDBClientService();
