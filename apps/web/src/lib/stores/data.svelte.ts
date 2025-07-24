import {
  influxDBService,
  type SensorReading,
  type ChartDataPoint,
} from '$lib/services/influxdb-client.js';

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

  // Time range for chart data
  timeRange: '24h' as string,

  // Refresh control
  lastRefresh: new Date(),
  isRefreshing: false,
});

// Derived values for easy access
export function isAnyLoading() {
  return (
    sensorData.isLoading.latest ||
    sensorData.isLoading.chart ||
    sensorData.isLoading.stats
  );
}

export function hasAnyError() {
  return (
    sensorData.errors.latest ||
    sensorData.errors.chart ||
    sensorData.errors.stats
  );
}

// Data fetching functions
export async function fetchLatestReading() {
  try {
    sensorData.isLoading.latest = true;
    sensorData.errors.latest = null;
    const result = await influxDBService.getLatestReading();
    sensorData.latestReading = result;
  } catch (error) {
    sensorData.errors.latest = 'Failed to fetch latest reading';
    console.error('Error fetching latest reading:', error);
  } finally {
    sensorData.isLoading.latest = false;
  }
}

export async function fetchChartData() {
  try {
    sensorData.isLoading.chart = true;
    sensorData.errors.chart = null;

    // Convert time range to hours
    const hours = getHoursFromTimeRange(sensorData.timeRange);
    const result = await influxDBService.getChartData(hours);
    sensorData.chartData = result;
  } catch (error) {
    sensorData.errors.chart = 'Failed to fetch chart data';
    console.error('Error fetching chart data:', error);
  } finally {
    sensorData.isLoading.chart = false;
  }
}

// Helper function to convert time range to hours
function getHoursFromTimeRange(timeRange: string): number {
  switch (timeRange) {
    case '1h':
      return 1;
    case '6h':
      return 6;
    case '24h':
      return 24;
    case '7d':
      return 24 * 7; // 168 hours
    default:
      return 24;
  }
}

export async function fetchStats() {
  try {
    sensorData.isLoading.stats = true;
    sensorData.errors.stats = null;

    // Convert time range to hours for stats calculation
    const hours = getHoursFromTimeRange(sensorData.timeRange);
    const result = await influxDBService.getStats(hours);
    sensorData.stats = result;
  } catch (error) {
    sensorData.errors.stats = 'Failed to fetch statistics';
    console.error('Error fetching stats:', error);
  } finally {
    sensorData.isLoading.stats = false;
  }
}

// Update time range and refresh chart data and stats
export async function updateTimeRange(newTimeRange: string) {
  sensorData.timeRange = newTimeRange;
  await Promise.all([fetchChartData(), fetchStats()]);
}

// Refresh all data
export async function refreshAllData() {
  sensorData.isRefreshing = true;
  sensorData.lastRefresh = new Date();

  try {
    await Promise.all([fetchLatestReading(), fetchChartData(), fetchStats()]);
  } finally {
    sensorData.isRefreshing = false;
  }
}

// Initialize data on first load
export async function initializeData() {
  await refreshAllData();
}

// Auto-refresh setup
let refreshInterval: ReturnType<typeof setInterval> | null = null;

export function startAutoRefresh(intervalMs: number = 1_000) {
  if (refreshInterval) {
    clearInterval(refreshInterval);
  }

  refreshInterval = setInterval(() => {
    refreshAllData();
  }, intervalMs);
}

export function stopAutoRefresh() {
  if (refreshInterval) {
    clearInterval(refreshInterval);
    refreshInterval = null;
  }
}

// Cleanup function
export function cleanup() {
  stopAutoRefresh();
}
