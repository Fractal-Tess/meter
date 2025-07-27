import {
  influxDBService,
  type SensorReading,
  type ChartDataPoint,
} from '$lib/services/influxdb-client.js';
import { PUBLIC_MEASUREMENT_INTERVAL_MS } from '$env/static/public';

// Centralized state for all sensor data
export const sensorData = $state({
  // Latest reading
  latestReading: null as SensorReading | null,

  // Chart data
  chartData: [] as ChartDataPoint[],

  // Statistics
  stats: null as {
    avgTemperature: number;
    avgHumidity: number;
    minTemperature: number;
    maxTemperature: number;
    minHumidity: number;
    maxHumidity: number;
    totalReadings: number;
  } | null,

  // Loading states
  isLoading: {
    latest: true,
    chart: true,
    stats: true,
  },

  // Error states
  errors: {
    latest: null as string | null,
    chart: null as string | null,
    stats: null as string | null,
  },

  // Refresh control
  lastRefresh: new Date(),
  isRefreshing: false,
});

// Data fetching functions
async function fetchLatestReading() {
  const result = await influxDBService.getLatestReading();
  sensorData.latestReading = result;
}

async function fetchChartData() {
  try {
    sensorData.errors.chart = null;

    const result = await influxDBService.getChartData();
    sensorData.chartData = result;
  } catch (error) {
    sensorData.errors.chart = 'Failed to fetch chart data';
  } finally {
  }
}

async function fetchStats() {
  const result = await influxDBService.getStats();
  sensorData.stats = result;
}

// Refresh all data
export async function refreshAllData() {
  console.log('refreshAllData');
  sensorData.lastRefresh = new Date();
  await Promise.all([fetchLatestReading(), fetchChartData(), fetchStats()]);

  sensorData.isLoading = {
    latest: false,
    chart: false,
    stats: false,
  };
}

let interval: ReturnType<typeof setInterval> | null = null;
// Initialize data on first load
export async function initialize(
  intervalMs = Number(PUBLIC_MEASUREMENT_INTERVAL_MS)
) {
  await refreshAllData();

  if (interval) {
    clearInterval(interval);
  }

  interval = setInterval(() => {
    refreshAllData();
  }, intervalMs);
}
