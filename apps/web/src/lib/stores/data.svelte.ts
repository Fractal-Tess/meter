import {
  influxDBService,
  type SensorReading,
  type ChartDataPoint,
} from '$lib/services/influxdb-client.js';
import { PUBLIC_MEASUREMENT_INTERVAL_MS } from '$env/static/public';

export const timeRange = $state({ hours: 12 });

export const sensorData = $state({
  latestReading: null as SensorReading | null,
  chartData: [] as ChartDataPoint[],
  stats: null as {
    avgTemperature: number;
    avgHumidity: number;
    minTemperature: number;
    maxTemperature: number;
    minHumidity: number;
    maxHumidity: number;
    totalReadings: number;
  } | null,

  isLoading: {
    latest: true,
    chart: true,
    stats: true,
  },

  errors: {
    latest: null as string | null,
    chart: null as string | null,
    stats: null as string | null,
  },

  lastRefresh: new Date(),
  isRefreshing: false,
});

async function fetchLatestReading() {
  const result = await influxDBService.getLatestReading();
  sensorData.latestReading = result;
}

async function fetchChartData() {
  try {
    sensorData.errors.chart = null;
    const result = await influxDBService.getChartData(timeRange.hours);
    sensorData.chartData = result;
  } catch (error) {
    sensorData.errors.chart = 'Failed to fetch chart data';
  }
}

async function fetchStats() {
  const result = await influxDBService.getStats(timeRange.hours);
  sensorData.stats = result;
}

export async function refreshAllData() {
  sensorData.lastRefresh = new Date();
  await Promise.all([fetchLatestReading(), fetchChartData(), fetchStats()]);

  sensorData.isLoading = {
    latest: false,
    chart: false,
    stats: false,
  };
}

export async function setTimeRange(hours: number) {
  timeRange.hours = hours;
  sensorData.isLoading = { latest: true, chart: true, stats: true };
  await refreshAllData();
}

let interval: ReturnType<typeof setInterval> | null = null;

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
